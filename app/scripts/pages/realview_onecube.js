/*global THREE */
/*global Detector */
/*global hilbert3D */
/*global Stats */

(function ($) {
  'use strict';

			if ( ! Detector.webgl ) {
				Detector.addGetWebGLMessage();
			}

			var renderer, scene, camera, stats, root;
			var objects = [];


			var WIDTH = window.innerWidth,
				HEIGHT = window.innerHeight;
			
			var FOG_COLOR = 0x222222;

			function init() {

				camera = new THREE.PerspectiveCamera( 60, WIDTH / HEIGHT, 1, 200 );
				camera.position.z = 150;

				scene = new THREE.Scene();

				scene.fog = new THREE.Fog( FOG_COLOR, 150, 200 );

				root = new THREE.Object3D();

				var subdivisions = 6;
				var recursion = 1;

				var points = hilbert3D( new THREE.Vector3( 0,0,0 ), 25.0, recursion, 0, 1, 2, 3, 4, 5, 6, 7 );

				var spline = new THREE.Spline( points );
				var geometrySpline = new THREE.Geometry();

				for ( var i = 0; i < points.length * subdivisions; i ++ ) {

					var index = i / ( points.length * subdivisions );
					var position = spline.getPoint( index );

					geometrySpline.vertices[ i ] = new THREE.Vector3( position.x, position.y, position.z );

				}

				var geometryCube = cube( 50 );

				geometryCube.computeLineDistances();
				geometrySpline.computeLineDistances();

				var object = new THREE.Line( geometrySpline, new THREE.LineDashedMaterial( { color: 0xffffff, dashSize: 1, gapSize: 0.5 } ), THREE.LineStrip );

				objects.push( object );
				scene.add( object );

				object = new THREE.Line( geometryCube, new THREE.LineDashedMaterial( { color: 0xffaa00, dashSize: 3, gapSize: 1, linewidth: 2 } ), THREE.LinePieces );

				objects.push( object );
				scene.add( object );

				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setClearColor( FOG_COLOR );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( WIDTH - 300, HEIGHT - 160 );

				var container = document.getElementById( 'container' );
				container.appendChild( renderer.domElement );

				stats = new Stats();
				stats.domElement.style.position = 'absolute';
				stats.domElement.style.top = '0px';
				container.appendChild( stats.domElement );

				//

				window.addEventListener( 'resize', onWindowResize, false );

			}

			function cube( size ) {

				var h = size * 0.5;

				var geometry = new THREE.Geometry();

				geometry.vertices.push(
					new THREE.Vector3( -h, -h, -h ),
					new THREE.Vector3( -h, h, -h ),

					new THREE.Vector3( -h, h, -h ),
					new THREE.Vector3( h, h, -h ),

					new THREE.Vector3( h, h, -h ),
					new THREE.Vector3( h, -h, -h ),

					new THREE.Vector3( h, -h, -h ),
					new THREE.Vector3( -h, -h, -h ),


					new THREE.Vector3( -h, -h, h ),
					new THREE.Vector3( -h, h, h ),

					new THREE.Vector3( -h, h, h ),
					new THREE.Vector3( h, h, h ),

					new THREE.Vector3( h, h, h ),
					new THREE.Vector3( h, -h, h ),

					new THREE.Vector3( h, -h, h ),
					new THREE.Vector3( -h, -h, h ),

					new THREE.Vector3( -h, -h, -h ),
					new THREE.Vector3( -h, -h, h ),

					new THREE.Vector3( -h, h, -h ),
					new THREE.Vector3( -h, h, h ),

					new THREE.Vector3( h, h, -h ),
					new THREE.Vector3( h, h, h ),

					new THREE.Vector3( h, -h, -h ),
					new THREE.Vector3( h, -h, h )
				 );

				return geometry;

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			function animate() {

				requestAnimationFrame( animate );

				render();
				stats.update();

			}

			function render() {

				var time = Date.now() * 0.001;

				for ( var i = 0; i < objects.length; i ++ ) {

					var object = objects[ i ];

					//object.rotation.x = 0.25 * time * ( i%2 == 1 ? 1 : -1);
					object.rotation.x = 0.25 * time;
					object.rotation.y = 0.25 * time;

				}

				renderer.render( scene, camera );

			}
			
			init(); 
			animate();




})(jQuery);
