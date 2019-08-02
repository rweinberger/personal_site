class Cube {
    constructor(textureNames, tesselation) {
        const geometry = new THREE.BoxGeometry( 200, 200, 200, tesselation, tesselation, tesselation );
        const materials = textureNames.map(name => {
            const texture = new THREE.TextureLoader().load( `../../images/${name}.png` );
            return new THREE.MeshBasicMaterial({map: texture, overdraw: 0.5})
        })
        const faces = new THREE.MultiMaterial(materials);

        this.textureNames = textureNames;
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

    getClickedFace(mouse, camera) {
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects([this.obj]);
        if (intersects[0]) {
            const faceIndex = intersects[0].face.materialIndex;
            console.log(this.textureNames[faceIndex]);
        }
    }

    getNearestFace(camera) {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects([this.obj]);
        console.log(intersects[0].faceIndex);
    }
}