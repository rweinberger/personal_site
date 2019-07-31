class Cube {
    constructor(textureNames, tesselation) {
        const geometry = new THREE.BoxGeometry( 200, 200, 200, tesselation, tesselation, tesselation );
        const materials = textureNames.map(name => {
            const texture = new THREE.TextureLoader().load( `../../images/${name}.png` );
            return new THREE.MeshBasicMaterial({map: texture, overdraw: 0.5})
        })
        const faces = new THREE.MultiMaterial(materials);

        this._cube = new THREE.Mesh( geometry, faces );
        this._cube.position.y = 150;
    }

    get obj() {
        return this._cube;
    }

    upright() {
        return (Math.round(this.obj.rotation.x / Math.PI) % 2) == 0;
    }

    tween(x, y, delay) {
        const to = x ? {y: y, x: x} : {y: y};
        new TWEEN
            .Tween(this.obj.rotation)
            .to(to, delay)
            .easing( TWEEN.Easing.Quadratic.Out)
            .start();
    }

    getNearestFace(camera) {
        let material = new THREE.LineBasicMaterial({ color: 0xAAFFAA });

        // crosshair size
        let x = 0.01, y = 0.01;

        let geometry = new THREE.Geometry();

        // crosshair
        geometry.vertices.push(new THREE.Vector3(0, y, 0));
        geometry.vertices.push(new THREE.Vector3(0, -y, 0));
        geometry.vertices.push(new THREE.Vector3(0, 0, 0));
        geometry.vertices.push(new THREE.Vector3(x, 0, 0));    
        geometry.vertices.push(new THREE.Vector3(-x, 0, 0));

        let crosshair = new THREE.Line( geometry, material );

        // place it in the center
        let crosshairPercentX = 50;
        let crosshairPercentY = 50;
        let crosshairPositionX = (crosshairPercentX / 100) * 2 - 1;
        let crosshairPositionY = (crosshairPercentY / 100) * 2 - 1;

        crosshair.position.x = crosshairPositionX * camera.aspect;
        crosshair.position.y = crosshairPositionY;

        crosshair.position.z = -0.3;

        camera.add( crosshair );

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects([this.obj]);
        console.log(intersects[0].faceIndex);
    }
}