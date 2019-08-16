var camera, scene, renderer;
var cube, cube_obj;
var targetRotationX = 0;
var targetRotationY = 0;
var mouseX = 0;
var mouseY = 0;
var lastX = 0;
var lastY = 0;
var windowHalfX = window.innerWidth / 4;
var windowHalfY = window.innerHeight / 2;
var drag, popup;
var mousedown = false;
var bgColor = 0x9b9b9b;

const text = $('#section-title');

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
    const textureNames = ['projects', 'contact', 'blank', 'blank', 'about', 'experience'];
    cube = new Cube(textureNames, tesselation);
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
    const mouse2 = new THREE.Vector2();
    mouse2.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse2.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    // cube.getIntersectedFace(mouse2, camera);
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 4;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = windowHalfX / windowHalfY;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth / 2, window.innerHeight );
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
    if (popup != true) {
        cube.tween(targetRotationY, targetRotationX, 200);
    }
    cube.updateNearestFace(camera, text);
    renderer.render( scene, camera );
}
