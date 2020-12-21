({
    afterScriptsLoaded : function(component, event, helper) {
        
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
        const cube = new THREE.Mesh( geometry, material );
        scene.add( cube );
        
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
        
        camera.position.z = 5;
        
        
        const resize = function() {
            width = container.offsetWidth;
            height = container.offsetHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
            controls.update();
        }
        
        const animate = function () {
            requestAnimationFrame( animate );
            
            if (container.offsetWidth != width || container.offsetHeight != height) resize();
            
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            
            controls.update();
            
            renderer.render( scene, camera );
        };
        
        animate();
    },
    handleClick : function(component, event, helper) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            type: 'error',
            title: "Fehler!",
            message: "Beim Hochladen ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut!"
        });
        toastEvent.fire();
    },
    /**
     * Prüft Berechtigungen beim Initialisieren der Komponente
     */
    handleInit : function(component) {
        // Prüfen, ob der Benutzer die Komponente überhaupt sehen darf
        var canViewAction = component.get("c.canUserViewModel");
        canViewAction.setCallback(this, $A.getCallback(function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set('v.canView', response.getReturnValue());
            }
        }));
        $A.enqueueAction(canViewAction);
        // Prüfen, ob der Benutzer den Upload-Button sehen darf
        var canUploadAction = component.get("c.canUserEditModel");
        canUploadAction.setCallback(this, $A.getCallback(function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set('v.canUpload', response.getReturnValue());
            }
        }));
        $A.enqueueAction(canUploadAction);
    },
    handleUploadFinished : function(component, event, helper) {
    },
})