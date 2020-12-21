({
    animate: function() {
        requestAnimationFrame(() => this.animate());
        if (this.container.offsetWidth != this.width || this.container.offsetHeight != this.height) this.resize();
        
        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.01;

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    },
    /**
     * Zoomt die übergebenen Objekte in den Bildausschnitt.
     * Von https://discourse.threejs.org/t/camera-zoom-to-fit-object/936/24
     */
    fitCameraToSelection: function(selection) {
        const box = new THREE.Box3();
        for( const object of selection ) box.expandByObject( object );
        const size = box.getSize( new THREE.Vector3() );
        const center = box.getCenter( new THREE.Vector3() );
        const maxSize = Math.max( size.x, size.y, size.z );
        const fitHeightDistance = maxSize / ( 2 * Math.atan( Math.PI * this.camera.fov / 360 ) );
        const fitWidthDistance = fitHeightDistance / this.camera.aspect;
        const fitOffset = 1.5;
        const distance = fitOffset * Math.max( fitHeightDistance, fitWidthDistance );
        const direction = this.controls.target.clone().sub(this.camera.position).normalize().multiplyScalar(distance);
        this.controls.maxDistance = distance * 10;
        this.controls.target.copy( center );
        this.camera.near = distance / 100;
        this.camera.far = distance * 100;
        this.camera.updateProjectionMatrix();
        this.camera.position.copy(this.controls.target).sub(direction);
        this.controls.update();
    },
    /**
     * Richtet die ThreeJS Szene ein. Wird einmalig beim Start aufgerufen.
     */
    initThreeJsScene: function(component) {
        this.container = document.querySelector('.modelcontainer');
        
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 75, this.container.offsetWidth / this.container.offsetHeight, 0.1, 1000 );
        this.renderer = new THREE.WebGLRenderer();
        
        this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
        this.controls.autoRotate = true;
        
        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
        this.container.appendChild(this.renderer.domElement);
        
        const ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white light
        this.scene.add( ambientLight );
        const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
        this.scene.add( directionalLight );

        // Würfel für Demo-Zwecke                
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        this.cube = new THREE.Mesh( geometry, material );
        this.scene.add(this.cube);

        //const loader = new THREE.OBJLoader();
        /*
        loader.load(
            $A.get('$Resource.Vase'), 
            function(object3d) { 
                console.log(object3d);
                fitCameraToSelection([object3d]);
                scene.add( object3d );
            },  // Loaded
            null, // Progress
            function(error) { 
                console.log(error);
            } // Error
        );
        */
        this.camera.position.z = 5;
        
        this.fitCameraToSelection([this.cube]);
        
        this.animate();

    },
    /**
     * Lädt das aktuell am Produkt verlinkte Modell und zeigt es an.
     * Wird beim Start und jedesmal, wenn sich das Modell ändert (nach einem Upload)
     * aufgerufen.
     */
    loadModel: function(component) {
    },
    /**
     * Beim Resizen des Fensters passt diese Funktion das Seitenverhältnis
     * der Kamera an.
     */
    resize: function() {
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.width, this.height);
        this.controls.update();
    },
})