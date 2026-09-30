/**
 * DeepGuard AI - Live Forensic Dashboard Charts
 * High-performance animated SVG data visualizations:
 * Detection distribution donut, confidence histogram, anomaly frequency curve, and daily telemetry.
 */

class DeepGuardDashboardCharts {
  constructor() {
    this.renderDonutChart();
    this.renderConfidenceHistogram();
    this.renderAnomalyFrequencyChart();
  }

  renderDonutChart() {
    const container = document.getElementById('chart-detection-donut');
    if (!container) return;

    // SVG Donut (Deepfake 34.0%, Authentic 61.2%, Inconclusive 4.8%)
    container.innerHTML = `
      <svg viewBox="0 0 200 200" class="w-full h-44">
        <!-- Background circle -->
        <circle cx="100" cy="100" r="70" fill="transparent" stroke="#F1F5F9" stroke-width="24"/>
        <!-- Authentic segment (61.2%) -->
        <circle cx="100" cy="100" r="70" fill="transparent" stroke="#10B981" stroke-width="24"
                stroke-dasharray="269.1 439.8" stroke-dashoffset="0" stroke-linecap="round"
                transform="rotate(-90 100 100)" class="transition-all duration-1000"/>
        <!-- Deepfake segment (34.0%) -->
        <circle cx="100" cy="100" r="70" fill="transparent" stroke="#EF4444" stroke-width="24"
                stroke-dasharray="149.5 439.8" stroke-dashoffset="-269.1" stroke-linecap="round"
                transform="rotate(-90 100 100)" class="transition-all duration-1000"/>
        <!-- Inconclusive segment (4.8%) -->
        <circle cx="100" cy="100" r="70" fill="transparent" stroke="#F59E0B" stroke-width="24"
                stroke-dasharray="21.1 439.8" stroke-dashoffset="-418.6" stroke-linecap="round"
                transform="rotate(-90 100 100)" class="transition-all duration-1000"/>
        
        <!-- Center text -->
        <text x="100" y="94" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="22" font-weight="bold" fill="#0F172A">1,284</text>
        <text x="100" y="114" text-anchor="middle" font-family="'Inter', sans-serif" font-size="10" font-weight="600" fill="#64748B">TOTAL SCANS</text>
      </svg>
      <div class="flex items-center justify-center gap-4 text-xs font-mono mt-2">
        <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>Authentic (61.2%)</span>
        <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-red-500"></span>Deepfake (34.0%)</span>
        <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>Review (4.8%)</span>
      </div>
    `;
  }

  renderConfidenceHistogram() {
    const container = document.getElementById('chart-confidence-histogram');
    if (!container) return;

    const bars = [
      { range: "50-60%", val: 18, color: "#93C5FD" },
      { range: "60-70%", val: 34, color: "#60A5FA" },
      { range: "70-80%", val: 89, color: "#3B82F6" },
      { range: "80-90%", val: 242, color: "#2563EB" },
      { range: "90-95%", val: 498, color: "#1D4ED8" },
      { range: "95-100%", val: 403, color: "#1E40AF" }
    ];

    let barsHtml = '';
    const maxVal = 500;

    bars.forEach(b => {
      const hPercent = (b.val / maxVal) * 100;
      barsHtml += `
        <div class="flex flex-col items-center flex-1 h-36 justify-end group">
          <div class="text-[10px] font-mono text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity mb-1">${b.val}</div>
          <div class="w-full max-w-[34px] rounded-t-lg transition-all duration-700 hover:brightness-110" style="height: ${hPercent}%; background-color: ${b.color};"></div>
          <div class="text-[10px] font-mono text-slate-500 mt-2 truncate max-w-full">${b.range}</div>
        </div>
      `;
    });

    container.innerHTML = `
      <div class="flex items-end justify-between gap-2 h-44 px-2 pt-4">
        ${barsHtml}
      </div>
    `;
  }

  renderAnomalyFrequencyChart() {
    const container = document.getElementById('chart-anomaly-frequency');
    if (!container) return;

    // SVG Area Chart representing anomaly peaks across standard 15-second media test clips
    container.innerHTML = `
      <svg viewBox="0 0 400 140" class="w-full h-36">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#EF4444" stop-opacity="0.45"/>
            <stop offset="100%" stop-color="#EF4444" stop-opacity="0.0"/>
          </linearGradient>
        </defs>
        
        <!-- Grid lines -->
        <line x1="0" y1="30" x2="400" y2="30" stroke="#F1F5F9" stroke-width="1"/>
        <line x1="0" y1="70" x2="400" y2="70" stroke="#F1F5F9" stroke-width="1"/>
        <line x1="0" y1="110" x2="400" y2="110" stroke="#F1F5F9" stroke-width="1"/>

        <!-- Area fill -->
        <path d="M 0 120 Q 50 115, 100 110 T 160 85 T 190 35 T 220 100 T 260 40 T 310 90 T 350 45 T 400 120 L 400 135 L 0 135 Z"
              fill="url(#areaGrad)" />
        
        <!-- Peak Line -->
        <path d="M 0 120 Q 50 115, 100 110 T 160 85 T 190 35 T 220 100 T 260 40 T 310 90 T 350 45 T 400 120"
              fill="none" stroke="#EF4444" stroke-width="2.5" stroke-linecap="round"/>

        <!-- Anomaly Peak markers -->
        <circle cx="190" cy="35" r="4" fill="#EF4444" stroke="#FFFFFF" stroke-width="2"/>
        <circle cx="260" cy="40" r="4" fill="#EF4444" stroke="#FFFFFF" stroke-width="2"/>
        <circle cx="350" cy="45" r="4" fill="#EF4444" stroke="#FFFFFF" stroke-width="2"/>
      </svg>
      <div class="flex items-center justify-between text-[11px] font-mono text-slate-400 px-2 mt-1">
        <span>00:00 (Ingestion)</span>
        <span class="text-red-500 font-semibold">🔴 Anomaly Burst Peaks (00:07 - 00:11)</span>
        <span>00:15 (End)</span>
      </div>
    `;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new DeepGuardDashboardCharts();
});
