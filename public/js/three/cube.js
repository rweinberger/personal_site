var container, stats;
var geometry;
var camera, scene, renderer;
var cube, plane;
var targetRotation = 0;
var targetRotationOnMouseDown = 0;
var mouseX = 0;
var mouseXOnMouseDown = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var flag, popup, prevRotation;
var time;
var angleSet = false;

init();
animate();
function init() {
  var container = document.getElementById('container');
  var split = new Date().toString().split(" ");
  var timeZoneFormatted = split[split.length - 2] + " " + split[split.length - 1];
  $('#timezone').append(timeZoneFormatted);
  var hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    $('#timezone').append("<br> morning");
  } else if (hour >= 12 && hour < 17){
    $('#timezone').append("<br> afternoon");
  } else if (hour >= 17 && hour < 19) {
    $('#timezone').append("<br> early evening");
  } else if (hour >= 19 && hour < 22) {
    $('#timezone').append("<br> evening");
  } else if (hour >= 22 && hour < 5) {
    $('#timezone').append("<br> night");
  };
  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.position.y = 150;
  camera.position.z = 500;
  scene = new THREE.Scene();
  // Cube
  var tesselation = 4;
  geometry = new THREE.BoxGeometry( 200, 200, 200, tesselation, tesselation, tesselation );
  var texture1 = new THREE.TextureLoader().load( "../../images/1.png" );
  var texture2 = new THREE.TextureLoader().load( "../../images/2.png" );
  var texture3 = new THREE.TextureLoader().load( "../../images/3.png" );
  var texture4 = new THREE.TextureLoader().load( "../../images/4.png" );
  var blank = new THREE.TextureLoader().load( "../../images/blank.png" );
  var materials = [
    new THREE.MeshBasicMaterial({map: texture2, overdraw: 0.5}), //second = projects, i=4-7
    new THREE.MeshBasicMaterial({map: texture4, overdraw: 0.5}), //fourth = contact, i= 20-23
    new THREE.MeshBasicMaterial({map: blank, overdraw: 0.5}),
    new THREE.MeshBasicMaterial({map: blank, overdraw: 0.5}),
    new THREE.MeshBasicMaterial({map: texture1, overdraw: 0.5}), //first = about, i=68-71
    new THREE.MeshBasicMaterial({map: texture3, overdraw: 0.5})  //third = education, i=84-87
  ]
  var cubeFaces = new THREE.MultiMaterial(materials);
  cube = new THREE.Mesh( geometry, cubeFaces );
  cube.position.y = 150;
  scene.add( cube );
  // Plane
  var geometry = new THREE.PlaneBufferGeometry( 200, 200 );
  geometry.rotateX( - Math.PI / 2 );
  var material = new THREE.MeshBasicMaterial( { color: 0x798190, overdraw: 0.5 } );
  plane = new THREE.Mesh( geometry, material );
  scene.add( plane );
  // renderer = new THREE.CanvasRenderer();
  renderer = new THREE.WebGLRenderer( { alpha: true } );
  renderer.setClearColor( 0xfff, 0 );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );
  // stats = new Stats();
  // container.appendChild( stats.dom );
  document.addEventListener( 'mousedown', onDocumentMouseDown, false );
  document.addEventListener( 'touchstart', onDocumentTouchStart, false );
  document.addEventListener( 'touchmove', onDocumentTouchMove, false );
  //
  window.addEventListener( 'resize', onWindowResize, false );
}
function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}
//
function onDocumentMouseDown( event ) {
  flag = 0;
  event.preventDefault();
  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  document.addEventListener( 'mouseup', onDocumentMouseUp, false );
  document.addEventListener( 'mouseout', onDocumentMouseOut, false );
  mouseXOnMouseDown = event.clientX - windowHalfX;
  targetRotationOnMouseDown = targetRotation;
}
function onDocumentMouseMove( event ) {
  flag = 1;
  mouseX = event.clientX - windowHalfX;
  targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.02;
}

function Tween (toAngle, time) {
  new TWEEN.Tween( cube.rotation ).to( {  y:  toAngle}, time ).easing( TWEEN.Easing.Quadratic.Out).start();
  new TWEEN.Tween( plane.rotation ).to( { y:  toAngle}, time ).easing( TWEEN.Easing.Quadratic.Out).start();
}

function getNearestAngleP(target, current){
  rotations = Math.floor(current/6.28);
  a1 = 6.28 * rotations + target;
  a2 = 6.28 * (rotations + 1) + target;
  if (Math.abs(a1 - current) < Math.abs(a2 - current)) {
    return a1
  } else {
    return a2
  }
}

function setRotation(target, delaySpeed, popup){
  actual = cube.rotation.y;
  setAngle = getNearestAngleP(target, actual)
  Tween(setAngle, delaySpeed);
  angleSet = true;
  $('#' + popup).delay(delaySpeed).fadeIn();
}

function onDocumentMouseUp( event ) {
  if(flag === 0){
    //CLICK
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    raycaster.setFromCamera( mouse, camera );
    var delaySpeed = 200;
    var intersects = raycaster.intersectObjects( [cube] );

    if ( intersects.length > 0 ) {
      var index = Math.floor( intersects[0].faceIndex / 2 );
      if (index>=68 && index <= 71) {
        //about
        popup = true;
        if (angleSet == false) {
          setRotation(0, delaySpeed, 'about');
        };
      }
      else if (index>=4 && index <= 7) {
        //projects
        popup = true;
        if (angleSet == false) {
          setRotation(4.71, delaySpeed, 'projects');
        };    
      }
      else if (index>=84 && index <= 87) {
        //education
        popup = true;
        if (angleSet == false) {
          setRotation(3.14, delaySpeed, 'education');
        };
      }
      else if (index>=20 && index <= 23) {
        //contact
        popup = true;
        if (angleSet == false) {
          setRotation(1.57, delaySpeed, 'contact');
        };
      }
    };

  }
  else if(flag === 1){
    $('#spin').fadeOut(800);
  };
  document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
  document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
  document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
}

// POPUP STUFF

$(".close").click(function() {
  // var id = $(this).attr('id');
  // var type = id.substring(5);
  // console.log(type);
  // console.log('closing');
  // $('#'+type).hide();
  $('.modal').fadeOut();
  setTimeout(function(){ 
    popup = false; 
  }, 200);
  // popup = false;
  angleSet = false
});

// $("#popup").click(function(event) {
//   event.stopPropagation();
// });

function onDocumentMouseOut( event ) {
  document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
  document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
  document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
}
function onDocumentTouchStart( event ) {
  if ( event.touches.length === 1 ) {
    event.preventDefault();
    mouseXOnMouseDown = event.touches[ 0 ].pageX - windowHalfX;
    targetRotationOnMouseDown = targetRotation;
  }
}
function onDocumentTouchMove( event ) {
  if ( event.touches.length === 1 ) {
    event.preventDefault();
    mouseX = event.touches[ 0 ].pageX - windowHalfX;
    targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 1;
  }
}
//
function animate() {
  requestAnimationFrame( animate );
  render();
}
function render() {
  TWEEN.update();
  if (popup != true) {
    if (screen.width <= 800) {
      console.log('thing');
      plane.rotation.y = cube.rotation.y += ( targetRotation - cube.rotation.y ) * 1;
    } else {
      // console.log("second thing");
      plane.rotation.y = cube.rotation.y += ( targetRotation - cube.rotation.y ) * 0.15;
    }
  };
  renderer.render( scene, camera );
}