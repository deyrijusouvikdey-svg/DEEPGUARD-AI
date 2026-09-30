/**
 * DeepGuard AI - Media Verification Center Engine
 * Simulates lookup across tamper-evident evidence registry,
 * perceptual fingerprint matching, and animated cryptographic shield verification.
 */

class DeepGuardVerificationCenter {
  constructor() {
    this.searchBtn = document.getElementById('verify-search-btn');
    this.searchInput = document.getElementById('verify-query-input');
    this.statusContainer = document.getElementById('verify-status-container');
    this.resultContainer = document.getElementById('verify-result-container');
    this.shieldIcon = document.getElementById('verify-shield-icon');

    this.sampleDB = {
      'DG-8F4A21': {
        evidenceId: 'DG-8F4A21',
        fingerprintMatch: '94.8%',
        classification: 'DEEPFAKE',
        manipulationType: 'Face-Swap (GAN / Diffusion Blend)',
        timestamp: '30 SEP 2026 19:14:05 UTC',
        modelVersion: 'DeepGuard Fusion v1',
        registryStatus: 'VERIFIED & PRESERVED',
        sha256: '7a29481bc92e01df349281a8b9e02c47ff1902a348e02b789123456789abcdef',
        pHash: 'pHash:f928c049e7b23190',
        issuer: 'DeepGuard Forensic Protocol v1.4'
      },
      'DG-7A19B3': {
        evidenceId: 'DG-7A19B3',
        fingerprintMatch: '99.1%',
        classification: 'AUTHENTIC',
        manipulationType: 'None (Pristine Camera Master)',
        timestamp: '30 SEP 2026 19:35:48 UTC',
        modelVersion: 'DeepGuard Fusion v1',
        registryStatus: 'VERIFIED & PRESERVED',
        sha256: '12a9bc4e0281d39478a01b29ce4812f901a23b48e02d4567890123456789abcd',
        pHash: 'pHash:c0192e84b912384a',
        issuer: 'DeepGuard Forensic Protocol v1.4'
      }
    };

    this.init();
  }

  init() {
    if (this.searchBtn && this.searchInput) {
      this.searchBtn.addEventListener('click', () => {
        const query = this.searchInput.value.trim() || 'DG-8F4A21';
        this.runVerificationLookup(query);
      });

      this.searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const query = this.searchInput.value.trim() || 'DG-8F4A21';
          this.runVerificationLookup(query);
        }
      });
    }

    // Quick fill sample chips
    const sampleChips = document.querySelectorAll('.verify-sample-chip');
    sampleChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const id = chip.getAttribute('data-id') || 'DG-8F4A21';
        if (this.searchInput) this.searchInput.value = id;
        this.runVerificationLookup(id);
      });
    });
  }

  runVerificationLookup(query) {
    if (!this.statusContainer || !this.resultContainer) return;

    // Reset view & show scanning animation
    this.resultContainer.classList.add('hidden');
    this.statusContainer.classList.remove('hidden');

    if (this.shieldIcon) {
      this.shieldIcon.classList.add('animate-spin');
    }

    const checkSteps = [
      "1. Normalizing perceptual fingerprint vectors...",
      "2. Querying immutable cryptographic evidence ledger...",
      "3. Resolving Merkle tree inclusion proof...",
      "4. Cross-verifying previous detection consensus..."
    ];

    const statusText = document.getElementById('verify-scan-step-text');
    let idx = 0;

    const interval = setInterval(() => {
      if (idx < checkSteps.length) {
        if (statusText) statusText.textContent = checkSteps[idx];
        idx++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          this.statusContainer.classList.add('hidden');
          if (this.shieldIcon) this.shieldIcon.classList.remove('animate-spin');
          this.renderResult(query);
        }, 400);
      }
    }, 350);
  }

  renderResult(query) {
    const record = this.sampleDB[query] || this.sampleDB['DG-8F4A21'];
    const isDeepfake = record.classification === 'DEEPFAKE';

    this.resultContainer.innerHTML = `
      <div class="glass-panel p-6 border-2 ${isDeepfake ? 'border-red-300 bg-red-50/40' : 'border-emerald-300 bg-emerald-50/40'}">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl flex items-center justify-center ${isDeepfake ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}">
              <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            </div>
            <div>
              <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${isDeepfake ? 'bg-red-200/80 text-red-800' : 'bg-emerald-200/80 text-emerald-800'}">
                PREVIOUS DETECTION RECORD FOUND
              </div>
              <h3 class="text-xl font-bold text-slate-900 mt-1 font-display">Evidence Archive Verified</h3>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="px-3 py-1.5 rounded-xl font-mono text-xs font-bold ${isDeepfake ? 'bg-red-600 text-white shadow-sm' : 'bg-emerald-600 text-white shadow-sm'}">
              ${record.classification} • FINGERPRINT MATCH: ${record.fingerprintMatch}
            </span>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5 text-xs">
          <div class="bg-white/90 p-4 rounded-xl border border-slate-200 shadow-sm">
            <div class="text-slate-400 font-medium">Evidence ID</div>
            <div class="text-base font-bold text-slate-900 font-mono mt-0.5">${record.evidenceId}</div>
            <div class="text-slate-400 font-medium mt-3">Detection Timestamp</div>
            <div class="font-mono text-slate-700">${record.timestamp}</div>
          </div>

          <div class="bg-white/90 p-4 rounded-xl border border-slate-200 shadow-sm">
            <div class="text-slate-400 font-medium">Perceptual Fingerprint</div>
            <div class="text-blue-600 font-mono font-semibold mt-0.5">${record.pHash}</div>
            <div class="text-slate-400 font-medium mt-3">Classification Model</div>
            <div class="font-medium text-slate-800">${record.modelVersion}</div>
          </div>

          <div class="bg-white/90 p-4 rounded-xl border border-slate-200 shadow-sm">
            <div class="text-slate-400 font-medium">Registry Status</div>
            <div class="inline-flex items-center gap-1.5 font-bold text-emerald-600 mt-0.5">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              ${record.registryStatus}
            </div>
            <div class="text-slate-400 font-medium mt-3">Manipulation Signature</div>
            <div class="font-medium text-slate-800">${record.manipulationType}</div>
          </div>
        </div>

        <div class="mt-4 p-3 bg-white/70 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs font-mono">
          <span class="text-slate-500 truncate">SHA-256: ${record.sha256}</span>
          <button onclick="window.deepGuardReporter && window.deepGuardReporter.openModal('${record.evidenceId}')" class="text-blue-600 hover:text-blue-800 font-semibold underline flex items-center gap-1 cursor-pointer">
            View Forensic Certificate →
          </button>
        </div>
      </div>
    `;

    this.resultContainer.classList.remove('hidden');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new DeepGuardVerificationCenter();
});
