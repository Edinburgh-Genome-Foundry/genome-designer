import React, {PropTypes} from 'react';
//import { propTypes } from './react-props-decorators.js'; //tnrtodo: update this once the actual npm module updates its dependencies
var Combokeys = require("combokeys");
var combokeys;

import OnionFile from './OnionFile'

//import PlasmidViewer from './PlasmidViewer';
var PlasmidViewer = require('./PlasmidViewer');

class SequenceEditor extends React.Component {
    constructor(props){
        super(props);
        this.state = {mode:"normal"};
    }
    componentDidMount() {
        var self = this;
        console.log("se mount");
        //combokeys = new Combokeys(document.documentElement);
        combokeys = new Combokeys(document);
        console.log(combokeys);
        //bindGlobalPlugin(combokeys);

        combokeys.bind(['r','ctrl+r'],(event)=>{
            if(this.state.mode=="normal"){
                console.log('r');
                this.setState({mode: "rotate"});
            }
            else if(this.state.mode=="rotate"){
                this.setState({mode: "normal"});
            }
        });
        combokeys.bind(['z','ctrl+z'],(event)=>{
            if(this.state.mode=="normal"){
                console.log('z');
                this.setState({mode: "zoom"});
            }
            else if(this.state.mode=="zoom"){
                this.setState({mode: "normal"});
            }
        });
        combokeys.bind(['f','ctrl+f'],(event)=>{
            if(this.state.mode=="normal"){
            console.log('f');
                this.setState({mode: "selectFeature"});
            }
            else if(this.state.mode=="zoom"){
                this.setState({mode: "normal"});
            }
        });
        combokeys.bind('esc',(event)=>{
            console.log('esc');
            this.setState({mode: "normal"});
        });

    }



    componentWillUnmount() {

        // Remove any Mousetrap bindings before unmounting.detach()
        combokeys.detach()
    }
    render() {
        var {
            selectedSequenceString,
            displayCircular,
            displayRow,
        } = this.props;

        return (
            <div>
                    <div>{this.state.mode}</div>
                      <div style={{display: 'flex', overflow: 'auto'}}>
                    
                    {<PlasmidViewer
                        mode={this.state.mode}
                        plasmidR = {250}
                        width={1024}
                        height={768}
                     ></PlasmidViewer>}
                     </div>
                    {
                        false && 
                        <CircularView 
                        handleEditorDrag={this.handleEditorDrag.bind(this)}
                        handleEditorDragStart={this.handleEditorDragStart.bind(this)}
                        handleEditorDragStop={this.handleEditorDragStop.bind(this)}
                          handleEditorClick={this.handleEditorClick.bind(this)}
                        ></CircularView> }

            </div>
            )
        ;
    }
}

module.exports = SequenceEditor;
