# DeepGuard AI — Digital Media Forensic Intelligence Platform

> **"Detect. Explain. Fingerprint. Verify. Preserve."**
> 
> *A World-Class, 3D AI-Powered Forensic Intelligence Platform for Face-Swap Deepfake Detection & Chain-of-Custody Attestation.*

---

## 🛡️ Problem Statement
**"Development of an AI/ML based solution for detection of face swap based deep fake videos."**

Modern deepfakes created via diffusion, generative adversarial networks (GANs), and latent identity-swap pipelines are no longer just a visual problem. Generic binary classifiers fail because:
1. They lack **explainability** (black-box predictions that cannot stand up in legal proceedings).
2. They evaluate only **static frames**, missing inter-frame temporal flickering and optical trajectory jitter.
3. They rely on **cryptographic file hashes** (like SHA-256) that break instantly when videos are compressed or transcoded on social networks.
4. They provide no **tamper-evident chain of custody** to prove when and how media was inspected.

**DeepGuard AI** transforms deepfake detection into an end-to-end digital forensic pipeline:
$$\text{DETECT} \longrightarrow \text{ANALYZE} \longrightarrow \text{EXPLAIN} \longrightarrow \text{FINGERPRINT} \longrightarrow \text{VERIFY} \longrightarrow \text{PRESERVE}$$

---

## 🔬 Core Capabilities

### 1. 3D WebGL Hero Engine
- **Procedural 3D Human Face**: Sculpted polygonal face mesh with geodesic wireframe overlay and translucent holographic layers.
- **68-Point Anatomical Landmarks**: MediaPipe/Dlib standard facial landmark point clouds.
- **AI Laser Scanning Beam**: Dynamic vertical scan beam that flashes red when intersecting simulated manipulation boundaries.
- **Holographic Verification Rings**: Dual orbiting cryptographic rings with real-time mouse parallax and cursor-following orientation.

### 2. Forensic Video Analyzer & 10-Stage Pipeline
- **Interactive Drag & Drop Workspace**: Supports MP4, MOV, AVI, and WEBM.
- **Preconfigured Evaluation Modes**:
  - `Sample A: Face-Swap Deepfake (High Risk)` — 96.3% confidence, flagged spatial seam & jitter.
  - `Sample B: Authentic News Broadcast (Pristine)` — 98.7% confidence, pristine stream verified.
- **10-Stage Asynchronous Pipeline Simulation**:
  1. *Video Ingestion* (Bitstream parsing & container integrity)
  2. *Frame Extraction* (Hardware-accelerated NVDEC decoding @ 30fps)
  3. *Face Detection* (RetinaFace multi-scale localization)
  4. *Facial Landmark Analysis* (3D pose & 68-point landmark mesh)
  5. *Spatial Feature Analysis* (EfficientNet-B7 inspecting boundary seams)
  6. *Temporal Feature Analysis* (Temporal ViT tracking biological pulse & jitter)
  7. *Model Fusion* (Weighted confidence tensor calibration)
  8. *Explainability* (Grad-CAM regional anomaly saliency)
  9. *Fingerprint Generation* (Perceptual pHash frame embeddings)
  10. *Verification & Preservation* (Immutable tamper-evident ledger block sealing)

### 3. Interactive Video Player & Suspicious Timeline
- **Canvas Video Renderer**: Procedural video player simulating head motion, eye blinks, and dynamic illumination.
- **Real-Time Overlays**: Toggle 68-point landmarks, Grad-CAM heatmap, and bounding boxes.
- **Flagged Frame Scrubber**: Clickable markers at `00:04`, `00:07 🔴`, `00:09 🔴`, `00:11 🔴`, and `00:15`.
- Clicking any anomaly flag immediately jumps to that keyframe, triggers the regional anomaly heatmap, and updates the forensic evidence readout.

### 4. Explainable AI (XAI) Deep-Dive
- Dynamic anatomical inspection of:
  - *Jawline Blending Seam* (Score: 0.94)
  - *Orbital Saccade & Eye Region* (Score: 0.88)
  - *Lip Boundary & Oral Cavity* (Score: 0.91)
  - *Temporal Skin Micro-texture* (Score: 0.85)
- Cursor-reactive anomaly loupe displaying localized continuous coefficients.

### 5. Perceptual Video Fingerprinting vs Cryptographic Hashing
- Interactive simulation showing how standard **SHA-256** completely fails upon recompression, while **Perceptual Fingerprinting (pHash)** maintains 96%+ semantic similarity across:
  - *Social Media Recompression (720p)*
  - *Resolution Downscaling (480p)*
  - *Codec Transcoding (HEVC / H.265)*
  - *Aspect Ratio Cropping (5%)*

### 6. Media Verification Center & 3D Blockchain Evidence Registry
- **Verification Search**: Look up any Evidence ID (e.g., `DG-8F4A21`) or perceptual hash to confirm prior detection verdicts.
- **3D WebGL Ledger Graph**: Interactive network of holographic blocks. Hovering over any block reveals immutable timestamps, SHA-256 hashes, perceptual fingerprints, and model checkpoint versions.
- *Architectural Note: Blockchain does not detect deepfakes; AI performs detection, and the ledger preserves the detection record.*

### 7. Official Forensic Report Generator
- Court-ready forensic analysis certificate.
- Complete breakdown of suspicious frames, confidence scores, hash signatures, and legal chain-of-custody metadata.
- Integrated one-click printable / PDF export (`window.print()`).

---

## 🚀 Quick Start Guide

### Option 1: Local Python Server (Recommended)
From the project folder, run:
```bash
python serve.py
```
Then open your browser at:
```
http://localhost:3000
```

### Option 2: Direct Browser Launch
Simply open `index.html` in any modern web browser (Chrome, Edge, Firefox, Safari).

---

## 📐 Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend & 3D UI** | HTML5, CSS3, Tailwind CSS, Three.js (r128), GSAP |
| **Backend & Pipeline** | Python 3.14, FastAPI, Celery, REST API |
| **Computer Vision** | OpenCV, MediaPipe 3D Mesh, RetinaFace, NVDEC FFmpeg |
| **AI / ML Models** | PyTorch, EfficientNet-B7 / ViT (Spatial), Temporal ViT / GRU (Temporal) |
| **Explainable AI** | Grad-CAM, Saliency Attribution, Discrete Cosine Transform (DCT) |
| **Verification & Trust** | Perceptual Hashing (pHash), Cryptographic SHA-256, Merkle Proof Ledger |

---

## 📊 Candidate Evaluation Datasets
*Candidate benchmarks for cross-dataset generalization evaluation:*
- **FaceForensics++**: Multi-method manipulation benchmark (Deepfakes, Face2Face, FaceSwap, NeuralTextures).
- **Celeb-DF (v2)**: High-quality synthetic video benchmark minimizing visible boundary seams.
- **DFDC (Deepfake Detection Challenge)**: Large-scale real-world evaluation dataset with diverse lighting and pose variations.

---

© 2026 DeepGuard AI. All rights reserved. Forensic Intelligence Protocol.
