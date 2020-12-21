({
    animate: function() {

    },
    /**
     * Richtet die ThreeJS Szene ein. Wird einmalig beim Start aufgerufen.
     */
    initThreeJsScene: function(component) {

        console.log(this);
        
        const container = document.querySelector('.modelcontainer');
        
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera( 75, container.offsetWidth / container.offsetHeight, 0.1, 1000 );
        const renderer = new THREE.WebGLRenderer();
        
        const controls = new THREE.OrbitControls( camera, renderer.domElement );
        controls.autoRotate = true;
        
        let width, height;
        renderer.setSize(container.offsetWidth, container.offsetHeight);
        container.appendChild(renderer.domElement);
        
        const ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white light
        scene.add( ambientLight );
        const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
        scene.add( directionalLight );

                
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        this.cube = new THREE.Mesh( geometry, material );
        scene.add(this.cube);

        
        // Von https://discourse.threejs.org/t/camera-zoom-to-fit-object/936/24
        function fitCameraToSelection(selection, fitOffset = 1.2 ) {
            
            const box = new THREE.Box3();
            
            for( const object of selection ) box.expandByObject( object );
            
            const size = box.getSize( new THREE.Vector3() );
            const center = box.getCenter( new THREE.Vector3() );
            
            const maxSize = Math.max( size.x, size.y, size.z );
            const fitHeightDistance = maxSize / ( 2 * Math.atan( Math.PI * camera.fov / 360 ) );
            const fitWidthDistance = fitHeightDistance / camera.aspect;
            const distance = fitOffset * Math.max( fitHeightDistance, fitWidthDistance );
            
            const direction = controls.target.clone()
            .sub( camera.position )
            .normalize()
            .multiplyScalar( distance );
            
            controls.maxDistance = distance * 10;
            controls.target.copy( center );
            
            camera.near = distance / 100;
            camera.far = distance * 100;
            camera.updateProjectionMatrix();
            
            camera.position.copy( controls.target ).sub(direction);
            
            controls.update();
            
        }
        
        const loader = new THREE.OBJLoader();
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
        camera.position.z = 5;
        
        
        const resize = function() {
            width = container.offsetWidth;
            height = container.offsetHeight;
            console.log(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
            controls.update();
        }
        
        const animate = function () {
            requestAnimationFrame( animate );
            
            if (container.offsetWidth != width || container.offsetHeight != height) resize();
            
            this.cube.rotation.x += 0.01;
            this.cube.rotation.y += 0.01;
            
            controls.update();
            
            renderer.render( scene, camera );
        };

        //fitCameraToSelection([this.cube]);
        
        animate();

    },
    /**
     * Lädt das aktuell am Produkt verlinkte Modell und zeigt es an.
     * Wird beim Start und jedesmal, wenn sich das Modell ändert (nach einem Upload)
     * aufgerufen.
     */
    loadModel: function(component) {
    },
})