function initScene1() {

  var WORLD

  var rows = 20;
  var columns = 20;
  var dist = 40;
  var firstR = -rows/2 * dist;
  var firstC = -columns/2 * dist;

  var preloader = Preloader();

  WORLD = new WHS.World({

      container: document.getElementById('scene1'),

      //stats: "fps",
      autoresize: true,

      camera: {
        far: 10000,
        y: 100,
        z: 100,
        x: 0
      }
  });

  WORLD.man_0_0 = WORLD.Model({

      geometry: {
          path: "3d/scene1/man.json",
      },

      mass: 0,
      physics: false,

      material: {
          shading: THREE.FlatShading,
          kind: "basic",
          specular: 0x000000,
          side: THREE.DoubleSide,
          map: WHS.API.texture('3d/scene1/man-texture.png'),
          useCustomMaterial: true
      },

      pos: {
          x: 0,
          y: 0,
          z: 50
      },

      scale: {
        x: 20,
        y: 20,
        z: 20
      },

      rot: {
          y: 0
      }

  });

  WORLD.HemisphereLight( {
    light: {
        skyColor: 0x26D0CE,
        groundColor: 0x1A2980,
        intensity: 0.2,
    }
  } );

  WORLD.light = WORLD.DirectionalLight({

      color: 0x00FF00,
      intensity: 0.1,

      pos: {
          x: 0,
          y: 500,
          z: 200
      },

      target: {
          x: 0,
          y: 0,
          z: 0
      }
  });

  WORLD.OrbitControls();

  WORLD.start();

  preloader.check();
}
