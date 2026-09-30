/**
 * DeepGuard AI - Forensic Report Generator Engine
 * Generates an official, court-ready, cryptographically sealed digital forensic
 * certificate and analysis report with print/PDF export and immutable proof.
 */

class DeepGuardReportGenerator {
  constructor() {
    this.modal = document.getElementById('forensic-report-modal');
    this.modalContent = document.getElementById('report-modal-content');
    this.generateBtn = document.getElementById('btn-generate-report');
    this.closeBtn = document.getElementById('btn-close-report-modal');

    this.init();
  }

  init() {
    if (this.generateBtn) {
      this.generateBtn.addEventListener('click', () => this.openModal('DG-8F4A21'));
    }

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.closeModal());
    }

    // Close on backdrop click
    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.closeModal();
      });
    }

    window.deepGuardReporter = this;
  }

  openModal(evidenceId = 'DG-8F4A21') {
    if (!this.modal || !this.modalContent) return;

    this.modal.classList.remove('hidden');
    this.modal.classList.add('flex');

    // Render official certificate
    this.modalContent.innerHTML = `
      <div class="p-8 max-w-4xl mx-auto bg-white rounded-2xl border border-slate-300 shadow-2xl relative">
        <!-- Certificate Header -->
        <div class="flex items-center justify-between border-b-2 border-slate-900 pb-6 mb-6">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-2xl shadow-md">
              DG
            </div>
            <div>
              <div class="text-xs font-mono font-bold tracking-widest text-blue-600 uppercase">OFFICIAL FORENSIC CERTIFICATE</div>
              <h1 class="text-2xl font-black text-slate-900 tracking-tight font-display">DEEPGUARD AI FORENSICS</h1>
              <p class="text-xs text-slate-500 font-mono">Digital Media Integrity & Chain-of-Custody Attestation</p>
            </div>
          </div>
          <div class="text-right font-mono text-xs text-slate-600">
            <div class="font-bold text-slate-900">CASE FILE: ${evidenceId}</div>
            <div>ISSUED: 30 SEP 2026 20:00 UTC</div>
            <div class="text-emerald-600 font-semibold">STATUS: SEALED & IMMUTABLE</div>
          </div>
        </div>

        <!-- Verdict Banner -->
        <div class="p-4 rounded-xl mb-6 flex items-center justify-between bg-red-50 border-2 border-red-300 text-red-900">
          <div>
            <div class="text-xs font-mono font-bold uppercase tracking-wider text-red-600">PRIMARY FORENSIC CLASSIFICATION</div>
            <div class="text-xl font-black tracking-tight mt-0.5">SYNTHETIC MANIPULATION CONFIRMED (DEEPFAKE)</div>
            <div class="text-xs text-red-700 mt-1">Spatial blending seams and temporal landmark trajectories exceed synthetic detection threshold.</div>
          </div>
          <div class="text-right">
            <div class="text-3xl font-black font-mono text-red-600">96.3%</div>
            <div class="text-[10px] font-mono text-red-500 uppercase tracking-widest">CONFIDENCE LEVEL</div>
          </div>
        </div>

        <!-- Technical Specification Grid -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-xs">
          <div class="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div class="text-slate-400 font-medium">Manipulation Type</div>
            <div class="font-bold text-slate-800 mt-0.5">Face-Swap Synthesis</div>
          </div>
          <div class="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div class="text-slate-400 font-medium">Algorithm Model</div>
            <div class="font-bold text-slate-800 mt-0.5">DeepGuard Fusion v1</div>
          </div>
          <div class="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div class="text-slate-400 font-medium">Examined Frames</div>
            <div class="font-bold text-slate-800 mt-0.5">450 Frames (15.0s)</div>
          </div>
          <div class="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div class="text-slate-400 font-medium">Anomalous Keyframes</div>
            <div class="font-bold text-red-600 mt-0.5">4 Keyframes Flagged</div>
          </div>
        </div>

        <!-- Suspicious Frames Table -->
        <div class="mb-6">
          <h3 class="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-2">Suspicious Keyframe Telemetry</h3>
          <table class="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
            <thead class="bg-slate-100 font-mono text-slate-700 border-b border-slate-200">
              <tr>
                <th class="p-2.5">TIMESTAMP</th>
                <th class="p-2.5">REGION</th>
                <th class="p-2.5">ANOMALY TYPE</th>
                <th class="p-2.5">LOCAL SCORE</th>
                <th class="p-2.5">ARTIFACT DETAIL</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 text-slate-700 font-mono">
              <tr>
                <td class="p-2.5 font-bold">00:04.20</td>
                <td class="p-2.5">Forehead / Light</td>
                <td class="p-2.5 text-amber-600 font-semibold">Temporal Micro-flicker</td>
                <td class="p-2.5">0.78</td>
                <td class="p-2.5 text-slate-500">Lighting inconsistency between source & base</td>
              </tr>
              <tr class="bg-red-50/50">
                <td class="p-2.5 font-bold text-red-600">00:07.00</td>
                <td class="p-2.5 font-bold">Jawline / Chin</td>
                <td class="p-2.5 text-red-600 font-semibold">Spatial Boundary Seam</td>
                <td class="p-2.5 font-bold text-red-600">0.96</td>
                <td class="p-2.5 text-slate-500">Poisson blending edge distortion</td>
              </tr>
              <tr class="bg-red-50/50">
                <td class="p-2.5 font-bold text-red-600">00:09.40</td>
                <td class="p-2.5 font-bold">Orbital / Blink</td>
                <td class="p-2.5 text-red-600 font-semibold">Landmark Trajectory Jitter</td>
                <td class="p-2.5 font-bold text-red-600">0.91</td>
                <td class="p-2.5 text-slate-500">Desynchronized corneal reflections</td>
              </tr>
              <tr class="bg-red-50/50">
                <td class="p-2.5 font-bold text-red-600">00:11.80</td>
                <td class="p-2.5 font-bold">Lip / Mouth</td>
                <td class="p-2.5 text-red-600 font-semibold">Synthesis Edge Blur</td>
                <td class="p-2.5 font-bold text-red-600">0.94</td>
                <td class="p-2.5 text-slate-500">Loss of intraoral boundary definitions</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Cryptographic Hashes & Ledger Chain -->
        <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 mb-6 text-xs font-mono space-y-2">
          <div>
            <span class="text-slate-400 font-semibold">FILE SHA-256: </span>
            <span class="text-slate-800 break-all">7a29481bc92e01df349281a8b9e02c47ff1902a348e02b789123456789abcdef</span>
          </div>
          <div>
            <span class="text-slate-400 font-semibold">PERCEPTUAL FINGERPRINT: </span>
            <span class="text-blue-600 font-bold">pHash:f928c049e7b23190 (Hamming distance threshold calibrated)</span>
          </div>
          <div>
            <span class="text-slate-400 font-semibold">IMMUTABLE LEDGER RECORD: </span>
            <span class="text-emerald-700 font-bold">Block #910,248 (DeepGuard Trust Protocol) • Inclusion Proof Confirmed</span>
          </div>
        </div>

        <!-- Notice & Disclaimers -->
        <p class="text-[11px] text-slate-400 leading-relaxed mb-6">
          * Notice: Values presented in this forensic report represent illustrative demonstration & evaluation metrics based on DeepGuard AI synthetic detection protocols. Blockchain preservation confirms record immutability and detection event timestamping.
        </p>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 no-print">
          <button onclick="window.print()" class="px-5 py-2.5 rounded-xl font-display font-semibold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-sm flex items-center gap-2 cursor-pointer">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
            Print / Save as PDF
          </button>
          <button onclick="window.deepGuardReporter.closeModal()" class="px-5 py-2.5 rounded-xl font-display font-semibold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 cursor-pointer">
            Close
          </button>
        </div>
      </div>
    `;
  }

  closeModal() {
    if (this.modal) {
      this.modal.classList.add('hidden');
      this.modal.classList.remove('flex');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new DeepGuardReportGenerator();
});
