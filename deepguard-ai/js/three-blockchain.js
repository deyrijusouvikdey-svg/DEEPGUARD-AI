/**
 * DeepGuard AI - 3D Blockchain Evidence Registry Engine
 * Interactive Three.js WebGL network of floating transparent evidence blocks,
 * cryptographic hash links, and inspector for immutable detection records.
 */

class DeepGuardBlockchain3D {
  constructor(canvasContainerId, detailCardId) {
    this.container = document.getElementById(canvasContainerId);
    this.detailCard = document.getElementById(detailCardId);
    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.blocksGroup = new THREE.Group();
    this.linksGroup = new THREE.Group();
    this.blocks = [];
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.hoveredBlock = null;

    this.mockRecords = [
      {
        id: "DG-9042F1",
        prevHash: "0x89d2...34e1",
        hash: "0x4f82a1b9e03d42c7aa887192bf394e1d5a8c9b20e74f1a23c890123456789abc",
        fingerprint: "pHash:e4893710a9c84e12",
        classification: "DEEPFAKE",
        confidence: "97.4%",
        manipulation: "Face-Swap (GAN Blend)",
        timestamp: "30 SEP 2026 18:42:10 UTC",
        model: "DeepGuard Fusion v1",
        status: "VERIFIED_PRESERVED"
      },
      {
        id: "DG-8F4A21",
        prevHash: "0x4f82...9abc",
        hash: "0x7a29481bc92e01df349281a8b9e02c47ff1902a348e02b789123456789abcdef",
        fingerprint: "pHash:f928c049e7b23190",
        classification: "DEEPFAKE",
        confidence: "96.3%",
        manipulation: "Face-Swap (Diffusion Inpaint)",
        timestamp: "30 SEP 2026 19:14:05 UTC",
        model: "DeepGuard Fusion v1",
        status: "VERIFIED_PRESERVED"
      },
      {
        id: "DG-7A19B3",
        prevHash: "0x7a29...cdef",
        hash: "0x12a9bc4e0281d39478a01b29ce4812f901a23b48e02d4567890123456789abcd",
        fingerprint: "pHash:c0192e84b912384a",
        classification: "AUTHENTIC",
        confidence: "98.9%",
        manipulation: "None (Pristine Stream)",
        timestamp: "30 SEP 2026 19:35:48 UTC",
        model: "DeepGuard Fusion v1",
        status: "VERIFIED_PRESERVED"
      },
      {
        id: "DG-6C39E8",
        prevHash: "0x12a9...abcd",
        hash: "0x98124ef0192a83bd47120a9bc4e823d1901a248f02b37890123456789abcdef0",
        fingerprint: "pHash:a9284f10e7b21904",
        classification: "DEEPFAKE",
        confidence: "94.8%",
        manipulation: "Face-Swap (Expression Transfer)",
        timestamp: "30 SEP 2026 19:58:22 UTC",
        model: "DeepGuard Fusion v1",
        status: "VERIFIED_PRESERVED"
      },
      {
        id: "DG-5D92A4",
        prevHash: "0x9812...def0",
        hash: "0x34a812df0921a8bc47e01b29ca4819d901a23e4802c567890123456789abcdef",
        fingerprint: "pHash:8f192b04c8e71239",
        classification: "DEEPFAKE",
        confidence: "98.1%",
        manipulation: "Face-Swap (Identity Morph)",
        timestamp: "30 SEP 2026 20:00:15 UTC",
        model: "DeepGuard Fusion v1",
        status: "VERIFIED_PRESERVED"
      }
    ];

    this.init();
  }

  init() {
    const width = this.container.clientWidth || 900;
    const height = this.container.clientHeight || 480;

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    this.camera.position.set(0, 2, 13);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    // Lights
    const ambLight = new THREE.AmbientLight(0xffffff, 0.85);
    this.scene.add(ambLight);

    const dirLight = new THREE.DirectionalLight(0x3B82F6, 1.5);
    dirLight.position.set(5, 10, 7);
    this.scene.add(dirLight);

    // Build Blocks in chain topology
    this.createBlockchainNodes();

    this.scene.add(this.linksGroup);
    this.scene.add(this.blocksGroup);

    // Raycaster listeners
    this.container.addEventListener('mousemove', (e) => this.onPointerMove(e));
    this.container.addEventListener('click', () => this.onBlockClick());
    window.addEventListener('resize', () => this.onResize());

    // Initial detail card display with middle block
    this.displayRecord(this.mockRecords[1]);

    this.animate();
  }

