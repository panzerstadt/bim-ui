import React, { Component } from "react";
import * as THREE from "three";
import GLTFLoader from "three-gltf-loader";

// main ref: https://github.com/colesayer/wear_house_socks

function normalize(v, vmin, vmax, tmin, tmax) {
  var nv = Math.max(Math.min(v, vmax), vmin);
  var dv = vmax - vmin;
  var pc = (nv - vmin) / dv;
  var dt = tmax - tmin;
  var tv = tmin + pc * dt;
  return tv;
}

// settings
// --------
var Colors = {
  red: "#F52F57",
  brown: "#F79D5C",
  pink: "#F5986E",
  pinkLight: "#F7EBEC",
  brownDark: "#23190f",
  blue: "#68c3c0",
  greyDark: "#404E4D",
  grey: "#CECCCC"
};
// we always have white on top of the 5 theme colors
Colors.white = "#d8d0d1";

const componentStyle = {
  root: {
    width: "80%",
    height: "80%" // needs to be updated by code
  },
  debug: {
    position: "fixed",
    top: "5%",
    zIndex: 100,
    fontWeight: 500,
    color: "#542344"
  }
};

let HEIGHT, WIDTH;
let geomObjects = [];

// or define function and load from componentDidMount
// if loading from API
// import components here if loading locally

// MAKE GEOMETRY HERE
const door = () => {
  // dimensions are at full size
  const mesh_group = new THREE.Group();

  // door handle
  const h_geom = new THREE.BoxGeometry(100, 30, 20);
  const h_mat = new THREE.MeshPhongMaterial({
    color: Colors.brownDark,
    flatShading: true
  });

  const door_handle = new THREE.Mesh(h_geom, h_mat);
  door_handle.name = "door_handle";
  door_handle.position.set(-300, 0, 30);
  door_handle.castShadow = true;
  door_handle.receiveShadow = true;

  // door panel
  const p_geom = new THREE.BoxGeometry(800, 1900, 50);
  const p_mat = new THREE.MeshPhongMaterial({
    color: Colors.grey,
    flatShading: true
  });

  const door_panel = new THREE.Mesh(p_geom, p_mat);
  door_panel.name = "door_panel";
  door_panel.castShadow = true;
  door_panel.receiveShadow = true;

  // door frame
  const f_geom = new THREE.BoxGeometry(900, 1950, 30);
  const f_mat = new THREE.MeshPhongMaterial({
    color: Colors.greyDark,
    flatShading: true
  });

  const door_frame = new THREE.Mesh(f_geom, f_mat);
  door_frame.name = "door_frame";
  door_frame.position.set(0, 25, 0);
  door_frame.castShadow = true;
  door_frame.receiveShadow = true;

  mesh_group.add(door_handle);
  mesh_group.add(door_panel);
  mesh_group.add(door_frame);
  geomObjects.push(door_handle);
  geomObjects.push(door_panel);
  geomObjects.push(door_frame);
  return mesh_group;
};

