import invariant from '../../../utils/environment/invariant';
import React, { Component, PropTypes } from 'react';
import Vector2D from '../geometry/vector2d.js';
import Node2D from './node2d.js';
import RootNode2D from './rootnode2d.js';

export default class SceneGraph2D extends React.Component {

  constructor(props) {
    super(props);
    /**
     * maps the uuid of nodes currently in the scene to their respective nodes
     */
    this.uuid2node = {};
  }

  get root() {
    return this.refs.root;
  }

  /**
   * when nodes are created they register with the scene graph.
   * This includes the root node
   * @param  {Node2D} node
   */
  registerNode(node) {
    invariant(!this.uuid2node[node.uuid], 'the node is already registered');
    this.uuid2node[node.uuid] = node;
  }

  /**
   * unregister the node
   * @param  {[type]} node [description]
   * @return {[type]}      [description]
   */
  unRegisterNode(node) {
    invariant(this.uuid2node[node.uuid], 'the node is not registered');
    delete this.uuid2node[node.uuid];
  }

  /**
   * add a new node to the scenegraph, if the parent is not specified we parent
   * the new node to the root node
   * @param {Node2D} node
   * @param {Node2D || null} parent
   */
  addNode(node, parent) {

    // immediate parent is either the given node or the root node
    const progenitor = parent || this.root;
    progenitor.addNode(node);
  }

  render() {

    const style = {
      width: this.props.w,
      height: this.props.h,
    }

    return (
      <div ref="outer" style={style} className="sceneGraph">
        <RootNode2D sceneGraph={this} ref="root" zoom={this.props.zoom}>

        </RootNode2D>
      </div>
    );
  }
}
