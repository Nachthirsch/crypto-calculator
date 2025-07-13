<template>
  <div class="profit-management">
    <div class="management-header">
      <h4>💼 Manajemen Profit</h4>
      <button @click="toggleExpanded" class="toggle-btn">
        {{ isExpanded ? "▲" : "▼" }}
      </button>
    </div>

    <div v-if="isExpanded" class="management-content">
      <!-- Quick Profit Taking Suggestions -->
      <div class="quick-suggestions">
        <h5>🎯 Saran Take Profit</h5>
        <div class="suggestion-grid">
          <div v-for="suggestion in profitSuggestions" :key="suggestion.percentage" class="suggestion-card" :class="suggestion.priority">
            <div class="suggestion-header">
              <span class="percentage">{{ suggestion.percentage }}%</span>
              <span class="priority-badge">{{ suggestion.label }}</span>
            </div>
            <div class="suggestion-details">
              <div class="amount-info">
                <span class="label">Jual:</span>
                <span class="value">{{ suggestion.sellPercentage }}% posisi</span>
              </div>
              <div class="amount-info">
                <span class="label">Profit:</span>
                <span class="value profit">Rp {{ formatNumber(suggestion.profitAmount) }}</span>
              </div>
              <div class="amount-info">
                <span class="label">Sisa:</span>
                <span class="value">Rp {{ formatNumber(suggestion.remainingValue) }}</span>
              </div>
            </div>
            <button @click="selectSuggestion(suggestion)" class="select-btn" :class="suggestion.priority">
              {{ suggestion.action }}
            </button>
          </div>
        </div>
      </div>

      <!-- Custom Profit Calculator -->
      <div class="custom-calculator">
        <h5>🔧 Kalkulator Custom</h5>
        <div class="calculator-inputs">
          <div class="input-group">
            <label>Take Profit (%)</label>
            <input v-model.number="customTakeProfit" type="number" min="1" max="100" placeholder="50" />
          </div>
          <div class="input-group">
            <label>Jual Posisi (%)</label>
            <input v-model.number="customSellPercentage" type="number" min="1" max="100" placeholder="25" />
          </div>
        </div>
        <div class="custom-results" v-if="customTakeProfit && customSellPercentage">
          <div class="result-item">
            <span class="label">Profit yang Diambil:</span>
            <span class="value profit">Rp {{ formatNumber(calculateCustomProfit()) }}</span>
          </div>
          <div class="result-item">
            <span class="label">Sisa Investasi:</span>
            <span class="value">Rp {{ formatNumber(calculateRemainingInvestment()) }}</span>
          </div>
          <div class="result-item">
            <span class="label">Break Even Point:</span>
            <span class="value">Rp {{ formatNumber(calculateBreakEven()) }}</span>
          </div>
        </div>
      </div>

      <!-- Risk Management -->
      <div class="risk-management">
        <h5>⚡ Risk Management</h5>
        <div class="risk-grid">
          <div class="risk-card">
            <div class="risk-header">
              <span class="risk-icon">🛡️</span>
              <strong>Stop Loss</strong>
            </div>
            <div class="risk-content">
              <div class="risk-item">
                <span class="label">Konservatif (-5%):</span>
                <span class="value">Rp {{ formatNumber(getStopLoss(5)) }}</span>
              </div>
              <div class="risk-item">
                <span class="label">Moderat (-10%):</span>
                <span class="value">Rp {{ formatNumber(getStopLoss(10)) }}</span>
              </div>
              <div class="risk-item">
                <span class="label">Agresif (-15%):</span>
                <span class="value">Rp {{ formatNumber(getStopLoss(15)) }}</span>
              </div>
            </div>
          </div>

          <div class="risk-card">
            <div class="risk-header">
              <span class="risk-icon">📊</span>
              <strong>Risk/Reward</strong>
            </div>
            <div class="risk-content">
              <div class="risk-item">
                <span class="label">Ratio Saat Ini:</span>
                <span class="value" :class="getRiskRewardClass()">{{ getCurrentRiskReward() }}</span>
              </div>
              <div class="risk-item">
                <span class="label">Target Ideal:</span>
                <span class="value">1:2 atau lebih</span>
              </div>
              <div class="risk-assessment">
                <span class="assessment-text">{{ getRiskAssessment() }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Portfolio Allocation -->
      <div class="portfolio-allocation">
        <h5>📈 Alokasi Portfolio</h5>
        <div class="allocation-suggestions">
          <div class="allocation-item">
            <span class="allocation-label">Conservative (60% profit):</span>
            <div class="allocation-bar">
              <div class="allocation-fill conservative" style="width: 60%"></div>
            </div>
            <span class="allocation-value">Jual 60% posisi untuk mengamankan profit</span>
          </div>
          <div class="allocation-item">
            <span class="allocation-label">Balanced (40% profit):</span>
            <div class="allocation-bar">
              <div class="allocation-fill balanced" style="width: 40%"></div>
            </div>
            <span class="allocation-value">Jual 40% posisi, hold 60% untuk growth</span>
          </div>
          <div class="allocation-item">
            <span class="allocation-label">Aggressive (20% profit):</span>
            <div class="allocation-bar">
              <div class="allocation-fill aggressive" style="width: 20%"></div>
            </div>
            <span class="allocation-value">Jual 20% posisi, hold 80% untuk maximum gain</span>
          </div>
        </div>
      </div>

      <!-- Market Timing -->
      <div class="market-timing">
        <h5>⏰ Market Timing</h5>
        <div class="timing-grid">
          <div class="timing-card" :class="getTimingClass('short')">
            <h6>Short Term (1-7 hari)</h6>
            <p>{{ getTimingAdvice("short") }}</p>
            <div class="timing-action">{{ getTimingAction("short") }}</div>
          </div>
          <div class="timing-card" :class="getTimingClass('medium')">
            <h6>Medium Term (1-4 minggu)</h6>
            <p>{{ getTimingAdvice("medium") }}</p>
            <div class="timing-action">{{ getTimingAction("medium") }}</div>
          </div>
          <div class="timing-card" :class="getTimingClass('long')">
            <h6>Long Term (1-6 bulan)</h6>
            <p>{{ getTimingAdvice("long") }}</p>
            <div class="timing-action">{{ getTimingAction("long") }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useProfitManagement } from "../composables/useProfitManagement";

const props = defineProps({
  profit: { type: Number, required: true },
  persentaseKeuntungan: { type: Number, required: true },
  totalNilai: { type: Number, required: true },
  modalUsed: { type: Number, required: true },
  jumlahKoin: { type: Number, required: true },
  hargaJual: { type: Number, required: true },
  hargaBeliUsed: { type: Number, required: true },
});

const isExpanded = ref(true);
const customTakeProfit = ref(25);
const customSellPercentage = ref(50);

const { getProfitSuggestions, formatNumber, getStopLoss, getCurrentRiskReward, getRiskRewardClass, getRiskAssessment, getTimingClass, getTimingAdvice, getTimingAction } = useProfitManagement(props);

const profitSuggestions = computed(() => getProfitSuggestions());

function toggleExpanded() {
  isExpanded.value = !isExpanded.value;
}

function selectSuggestion(suggestion) {
  // Could emit an event to parent or show detailed breakdown
  console.log("Selected suggestion:", suggestion);
}

function calculateCustomProfit() {
  if (!customTakeProfit.value || !customSellPercentage.value) return 0;
  const targetValue = props.modalUsed * (1 + customTakeProfit.value / 100);
  const profitAtTarget = targetValue - props.modalUsed;
  return (profitAtTarget * customSellPercentage.value) / 100;
}

function calculateRemainingInvestment() {
  if (!customSellPercentage.value) return 0;
  const remainingPercentage = (100 - customSellPercentage.value) / 100;
  return props.modalUsed * remainingPercentage;
}

function calculateBreakEven() {
  const soldPercentage = customSellPercentage.value / 100;
  const profitTaken = calculateCustomProfit();
  const remainingInvestment = calculateRemainingInvestment();

  if (remainingInvestment === 0) return 0;

  // Break even point for remaining position
  const neededValue = remainingInvestment - profitTaken;
  return Math.max(0, neededValue);
}
</script>

<style scoped>
.profit-management {
  background: var(--input);
  border-radius: 0.6rem;
  padding: 1rem;
  margin-top: 1rem;
  border: 2px solid #646cff;
}

.management-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.management-header h4 {
  margin: 0;
  color: #646cff;
  font-size: 1rem;
}

.toggle-btn {
  background: #646cff;
  color: white;
  border: none;
  border-radius: 0.3rem;
  padding: 0.3rem 0.6rem;
  cursor: pointer;
  font-size: 0.8rem;
}

.management-content > div {
  margin-bottom: 1.5rem;
}

.management-content > div:last-child {
  margin-bottom: 0;
}

.management-content h5 {
  margin: 0 0 0.8rem 0;
  font-size: 0.9rem;
  color: var(--text);
}

/* Quick Suggestions */
.suggestion-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 0.8rem;
}

