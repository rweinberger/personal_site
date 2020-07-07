class Cube {
    constructor(textureNames, tesselation, sz) {
        const geometry = new THREE.BoxGeometry( sz, sz, sz, tesselation, tesselation, tesselation );
        const materials = textureNames.map(name => {
            const texture = new THREE.TextureLoader().load( `../../images/faces/${name}.png` );
            return new THREE.MeshBasicMaterial({map: texture, overdraw: 0.5});
        });
        const faces = new THREE.MultiMaterial(materials);
        const pi = Math.PI;

        this._textureNames = textureNames;
        this._cube = new THREE.Mesh( geometry, faces );
        this._cube.position.y = 150;
        this._nearest_face = 'about';
        this._raycaster = new THREE.Raycaster();
        
        const rotations = [
            [0, -pi/2],
            [0, pi/2],
            [pi/2, 0],
            [-pi/2, 0],
            [0, 0],
            [0, pi],
        ]
        this._rotations = rotations.reduce(function(map, rot, i) {
            const key = textureNames[i];
            map[key] = rot;
            return map;
        }, {});
        console.log(this._rotations)
    }

    get obj() {
        return this._cube;
    }

    upright() {
        return (Math.round(this.obj.rotation.x / Math.PI) % 2) == 0;
    }

    rotateTo(faceName) {
        const targetRot = this._rotations[faceName];
        tweening = true;
        this.tweenClick(...targetRot, 400);
        // tweening = false;
    }

    tween(x, y, delay) {
        const to = { x, y };
        new TWEEN
            .Tween(this.obj.rotation)
            .to(to, delay)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start()
    }

    tweenClick(x, y, delay) {
        const to = { x, y };
        new TWEEN
            .Tween(this.obj.rotation)
            .to(to, delay)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onComplete(() => {
                targetRotationX = this.obj.rotation.y;
                targetRotationY = this.obj.rotation.x;
                tweening = false;
            })
            .start()
    }

    isIntersected(mouse, camera) {
        this._raycaster.setFromCamera(mouse, camera);
        const intersections = this._raycaster.intersectObjects([this.obj]);
        const intersects = intersections[0] ? true : false;
        return intersects;
    }

    updateNearestFace(camera) {
        const mouse = new THREE.Vector2();
        this._raycaster.setFromCamera(mouse, camera);

        const intersections = this._raycaster.intersectObjects([this.obj]);
        if (intersections[0]) {
            const nearest = this._textureNames[intersections[0].face.materialIndex];
            if (nearest != this._nearest_face) {
                // element.text(nearest);
                const all = $(`.nav-link`);
                const selected = $(`#${nearest}-link`);
                all.css('color', '#9c9c9c');
                selected.css('color', 'white');
                this.updateSectionContent(nearest);
                this._nearest_face = nearest;
            }
        }
    }

    updateSectionContent(title) {
        const all_sections = $('.section-content');
        const content = $(`#${title}`);
        all_sections.hide();
        content.show();
    }

    // getIntersectedFace(mouse, camera) {
    //     const raycaster = new THREE.Raycaster();
    //     raycaster.setFromCamera(mouse, camera);

    //     const intersects = raycaster.intersectObjects([this.obj]);
    //     if (intersects[0]) {
    //         const faceIndex = intersects[0].face.materialIndex;
    //         console.log(this._textureNames[faceIndex]);
    //     }
    // }
}
