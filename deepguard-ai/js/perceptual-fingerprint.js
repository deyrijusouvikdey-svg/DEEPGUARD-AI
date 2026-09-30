/**
 * DeepGuard AI - Perceptual Fingerprinting vs Cryptographic Hashing Engine
 * Demonstrates how SHA-256 breaks upon re-encoding while perceptual fingerprinting
 * preserves semantic content similarity across supported transformations.
 */

class DeepGuardFingerprintEngine {
  constructor() {
    this.states = {
      original: {
        title: "Original Master Video",
        specs: "1080p • H.264 • 12.4 Mbps • Pristine Bitstream",
        sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        pHash: "pHash:f928c049e7b23190",
        similarity: "100.0% (Exact Master Match)",
        shaStatus: "EXACT_MATCH",
        pHashStatus: "IDENTICAL"
      },
      compressed: {
        title: "Social Media Transcoded (WhatsApp / Twitter)",
        specs: "720p • Recompressed • 1.8 Mbps • Quantization Loss",
        sha256: "8a194bc0281d39478a01b29ce4812f901a23b48e02d4567890123456789abcd9",
        pHash: "pHash:f928c049e7b23190",
        similarity: "98.2% (Semantic Content Preserved)",
        shaStatus: "FAILED_MISMATCH",
        pHashStatus: "MATCH_HIGH"
      },
      resized: {
        title: "Resolution Downscaled (480p)",
        specs: "854x480 • Rescaled Aspect • Bilinear Filter",
        sha256: "2d7120a9bc4e823d1901a248f02b37890123456789abcdef01293810238120ab",
        pHash: "pHash:f928c049e7b23191",
        similarity: "96.7% (Semantic Content Preserved)",
        shaStatus: "FAILED_MISMATCH",
        pHashStatus: "MATCH_HIGH"
      },
      transcoded: {
        title: "Transcoded to HEVC / H.265",
        specs: "1080p • New Codec Container • B-Frame Reordering",
        sha256: "6c91a0283b48e02d4567890123456789abcd98124ef0192a83bd47120a9bc4e8",
        pHash: "pHash:f928c049e7b23190",
        similarity: "97.4% (Semantic Content Preserved)",
        shaStatus: "FAILED_MISMATCH",
        pHashStatus: "MATCH_HIGH"
      },
      cropped: {
        title: "5% Border Crop & Color Grade",
        specs: "1026x576 • Gamma Adjusted • Slight Aspect Shift",
        sha256: "1f82a1b9e03d42c7aa887192bf394e1d5a8c9b20e74f1a23c890123456789abc",
        pHash: "pHash:f928c049e7b22194",
        similarity: "94.1% (Near-Duplicate Match)",
        shaStatus: "FAILED_MISMATCH",
        pHashStatus: "MATCH_CONFIRMED"
      }
    };

    this.init();
  }

  init() {
    const buttons = document.querySelectorAll('.fingerprint-transform-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-mode') || 'original';
        this.applyState(mode);

        buttons.forEach(b => {
          b.classList.remove('bg-blue-600', 'text-white', 'shadow-md');
          b.classList.add('bg-white', 'text-slate-700');
        });
        btn.classList.remove('bg-white', 'text-slate-700');
        btn.classList.add('bg-blue-600', 'text-white', 'shadow-md');
      });
    });

    // Initial render
    this.applyState('compressed');
  }

  applyState(mode) {
    const data = this.states[mode] || this.states.original;

    const titleEl = document.getElementById('fp-state-title');
    const specsEl = document.getElementById('fp-state-specs');
    const shaEl = document.getElementById('fp-sha-hash');
    const shaBadgeEl = document.getElementById('fp-sha-badge');
    const pHashEl = document.getElementById('fp-phash-val');
    const pHashBadgeEl = document.getElementById('fp-phash-badge');
    const similarityEl = document.getElementById('fp-similarity-score');
    const similarityBarEl = document.getElementById('fp-similarity-bar');

    if (titleEl) titleEl.textContent = data.title;
    if (specsEl) specsEl.textContent = data.specs;
    if (shaEl) shaEl.textContent = data.sha256;
    if (pHashEl) pHashEl.textContent = data.pHash;
    if (similarityEl) similarityEl.textContent = data.similarity;

    const pct = parseFloat(data.similarity);
    if (similarityBarEl) similarityBarEl.style.width = `${pct}%`;

    if (shaBadgeEl) {
      if (data.shaStatus === 'EXACT_MATCH') {
        shaBadgeEl.className = 'px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200';
        shaBadgeEl.textContent = 'MATCH: EXACT BITSTREAM';
      } else {
        shaBadgeEl.className = 'px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-red-100 text-red-700 border border-red-200';
        shaBadgeEl.textContent = 'ZERO BIT MATCH (COLLISION MISS)';
      }
    }

    if (pHashBadgeEl) {
      pHashBadgeEl.className = 'px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-blue-100 text-blue-700 border border-blue-200';
      pHashBadgeEl.textContent = `${pct >= 95 ? 'RECOGNIZED' : 'DERIVED DETECTED'} (${pct}%)`;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new DeepGuardFingerprintEngine();
});
