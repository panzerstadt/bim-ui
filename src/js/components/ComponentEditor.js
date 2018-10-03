import React, { Component } from "react";
import * as THREE from "three";

const componentStyle = {
  width: 400,
  height: 400
};

// or define function and load from componentDidMount
// if loading from API
// import components here if loading locally
// 1/2 geometry
const geometry = new THREE.BoxGeometry(1, 1, 1);
// 2/2 material
const material = new THREE.MeshBasicMaterial({ color: "#433F81" });

const cube = new THREE.Mesh(geometry, material);

// Component Editor is a THREE scene
export default class ComponentEditor extends Component {
  state = {
    componentGeometry: null
  };

  componentDidMount() {
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;

    // build THREE scene
    /*
    1. scene object
    2. lights
    3. camera
    4. fog

    */

    // add scene
    this.scene = new THREE.Scene();

    // add camera
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    // move back from the point on the camera
    this.camera.position.z = 4;

    // add renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor("#000000");
    this.renderer.setSize(width, height);
    this.mount.appendChild(this.renderer.domElement);

    // add geomtries to scene
    this.scene.add(cube);

    // start the scene
    this.start();
  }

  componentWillUnmount() {
    this.stop();
    this.mount.removeChild(this.renderer.domElement);
  }

  start = () => {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate);
    }
  };

  stop = () => {
    cancelAnimationFrame(this.frameId);
  };

  animate = () => {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    this.renderScene();
    this.frameId = window.requestAnimationFrame(this.animate);
  };

  renderScene = () => {
    this.renderer.render(this.scene, this.camera);
  };

  render() {
    return (
      <div
        style={componentStyle}
        ref={mount => {
          this.mount = mount;
        }}
      />
    );
  }
}
