import React, { PropTypes } from 'react';
import PlasmidBone from './PlasmidBone';
import FeatureGroup from './FeatureGroup';
import {onionFile} from './OnionFile';
import EnzymeLabelContainer from './EnzymeLabelContainer'
import {LA} from "./LA";
class PlasmidViewer extends React.Component {
	constructor(props){
        super(props);
        this.state = {rotateAngle:props.rotateAngle,
        	plasmidR:props.plasmidR,
        	selectedFeature:-1
        };
    }
    selectNextFeature(delta){
    	if(this.state.selectedFeature<0){
    		console.log("select feature 0");
    		this.setState({selectedFeature:0});
    	}
    	else{
    		if(delta>0){
	    		let nextFeature = this.state.selectedFeature+1;
    		}
	    	else{
	    		let nextFeature = this.state.selectedFeature-1;
	    	}

    		if(nextFeature>onionFile.features.length || nextFeature<0){
    			nextFeature = 0;
    		}
    		console.log("select feature "+nextFeature);
    		this.setState({selectedFeature:nextFeature});
    	}
    	
    }

    calcEnzymeRoot(enzymes){
      let {plasmidR} = this.state;
      let la = new LA(onionFile.seq.length,true);
//      let xy = (a)=>{return{x:plasmidR*Math.cos(-a+Math.PI/2),y:-plasmidR*Math.sin(-a+Math.PI/2)};};
      let xy = (a)=>{return{x:plasmidR*Math.cos((90-a)*Math.PI/180),y:-plasmidR*Math.sin((90-a)*Math.PI/180)};};
      for(let i in enzymes){
        console.log("---",la.a(enzymes[i].pos[0]));
        enzymes[i].rootPos = xy(la.a(enzymes[i].pos[0])+this.state.rotateAngle);
      }
      return enzymes;
    }

    render() {
    	var {width,height,mode} = this.props;
    	var {rotateAngle,plasmidR} = this.state;

      var enzymes = onionFile.enzymes;
      enzymes = this.calcEnzymeRoot(enzymes);

      var altKey =false;
      var viewBox = [];
      if(plasmidR*2<width && plasmidR*2<height){
          viewBox = [-width/2,-height/2,width,height];
      }
      else{
          viewBox = [-width/2,-plasmidR-height/2,width,height];
      }
        return (
                <div>
                  <svg
                  	width={width}
                  	height={height}
                  	viewBox={viewBox}
                    onWheel={(e)=>{
                    switch(mode){
                     	case "rotate":
                	      	//if(e.deltaY>0){
	                    	  	this.setState({rotateAngle:this.state.rotateAngle+e.deltaY/10});
                      		//}
                      		//else if(e.deltaY<0){
                      		//	this.setState({rotateAngle:this.state.rotateAngle+e.deltaY/2});
                      		//}
                          e.preventDefault();
                  		break;
                  		case "zoom":
                  			console.log(this.state.plasmidR)
                  			if(e.deltaY>0){
                  				if(this.state.plasmidR){
                  					this.setState({plasmidR:this.state.plasmidR+10});
                  				}
                  			}
                  			else if(e.deltaY<0){
                  				if(this.state.plasmidR>200){
                  					this.setState({plasmidR:this.state.plasmidR-10});
                  				}
                  			}
                        e.preventDefault();
                  		break;
                  		case "selectFeature":
                  			this.selectNextFeature(e.deltaY);
                        e.preventDefault();
                  		break;
                    }}}
                  	>
                  	<g className="plasmid"
                  		transform={`rotate (${rotateAngle})`}
                  	>
	                  	<PlasmidBone
	                  		radius={this.state.plasmidR}
	                  		seqLength={onionFile.seq.length}
	                  	>
	                  	</PlasmidBone>
	                  	<FeatureGroup
	                  		radius = {this.state.plasmidR-30}
	                  		features = {onionFile.features}
	                  		seqLength = {onionFile.seq.length}
	                  		selectedFeature = {this.state.selectedFeature}
	                  		globalRotateAngle = {rotateAngle}
	                  	>
	                  	</FeatureGroup>
                  	</g>
                  	<g className="title">
                  		<text
                  			x={0}
                  			y={0}
                  			fontSize={16}
                  			style={{dominantBaseline:"text-after-edge",textAnchor:"middle"}}
                  		>
                  		{onionFile.name}
                  		</text>
                  		<text
                  			x={0}
                  			y={0}
                  			fontSize={10}
                  			style={{dominantBaseline:"text-before-edge",textAnchor:"middle"}}
                  		>
                  		{onionFile.seq.length+" bp"}
                  		</text>
                  	</g>
                    <g className="enzyme">
                      {mode == "normal" && <EnzymeLabelContainer
                        enzymeR={this.state.plasmidR+50}
                        plasmidR={this.state.plasmidR}
                        enzymes={enzymes}
                      >
                      </EnzymeLabelContainer>}
                    </g>
                  </svg>
                </div>
            );
    }
}
PlasmidViewer.defaultProps = {
	width:500,
	height:500,
	seqLength:onionFile.seq.length,
	rotateAngle:0,
};

module.exports = PlasmidViewer;

