const CANVAS_X_RATIO = 1/2;
const CANVAS_Y_RATIO = 1/1;
const CUBE_SIZE = 150;

var camera, scene, renderer;
var cube, cube_obj;
var targetRotationX = 0;
var targetRotationY = 0;
var mouseX = 0;
var mouseY = 0;
var lastX = 0;
var lastY = 0;
var windowHalfX = window.innerWidth / 2 * CANVAS_X_RATIO;
var windowHalfY = window.innerHeight / 2 * CANVAS_Y_RATIO;
var drag, tweening;
var mousedown = false;
// var bgColor = 0x9b9b9b;
var bgColor = 0x000;

// const text = $('#section-title');

init();
animate();

function init() {
    var container = document.getElementById('left');

    camera = new THREE.PerspectiveCamera( 70, windowHalfX / windowHalfY, 1, 1000 );
    camera.position.y = 150;
    camera.position.z = 500;
    scene = new THREE.Scene();

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
    const textureNames = ['about', 'projects', 'contact', 'blank', 'hello', 'experience'];
    cube = new Cube(textureNames, tesselation, CUBE_SIZE);
    cube_obj = cube.obj;
    scene.add( cube_obj );

    renderer = new THREE.WebGLRenderer( { alpha: true } );
    renderer.setClearColor( bgColor );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth / 2, window.innerHeight);
    container.appendChild( renderer.domElement );

    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'mouseup', onDocumentMouseUp, false );
    window.addEventListener( 'resize', onWindowResize, false );

    $(document).on('click', clickHandler);
}

function clickHandler(event) {
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2 * CANVAS_X_RATIO;
    windowHalfY = window.innerHeight / 2 * CANVAS_Y_RATIO;
    camera.aspect = windowHalfX / windowHalfY;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth * CANVAS_X_RATIO, window.innerHeight * CANVAS_Y_RATIO);
}

function onDocumentMouseDown( event ) {
    drag = false;
    mousedown = true;
    event.preventDefault();

    lastX = event.clientX - windowHalfX;
    lastY = event.clientY - windowHalfY;
}

function onDocumentMouseMove( event ) {
    const mouse = new THREE.Vector2();
    mouse.x = ( event.clientX / window.innerWidth / CANVAS_X_RATIO ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight / CANVAS_Y_RATIO ) * 2 + 1;

    if (cube.isIntersected(mouse, camera)) {
        document.body.style.cursor = 'pointer';
    } else {
        document.body.style.cursor = 'default';
    }


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
        // console.log(cube.obj.rotation)
    } else {

    }
}

function onDocumentMouseUp( event ) {
    mousedown = false;
    if (drag){
        $('#spin').fadeOut(800);
        drag = false;
    } else {
    // was a click
    }
}

function animate() {
    requestAnimationFrame( animate );
    render();
}

function render() {
    TWEEN.update();
    if (tweening != true) {
        cube.tween(targetRotationY, targetRotationX, 200);
    }
    cube.updateNearestFace(camera);
    renderer.render( scene, camera );
}
