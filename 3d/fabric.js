$(window).load(function() {
  initFabric()
})

var FABRIC

function initFabric() {

  FABRIC = new WHS.World({

      container: document.getElementById('fabric'),

      autoresize: true,

      camera: {
        far: 10000,
        y: 0,
        z: 100,
        x: 0
      },

      background: {
        opacity: 0
      },

      renderer: {
        alpha: true,
        antialias: true
      }

  });

  FABRIC_flag = new WHS.Plane( {
    geometry: {
        width: 300,
        height: 300,
        segments: 25,
        hsegments: 25
    },

    mass: 10,

    material: {
      shading: THREE.FlatShading,
      kind: "phong",
      color: 0x26D0CE,
      specular: 0xffffff,
      transparent: true,
      opacity: .2
    },

    pos: {
        x: 0,
        y: 0,
        z: 0
    }
  } );
  FABRIC_flag.addTo(FABRIC);
  FLAG_mesh = FABRIC_flag.getNative();

  FABRIC_sphere = new WHS.Sphere( {
    geometry: {
        radius: 30,
        segmentA: 8,
        segmentB: 8
    },

    mass: 10,

    material: {
      shading: THREE.FlatShading,
      kind: "phong",
      color: 0x26D0CE,
      specular: 0x333333,
      transparent: true,
      opacity: .6,
      emit: 1
    },

    pos: {
        x: 0,
        y: 0,
        z: 10
    }
  } );
  FABRIC_sphere.addTo(FABRIC);
  SPHERE_mesh = FABRIC_sphere.getNative();

  FABRIC.light = new WHS.DirectionalLight({
      color: 0xffffff,
      intensity: 2,

      pos: {
          x: 0,
          y: 2000,
          z: 200
      },

      target: {
          x: 0,
          y: 0,
          z: 0
      }
  }).addTo(FABRIC);

  FABRIC.light2 = new WHS.DirectionalLight({
      color: 0xffffff,
      intensity: 2,

      pos: {
          x: -6000,
          y: 2000,
          z: 2000
      },

      target: {
          x: 0,
          y: 0,
          z: 0
      }
  }).addTo(FABRIC);

  //FABRIC.OrbitControls();
  FABRIC.start();

  initSphereAnimation()
  initFabricAnimation()
}








function initSphereAnimation() {


  spherePoints = SPHERE_mesh.geometry.vertices.slice(0);
  spherePointsOriginal = []; // clone array

  for (var i=0; i<spherePoints.length; i++) {
    spherePointsOriginal[i] = {};
    if (i == 0) {
      console.log('original -- ', JSON.parse(JSON.stringify(SPHERE_mesh.geometry.vertices[i])))
    }
    spherePointsOriginal[i] = JSON.parse(JSON.stringify(SPHERE_mesh.geometry.vertices[i]))
    /*
    spherePointsOriginal[i] = {};
    spherePointsOriginal[i].x = spherePoints[i].x;
    spherePointsOriginal[i].y = spherePoints[i].y;
    spherePointsOriginal[i].z = spherePoints[i].z;
    */
  }

  spherePointsDisplaced = spherePointsOriginal.slice(0);

  setInterval(function() {
    //console.log(spherePointsOriginal[0].x, SPHERE_mesh.geometry.vertices[0].x);

    var amplitude = 15
    for (var i=0; i<spherePoints.length; i++) {
      spherePointsDisplaced[i].x = spherePointsOriginal[i].x + ((Math.random() * (amplitude/2)) - amplitude)
      spherePointsDisplaced[i].y = spherePointsOriginal[i].y + ((Math.random() * (amplitude/2)) - amplitude)
      spherePointsDisplaced[i].z = spherePointsOriginal[i].z + ((Math.random() * (amplitude/2)) - amplitude)
    }
  }, 1000)

  sphereAnim = new TimelineMax({
    repeat: -1
  });

  sphereAnim.add(TweenLite.to(FABRIC_sphere.rotation, 10, {
    y: 2*Math.PI,
    ease: Linear.easeNone,
    onUpdate: function() {
      for (var i=0; i<spherePoints.length; i++) {
        /*
        spherePoints[i].x += (spherePointsDisplaced[i].x - spherePoints[i].x)*.1;
        spherePoints[i].y += (spherePointsDisplaced[i].y - spherePoints[i].y)*.1;
        spherePoints[i].z += (spherePointsDisplaced[i].z - spherePoints[i].z)*.1;
        */
        spherePoints[i].x = spherePointsDisplaced[i].x;
        spherePoints[i].y = spherePointsDisplaced[i].y;
        spherePoints[i].z = spherePointsDisplaced[i].z;
      }
      SPHERE_mesh.geometry.verticesNeedUpdate = true;
    }
  }));
}









var epicenter = {x:0, y:0};

var points,
    totalPoints,
    lastPoint,
    waveEdgeRadius,

    radiusAnim; // set on init

var maxHeight = -4; // maximum wave height at epicenter
var waveLength = 60
var ripple = { radius: 0 };
var waveTravelTime = 30;

function initFabricAnimation() {
  points = FLAG_mesh.geometry.vertices;
  totalPoints = points.length;
  lastPoint = totalPoints-1;

  // randomize vertex positions a bit
  var amplitude = 15
  for (var i=0; i<totalPoints; i++) {
    points[i].x += (Math.random() * (amplitude/2)) - amplitude
    points[i].y += (Math.random() * (amplitude/2)) - amplitude
  }
  FLAG_mesh.geometry.verticesNeedUpdate = true;

  var cat1 = points[lastPoint].x - epicenter.x;
  var cat2 = points[lastPoint].y - epicenter.y;
  waveEdgeRadius = Math.sqrt(Math.pow(cat1,2) + Math.pow(cat2,2)) + waveLength;

  radiusAnim = new TimelineMax({
    onUpdate: renderWave,
    paused: true
  });

  radiusAnim.add(TweenLite.to(ripple, waveTravelTime, {
    radius: waveEdgeRadius,
    ease: Linear.easeNone
  }));
}

function renderWave() {

  for (var i=0; i<totalPoints; i++) {
    var cv = points[i]
    var cvcat1 = points[i].x - epicenter.x;
    var cvcat2 = points[i].y - epicenter.y;
    var cvde = Math.sqrt(Math.pow(cvcat1,2) + Math.pow(cvcat2,2)); // vertex distance to epicenter
    var cvdr = cvde - ripple.radius;
    var resultZ

    if (cvdr < 0) {
      cvdr *= -1
    }

    if (cvdr < waveLength) {
      resultZ = waveLength - cvdr
      if (resultZ > 0) { resultZ *= -1 }
    } else {
      resultZ = 0;
    }

    resultZ = resultZ/10 * maxHeight

    // instead of directly applying the new value, ease into it
    FLAG_mesh.geometry.vertices[i].z += (-resultZ - FLAG_mesh.geometry.vertices[i].z)*.3;
  }

  FLAG_mesh.geometry.verticesNeedUpdate = true;
}
