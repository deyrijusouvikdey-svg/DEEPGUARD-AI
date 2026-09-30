/**
 * DeepGuard AI - Forensic Video Analyzer Engine
 * High-precision simulation of 10-stage forensic AI pipeline,
 * real-time video player with canvas landmark tracking, suspicious region heatmap,
 * interactive frame timeline scrubber, and dynamic evidence panel.
 */

class DeepGuardVideoAnalyzer {
  constructor() {
    this.currentMode = 'deepfake'; // 'deepfake' or 'authentic'
    this.isProcessing = false;
    this.isPlaying = true;
    this.currentTime = 7.0; // Current video time in seconds (default at first suspicious frame)
    this.duration = 15.0;
    
    // Display Toggles
    this.showLandmarks = true;
    this.showHeatmap = true;
    this.showBoundingBox = true;
    this.showTrackingPoints = true;

    // Elements
    this.dropzone = document.getElementById('analyzer-dropzone');
    this.processingModal = document.getElementById('processing-pipeline-modal');
    this.resultDashboard = document.getElementById('forensic-result-dashboard');
    this.videoCanvas = document.getElementById('forensic-video-canvas');
    this.timelineTrack = document.getElementById('timeline-track');
    this.timelineProgress = document.getElementById('timeline-progress');
    this.currentTimeLabel = document.getElementById('timeline-current-time');
    this.anomalyBadge = document.getElementById('active-anomaly-badge');
    this.anomalyDetail = document.getElementById('active-anomaly-description');

    // Suspicious Keyframe Markers (Seconds)
    this.suspiciousFrames = [
      { time: 4.2, label: "Micro-flicker detected", type: "TEMPORAL", score: 0.78, region: "Forehead / Lighting" },
      { time: 7.0, label: "Face-swap boundary seam", type: "SPATIAL", score: 0.96, region: "Jawline / Chin Blend" },
      { time: 9.4, label: "Landmark trajectory jitter", type: "TEMPORAL", score: 0.91, region: "Blink & Eyeball Saccade" },
      { time: 11.8, label: "Mouth synthesis artifact", type: "SPATIAL", score: 0.94, region: "Lip Boundary / Teeth" }
    ];

    if (this.videoCanvas) {
      this.ctx = this.videoCanvas.getContext('2d');
    }

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupTimelineMarkers();
    this.startVideoRenderLoop();
  }

