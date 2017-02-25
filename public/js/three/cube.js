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

init();
animate();
function init() {
  var container = document.getElementById('container');
  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.position.y = 150;
  camera.position.z = 500;
  scene = new THREE.Scene();
  // Cube
  var tesselation = 4;
  geometry = new THREE.BoxGeometry( 200, 200, 200, tesselation, tesselation, tesselation );
  // for ( var i = 0; i < geometry.faces.length; i += 2 ) {
  //   var hex = Math.random() * 0xffffff;
  //   geometry.faces[ i ].color.setHex( hex );
  //   geometry.faces[ i + 1 ].color.setHex( hex );
  // }
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
  var material = new THREE.MeshBasicMaterial( { color: 0x9da18d, overdraw: 0.5 } );
  plane = new THREE.Mesh( geometry, material );
  scene.add( plane );
  renderer = new THREE.CanvasRenderer();
  renderer.setClearColor( 0xcfd2c2 );
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
function onDocumentMouseUp( event ) {
  if(flag === 0){
    //CLICK
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    raycaster.setFromCamera( mouse, camera );

    var intersects = raycaster.intersectObjects( [cube] );

    if ( intersects.length > 0 ) {
      var index = Math.floor( intersects[0].faceIndex / 2 );
      console.log(cube.rotation.y);
      if (index>=68 && index <= 71) {
        //about
        popup = true;
        plane.rotation.y = cube.rotation.y = 0;
        $('#about').fadeIn();
      }
      else if (index>=4 && index <= 7) {
        //projects
        popup = true;
        plane.rotation.y = cube.rotation.y = -1.58;
        $('#projects').fadeIn();
      }
      else if (index>=84 && index <= 87) {
        //education
        popup = true;
        plane.rotation.y = cube.rotation.y = 3.14;
        $('#education').fadeIn();
      }
      else if (index>=20 && index <= 23) {
        //contact
        popup = true;
        plane.rotation.y = cube.rotation.y = 1.56;
        $('#contact').fadeIn();
      }
    };

  }
  else if(flag === 1){
    //DRAG
    $('#spin').fadeOut(800);
  };
  document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
  document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
  document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
}

// POPUP STUFF

$(".close").click(function() {
  console.log("prevRotation: "+ prevRotation);
  $('.modal').fadeOut();
  // plane.rotation.y = cube.rotation.y = 0;
  popup = false;
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
  if (popup != true) {
    plane.rotation.y = cube.rotation.y += ( targetRotation - cube.rotation.y ) * 0.15;
  };
  renderer.render( scene, camera );
}