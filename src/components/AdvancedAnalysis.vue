<template>
  <div class="advanced-analysis">
    <div class="analysis-section compact">
      <!-- Profit/Loss Analysis -->
      <div class="analysis-card compact" :class="getPerformanceClass()">
        <div class="analysis-header">
          <span class="analysis-icon">{{ getPerformanceIcon() }}</span>
          <strong>{{ getPerformanceTitle() }}</strong>
        </div>
        <p class="compact-text">{{ getPerformanceAnalysis() }}</p>
      </div>

      <!-- Investment Recommendations -->
      <div class="recommendations compact">
        <h5>🧠 Rekomendasi:</h5>
        <div v-for="(rec, index) in getTopRecommendations()" :key="index" class="recommendation-item compact" :class="rec.type">
          <span class="rec-icon">{{ rec.icon }}</span>
          <div class="rec-content">
            <strong class="clickable-recommendation" @click="$emit('showTerm', rec.termKey)"> {{ rec.title }} <span class="info-icon">ℹ️</span> </strong>
            <p>{{ rec.message }}</p>
          </div>
        </div>
      </div>

      <!-- Technical Analysis Section -->
      <div class="technical-analysis compact">
        <h5>📊 Technical:</h5>

        <!-- Key Metrics -->
        <div class="tech-metrics-row">
          <div class="metric-compact" @click="$emit('showTerm', 'RSI')">
            <span class="metric-label clickable">RSI: <span class="info-icon">ℹ️</span></span>
            <span class="metric-value" :class="getRSIClass()">{{ getSimulatedRSI() }}</span>
          </div>
          <div class="metric-compact" @click="$emit('showTerm', 'MACD')">
            <span class="metric-label clickable">Trend: <span class="info-icon">ℹ️</span></span>
            <span class="metric-value" :class="getMACDClass()">{{ getMACDSignal() }}</span>
          </div>
          <div class="metric-compact" @click="$emit('showTerm', 'Sentiment')">
            <span class="metric-label clickable">Sentiment: <span class="info-icon">ℹ️</span></span>
            <span class="metric-value" :class="getSentimentClass()" :title="getSentimentLevelWithExplanation()">
              {{ getSentimentLevel() }}
            </span>
          </div>
        </div>

        <!-- Risk Level -->
        <div class="risk-compact">
          <span class="risk-label">Risk:</span>
          <div class="risk-bar-compact">
            <div class="risk-fill-compact" :style="{ width: getRiskLevel() + '%' }" :class="getRiskClass()"></div>
          </div>
          <span class="risk-desc">{{ getRiskDescription() }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAnalysisLogic } from "../composables/useAnalysisLogic";

const props = defineProps({
  profit: { type: Number, required: true },
  persentaseKeuntungan: { type: Number, required: true },
  hargaJual: { type: Number, required: true },
  hargaBeliUsed: { type: Number, required: true },
});

defineEmits(["showTerm"]);

const { getPerformanceClass, getPerformanceIcon, getPerformanceTitle, getPerformanceAnalysis, getRecommendations, getRiskLevel, getRiskClass, getRiskDescription, getSimulatedRSI, getRSIClass, getMACDSignal, getMACDClass, getSentimentScore, getSentimentClass, getSentimentLevel, getSentimentLevelWithExplanation } = useAnalysisLogic(props);

function getTopRecommendations() {
  const recs = getRecommendations();
  return recs.slice(0, 2);
}
</script>

<style scoped>
.advanced-analysis {
  border-top: 1px solid var(--border);
  padding-top: 1rem;
}

.analysis-section.compact {
  margin: 0;
}

.analysis-card.compact {
  background: var(--bg);
  padding: 0.6rem;
  border-radius: 0.4rem;
  margin-bottom: 0.8rem;
  border-left: 3px solid #646cff;
}

.analysis-card.compact.excellent {
  border-left-color: #00d4aa;
}
.analysis-card.compact.good {
  border-left-color: #27ae60;
}
.analysis-card.compact.positive {
  border-left-color: #2ecc71;
}
.analysis-card.compact.negative {
  border-left-color: #f39c12;
}
.analysis-card.compact.warning {
  border-left-color: #e67e22;
}
.analysis-card.compact.danger {
  border-left-color: #e74c3c;
}

.analysis-header {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.4rem;
}

.compact-text {
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.3;
}

.recommendations.compact h5 {
  margin-bottom: 0.6rem;
  font-size: 0.95rem;
}

.recommendation-item.compact {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  padding: 0.5rem;
  margin-bottom: 0.4rem;
  border-radius: 0.3rem;
  background: var(--bg);
  border-left: 2px solid #646cff;
}

.recommendation-item.compact.success {
  border-left-color: #27ae60;
}
.recommendation-item.compact.info {
  border-left-color: #3498db;
}
.recommendation-item.compact.warning {
  border-left-color: #f39c12;
}
.recommendation-item.compact.danger {
  border-left-color: #e74c3c;
}
.recommendation-item.compact.neutral {
  border-left-color: #95a5a6;
}
.recommendation-item.compact.caution {
  border-left-color: #e67e22;
}

.rec-icon {
  font-size: 1rem;
}

.rec-content strong {
  display: block;
  margin-bottom: 0.2rem;
  font-size: 0.85rem;
}

.rec-content p {
  margin: 0;
  font-size: 0.8rem;
  line-height: 1.3;
  color: #666;
}

.technical-analysis.compact h5 {
  margin-bottom: 0.6rem;
  font-size: 0.95rem;
}

.tech-metrics-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.6rem;
  margin-bottom: 0.8rem;
}

.metric-compact {
  text-align: center;
  padding: 0.4rem;
  background: var(--bg);
  border-radius: 0.3rem;
}

.metric-compact .metric-label {
  display: block;
  font-size: 0.75rem;
  color: #666;
  margin-bottom: 0.2rem;
}

.metric-compact .metric-value {
  font-weight: 600;
  font-size: 0.8rem;
}

.metric-value.overbought,
.metric-value.bearish {
  color: #e74c3c;
}

.metric-value.oversold,
.metric-value.bullish {
  color: #27ae60;
}

.metric-value.neutral {
  color: #95a5a6;
}

.risk-compact {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem;
  background: var(--bg);
  border-radius: 0.3rem;
}

.risk-label {
  font-size: 0.8rem;
  font-weight: 500;
  min-width: 40px;
}

.risk-bar-compact {
  flex: 1;
  height: 0.4rem;
  background: #e0e0e0;
  border-radius: 0.2rem;
  overflow: hidden;
}

.risk-fill-compact {
  height: 100%;
  transition: width 0.3s ease;
}

.risk-fill-compact.low {
  background: #27ae60;
}
.risk-fill-compact.medium {
  background: #f39c12;
}
.risk-fill-compact.high {
  background: #e74c3c;
}

.risk-desc {
  font-size: 0.75rem;
  min-width: 60px;
}

.clickable,
.clickable-recommendation {
  cursor: pointer;
  transition: color 0.2s;
}

.clickable:hover,
.clickable-recommendation:hover {
  color: #646cff;
}

.info-icon {
  font-size: 0.8em;
  opacity: 0.7;
  margin-left: 0.2rem;
}

@media (max-width: 768px) {
  .tech-metrics-row {
    grid-template-columns: 1fr;
    gap: 0.4rem;
  }
}
</style>
