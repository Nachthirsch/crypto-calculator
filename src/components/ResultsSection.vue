<template>
  <div v-if="showResult" class="results">
    <div class="results-header">
      <h3>💰 Hasil</h3>
      <div class="profit-indicator" :class="{ profit: profit >= 0, loss: profit < 0 }">{{ profit >= 0 ? "📈" : "📉" }} {{ persentaseKeuntungan.toFixed(1) }}%</div>
    </div>

    <div class="result-summary">
      <div class="summary-item">
        <span class="label">Koin:</span>
        <span class="value">{{ formatKoin(jumlahKoin) }}</span>
      </div>
      <div class="summary-item">
        <span class="label">Modal:</span>
        <span class="value">Rp {{ formatNumber(modalUsed) }}</span>
      </div>
      <div class="summary-item">
        <span class="label">Nilai:</span>
        <span class="value">Rp {{ formatNumber(totalNilai) }}</span>
      </div>
      <div class="summary-item highlight" :class="{ profit: profit >= 0, loss: profit < 0 }">
        <span class="label">{{ profit >= 0 ? "Untung:" : "Rugi:" }}</span>
        <span class="value">Rp {{ formatNumber(Math.abs(profit)) }}</span>
      </div>
    </div>

    <!-- Quick Analysis -->
    <div class="quick-analysis">
      <div class="analysis-item" :class="getPerformanceClass()">
        <span class="analysis-icon">{{ getPerformanceIcon() }}</span>
        <span class="analysis-text">{{ getQuickAnalysis() }}</span>
      </div>
    </div>

    <!-- Advanced Analysis -->
    <AdvancedAnalysis v-if="showAdvanced" :profit="profit" :persentase-keuntungan="persentaseKeuntungan" :harga-jual="hargaJual" :harga-beli-used="hargaBeliUsed" @show-term="$emit('showTerm', $event)" />

    <!-- Profit Management Section -->
    <ProfitManagement v-if="showResult && profit !== 0" :profit="profit" :persentase-keuntungan="persentaseKeuntungan" :total-nilai="totalNilai" :modal-used="modalUsed" :jumlah-koin="jumlahKoin" :harga-jual="hargaJual" :harga-beli-used="hargaBeliUsed" />
  </div>
</template>

<script setup>
import AdvancedAnalysis from "./AdvancedAnalysis.vue";
import ProfitManagement from "./ProfitManagement.vue";
import { useAnalysisLogic } from "../composables/useAnalysisLogic";

const props = defineProps({
  showResult: { type: Boolean, required: true },
  showAdvanced: { type: Boolean, required: true },
  profit: { type: Number, required: true },
  persentaseKeuntungan: { type: Number, required: true },
  jumlahKoin: { type: Number, required: true },
  modalUsed: { type: Number, required: true },
  totalNilai: { type: Number, required: true },
  hargaJual: { type: Number, required: true },
  hargaBeliUsed: { type: Number, required: true },
});

defineEmits(["showTerm"]);

const { getPerformanceClass, getPerformanceIcon } = useAnalysisLogic(props);

function formatNumber(num) {
  return Number(num).toLocaleString("id-ID");
}

function formatKoin(num) {
  return Number(num).toLocaleString("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 8,
  });
}

function getQuickAnalysis() {
  const percentage = props.persentaseKeuntungan;
  if (percentage >= 15) return "Profit besar! Pertimbangkan take profit.";
  if (percentage >= 5) return "Profit bagus. Monitor terus.";
  if (percentage >= 0) return "Profit kecil. Tunggu momentum lebih baik.";
  if (percentage >= -10) return "Rugi ringan. Evaluasi strategi.";
  return "Rugi besar. Pertimbangkan cut loss.";
}
</script>

<style scoped>
.results {
  background: var(--input);
  border-radius: 0.6rem;
  padding: 1rem;
  flex: 1;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
}

.results-header h3 {
  margin: 0;
  font-size: 1.1rem;
}

.profit-indicator {
  font-weight: 600;
  padding: 0.3rem 0.6rem;
  border-radius: 0.3rem;
}

.profit-indicator.profit {
  background: #27ae6020;
  color: #27ae60;
}

.profit-indicator.loss {
  background: #e74c3c20;
  color: #e74c3c;
}

.result-summary {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.8rem;
  margin-bottom: 1rem;
}

.summary-item {
  text-align: center;
  padding: 0.6rem;
  background: var(--bg);
  border-radius: 0.4rem;
}

.summary-item.highlight {
  border: 2px solid;
}

.summary-item.highlight.profit {
  border-color: #27ae60;
}

.summary-item.highlight.loss {
  border-color: #e74c3c;
}

.summary-item .label {
  display: block;
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 0.2rem;
}

.summary-item .value {
  font-weight: 600;
  font-size: 0.9rem;
}

.quick-analysis {
  margin-bottom: 1rem;
}

.analysis-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem;
  background: var(--bg);
  border-radius: 0.4rem;
  border-left: 3px solid #646cff;
}

.analysis-item.excellent {
  border-left-color: #00d4aa;
}
.analysis-item.good {
  border-left-color: #27ae60;
}
.analysis-item.positive {
  border-left-color: #2ecc71;
}
.analysis-item.negative {
  border-left-color: #f39c12;
}
.analysis-item.warning {
  border-left-color: #e67e22;
}
.analysis-item.danger {
  border-left-color: #e74c3c;
}

.analysis-icon {
  font-size: 1.1rem;
}

.analysis-text {
  font-size: 0.9rem;
}

.profit {
  color: #27ae60;
}

.loss {
  color: #e74c3c;
}

@media (max-width: 768px) {
  .result-summary {
    grid-template-columns: repeat(2, 1fr);
  }

  .results-header {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .result-summary {
    grid-template-columns: 1fr;
  }
}
</style>
