var container, stats;
var geometry;
var camera, scene, renderer;
var cube, cube_obj, plane;
var targetRotationX = 0;
var targetRotationY = 0;
var targetRotationOnMouseDown = 0;
var targetRotationOnMouseDownY = 0;
var mouseX = 0;
var mouseY = 0;
var lastX = 0;
var lastY = 0;
var mouseXOnMouseDown = 0;
var mouseYOnMouseDown = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var drag, popup, prevRotation;
var mousedown = false;
// var upright = true;
var time;
var angleSet = false;
var useParticles = false;
var showShadow = false;
var showTimeZone = false;
var bgColor = 0x9b9b9b;
var shadowColor = 0x5d5d5d;

init();
animate();

function init() {
  var container = document.getElementById('container');
  var split = new Date().toString().split(" ");
  if (showTimeZone) {
    var timeZoneFormatted = split[split.length - 2] + " " + split[split.length - 1];
    $('#timezone').append(timeZoneFormatted);
    var hour = new Date().getHours();
    console.log(hour);
    if (hour < 5) {
      $('#timezone').append("<br> night");
    } else if (hour >= 5 && hour < 12) {
      $('#timezone').append("<br> morning");
    } else if (hour >= 12 && hour < 17){
      $('#timezone').append("<br> afternoon");
    } else if (hour >= 17 && hour < 19) {
      $('#timezone').append("<br> early evening");
    } else if (hour >= 19 && hour < 22) {
      $('#timezone').append("<br> evening");
    } else if (hour >= 22) {
      $('#timezone').append("<br> night");
    };
  }
  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.position.y = 150;
  camera.position.z = 500;
  scene = new THREE.Scene();
  // Particles
  if (useParticles) {
    var spriteMaterial = new THREE.SpriteMaterial( {
      map: new THREE.CanvasTexture( generateSprite() ),
      blending: THREE.AdditiveBlending
    } );
    for ( var i = 0; i < 1000; i++ ) {
      particle = new THREE.Sprite( spriteMaterial );
      initParticle( particle, i * 200 );
      scene.add( particle );
    }
  }
  // Cube
  var tesselation = 4;
  /*
    second = projects, i=4-7
    fourth = contact, i= 20-23
    blank
    blank
    first = about, i=68-71
    third = experience, i=84-87
  */
  const textureNames = ["projects", "contact", "blank", "blank", "about", "experience"]
  cube = new Cube(textureNames, tesselation);
  cube_obj = cube.obj;
  scene.add( cube_obj );

  renderer = new THREE.CanvasRenderer();
  renderer = new THREE.WebGLRenderer( { alpha: true } );
  renderer.setClearColor( bgColor );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );
  document.addEventListener( 'mousedown', onDocumentMouseDown, false );
  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  document.addEventListener( 'mouseup', onDocumentMouseUp, false );

  window.addEventListener( 'resize', onWindowResize, false );

  $(document).on("click", clickHandler);
}

function clickHandler(event) {
  const mouse2 = new THREE.Vector2();
  mouse2.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse2.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  cube.getIntersectedFace(mouse2, camera);
}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

function onDocumentMouseDown( event ) {
  drag = false;
  mousedown = true;
  event.preventDefault();

  lastX = event.clientX - windowHalfX;
  lastY = event.clientY - windowHalfY;
}

function onDocumentMouseMove( event ) {
  if (mousedown) {
    drag = true;
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;

    if (cube.upright()) {
      targetRotationX += ( mouseX - lastX ) * 0.02;
    } else {
      targetRotationX -= ( mouseX - lastX ) * 0.02;
    }
  
    targetRotationY += ( mouseY - lastY ) * 0.02;

    lastX = mouseX;
    lastY = mouseY;
  } else {

  }
}

function nearestAngle(target, current){
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
  actual = cube_obj.rotation.y;
  setAngle = nearestAngle(target, actual)
  cube.tween(null, setAngle, delaySpeed)
  angleSet = true;
  if (popup == 'abt' || popup == 'proj') {
    $('#' + popup).delay(delaySpeed).fadeIn();
    $('.' + popup).delay(2*delaySpeed).animate({
      width: '53vh',
      height: '53vh',
      top: '24%'
    });
    $('.pContent').delay(4*delaySpeed).fadeIn();
    $('.close').delay(4*delaySpeed).fadeIn();
  } else {
    $('#' + popup).delay(delaySpeed).fadeIn();
    $('.pContent').delay(delaySpeed).fadeIn();
    $('.close').delay(delaySpeed).fadeIn();
  }
}

$('#open-resume').click(function() {
  $("#resume").delay(200).fadeIn();
  $("#closeresume").delay(200).fadeIn();
});

function onDocumentMouseUp( event ) {
  mousedown = false;
  if (!drag){

    // //CLICK
    // var raycaster = new THREE.Raycaster();
    // var mouse = new THREE.Vector2();
    // raycaster.setFromCamera( mouse, camera );
    
    // var delaySpeed = 200;
    // var intersects = raycaster.intersectObjects( [cube_obj] );

    // if ( intersects.length > 0 ) {
    //   // console.log(intersects[0].faceIndex);
    //   var index = Math.floor( intersects[0].faceIndex / 2 );
    //   if (index>=68 && index <= 71) {
    //     //about
    //     popup = true;
    //     if (angleSet == false) {
    //       setRotation(0, delaySpeed, 'abt');
    //     };
    //   }
    //   else if (index>=4 && index <= 7) {
    //     //projects
    //     popup = true;
    //     if (angleSet == false) {
    //       setRotation(4.71, delaySpeed, 'proj');
    //     };    
    //   }
    //   else if (index>=84 && index <= 87) {
    //     //experience
    //     popup = true;
    //     if (angleSet == false) {
    //       setRotation(3.14, delaySpeed, 'exp');
    //     };
    //   }
    //   else if (index>=20 && index <= 23) {
    //     //contact
    //     popup = true;
    //     if (angleSet == false) {
    //       setRotation(1.57, delaySpeed, 'con');
    //     };
    //   }
    // };

  } else {
    $('#spin').fadeOut(800);
    drag = false;
  };
}

function animate() {
  requestAnimationFrame( animate );
  render();
}

function render() {
  TWEEN.update();
  if (popup != true) {
    cube.tween(targetRotationY, targetRotationX, 200);
  };
  renderer.render( scene, camera );
}

$(".close").click(function() {
  var delaySpeed = 200;
  $('.pContent').fadeOut(200);
  $('.close').fadeOut(200);
  $('.modal').delay(2*delaySpeed).fadeOut();
  $('.popup').delay(delaySpeed).animate({
    width: '34vh',
    height: '34%',
    top: '33%'
  });
  setTimeout(function(){ 
    popup = false; 
  }, 800);
  angleSet = false
});

$("#closeresume").click(function() {
  $('#resume').fadeOut(200);
  $("#closeresume").fadeOut(200);
});