  setupEventListeners() {
    // Dropzone interactions
    if (this.dropzone) {
      this.dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        this.dropzone.classList.add('dragover');
      });
      this.dropzone.addEventListener('dragleave', () => {
        this.dropzone.classList.remove('dragover');
      });
      this.dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        this.dropzone.classList.remove('dragover');
        this.startAnalysis('deepfake');
      });
    }

    // Preset buttons
    const btnDemoDeepfake = document.getElementById('btn-demo-deepfake');
    const btnDemoAuthentic = document.getElementById('btn-demo-authentic');
    if (btnDemoDeepfake) {
      btnDemoDeepfake.addEventListener('click', () => this.startAnalysis('deepfake'));
    }
    if (btnDemoAuthentic) {
      btnDemoAuthentic.addEventListener('click', () => this.startAnalysis('authentic'));
    }

    // Video Player Toggles
    const toggleLandmarksBtn = document.getElementById('toggle-landmarks-btn');
    if (toggleLandmarksBtn) {
      toggleLandmarksBtn.addEventListener('click', () => {
        this.showLandmarks = !this.showLandmarks;
        toggleLandmarksBtn.classList.toggle('bg-blue-100', this.showLandmarks);
        toggleLandmarksBtn.classList.toggle('text-blue-700', this.showLandmarks);
      });
    }

    const toggleHeatmapBtn = document.getElementById('toggle-heatmap-btn');
    if (toggleHeatmapBtn) {
      toggleHeatmapBtn.addEventListener('click', () => {
        this.showHeatmap = !this.showHeatmap;
        toggleHeatmapBtn.classList.toggle('bg-blue-100', this.showHeatmap);
        toggleHeatmapBtn.classList.toggle('text-blue-700', this.showHeatmap);
      });
    }

    const toggleBoxBtn = document.getElementById('toggle-box-btn');
    if (toggleBoxBtn) {
      toggleBoxBtn.addEventListener('click', () => {
        this.showBoundingBox = !this.showBoundingBox;
        toggleBoxBtn.classList.toggle('bg-blue-100', this.showBoundingBox);
        toggleBoxBtn.classList.toggle('text-blue-700', this.showBoundingBox);
      });
    }

    // Play/Pause button
    const playPauseBtn = document.getElementById('video-play-pause-btn');
    if (playPauseBtn) {
      playPauseBtn.addEventListener('click', () => {
        this.isPlaying = !this.isPlaying;
        playPauseBtn.innerHTML = this.isPlaying 
          ? `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
          : `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;
      });
    }

    // Timeline Track Click
    if (this.timelineTrack) {
      this.timelineTrack.addEventListener('click', (e) => {
        const rect = this.timelineTrack.getBoundingClientRect();
        const clickRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        this.seekTo(clickRatio * this.duration);
      });
    }
  }

  setupTimelineMarkers() {
    const markersContainer = document.getElementById('timeline-markers-container');
    if (!markersContainer) return;
    markersContainer.innerHTML = '';

    if (this.currentMode === 'deepfake') {
      this.suspiciousFrames.forEach((frame) => {
        const percent = (frame.time / this.duration) * 100;
        const marker = document.createElement('div');
        marker.className = 'timeline-marker suspicious';
        marker.style.left = `${percent}%`;
        marker.title = `${frame.time.toFixed(1)}s: ${frame.label} (Score: ${frame.score})`;
        marker.addEventListener('click', (e) => {
          e.stopPropagation();
          this.seekTo(frame.time);
        });
        markersContainer.appendChild(marker);
      });
    }
  }

  seekTo(seconds) {
    this.currentTime = Math.max(0, Math.min(this.duration, seconds));
    this.updateTimelineUI();
    this.checkCurrentAnomalies();
  }

  updateTimelineUI() {
    if (this.timelineProgress) {
      const pct = (this.currentTime / this.duration) * 100;
      this.timelineProgress.style.width = `${pct}%`;
    }
    if (this.currentTimeLabel) {
      const mins = Math.floor(this.currentTime / 60);
      const secs = Math.floor(this.currentTime % 60);
      const ms = Math.floor((this.currentTime % 1) * 100);
      this.currentTimeLabel.textContent = `0${mins}:${secs < 10 ? '0' : ''}${secs}.${ms < 10 ? '0' : ''}${ms}`;
    }
  }

  checkCurrentAnomalies() {
    if (this.currentMode !== 'deepfake') {
      if (this.anomalyBadge) {
        this.anomalyBadge.className = 'px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200';
        this.anomalyBadge.textContent = 'NO ANOMALIES DETECTED';
      }
      if (this.anomalyDetail) {
        this.anomalyDetail.textContent = 'Facial boundary consistency verified. Biological pulse and landmark trajectories are continuous and natural.';
      }
      return;
    }

    // Find closest suspicious frame within 1.0 second
    const match = this.suspiciousFrames.find(f => Math.abs(f.time - this.currentTime) < 1.0);
    if (match) {
      if (this.anomalyBadge) {
        this.anomalyBadge.className = 'px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200 animate-pulse';
        this.anomalyBadge.textContent = `⚠️ SUSPICIOUS: ${match.type} ANOMALY (${Math.round(match.score * 100)}%)`;
      }
      if (this.anomalyDetail) {
        this.anomalyDetail.textContent = `Frame ${Math.round(this.currentTime * 30)} (00:${Math.floor(this.currentTime).toString().padStart(2, '0')}s): ${match.label} in ${match.region}. Gradient boundary failure detected at Poisson blend margin.`;
      }
    } else {
      if (this.anomalyBadge) {
        this.anomalyBadge.className = 'px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200';
        this.anomalyBadge.textContent = 'INTERPOLATED FRAME';
      }
      if (this.anomalyDetail) {
        this.anomalyDetail.textContent = 'Normal landmark track continuity. Anomaly score remains baseline (0.12).';
      }
    }
  }

  startAnalysis(mode = 'deepfake') {
    if (this.isProcessing) return;
    this.isProcessing = true;
    this.currentMode = mode;

    // Show processing pipeline modal
    if (this.processingModal) {
      this.processingModal.classList.remove('hidden');
    }

    const stages = [
      { id: 1, name: "VIDEO INGESTION", detail: "Demuxing H.264 stream & validating container integrity..." },
      { id: 2, name: "FRAME EXTRACTION", detail: "Decoded 450 frames @ 30fps with hardware NVDEC acceleration..." },
      { id: 3, name: "FACE DETECTION", detail: "RetinaFace localized 1 subject (Confidence: 0.998)..." },
      { id: 4, name: "FACIAL LANDMARK ANALYSIS", detail: "Extracting 68-point 3D landmark mesh & pose orientation..." },
      { id: 5, name: "SPATIAL FEATURE ANALYSIS", detail: "EfficientNet-B7 inspecting blending seams & frequency cutoff..." },
      { id: 6, name: "TEMPORAL FEATURE ANALYSIS", detail: "Temporal ViT tracking cross-frame biological pulse & jitter..." },
      { id: 7, name: "MODEL FUSION", detail: "Calibrating spatial + temporal confidence tensors via DeepGuard Fusion..." },
      { id: 8, name: "EXPLAINABILITY", detail: "Generating Grad-CAM regional anomaly saliency heatmaps..." },
      { id: 9, name: "FINGERPRINT GENERATION", detail: "Hashing perceptual frame embeddings (pHash:f928c049e7b23190)..." },
      { id: 10, name: "VERIFICATION & PRESERVATION", detail: "Recording tamper-evident detection ledger block DG-8F4A21..." }
    ];

    let currentStep = 0;
    const stageNameEl = document.getElementById('pipeline-stage-name');
    const stageDetailEl = document.getElementById('pipeline-stage-detail');
    const stagePercentEl = document.getElementById('pipeline-stage-percent');
    const progressBarEl = document.getElementById('pipeline-progress-bar');
    const visualCanvasEl = document.getElementById('pipeline-visual-canvas');

    const interval = setInterval(() => {
      if (currentStep < stages.length) {
        const stage = stages[currentStep];
        const percent = Math.round(((currentStep + 1) / stages.length) * 100);

        if (stageNameEl) stageNameEl.textContent = `STAGE ${stage.id.toString().padStart(2, '0')}: ${stage.name}`;
        if (stageDetailEl) stageDetailEl.textContent = stage.detail;
        if (stagePercentEl) stagePercentEl.textContent = `${percent}%`;
        if (progressBarEl) progressBarEl.style.width = `${percent}%`;

        // Update stage icons/items in list
        const stepItem = document.getElementById(`step-item-${stage.id}`);
        if (stepItem) {
          stepItem.classList.remove('opacity-40');
          stepItem.classList.add('opacity-100', 'text-blue-600', 'font-semibold');
        }

        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          if (this.processingModal) this.processingModal.classList.add('hidden');
          this.isProcessing = false;
          this.renderResultDashboard();
        }, 600);
      }
    }, 450);
  }

  renderResultDashboard() {
    if (!this.resultDashboard) return;
    this.resultDashboard.classList.remove('hidden');
    this.resultDashboard.scrollIntoView({ behavior: 'smooth', block: 'start' });

    const verdictBadge = document.getElementById('dashboard-verdict-badge');
    const verdictTitle = document.getElementById('dashboard-verdict-title');
    const confidenceValue = document.getElementById('dashboard-confidence-val');
    const manipulationType = document.getElementById('dashboard-manipulation-type');
    const riskLevel = document.getElementById('dashboard-risk-level');

    if (this.currentMode === 'deepfake') {
      if (verdictBadge) {
        verdictBadge.className = 'inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-100 text-red-700 border border-red-200';
        verdictBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span> DEEPFAKE DETECTED`;
      }
      if (verdictTitle) verdictTitle.textContent = "SYNTHETIC FACE-SWAP IDENTIFIED";
      if (confidenceValue) confidenceValue.textContent = "96.3%";
      if (manipulationType) manipulationType.textContent = "Face-Swap (GAN / Diffusion Blend)";
      if (riskLevel) {
        riskLevel.className = "text-sm font-bold text-red-600";
        riskLevel.textContent = "CRITICAL / HIGH";
      }
    } else {
      if (verdictBadge) {
        verdictBadge.className = 'inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 border border-emerald-200';
        verdictBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-600"></span> AUTHENTIC MEDIA VERIFIED`;
      }
      if (verdictTitle) verdictTitle.textContent = "AUTHENTIC PRISTINE FOOTAGE";
      if (confidenceValue) confidenceValue.textContent = "98.7%";
      if (manipulationType) manipulationType.textContent = "None (Authentic Camera Capture)";
      if (riskLevel) {
        riskLevel.className = "text-sm font-bold text-emerald-600";
        riskLevel.textContent = "LOW / VERIFIED";
      }
    }

    this.setupTimelineMarkers();
    this.seekTo(this.currentMode === 'deepfake' ? 7.0 : 3.0);
  }

  startVideoRenderLoop() {
    const render = () => {
      if (this.isPlaying) {
        this.currentTime += 0.033; // ~30 fps
        if (this.currentTime >= this.duration) {
          this.currentTime = 0;
        }
        this.updateTimelineUI();
        this.checkCurrentAnomalies();
      }

      this.drawForensicFrame();
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  }

  drawForensicFrame() {
    if (!this.ctx || !this.videoCanvas) return;
    const w = this.videoCanvas.width;
    const h = this.videoCanvas.height;

    // Clear frame
    this.ctx.fillStyle = '#0B132B';
    this.ctx.fillRect(0, 0, w, h);

    // Subtle video grid background
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    this.ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, h);
      this.ctx.stroke();
    }
    for (let y = 0; y < h; y += 40) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(w, y);
      this.ctx.stroke();
    }

    // Render realistic procedural head & face in studio lighting
    const headX = w / 2;
    const headY = h / 2 - 10;
    const bob = Math.sin(this.currentTime * 2) * 4;

    // Shoulders
    this.ctx.fillStyle = '#1E293B';
    this.ctx.beginPath();
    this.ctx.ellipse(headX, headY + 220 + bob, 180, 90, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Neck
    this.ctx.fillStyle = '#E2B19C';
    this.ctx.fillRect(headX - 45, headY + 80 + bob, 90, 80);

    // Head base skin tone
    const skinGrad = this.ctx.createRadialGradient(headX - 20, headY - 20 + bob, 30, headX, headY + bob, 140);
    skinGrad.addColorStop(0, '#FFE0D2');
    skinGrad.addColorStop(0.7, '#F3C4B2');
    skinGrad.addColorStop(1, '#D99B85');
    this.ctx.fillStyle = skinGrad;

    this.ctx.beginPath();
    this.ctx.ellipse(headX, headY + bob, 95, 125, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Eyes
    const blink = Math.sin(this.currentTime * 3) > 0.95 ? 2 : 10;
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.beginPath();
    this.ctx.ellipse(headX - 35, headY - 15 + bob, 16, blink, 0, 0, Math.PI * 2);
    this.ctx.ellipse(headX + 35, headY - 15 + bob, 16, blink, 0, 0, Math.PI * 2);
    this.ctx.fill();

    if (blink > 3) {
      this.ctx.fillStyle = '#1E3A8A';
      this.ctx.beginPath();
      this.ctx.arc(headX - 35, headY - 15 + bob, 6, 0, Math.PI * 2);
      this.ctx.arc(headX + 35, headY - 15 + bob, 6, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // Eyebrows
    this.ctx.strokeStyle = '#475569';
    this.ctx.lineWidth = 4;
    this.ctx.beginPath();
    this.ctx.arc(headX - 35, headY - 32 + bob, 22, Math.PI * 1.1, Math.PI * 1.9);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.arc(headX + 35, headY - 32 + bob, 22, Math.PI * 1.1, Math.PI * 1.9);
    this.ctx.stroke();

    // Nose
    this.ctx.strokeStyle = '#BA7A65';
    this.ctx.lineWidth = 2.5;
    this.ctx.beginPath();
    this.ctx.moveTo(headX, headY - 10 + bob);
    this.ctx.lineTo(headX - 4, headY + 25 + bob);
    this.ctx.lineTo(headX + 6, headY + 25 + bob);
    this.ctx.stroke();

    // Lips
    this.ctx.fillStyle = '#C86B6B';
    this.ctx.beginPath();
    this.ctx.ellipse(headX, headY + 60 + bob, 24, 8, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Hair
    this.ctx.fillStyle = '#1E293B';
    this.ctx.beginPath();
    this.ctx.arc(headX, headY - 45 + bob, 100, Math.PI, 0);
    this.ctx.fill();

    // FORENSIC OVERLAYS

    // 1. RetinaFace Bounding Box
    if (this.showBoundingBox) {
      this.ctx.strokeStyle = (this.currentMode === 'deepfake' && Math.abs(this.currentTime - 7.0) < 3.0) ? '#EF4444' : '#00E5FF';
      this.ctx.lineWidth = 2;
      this.ctx.setLineDash([6, 4]);
      this.ctx.strokeRect(headX - 110, headY - 145 + bob, 220, 280);
      this.ctx.setLineDash([]);

      // Corner tags
      this.ctx.fillStyle = this.ctx.strokeStyle;
      this.ctx.font = '11px "JetBrains Mono", monospace';
      this.ctx.fillText(`FACE_ID: #01 [CONF: 0.99]`, headX - 105, headY - 150 + bob);
      this.ctx.fillText(`POSE: P=2.1° Y=-1.4°`, headX - 105, headY + 150 + bob);
    }

    // 2. Suspicious Anomaly Heatmap (Grad-CAM Blend)
    if (this.showHeatmap && this.currentMode === 'deepfake') {
      const isNearAnomaly = Math.abs(this.currentTime - 7.0) < 2.5;
      if (isNearAnomaly) {
        // Red anomaly gradient around jawline blend boundary
        const hGrad = this.ctx.createRadialGradient(headX, headY + 80 + bob, 15, headX, headY + 80 + bob, 70);
        hGrad.addColorStop(0, 'rgba(239, 68, 68, 0.7)');
        hGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.45)');
        hGrad.addColorStop(1, 'rgba(59, 130, 246, 0)');

        this.ctx.save();
        this.ctx.fillStyle = hGrad;
        this.ctx.beginPath();
        this.ctx.ellipse(headX, headY + 80 + bob, 85, 45, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();

        // Anomaly Label
        this.ctx.fillStyle = '#EF4444';
        this.ctx.font = 'bold 12px "JetBrains Mono", monospace';
        this.ctx.fillText('ANOMALY_REGION: 0.96 JAW_SEAM', headX - 95, headY + 115 + bob);
      }
    }

    // 3. 68-Point Facial Landmark Mesh Overlay
    if (this.showLandmarks) {
      this.ctx.fillStyle = this.currentMode === 'deepfake' ? '#F87171' : '#38BDF8';
      this.ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
      this.ctx.lineWidth = 1;

      // Sample key coordinates
      const lm = [
        // Jawline
        [headX - 85, headY + bob], [headX - 75, headY + 35 + bob], [headX - 60, headY + 70 + bob],
        [headX - 35, headY + 95 + bob], [headX, headY + 105 + bob], [headX + 35, headY + 95 + bob],
        [headX + 60, headY + 70 + bob], [headX + 75, headY + 35 + bob], [headX + 85, headY + bob],
        // Left Eye
        [headX - 45, headY - 15 + bob], [headX - 35, headY - 20 + bob], [headX - 25, headY - 15 + bob], [headX - 35, headY - 10 + bob],
        // Right Eye
        [headX + 25, headY - 15 + bob], [headX + 35, headY - 20 + bob], [headX + 45, headY - 15 + bob], [headX + 35, headY - 10 + bob],
        // Nose
        [headX, headY - 10 + bob], [headX, headY + 10 + bob], [headX, headY + 25 + bob],
        // Mouth
        [headX - 24, headY + 60 + bob], [headX, headY + 54 + bob], [headX + 24, headY + 60 + bob], [headX, headY + 66 + bob]
      ];

      // Draw points & interconnecting mesh
      this.ctx.beginPath();
      lm.forEach((pt, idx) => {
        if (idx === 0) this.ctx.moveTo(pt[0], pt[1]);
        else this.ctx.lineTo(pt[0], pt[1]);
      });
      this.ctx.stroke();

      lm.forEach(pt => {
        this.ctx.beginPath();
        this.ctx.arc(pt[0], pt[1], 2.2, 0, Math.PI * 2);
        this.ctx.fill();
      });
    }

    // Telemetry OSD
    this.ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
    this.ctx.fillRect(15, 15, 210, 75);
    this.ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
    this.ctx.strokeRect(15, 15, 210, 75);

    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.font = '10px "JetBrains Mono", monospace';
    this.ctx.fillText(`DEEPGUARD FORENSIC ENGINE v1.2`, 25, 32);
    this.ctx.fillStyle = '#94A3B8';
    this.ctx.fillText(`FRAME: ${Math.floor(this.currentTime * 30).toString().padStart(4, '0')} / 450`, 25, 48);
    this.ctx.fillText(`FPS: 29.97 (VFR STABLE)`, 25, 62);
    this.ctx.fillStyle = this.currentMode === 'deepfake' ? '#EF4444' : '#10B981';
    this.ctx.fillText(`STATUS: ${this.currentMode === 'deepfake' ? 'ANOMALY DETECTED' : 'CLEAN / AUTHENTIC'}`, 25, 76);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.deepGuardAnalyzer = new DeepGuardVideoAnalyzer();
});
