import invariant from '../../../utils/environment/invariant';
import React, { Component, PropTypes } from 'react';
import Vector2D from '../geometry/vector2d.js';
import Node2D from './node2d.js';
import RootNode2D from './rootnode2d.js';

export default class SceneGraph2D extends React.Component {

  constructor(props) {
    super(props);
    this.nodeSet = new Set();
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
    invariant(!this.nodeSet.has(node), 'node already registered');
    this.nodeSet.add(node);
  }

  /**
   * unregister the node
   * @param  {[type]} node [description]
   * @return {[type]}      [description]
   */
  unRegisterNode(node) {
    invariant(!this.nodeSet.has(node), 'node not registered');
    this.nodeSet.delete(node);
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

  /**
   * perform a depth first traversal of the scene graph invoking the callback
   * for each node encountered.
   * NOTE: The root node is the starting point, but is not included in the callback
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  traverse(callback) {
      let stack = [this.root];
      while (stack.length) {
        const next = stack.pop();
        callback(next);
        stack = stack.concat(next.progeny);
      }
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