.suggestion-card {
  background: var(--bg);
  border-radius: 0.5rem;
  padding: 0.8rem;
  border: 2px solid transparent;
  transition: border-color 0.2s;
}

.suggestion-card.high {
  border-color: #e74c3c;
}

.suggestion-card.medium {
  border-color: #f39c12;
}

.suggestion-card.low {
  border-color: #27ae60;
}

.suggestion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.6rem;
}

.percentage {
  font-size: 1.2rem;
  font-weight: bold;
  color: #646cff;
}

.priority-badge {
  font-size: 0.7rem;
  padding: 0.2rem 0.4rem;
  border-radius: 0.2rem;
  text-transform: uppercase;
  font-weight: bold;
}

.suggestion-card.high .priority-badge {
  background: #e74c3c20;
  color: #e74c3c;
}

.suggestion-card.medium .priority-badge {
  background: #f39c1220;
  color: #f39c12;
}

.suggestion-card.low .priority-badge {
  background: #27ae6020;
  color: #27ae60;
}

.suggestion-details {
  margin-bottom: 0.8rem;
}

.amount-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.3rem;
  font-size: 0.8rem;
}

.amount-info .label {
  color: #666;
}

.amount-info .value.profit {
  color: #27ae60;
  font-weight: bold;
}

.select-btn {
  width: 100%;
  padding: 0.5rem;
  border: none;
  border-radius: 0.3rem;
  font-size: 0.8rem;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.2s;
}