// doesnt seem to work properly
// https://medium.com/@zakhuber/loading-3d-models-into-react-with-webgl-and-three-js-273a492e645f
// https://github.com/colesayer/gallerina
const loaded = () => {
  const Loader = new GLTFLoader();
  Loader.load(
    "../../assets/fire_extinguisher/scene.gltf",
    // called when the resource is loaded
    function(gltf) {
      console.log("gltf loaded, ", gltf);
      return gltf.scene;

      // gltf.animations; // Array<THREE.AnimationClip>
      // gltf.scene; // THREE.Scene
      // gltf.scenes; // Array<THREE.Scene>
      // gltf.cameras; // Array<THREE.Camera>
      // gltf.asset; // Object
    },
    // called while loading is progressing
    function(xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    // called when loading has errors
    function(error) {
      console.log("An error happened");
    }
  );
};

// Component Editor is a THREE scene
export default class ComponentEditor extends Component {
  state = {
    componentGeometry: null,
    resizeWindow: false,
    debug: null
  };
  mousePos = {
    x: 0,
    y: 0
  };
  editorWindow = {
    width: 0,
    height: 0,
    selection: true
  };
  cameraState = {
    z: 0
  };
  handleWindowResize = this.handleWindowResize.bind(this);
  createRenderer = this.createRenderer.bind(this);
  createScene = this.createScene.bind(this);
  createLights = this.createLights.bind(this);
  handleMouseClick = this.handleMouseClick.bind(this);
  handleMouseMove = this.handleMouseMove.bind(this);
  handleTouchClick = this.handleTouchClick.bind(this);
  handleTouchMove = this.handleTouchMove.bind(this);
  updateGeometry = this.updateGeometry.bind(this);

  createRenderer() {
    // add renderer
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    //this.renderer.setClearColor("#000000");
    this.renderer.setSize(this.editorWindow.width, this.editorWindow.height);
    // enable shadow rendering
    this.renderer.shadowMap.enabled = true;
  }

  createScene() {
    // add scene
    this.scene = new THREE.Scene();

    // add a fog effect to the scene
    // same color as the backgorund color used in the style sheet
    this.scene.fog = new THREE.Fog("#f7d9aa", 0.1, 10000);
  }

  createLights() {
    // a hemisphere light is a gradient colored light
    // with the settings (sky col, ground col, intensity)
    const hemisphereLight = new THREE.HemisphereLight(
      "#aaaaaa",
      "#000000",
      0.9
    );

    const ambientLight = new THREE.AmbientLight("#CCD8E5", 0.3);

    // a directional light shines from a specific location
    // acts like the sun, meaning all rays are parallel
    const shadowLight = new THREE.DirectionalLight("#ffffff", 0.9);

    // set the direction of the light
    shadowLight.position.set(-1500, 2500, 3000);

    // allow shadow casting
    shadowLight.castShadow = true;

    // define the visible area of the projected shadow
    shadowLight.shadow.camera.left = -400;
    shadowLight.shadow.camera.right = 400;
    shadowLight.shadow.camera.top = 400;
    shadowLight.shadow.camera.bottom = -400;
    shadowLight.shadow.camera.near = 1;
    shadowLight.shadow.camera.far = 10000;

    // define the resolution of the shadow, the higher the better
    // but also more expensive
    shadowLight.shadow.mapSize.width = 2048;
    shadowLight.shadow.mapSize.height = 2048;

    // to activate the lights, add them to the scene

    this.scene.add(hemisphereLight);
    this.scene.add(shadowLight);
    this.scene.add(ambientLight);
  }

  createCamera() {
    // add camera
    this.camera = new THREE.PerspectiveCamera(
      60,
      this.editorWindow.width / this.editorWindow.height,
      0.1,
      10000
    );
    // move back from the point on the camera
    this.camera.position.z = 2500;
  }

  componentDidMount() {
    this.editorWindow = {
      ...this.editorWindow,
      width: this.mount.clientWidth,
      height: this.mount.clientHeight
    };
    // build THREE scene
    /*
    renderer

    - scene
        - fog
        - geometry
        - lights
    - camera

    5. lights

    */
    // BUILD
    // -----
    // scene, lights, camera
    this.createRenderer();
    this.createScene();
    this.createLights();
    this.createCamera();

    // add geometry
    // todo: allow on the fly updating of the geometry
    this.geometry = door();

    // MOUNT AND START
    // ---------------
    // mount the renderer
    this.mount.appendChild(this.renderer.domElement);
    // add geomtries to scene
    this.scene.add(this.geometry);
    // start the scene
    this.start();

    // INTERACTIVITY
    // -------------
    window.addEventListener("resize", this.handleWindowResize, false);
    // add listeners for mouse and keybaord events
    window.addEventListener("mousemove", this.handleMouseMove, false);
    window.addEventListener("mousedown", this.handleMouseClick, false);
    window.addEventListener("mouseup", this.handleMouseClick, false);
    // add listeners for touch events
    window.addEventListener("touchmove", this.handleTouchMove, false);
    window.addEventListener("touchstart", this.handleTouchClick, false);
    window.addEventListener("touchend", this.handleTouchClick, false);
  }

  updateGeometry() {
    // edit these last two numbers to adjust range
    let targetX = normalize(this.mousePos.x, -0.75, 0.75, -200, 75);
    let targetY = normalize(this.mousePos.y, -0.75, 0.75, -200, 75);

    // if mouse move, rotate object
    //console.log(this.geometry.position);
    //this.geometry.rotation.z = (targetY - this.geometry.rotation.y) * 0.0128;

    // edit these multipliers to adjust sensitivity
    this.geometry.rotation.x = (targetY - this.geometry.rotation.y) * 0.0032;
    this.geometry.rotation.y = (targetX - this.geometry.rotation.x) * 0.0032;

    // if mouse click, find object and zoom to object
  }

  handleMouseMove(event) {
    //console.log("handling mouse move!");
    let mouse_x = event.clientX / window.innerWidth;
    let mouse_y = event.clientY / window.innerHeight;
    this.mousePos = { x: mouse_x, y: mouse_y };
  }

  handleMouseClick(event) {
    console.log("handling mouse click!");
    // todo: zoom to object
    //console.log(event);
    if (event.type === "mousedown") {
      //event.preventDefault();
      console.log("mousedown!", this.editorWindow);

      // if selection is enabled
      if (this.editorWindow.selection === true) {
        console.log("checkinghit point");
        // make mouse hit point at this position
        let mouse3D = new THREE.Vector3(
          (event.clientX / window.innerWidth) * 2 - 1,
          -(event.clientY / window.innerHeight) * 2 + 1,
          0.5
        );
        // make intersecting line
        let raycaster = new THREE.Raycaster();
        // put it on the camera
        raycaster.setFromCamera(mouse3D, this.camera);

        let intersects = raycaster.intersectObjects(geomObjects);
        if (intersects.length > 0) {
          let hits = intersects.map(o => {
            console.log(o.object.name);
            return o.object.name + ",";
          });
          hits = "found: " + hits;
          this.setState({ debug: hits });
        } else {
          this.setState({ debug: null });
        }
      } else {
        // dummy zoom
        this.cameraState = this.camera.position.z;
        // get position of the object
        this.camera.position.z = 800;
      }
    } else if (event.type === "mouseup") {
      console.log("mouseup!");
      if (this.editorWindow.selection === true) {
        console.log("implement zoom back out");
      } else {
        this.camera.position.z = this.cameraState;
      }
    }
  }

  handleTouchMove(event) {
    console.log("touch move!");
  }

  handleTouchClick(event) {
    console.log("touch click");
  }

  callWindowResize() {
    this.setState({ resizeWindow: true });
  }

  handleWindowResize() {
    //udpate the height and width of the renderer and the camera
    HEIGHT = this.mount.clientHeight;
    WIDTH = this.mount.clientWidth;
    //console.log("window resizing to %sh, %sw", HEIGHT, WIDTH);
    this.renderer.setSize(WIDTH, HEIGHT);
    this.camera.aspect = WIDTH / HEIGHT;
    this.camera.updateProjectionMatrix();
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

  // throw all animations into this function so that
  // it is only called after requestAnimationFrame()
  animate = () => {
    // this.geometry.rotation.x += 0.01;
    // this.geometry.rotation.y += 0.01;
    this.updateGeometry();

    if (this.state.resizeWindow) this.handleWindowResize();

    this.renderScene();
    this.frameId = window.requestAnimationFrame(this.animate);
  };

  renderScene = () => {
    this.renderer.render(this.scene, this.camera);
  };

  render() {
    return (
      <div
        style={componentStyle.root}
        ref={mount => {
          this.mount = mount;
        }}
      >
        <p style={componentStyle.debug}>{this.state.debug}</p>
      </div>
    );
  }
}
