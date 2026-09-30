/**
 * DeepGuard AI - Three.js 3D Hero Face & Scanner Engine
 * Real WebGL 3D procedural human face mesh, 68-point facial landmarks,
 * holographic scanning beam, orbiting verification ring, and neural particle field.
 */

class DeepGuardHero3D {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.faceGroup = new THREE.Group();
    this.landmarksGroup = new THREE.Group();
    this.scannerBeam = null;
    this.shieldRing = null;
    this.particleSystem = null;
    this.neuralLines = null;
    this.suspiciousRegions = [];
    
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetRotationX = 0;
    this.targetRotationY = 0;
    this.clock = new THREE.Clock();

    this.init();
  }

  init() {
    const width = this.container.clientWidth || 600;
    const height = this.container.clientHeight || 650;

    // 1. Scene
    this.scene = new THREE.Scene();

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 14);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.container.appendChild(this.renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x3B82F6, 1.8);
    dirLight1.position.set(5, 8, 10);
    this.scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x7C3AED, 1.2);
    dirLight2.position.set(-6, -5, 8);
    this.scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0x06B6D4, 2, 20);
    pointLight.position.set(0, 1, 6);
    this.scene.add(pointLight);

    // 5. Build 3D Facial Structure & Components
    this.buildFaceMesh();
    this.buildFacialLandmarks();
    this.buildScanningBeam();
    this.buildHolographicShield();
    this.buildParticleField();

    this.scene.add(this.faceGroup);

    // 6. Listeners
    window.addEventListener('resize', () => this.onWindowResize());
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    window.addEventListener('scroll', () => this.onScroll());

    // 7. Start render loop
    this.animate();
  }

  buildFaceMesh() {
    // Generate an anatomical 3D human face surface using subdivided parametric geometry
    // and specialized facial contour deformation
    const faceGeo = new THREE.SphereGeometry(3.6, 36, 44);
    const pos = faceGeo.attributes.position;

    // Sculpt sphere into a high-fidelity human facial structure:
    // Flattens back of head, sculpts jawline, cheekbones, nose bridge, eye cavities, and chin
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);

      // Only sculpt front hemisphere
      if (z > -0.5) {
        // Taper temples and narrow jaw towards chin
        const taper = 1.0 - (y < 0 ? Math.abs(y) * 0.16 : y * 0.05);
        x *= taper;

        // Eyeballs & Brow Ridge
        if (y > 0.4 && y < 1.4 && Math.abs(x) > 0.6 && Math.abs(x) < 2.0) {
          z -= 0.35 * Math.sin((y - 0.4) * Math.PI);
        }

        // Nose Bridge & Tip
        if (y > -0.5 && y < 0.9 && Math.abs(x) < 0.6) {
          const noseProfile = Math.cos((x / 0.6) * (Math.PI / 2));
          z += (0.9 - Math.abs(y - 0.1) * 0.8) * Math.max(0, noseProfile) * 0.85;
        }

        // Lips & Mouth Contour
        if (y > -1.5 && y < -0.6 && Math.abs(x) < 1.1) {
          const lipCurve = Math.cos((x / 1.1) * (Math.PI / 2));
          z += 0.25 * lipCurve * Math.sin((y + 1.5) * Math.PI);
        }

        // Prominent Chin
        if (y < -1.8 && y > -3.2 && Math.abs(x) < 1.0) {
          z += 0.4 * (1.0 - Math.abs(x));
        }

        // Cheekbones definition
        if (y > -0.3 && y < 0.8 && Math.abs(x) > 1.3 && Math.abs(x) < 2.6) {
          z += 0.28 * Math.sin((y + 0.3) * Math.PI);
        }
      } else {
        // Compress back of head
        z *= 0.4;
      }

      pos.setXYZ(i, x, y, z);
    }
    faceGeo.computeVertexNormals();

    // Translucent holographic face surface
    const faceMat = new THREE.MeshPhysicalMaterial({
      color: 0xDBEAFE,
      roughness: 0.15,
      metalness: 0.1,
      transmission: 0.65,
      ior: 1.35,
      transparent: true,
      opacity: 0.55,
      wireframe: false,
      depthWrite: false
    });
    this.faceSurface = new THREE.Mesh(faceGeo, faceMat);
    this.faceGroup.add(this.faceSurface);

    // Glowing wireframe facial topology
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x3B82F6,
      wireframe: true,
      transparent: true,
      opacity: 0.28
    });
    this.faceWire = new THREE.Mesh(faceGeo, wireMat);
    this.faceGroup.add(this.faceWire);
  }

  buildFacialLandmarks() {
    // 68 Key Anatomical Facial Landmark Points (MediaPipe/Dlib Standard)
    const landmarks = [
      // Jawline (0 - 16)
      [-2.4, 1.2, 0.4], [-2.3, 0.5, 0.7], [-2.2, -0.2, 1.0], [-2.0, -1.0, 1.3],
      [-1.6, -1.7, 1.7], [-1.2, -2.3, 2.0], [-0.7, -2.8, 2.3], [-0.3, -3.1, 2.5],
      [0.0, -3.2, 2.6], // Chin point
      [0.3, -3.1, 2.5], [0.7, -2.8, 2.3], [1.2, -2.3, 2.0], [1.6, -1.7, 1.7],
      [2.0, -1.0, 1.3], [2.2, -0.2, 1.0], [2.3, 0.5, 0.7], [2.4, 1.2, 0.4],
      
      // Right Eyebrow (17 - 21)
      [-2.0, 1.6, 1.6], [-1.6, 1.9, 1.8], [-1.1, 2.0, 2.0], [-0.6, 1.9, 2.1], [-0.2, 1.7, 2.2],
      // Left Eyebrow (22 - 26)
      [0.2, 1.7, 2.2], [0.6, 1.9, 2.1], [1.1, 2.0, 2.0], [1.6, 1.9, 1.8], [2.0, 1.6, 1.6],

      // Nose Bridge & Base (27 - 35)
      [0.0, 1.3, 2.4], [0.0, 0.8, 2.7], [0.0, 0.3, 3.0], [0.0, -0.1, 3.3], // Tip
      [-0.5, -0.4, 2.9], [-0.2, -0.5, 3.1], [0.0, -0.5, 3.15], [0.2, -0.5, 3.1], [0.5, -0.4, 2.9],

      // Right Eye (36 - 41)
      [-1.6, 1.0, 1.8], [-1.3, 1.2, 1.9], [-0.9, 1.2, 2.0], [-0.6, 0.9, 2.0], [-0.9, 0.8, 1.9], [-1.3, 0.8, 1.8],
      // Left Eye (42 - 47)
      [0.6, 0.9, 2.0], [0.9, 1.2, 2.0], [1.3, 1.2, 1.9], [1.6, 1.0, 1.8], [1.3, 0.8, 1.9], [0.9, 0.8, 2.0],

      // Outer Lip (48 - 59)
      [-0.8, -1.2, 2.6], [-0.5, -1.0, 2.8], [-0.2, -0.9, 2.9], [0.0, -0.95, 2.95],
      [0.2, -0.9, 2.9], [0.5, -1.0, 2.8], [0.8, -1.2, 2.6],
      [0.5, -1.5, 2.7], [0.2, -1.6, 2.8], [0.0, -1.65, 2.85], [-0.2, -1.6, 2.8], [-0.5, -1.5, 2.7],

      // Forehead Nodes (AI extension)
      [-1.2, 2.6, 1.6], [0.0, 2.8, 1.9], [1.2, 2.6, 1.6],
      [-2.0, 2.3, 1.2], [2.0, 2.3, 1.2]
    ];

    const sphereGeo = new THREE.SphereGeometry(0.065, 12, 12);
    const landmarkMat = new THREE.MeshBasicMaterial({ color: 0x00E5FF });
    const anomalyMat = new THREE.MeshBasicMaterial({ color: 0xEF4444 });

    landmarks.forEach((pt, index) => {
      // Mark jaw boundary and mouth as suspicious regions for deepfake illustration
      const isSuspicious = (index >= 3 && index <= 7) || (index >= 48 && index <= 54);
      const mesh = new THREE.Mesh(sphereGeo, isSuspicious ? anomalyMat : landmarkMat);
      mesh.position.set(pt[0], pt[1], pt[2]);
      this.landmarksGroup.add(mesh);

      if (isSuspicious) {
        this.suspiciousRegions.push(mesh);
      }
    });

    // Connecting Neural Lines between landmark clusters
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x3B82F6,
      transparent: true,
      opacity: 0.4
    });

    const lineGeo = new THREE.BufferGeometry();
    const linePositions = [];

    // Connect jawline points sequentially
    for (let i = 0; i < 16; i++) {
      linePositions.push(landmarks[i][0], landmarks[i][1], landmarks[i][2]);
      linePositions.push(landmarks[i+1][0], landmarks[i+1][1], landmarks[i+1][2]);
    }
    // Connect eye contours
    for (let i = 36; i < 41; i++) {
      linePositions.push(landmarks[i][0], landmarks[i][1], landmarks[i][2]);
      linePositions.push(landmarks[i+1][0], landmarks[i+1][1], landmarks[i+1][2]);
    }
    linePositions.push(landmarks[41][0], landmarks[41][1], landmarks[41][2]);
    linePositions.push(landmarks[36][0], landmarks[36][1], landmarks[36][2]);

    for (let i = 42; i < 47; i++) {
      linePositions.push(landmarks[i][0], landmarks[i][1], landmarks[i][2]);
      linePositions.push(landmarks[i+1][0], landmarks[i+1][1], landmarks[i+1][2]);
    }
    linePositions.push(landmarks[47][0], landmarks[47][1], landmarks[47][2]);
    linePositions.push(landmarks[42][0], landmarks[42][1], landmarks[42][2]);

    // Connect mouth contour
    for (let i = 48; i < 59; i++) {
      linePositions.push(landmarks[i][0], landmarks[i][1], landmarks[i][2]);
      linePositions.push(landmarks[i+1][0], landmarks[i+1][1], landmarks[i+1][2]);
    }
    linePositions.push(landmarks[59][0], landmarks[59][1], landmarks[59][2]);
    linePositions.push(landmarks[48][0], landmarks[48][1], landmarks[48][2]);

    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    this.neuralLines = new THREE.LineSegments(lineGeo, lineMat);
    this.landmarksGroup.add(this.neuralLines);

    this.faceGroup.add(this.landmarksGroup);
  }

  buildScanningBeam() {
    // 3D Horizontal Laser Scanning Ring & Plane
    const ringGeo = new THREE.RingGeometry(3.6, 4.0, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x06B6D4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.65
    });
    this.scannerRing = new THREE.Mesh(ringGeo, ringMat);
    this.scannerRing.rotation.x = Math.PI / 2;
    this.scannerRing.position.y = 0;
    this.faceGroup.add(this.scannerRing);

    // Glowing Laser Line
    const beamGeo = new THREE.PlaneGeometry(8, 0.08);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x38BDF8,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide
    });
    this.scannerBeam = new THREE.Mesh(beamGeo, beamMat);
    this.scannerBeam.position.z = 2.4;
    this.faceGroup.add(this.scannerBeam);
  }

  buildHolographicShield() {
    // Outer Verification Orbiting Arc / Shield
    const shieldGeo = new THREE.TorusGeometry(4.7, 0.05, 16, 100);
    const shieldMat = new THREE.MeshBasicMaterial({
      color: 0x2563EB,
      transparent: true,
      opacity: 0.4
    });
    this.shieldRing = new THREE.Mesh(shieldGeo, shieldMat);
    this.shieldRing.rotation.x = 0.4;
    this.shieldRing.rotation.y = 0.3;
    this.faceGroup.add(this.shieldRing);

    // Second inclined cryptographic verification ring
    const innerRingGeo = new THREE.TorusGeometry(4.3, 0.03, 16, 80);
    const innerRingMat = new THREE.MeshBasicMaterial({
      color: 0x7C3AED,
      transparent: true,
      opacity: 0.35
    });
    this.innerShield = new THREE.Mesh(innerRingGeo, innerRingMat);
    this.innerShield.rotation.x = -0.5;
    this.innerShield.rotation.z = 0.6;
    this.faceGroup.add(this.innerShield);
  }

  buildParticleField() {
    // Floating AI Neural Particles surrounding the face
    const particleCount = 220;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0x3B82F6);
    const color2 = new THREE.Color(0x06B6D4);
    const color3 = new THREE.Color(0x8B5CF6);

    for (let i = 0; i < particleCount; i++) {
      const radius = 4.2 + Math.random() * 3.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      positions[i * 3] = radius * Math.cos(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi);
      positions[i * 3 + 2] = radius * Math.cos(phi) * Math.sin(theta);

      const chosenColor = (i % 3 === 0) ? color1 : (i % 3 === 1 ? color2 : color3);
      colors[i * 3] = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.09,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    this.particleSystem = new THREE.Points(geometry, material);
    this.faceGroup.add(this.particleSystem);
  }

  onMouseMove(event) {
    // Smooth Parallax Tracking
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;
    this.mouseX = (event.clientX - windowHalfX) / windowHalfX;
    this.mouseY = (event.clientY - windowHalfY) / windowHalfY;

    this.targetRotationY = this.mouseX * 0.45;
    this.targetRotationX = this.mouseY * 0.35;
  }

  onScroll() {
    const scrollY = window.scrollY;
    // Morph/react to scroll state subtly
    if (this.faceGroup) {
      this.faceGroup.position.y = -scrollY * 0.003;
    }
  }

  onWindowResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const elapsedTime = this.clock.getElapsedTime();

    // 1. Natural Face Sway & Cursor Follow
    this.faceGroup.rotation.y += (this.targetRotationY - this.faceGroup.rotation.y) * 0.05;
    this.faceGroup.rotation.x += (this.targetRotationX - this.faceGroup.rotation.x) * 0.05;

    // Subtle gentle autonomous floating breath
    this.faceGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.15;

    // 2. Animated AI Laser Scanning Sweep
    const scanY = Math.sin(elapsedTime * 2.2) * 2.8;
    if (this.scannerRing) {
      this.scannerRing.position.y = scanY;
      this.scannerRing.scale.setScalar(1 + Math.abs(Math.sin(elapsedTime * 3)) * 0.08);
    }
    if (this.scannerBeam) {
      this.scannerBeam.position.y = scanY;
    }

    // 3. Highlight suspicious facial regions when scanner passes over them
    this.suspiciousRegions.forEach((node) => {
      const dist = Math.abs(node.position.y - scanY);
      if (dist < 0.6) {
        node.scale.setScalar(1.6 + Math.sin(elapsedTime * 8) * 0.3);
        node.material.color.setHex(0xEF4444); // Flash forensic red
      } else {
        node.scale.setScalar(1.0);
        node.material.color.setHex(0xF87171); // Restful indicator red
      }
    });

    // 4. Orbiting Holographic Rings
    if (this.shieldRing) {
      this.shieldRing.rotation.z += 0.006;
      this.shieldRing.rotation.y += 0.004;
    }
    if (this.innerShield) {
      this.innerShield.rotation.z -= 0.008;
      this.innerShield.rotation.x += 0.005;
    }

    // 5. Floating Data Particles Drift
    if (this.particleSystem) {
      this.particleSystem.rotation.y = elapsedTime * 0.04;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  if (typeof THREE !== 'undefined') {
    new DeepGuardHero3D('three-hero-container');
  }
});