.select-btn.high {
  background: #e74c3c;
  color: white;
}

.select-btn.medium {
  background: #f39c12;
  color: white;
}

.select-btn.low {
  background: #27ae60;
  color: white;
}

.select-btn:hover {
  opacity: 0.9;
}

/* Custom Calculator */
.calculator-inputs {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.8rem;
  margin-bottom: 0.8rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.input-group label {
  font-size: 0.8rem;
  color: #666;
  font-weight: 500;
}

.input-group input {
  padding: 0.4rem;
  border: 1px solid var(--border);
  border-radius: 0.3rem;
  background: var(--bg);
  color: var(--text);
  font-size: 0.8rem;
}

.custom-results {
  background: var(--bg);
  border-radius: 0.4rem;
  padding: 0.6rem;
}

.result-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.4rem;
  font-size: 0.8rem;
}

.result-item:last-child {
  margin-bottom: 0;
}

/* Risk Management */
.risk-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.8rem;
}

.risk-card {
  background: var(--bg);
  border-radius: 0.4rem;
  padding: 0.6rem;
}

.risk-header {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.6rem;
}

.risk-icon {
  font-size: 1rem;
}

.risk-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.3rem;
  font-size: 0.8rem;
}

.risk-assessment {
  margin-top: 0.5rem;
  padding: 0.4rem;
  background: var(--input);
  border-radius: 0.3rem;
  font-size: 0.75rem;
  text-align: center;
}

/* Portfolio Allocation */
.allocation-item {
  margin-bottom: 0.8rem;
}

.allocation-label {
  display: block;
  font-size: 0.8rem;
  margin-bottom: 0.3rem;
  font-weight: 500;
}

.allocation-bar {
  height: 0.5rem;
  background: #e0e0e0;
  border-radius: 0.25rem;
  overflow: hidden;
  margin-bottom: 0.3rem;
}

.allocation-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.allocation-fill.conservative {
  background: #e74c3c;
}

.allocation-fill.balanced {
  background: #f39c12;
}

.allocation-fill.aggressive {
  background: #27ae60;
}

.allocation-value {
  font-size: 0.75rem;
  color: #666;
}

/* Market Timing */
.timing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.6rem;
}

.timing-card {
  background: var(--bg);
  border-radius: 0.4rem;
  padding: 0.6rem;
  border-left: 3px solid #646cff;
}

.timing-card.bullish {
  border-left-color: #27ae60;
}

.timing-card.bearish {
  border-left-color: #e74c3c;
}

.timing-card.neutral {
  border-left-color: #f39c12;
}

.timing-card h6 {
  margin: 0 0 0.4rem 0;
  font-size: 0.8rem;
  color: #646cff;
}

.timing-card p {
  margin: 0 0 0.5rem 0;
  font-size: 0.75rem;
  line-height: 1.3;
  color: #666;
}

.timing-action {
  font-size: 0.7rem;
  font-weight: bold;
  padding: 0.3rem;
  border-radius: 0.2rem;
  text-align: center;
  background: var(--input);
}

@media (max-width: 768px) {
  .suggestion-grid,
  .calculator-inputs,
  .risk-grid,
  .timing-grid {
    grid-template-columns: 1fr;
  }
}
</style>
