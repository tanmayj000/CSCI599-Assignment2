import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { PLYLoader } from 'three/addons/loaders/PLYLoader.js';

const plyFiles = [
    '../assets/assignment2/results/fountain-P11/point-clouds/cloud_2_view.ply',
    '../assets/assignment2/results/Herz-Jesus-P8/point-clouds/cloud_3_view.ply',
    '../assets/assignment2/results/entry-P10/point-clouds/cloud_2_view.ply',
    // Add more PLY files here
];

const plyTitles = [
    'fountain-P11 Cloud Camera View 1',
    'Herz-Jesus-P8 Cloud Camera View 2',
    'entry-p10 Cloud Camera View 1',
    // Ensure this list matches the plyFiles array in length and order
];

const plyImages = [
    '../assets/assignment2/results/fountain-P11/errors/0000.png',
    '../assets/assignment2/results/Herz-Jesus-P8/errors/0001.png',
    '../assets/assignment2/results/entry-P10/errors/0000.png',
    // Make sure this list matches the plyFiles array in length and order
];

function initScene(plyFilePath, containerElementId) {
    const container = document.getElementById(containerElementId);
    container.style.position = 'relative';
    const renderer = new THREE.WebGLRenderer();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild(renderer.domElement);
    
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 2;
    controls.maxDistance = 10;
    controls.addEventListener('change', () => renderer.render(scene, camera));
    
    camera.position.z = 5;
    
    loadPointCloud(plyFilePath, scene, camera, renderer);

    window.addEventListener('resize', () => onWindowResize(container, camera, renderer), false);
}

function loadPointCloud(plyFilePath, scene, camera, renderer) {
    const loader = new PLYLoader();
    loader.load(plyFilePath, function(geometry) {
        geometry.computeVertexNormals();
        const material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
        const points = new THREE.Points(geometry, material);
        scene.add(points);
        renderer.render(scene, camera);
    });
}

function onWindowResize(container, camera, renderer) {
    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.render(scene, camera);
}

// Create a container for each PLY file and initialize the scene for each
plyFiles.forEach((file, index) => {
    // Create a heading element for the PLY file
    const heading = document.createElement('h2');
    heading.textContent = plyTitles[index]; // Use the title from the plyTitles array
    heading.style.textAlign = 'center'; // Center-align the heading

    const image = document.createElement('img');
    image.src = plyImages[index]; // Set the source of the image
    image.alt = 'PLY visualization image'; // Set an alternative text for the image
    image.style.display = 'block'; // Ensure the image is block-level to center it
    image.style.margin = '0 auto'; // Center the image
    image.style.maxWidth = '100%'; // Ensure the image is responsive
    image.style.height = 'auto'; // Maintain aspect ratio
    // Create the container div for the PLY file
    const plyContainer = document.createElement('div');
    plyContainer.id = `plyContainer${index}`;
    plyContainer.style.height = '400px';
    plyContainer.style.width = '1000px';
    plyContainer.style.margin = '0 auto';

    // Append the heading and then the container to the body
	document.body.appendChild(image);
    document.body.appendChild(plyContainer);
    document.body.appendChild(heading);

    // Initialize the scene for this PLY file
    initScene(file, plyContainer.id);
});
// '../assets/assignment2/results/entry-P10/point-clouds/cloud_2_view.ply'