  createBlockchainNodes() {
    const boxGeo = new THREE.BoxGeometry(1.6, 1.4, 1.4);
    const edgesGeo = new THREE.EdgesGeometry(boxGeo);

    const startX = -6.0;
    const stepX = 3.0;

    this.mockRecords.forEach((record, idx) => {
      const x = startX + idx * stepX;
      const y = Math.sin(idx * 1.2) * 0.8;
      const z = Math.cos(idx * 0.9) * 0.7;

      const isDeepfake = record.classification === "DEEPFAKE";
      const blockColor = isDeepfake ? 0x2563EB : 0x059669;

      // Transparent holographic glass box
      const boxMat = new THREE.MeshPhysicalMaterial({
        color: 0xF8FAFC,
        roughness: 0.1,
        metalness: 0.1,
        transmission: 0.85,
        ior: 1.3,
        transparent: true,
        opacity: 0.8,
        depthWrite: false
      });
      const mesh = new THREE.Mesh(boxGeo, boxMat);
      mesh.position.set(x, y, z);
      mesh.userData = { record, originalColor: blockColor, index: idx };

      // Glowing outer cryptographic edges
      const edgeMat = new THREE.LineBasicMaterial({
        color: blockColor,
        linewidth: 2,
        transparent: true,
        opacity: 0.85
      });
      const wire = new THREE.LineSegments(edgesGeo, edgeMat);
      mesh.add(wire);

      // Inner data core sphere
      const coreGeo = new THREE.SphereGeometry(0.3, 16, 16);
      const coreMat = new THREE.MeshBasicMaterial({
        color: isDeepfake ? 0xEF4444 : 0x10B981,
        wireframe: true
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      mesh.add(core);

      this.blocksGroup.add(mesh);
      this.blocks.push(mesh);

      // Cryptographic chain link to previous block
      if (idx > 0) {
        const prevMesh = this.blocks[idx - 1];
        const lineGeo = new THREE.BufferGeometry().setFromPoints([
          prevMesh.position,
          mesh.position
        ]);
        const lineMat = new THREE.LineDashedMaterial({
          color: 0x3B82F6,
          dashSize: 0.2,
          gapSize: 0.1,
          transparent: true,
          opacity: 0.7
        });
        const line = new THREE.Line(lineGeo, lineMat);
        line.computeLineDistances();
        this.linksGroup.add(line);
      }
    });
  }

  onPointerMove(e) {
    const rect = this.container.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.blocks);

    if (intersects.length > 0) {
      const topBlock = intersects[0].object;
      if (this.hoveredBlock !== topBlock) {
        if (this.hoveredBlock) this.resetBlock(this.hoveredBlock);
        this.hoveredBlock = topBlock;
        this.highlightBlock(topBlock);
        this.displayRecord(topBlock.userData.record);
      }
      this.container.style.cursor = 'pointer';
    } else {
      if (this.hoveredBlock) {
        this.resetBlock(this.hoveredBlock);
        this.hoveredBlock = null;
      }
      this.container.style.cursor = 'default';
    }
  }

  highlightBlock(block) {
    block.scale.set(1.18, 1.18, 1.18);
    block.material.opacity = 0.95;
    block.children[0].material.color.setHex(0x38BDF8); // Glow cyan
  }

  resetBlock(block) {
    block.scale.set(1, 1, 1);
    block.material.opacity = 0.8;
    block.children[0].material.color.setHex(block.userData.originalColor);
  }

  onBlockClick() {
    if (this.hoveredBlock) {
      this.displayRecord(this.hoveredBlock.userData.record);
    }
  }

  displayRecord(record) {
    if (!this.detailCard || !record) return;
    const isDeepfake = record.classification === "DEEPFAKE";

    this.detailCard.innerHTML = `
      <div class="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center ${isDeepfake ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'}">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
          </div>
          <div>
            <div class="text-xs font-semibold uppercase tracking-wider text-slate-400">Preserved Evidence Block</div>
            <div class="text-lg font-bold text-slate-900 font-mono">${record.id}</div>
          </div>
        </div>
        <span class="px-3 py-1 text-xs font-bold rounded-full font-mono ${isDeepfake ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'}">
          ${record.classification} • ${record.confidence}
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div class="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
          <div class="text-slate-500 font-medium mb-1">Cryptographic Hash (SHA-256)</div>
          <div class="font-mono text-slate-800 break-all text-[11px]">${record.hash}</div>
        </div>
        <div class="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
          <div class="text-slate-500 font-medium mb-1">Perceptual Content Fingerprint</div>
          <div class="font-mono text-blue-600 font-semibold text-[11px]">${record.fingerprint}</div>
        </div>
        <div class="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
          <div class="text-slate-500 font-medium mb-1">Manipulation Anomaly</div>
          <div class="font-medium text-slate-800">${record.manipulation}</div>
        </div>
        <div class="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
          <div class="text-slate-500 font-medium mb-1">Detection Model</div>
          <div class="font-medium text-slate-800">${record.model}</div>
        </div>
      </div>

      <div class="flex items-center justify-between mt-4 pt-3 border-t border-slate-200 text-xs text-slate-500 font-mono">
        <div>Timestamp: ${record.timestamp}</div>
        <div class="flex items-center gap-1.5 text-emerald-600 font-semibold">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          LEDGER IMMUTABLE
        </div>
      </div>
    `;
  }

  onResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const time = Date.now() * 0.001;

    // Gentle floating rotation of the blockchain cluster
    this.blocks.forEach((block, idx) => {
      block.rotation.y = time * 0.4 + idx;
      block.rotation.x = Math.sin(time * 0.5 + idx) * 0.2;
      block.position.y += Math.sin(time * 1.5 + idx) * 0.002;
    });

    this.renderer.render(this.scene, this.camera);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (typeof THREE !== 'undefined' && document.getElementById('blockchain-3d-canvas')) {
    new DeepGuardBlockchain3D('blockchain-3d-canvas', 'blockchain-record-details');
  }
});
