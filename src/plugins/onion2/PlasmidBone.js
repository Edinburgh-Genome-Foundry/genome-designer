import React, { PropTypes } from 'react';
import {LA} from "./LA";

class PlasmidBone extends React.Component {
    constructor(props){
      super(props);
    }
    render() {
    	var {radius,seqLength} = this.props;
      var rOutSide = radius;
      var rInSide = radius-3;
      var r = rInSide;
      var markPos = [];
      var markPosAngle = [];
      var markLines = [];
      var markD=1000;
      var la = new LA(seqLength,true);
      if(seqLength<1000){
        markD = 100;
      }
      else{
        markD = 1000;
      }
      for(let i=0;i<seqLength;i+=markD){
        markPos.push(i);
      }
      for(let i in markPos){
        var p = markPos[i];
        var angle = la.a(p);
        markLines.push(
            <PosOnPlasmid
                angle={angle}
                key = {i}
              >
                <line
                  x1="0"
                  x2="0"
                  y1={-r+20}
                  y2={-r}
                  stroke="black"
                  strokeWidth="1"
                >
                </line>
                <text

                  fontSize="12"
                  textAnchor="start"
                  style={{"alignmentBaseline":"text-before-edge"}}
                >
                <textPath
                  xlinkHref="#markTextPath"
                  >
                {p}
                </textPath>
                </text>
              </PosOnPlasmid>  
          );
      }
      return (
            <g>
              <circle
                x="0"
                y="1"
                r={rOutSide}
                fill="none"
                stroke="black"
                onClick= {(e,a,c)=>{
                  console.log([e,a,c]);
                }}
              >
              </circle>
              <circle
                x="0"
                y="1"
                r={r}
                id="insideCircle"
                fill="none"
                stroke="black"
              >
              </circle>
              <path
                d={`M 0 ${-r+10} A ${r-10} ${r-10} 0 1 1 -0.1 ${-r+10}`}
                stroke="red"
                strokeWidth="0"
                fill="none"
                id="markTextPath"
              >
              </path>
              {markLines}
            </g>
          );
    }
}

module.exports = PlasmidBone;

var PosOnPlasmid = function({children,angle=0}) {
    var transform;
        transform = `rotate(${angle},0,0)`
    return (
        <g transform={ transform }>
          { children }
        </g>
        )
}

var PositionAnnotationOnCircle = function({children, height=0, sAngle=0, eAngle=0, forward=true}) {
    const sAngleDegs = sAngle * 360 / Math.PI / 2
    const eAngleDegs = eAngle * 360 / Math.PI / 2
    var transform;
    if (forward) {
        transform = `translate(0,${-height}) rotate(${sAngleDegs},0,${height})`
    } else {
        transform = `scale(-1,1) translate(0,${-height}) rotate(${-eAngleDegs},0,${height}) `
    }
    return (
        <g transform={ transform }>
          { children }
        </g>
        )
}