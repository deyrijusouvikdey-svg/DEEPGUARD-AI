/**
 * DeepGuard AI - Explainable AI (XAI) Deep-Dive Engine
 * Interactive heatmap over facial regions (jaw boundary, eyes, mouth, skin texture blending),
 * cursor anomaly loupe, and explainability indicator checklist.
 */

class DeepGuardExplainableAI {
  constructor() {
    this.canvas = document.getElementById('xai-frame-canvas');
    this.loupe = document.getElementById('xai-anomaly-loupe');
    this.scoreDisplay = document.getElementById('xai-anomaly-score');
    this.regionNameDisplay = document.getElementById('xai-region-name');
    this.confidenceBar = document.getElementById('xai-confidence-bar');
    
    // Regions with anomaly profiles (illustrative demo data)
    this.regions = [
      { name: "Jawline Blending Seam", x: 260, y: 310, radius: 65, score: 0.94, desc: "High-frequency edge mismatch at Poisson border blend." },
      { name: "Orbital Saccade & Eye Region", x: 200, y: 175, radius: 45, score: 0.88, desc: "Micro-flickering and corneal reflection desync." },
      { name: "Lip Boundary & Oral Cavity", x: 260, y: 265, radius: 40, score: 0.91, desc: "Phoneme-viseme desynchronization and texture blur." },
      { name: "Temporal Skin Micro-texture", x: 340, y: 210, radius: 55, score: 0.85, desc: "Loss of natural pore detail due to latent decoders." }
    ];

    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
      this.init();
    }
  }

  init() {
    this.drawBaseFrame();
    this.setupListeners();
  }

  drawBaseFrame() {
    if (!this.ctx || !this.canvas) return;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // High resolution facial frame illustration
    this.ctx.fillStyle = '#0F172A';
    this.ctx.fillRect(0, 0, w, h);

    // Face representation
    const cx = w / 2;
    const cy = h / 2 - 10;

    // Head base
    const grad = this.ctx.createRadialGradient(cx, cy, 40, cx, cy, 180);
    grad.addColorStop(0, '#FED7AA');
    grad.addColorStop(0.8, '#FDBA74');
    grad.addColorStop(1, '#FB923C');
    this.ctx.fillStyle = grad;
    this.ctx.beginPath();
    this.ctx.ellipse(cx, cy, 120, 160, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Eyes
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.beginPath();
    this.ctx.ellipse(cx - 45, cy - 25, 22, 12, 0, 0, Math.PI * 2);
    this.ctx.ellipse(cx + 45, cy - 25, 22, 12, 0, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = '#1E3A8A';
    this.ctx.beginPath();
    this.ctx.arc(cx - 45, cy - 25, 8, 0, Math.PI * 2);
    this.ctx.arc(cx + 45, cy - 25, 8, 0, Math.PI * 2);
    this.ctx.fill();

    // Lips
    this.ctx.fillStyle = '#E11D48';
    this.ctx.beginPath();
    this.ctx.ellipse(cx, cy + 65, 34, 12, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Heatmap Overlay (Grad-CAM Multi-layer Gaussian)
    this.regions.forEach(reg => {
      const hg = this.ctx.createRadialGradient(reg.x, reg.y, 5, reg.x, reg.y, reg.radius);
      hg.addColorStop(0, 'rgba(239, 68, 68, 0.75)');
      hg.addColorStop(0.4, 'rgba(245, 158, 11, 0.55)');
      hg.addColorStop(0.8, 'rgba(59, 130, 246, 0.25)');
      hg.addColorStop(1, 'rgba(37, 99, 235, 0)');

      this.ctx.fillStyle = hg;
      this.ctx.beginPath();
      this.ctx.arc(reg.x, reg.y, reg.radius, 0, Math.PI * 2);
      this.ctx.fill();

      // Outer contour ring
      this.ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
      this.ctx.lineWidth = 1.5;
      this.ctx.setLineDash([4, 4]);
      this.ctx.beginPath();
      this.ctx.arc(reg.x, reg.y, reg.radius, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.setLineDash([]);
    });

    // Grid coordinates
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    this.ctx.lineWidth = 1;
    for (let i = 40; i < w; i += 40) {
      this.ctx.beginPath();
      this.ctx.moveTo(i, 0);
      this.ctx.lineTo(i, h);
      this.ctx.stroke();
    }
  }

  setupListeners() {
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (this.canvas.width / rect.width);
      const y = (e.clientY - rect.top) * (this.canvas.height / rect.height);

      // Check proximity to any anomaly region
      let activeRegion = null;
      let minDistance = 999;

      this.regions.forEach(reg => {
        const dist = Math.hypot(reg.x - x, reg.y - y);
        if (dist < reg.radius + 20 && dist < minDistance) {
          minDistance = dist;
          activeRegion = reg;
        }
      });

      if (activeRegion) {
        const anomalyScore = activeRegion.score.toFixed(2);
        if (this.scoreDisplay) this.scoreDisplay.textContent = anomalyScore;
        if (this.regionNameDisplay) this.regionNameDisplay.textContent = activeRegion.name;
        if (this.confidenceBar) this.confidenceBar.style.width = `${activeRegion.score * 100}%`;
      } else {
        if (this.scoreDisplay) this.scoreDisplay.textContent = "0.14";
        if (this.regionNameDisplay) this.regionNameDisplay.textContent = "Normal Skin Region";
        if (this.confidenceBar) this.confidenceBar.style.width = `14%`;
      }
    });

    // Region button click selectors
    const regionButtons = document.querySelectorAll('.xai-region-selector');
    regionButtons.forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        const reg = this.regions[idx % this.regions.length];
        if (this.scoreDisplay) this.scoreDisplay.textContent = reg.score.toFixed(2);
        if (this.regionNameDisplay) this.regionNameDisplay.textContent = reg.name;
        if (this.confidenceBar) this.confidenceBar.style.width = `${reg.score * 100}%`;
        
        regionButtons.forEach(b => b.classList.remove('bg-blue-50', 'border-blue-300'));
        btn.classList.add('bg-blue-50', 'border-blue-300');
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new DeepGuardExplainableAI();
});
