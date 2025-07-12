<template>
  <div class="calculator" :class="{ dark: isDarkMode }">
    <div class="header">
      <h2>Crypto Calculator</h2>
      <button type="button" @click="toggleDarkMode" class="toggle-mode">
        {{ isDarkMode ? "☀️" : "🌙" }}
      </button>
    </div>

    <!-- Input Mode Selection -->
    <div class="mode-selector">
      <label>
        <input type="radio" v-model="inputMode" value="modal" />
        Modal
      </label>
      <label>
        <input type="radio" v-model="inputMode" value="koin" />
        Jumlah Koin
      </label>
    </div>

    <!-- Input Fields -->
    <form @submit.prevent="calculateProfit" class="inputs">
      <div class="input-row">
        <!-- Mode: Berdasarkan Modal -->
        <div v-if="inputMode === 'modal'" class="input-section">
          <div class="input-group">
            <label for="modal">Modal (Rp)</label>
            <input id="modal" v-model.number="modal" type="number" min="1" placeholder="1000000" :class="{ error: errors.modal }" />
            <span v-if="errors.modal" class="error-msg">{{ errors.modal }}</span>
          </div>
          <div class="input-group">
            <label for="hargaBeli">Harga Beli (Rp)</label>
            <input id="hargaBeli" v-model.number="hargaBeli" type="number" min="1" placeholder="50000" :class="{ error: errors.hargaBeli }" />
            <span v-if="errors.hargaBeli" class="error-msg">{{ errors.hargaBeli }}</span>
          </div>
        </div>

        <!-- Mode: Berdasarkan Jumlah Koin -->
        <div v-if="inputMode === 'koin'" class="input-section">
          <div class="input-group">
            <label for="jumlahKoinInput">Jumlah Koin</label>
            <input id="jumlahKoinInput" v-model.number="jumlahKoinInput" type="number" min="0.01" step="0.01" placeholder="20" :class="{ error: errors.jumlahKoinInput }" />
            <span v-if="errors.jumlahKoinInput" class="error-msg">{{ errors.jumlahKoinInput }}</span>
          </div>
          <div class="input-group">
            <label for="hargaBeliKoin">Harga Beli (Rp)</label>
            <div class="input-with-tooltip" :class="{ 'show-tooltip': shouldShowModalTooltip() }">
              <input id="hargaBeliKoin" v-model.number="hargaBeliKoin" type="number" min="1" placeholder="50000" :class="{ error: errors.hargaBeliKoin }" />
              <div v-if="shouldShowModalTooltip()" class="modal-tooltip">
                <span class="tooltip-icon">💰</span>
                <div class="tooltip-content">
                  <strong>Total Modal:</strong>
                  <span class="modal-amount">Rp {{ formatNumber(calculateTotalModal()) }}</span>
                </div>
              </div>
            </div>
            <span v-if="errors.hargaBeliKoin" class="error-msg">{{ errors.hargaBeliKoin }}</span>
          </div>
        </div>

        <!-- Common field: Harga Jual -->
        <div class="input-group">
          <label for="hargaJual">Harga Sekarang (Rp)</label>
          <input id="hargaJual" v-model.number="hargaJual" type="number" min="1" placeholder="55000" :class="{ error: errors.hargaJual }" />
          <span v-if="errors.hargaJual" class="error-msg">{{ errors.hargaJual }}</span>
        </div>
      </div>

      <div class="button-row">
        <button type="submit">Hitung</button>
        <button type="button" @click="resetForm" class="reset">Reset</button>
        <button type="button" @click="toggleAnalysis" class="toggle-analysis">
          {{ showAdvanced ? "Analisis ▲" : "Analisis ▼" }}
        </button>
      </div>
    </form>

    <!-- Output Area -->
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

      <!-- Advanced Analysis (Collapsible) -->
      <div v-if="showAdvanced" class="advanced-analysis">
        <!-- Market Analysis & Recommendations -->
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
                <strong class="clickable-recommendation" @click="showTermExplanation(rec.termKey)"> {{ rec.title }} <span class="info-icon">ℹ️</span> </strong>
                <p>{{ rec.message }}</p>
              </div>
            </div>
          </div>

          <!-- Technical Analysis Section (Minimal) -->
          <div class="technical-analysis compact">
            <h5>📊 Technical:</h5>

            <!-- Key Metrics Only -->
            <div class="tech-metrics-row">
              <div class="metric-compact" @click="showTermExplanation('RSI')">
                <span class="metric-label clickable">RSI: <span class="info-icon">ℹ️</span></span>
                <span class="metric-value" :class="getRSIClass()">{{ getSimulatedRSI() }}</span>
              </div>
              <div class="metric-compact" @click="showTermExplanation('MACD')">
                <span class="metric-label clickable">Trend: <span class="info-icon">ℹ️</span></span>
                <span class="metric-value" :class="getMACDClass()">{{ getMACDSignal() }}</span>
              </div>
              <div class="metric-compact" @click="showTermExplanation('Sentiment')">
                <span class="metric-label clickable">Sentiment: <span class="info-icon">ℹ️</span></span>
                <span class="metric-value" :class="getSentimentClass()" :title="getSentimentLevelWithExplanation()">{{ getSentimentLevel() }}</span>
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
    </div>

    <!-- Term Explanation Modal -->
    <div v-if="showTermModal" class="term-modal-overlay" @click="closeTermModal">
      <div class="term-modal" @click.stop>
        <div class="term-modal-header">
          <h3>{{ currentTerm.title }}</h3>
          <button @click="closeTermModal" class="close-btn">×</button>
        </div>
        <div class="term-modal-content">
          <div class="term-definition">
            <h4>Apa itu {{ currentTerm.title }}?</h4>
            <p>{{ currentTerm.definition }}</p>
          </div>
          <div class="term-explanation">
            <h4>Cara Membaca:</h4>
            <ul>
              <li v-for="(explanation, index) in currentTerm.explanations" :key="index">
                <strong>{{ explanation.condition }}:</strong> {{ explanation.meaning }}
              </li>
            </ul>
          </div>
          <div class="term-example">
            <h4>Contoh:</h4>
            <p>{{ currentTerm.example }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// State for input fields
import { ref } from "vue";

// Input mode: 'modal' or 'koin'
const inputMode = ref("modal");

// Modal-based inputs
const modal = ref("");
const hargaBeli = ref("");

// Coin-based inputs
const jumlahKoinInput = ref("");
const hargaBeliKoin = ref("");

// Common input
const hargaJual = ref("");

// State for results
const jumlahKoin = ref(0);
const totalNilai = ref(0);
const profit = ref(0);
const persentaseKeuntungan = ref(0);
const showResult = ref(false);
const modalUsed = ref(0);
const hargaBeliUsed = ref(0);

// State for errors
const errors = ref({
  modal: "",
  hargaBeli: "",
  jumlahKoinInput: "",
  hargaBeliKoin: "",
  hargaJual: "",
});

// Dark mode state
const isDarkMode = ref(false);

// Advanced analysis toggle
const showAdvanced = ref(false);

// Term explanation modal
const showTermModal = ref(false);
const currentTerm = ref({});

// Format number with thousand separator
function formatNumber(num) {
  return Number(num).toLocaleString("id-ID");
}

// Format coin number (up to 8 decimal places)
function formatKoin(num) {
  return Number(num).toLocaleString("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 8,
  });
}

// Validate input fields based on current mode
function validate() {
  let valid = true;
  errors.value = {
    modal: "",
    hargaBeli: "",
    jumlahKoinInput: "",
    hargaBeliKoin: "",
    hargaJual: "",
  };

  if (inputMode.value === "modal") {
    if (!modal.value || modal.value <= 0) {
      errors.value.modal = "Modal harus diisi dan > 0";
      valid = false;
    }
    if (!hargaBeli.value || hargaBeli.value <= 0) {
      errors.value.hargaBeli = "Harga beli harus diisi dan > 0";
      valid = false;
    }
  } else {
    if (!jumlahKoinInput.value || jumlahKoinInput.value <= 0) {
      errors.value.jumlahKoinInput = "Jumlah koin harus diisi dan > 0";
      valid = false;
    }
    if (!hargaBeliKoin.value || hargaBeliKoin.value <= 0) {
      errors.value.hargaBeliKoin = "Harga beli harus diisi dan > 0";
      valid = false;
    }
  }

  if (!hargaJual.value || hargaJual.value <= 0) {
    errors.value.hargaJual = "Harga jual harus diisi dan > 0";
    valid = false;
  }
  return valid;
}

// Calculate profit and related values
function calculateProfit() {
  if (!validate()) {
    showResult.value = false;
    return;
  }

  if (inputMode.value === "modal") {
    // Calculate based on modal
    jumlahKoin.value = modal.value / hargaBeli.value;
    modalUsed.value = modal.value;
    hargaBeliUsed.value = hargaBeli.value;
  } else {
    // Calculate based on coin amount
    jumlahKoin.value = jumlahKoinInput.value;
    modalUsed.value = jumlahKoinInput.value * hargaBeliKoin.value;
    hargaBeliUsed.value = hargaBeliKoin.value;
  }

  totalNilai.value = jumlahKoin.value * hargaJual.value;
  profit.value = totalNilai.value - modalUsed.value;
  persentaseKeuntungan.value = (profit.value / modalUsed.value) * 100;
  showResult.value = true;
}

// Reset all fields and results
function resetForm() {
  modal.value = "";
  hargaBeli.value = "";
  jumlahKoinInput.value = "";
  hargaBeliKoin.value = "";
  hargaJual.value = "";
  showResult.value = false;
  errors.value = {
    modal: "",
    hargaBeli: "",
    jumlahKoinInput: "",
    hargaBeliKoin: "",
    hargaJual: "",
  };
}

// Toggle dark/light mode
function toggleDarkMode() {
  isDarkMode.value = !isDarkMode.value;
}

// Toggle advanced analysis
function toggleAnalysis() {
  showAdvanced.value = !showAdvanced.value;
}

// Term explanation functions
function showTermExplanation(term) {
  const termDefinitions = {
    RSI: {
      title: "RSI (Relative Strength Index)",
      definition: "RSI adalah indikator momentum yang mengukur kecepatan dan perubahan harga untuk menentukan apakah suatu aset sedang dalam kondisi overbought (terlalu tinggi) atau oversold (terlalu rendah). Skala RSI adalah 0-100.",
      explanations: [
        { condition: "RSI > 70", meaning: "Overbought (Jenuh Beli) - Harga mungkin akan turun, pertimbangkan untuk jual" },
        { condition: "RSI 30-70", meaning: "Normal Zone - Harga dalam zona aman, tidak ada sinyal kuat" },
        { condition: "RSI < 30", meaning: "Oversold (Jenuh Jual) - Harga mungkin akan naik, pertimbangkan untuk beli" },
      ],
      example: "Jika RSI Bitcoin = 75, artinya Bitcoin sedang overbought dan kemungkinan besar harga akan koreksi turun dalam waktu dekat.",
    },
    MACD: {
      title: "MACD & Trend Analysis",
      definition: "MACD (Moving Average Convergence Divergence) adalah indikator trend yang menunjukkan hubungan antara dua moving average. Trend menunjukkan arah pergerakan harga secara umum.",
      explanations: [
        { condition: "Bullish Cross", meaning: "Sinyal beli kuat - Momentum baru saja berubah ke arah positif" },
        { condition: "Positive", meaning: "Trend naik - Momentum sedang positif, harga cenderung naik" },
        { condition: "Negative", meaning: "Trend turun - Momentum sedang negatif, harga cenderung turun" },
        { condition: "Bearish Cross", meaning: "Sinyal jual kuat - Momentum baru saja berubah ke arah negatif" },
      ],
      example: "Jika MACD menunjukkan 'Bullish Cross', artinya ada sinyal kuat untuk membeli karena trend baru saja berubah dari negatif ke positif.",
    },
    Sentiment: {
      title: "Market Sentiment (Sentimen Pasar)",
      definition: "Sentimen pasar adalah suasana hati atau sikap umum investor terhadap aset tertentu. Ini menggambarkan psikologi massa investor dan bisa mempengaruhi pergerakan harga.",
      explanations: [
        { condition: "Bullish (Bull Market)", meaning: "Optimis - Mayoritas investor percaya harga akan naik. 'Bull' melambangkan banteng yang menyerang ke atas" },
        { condition: "Neutral (Sideways)", meaning: "Netral - Investor tidak yakin arah pergerakan harga, market bergerak menyamping" },
        { condition: "Bearish (Bear Market)", meaning: "Pesimis - Mayoritas investor percaya harga akan turun. 'Bear' melambangkan beruang yang menyerang ke bawah" },
      ],
      example: "Jika sentimen 'Bullish', artinya mayoritas investor optimis dan cenderung membeli, menciptakan tekanan beli yang mendorong harga naik.",
    },
    TakeProfit: {
      title: "Take Profit",
      definition: "Take Profit adalah strategi untuk menjual sebagian atau seluruh investasi ketika sudah mencapai keuntungan tertentu. Tujuannya untuk mengamankan profit sebelum harga berbalik arah.",
      explanations: [
        { condition: "Profit 10-20%", meaning: "Pertimbangkan take profit sebagian (25-50%) untuk mengamankan keuntungan" },
        { condition: "Profit > 20%", meaning: "Sangat disarankan take profit sebagian besar (50-75%)" },
        { condition: "Profit > 50%", meaning: "Take profit mayoritas posisi, sisakan sedikit untuk potensi gain lebih" },
      ],
      example: "Jika profit Anda 30%, take profit 60% dari posisi untuk mengamankan keuntungan, sisakan 40% untuk potensi gain lebih.",
    },
    CutLoss: {
      title: "Cut Loss / Stop Loss",
      definition: "Cut Loss adalah strategi untuk menjual investasi ketika mengalami kerugian tertentu untuk mencegah kerugian yang lebih besar. Ini adalah bagian penting dari risk management.",
      explanations: [
        { condition: "Loss 5-10%", meaning: "Evaluasi ulang fundamental, pertimbangkan hold jika masih yakin" },
        { condition: "Loss 10-20%", meaning: "Pertimbangkan cut loss sebagian untuk protect modal" },
        { condition: "Loss > 20%", meaning: "Sangat disarankan cut loss untuk melindungi sisa modal" },
      ],
      example: "Jika kerugian mencapai 15%, cut loss 50% posisi untuk melindungi modal, evaluasi ulang sebelum melanjutkan investasi.",
    },
  };

  currentTerm.value = termDefinitions[term];
  showTermModal.value = true;
}

function closeTermModal() {
  showTermModal.value = false;
}

// Advanced Analysis Functions
function getPerformanceClass() {
  if (profit.value >= 0) {
    if (persentaseKeuntungan.value >= 20) return "excellent";
    if (persentaseKeuntungan.value >= 10) return "good";
    return "positive";
  } else {
    if (Math.abs(persentaseKeuntungan.value) >= 20) return "danger";
    if (Math.abs(persentaseKeuntungan.value) >= 10) return "warning";
    return "negative";
  }
}

function getPerformanceIcon() {
  const percentage = persentaseKeuntungan.value;
  if (percentage >= 20) return "🚀";
  if (percentage >= 10) return "📈";
  if (percentage >= 0) return "💚";
  if (percentage >= -10) return "🔸";
  if (percentage >= -20) return "📉";
  return "🔻";
}

function getPerformanceTitle() {
  const percentage = persentaseKeuntungan.value;
  if (percentage >= 20) return "Performa Luar Biasa!";
  if (percentage >= 10) return "Performa Bagus";
  if (percentage >= 0) return "Untung Ringan";
  if (percentage >= -10) return "Rugi Ringan";
  if (percentage >= -20) return "Rugi Cukup Besar";
  return "Rugi Besar";
}

function getPerformanceAnalysis() {
  const percentage = persentaseKeuntungan.value;
  if (percentage >= 30) return "Investasi Anda sangat berhasil! Namun pertimbangkan untuk take profit sebagian untuk mengamankan keuntungan.";
  if (percentage >= 20) return "Keuntungan yang sangat baik! Ini adalah waktu yang tepat untuk mengevaluasi strategi exit.";
  if (percentage >= 10) return "Performa positif yang solid. Pantau terus pergerakan harga untuk timing yang optimal.";
  if (percentage >= 5) return "Keuntungan kecil tapi tetap positif. Sabar dan tunggu momentum yang lebih baik.";
  if (percentage >= 0) return "Break even atau untung tipis. Evaluasi apakah masih worth it untuk hold.";
  if (percentage >= -5) return "Rugi kecil yang masih dalam batas wajar. Jangan panic selling, evaluasi fundamental asset.";
  if (percentage >= -15) return "Rugi sedang. Pertimbangkan apakah ini koreksi sementara atau tren bearish.";
  if (percentage >= -25) return "Rugi cukup besar. Evaluasi ulang strategi dan pertimbangkan cut loss untuk melindungi modal.";
  return "Rugi sangat besar. Segera evaluasi dan pertimbangkan exit strategy untuk melindungi sisa modal.";
}

function getPriceMovementAnalysis() {
  const priceChange = ((hargaJual.value - hargaBeliUsed.value) / hargaBeliUsed.value) * 100;
  const changeText = priceChange >= 0 ? "naik" : "turun";
  return `Harga bergerak ${changeText} ${Math.abs(priceChange).toFixed(2)}% dari harga beli Anda. ${getPriceMovementContext(priceChange)}`;
}

function getPriceMovementContext(priceChange) {
  if (priceChange >= 15) return "Momentum bullish yang kuat!";
  if (priceChange >= 5) return "Tren positif yang bagus.";
  if (priceChange >= 0) return "Pergerakan harga positif.";
  if (priceChange >= -5) return "Koreksi ringan yang normal.";
  if (priceChange >= -15) return "Koreksi sedang, waspadai tren.";
  return "Penurunan signifikan, evaluasi ulang.";
}

function getRecommendations() {
  const recommendations = [];
  const percentage = persentaseKeuntungan.value;
  const priceChange = ((hargaJual.value - hargaBeliUsed.value) / hargaBeliUsed.value) * 100;

  // Profit recommendations
  if (percentage >= 25) {
    recommendations.push({
      type: "success",
      icon: "💰",
      title: "Take Profit Sebagian",
      termKey: "TakeProfit",
      message: "Keuntungan sudah besar, pertimbangkan jual 30-50% untuk mengamankan profit.",
    });
  } else if (percentage >= 15) {
    recommendations.push({
      type: "info",
      icon: "📊",
      title: "Monitor Closely",
      termKey: "TakeProfit",
      message: "Pantau resistance level. Siapkan strategy jika harga mulai reversal.",
    });
  } else if (percentage >= 5) {
    recommendations.push({
      type: "neutral",
      icon: "⏳",
      title: "Hold & Watch",
      termKey: "TakeProfit",
      message: "Masih dalam zona aman. Tunggu momentum yang lebih kuat untuk take profit.",
    });
  }

  // Loss recommendations
  if (percentage <= -20) {
    recommendations.push({
      type: "danger",
      icon: "⛔",
      title: "Pertimbangkan Cut Loss",
      termKey: "CutLoss",
      message: "Rugi sudah cukup besar. Evaluasi fundamental dan pertimbangkan exit untuk protect modal.",
    });
  } else if (percentage <= -10) {
    recommendations.push({
      type: "warning",
      icon: "⚠️",
      title: "Risk Management",
      termKey: "CutLoss",
      message: "Set stop loss yang ketat. Jangan menambah posisi sampai trend berubah.",
    });
  } else if (percentage < 0) {
    recommendations.push({
      type: "caution",
      icon: "🔍",
      title: "Analisa Ulang",
      termKey: "CutLoss",
      message: "Evaluasi apakah ini koreksi sementara atau perubahan trend jangka panjang.",
    });
  }

  // General recommendations
  recommendations.push({
    type: "info",
    icon: "📚",
    title: "Diversifikasi",
    termKey: "TakeProfit",
    message: "Jangan put semua telur dalam satu keranjang. Diversifikasi portfolio untuk mengurangi risiko.",
  });

  return recommendations;
}

function getRiskLevel() {
  const percentage = Math.abs(persentaseKeuntungan.value);
  if (percentage >= 30) return 85;
  if (percentage >= 20) return 70;
  if (percentage >= 10) return 55;
  if (percentage >= 5) return 40;
  return 25;
}

function getRiskClass() {
  const risk = getRiskLevel();
  if (risk >= 70) return "high";
  if (risk >= 50) return "medium";
  return "low";
}

function getRiskDescription() {
  const risk = getRiskLevel();
  if (risk >= 70) return "Risiko Tinggi";
  if (risk >= 50) return "Risiko Sedang";
  return "Risiko Rendah";
}

function getRiskExplanation() {
  const percentage = Math.abs(persentaseKeuntungan.value);
  if (percentage >= 20) return "Volatilitas tinggi memerlukan strategi yang hati-hati. Pertimbangkan position sizing yang tepat.";
  if (percentage >= 10) return "Level risiko yang perlu diperhatikan. Gunakan stop loss dan take profit yang jelas.";
  return "Risiko dalam batas wajar. Tetap disiplin dengan money management.";
}

// Advanced Technical Analysis Functions
function getPriceChangePercentage() {
  const change = ((hargaJual.value - hargaBeliUsed.value) / hargaBeliUsed.value) * 100;
  return change.toFixed(2);
}

function getPriceChangeClass() {
  const change = parseFloat(getPriceChangePercentage());
  if (change > 5) return "bullish";
  if (change > 0) return "positive";
  if (change > -5) return "negative";
  return "bearish";
}

function getMomentumSignal() {
  const change = parseFloat(getPriceChangePercentage());
  if (change > 10) return "Strong Bullish";
  if (change > 3) return "Bullish";
  if (change > -3) return "Neutral";
  if (change > -10) return "Bearish";
  return "Strong Bearish";
}

function getVolatilityLevel() {
  const absChange = Math.abs(parseFloat(getPriceChangePercentage()));
  if (absChange > 15) return "Very High";
  if (absChange > 8) return "High";
  if (absChange > 3) return "Medium";
  return "Low";
}

// Simulated Technical Indicators (based on price action)
function getSimulatedRSI() {
  const priceChange = parseFloat(getPriceChangePercentage());
  // Simulate RSI based on price movement
  let baseRSI = 50;
  if (priceChange > 0) {
    baseRSI = Math.min(85, 50 + priceChange * 2.5);
  } else {
    baseRSI = Math.max(15, 50 + priceChange * 2.5);
  }
  return Math.round(baseRSI);
}

function getRSIClass() {
  const rsi = getSimulatedRSI();
  if (rsi > 70) return "overbought";
  if (rsi < 30) return "oversold";
  return "neutral";
}

function getRSISignal() {
  const rsi = getSimulatedRSI();
  if (rsi > 80) return "Extremely Overbought - Consider Selling";
  if (rsi > 70) return "Overbought Territory";
  if (rsi < 20) return "Extremely Oversold - Consider Buying";
  if (rsi < 30) return "Oversold Territory";
  return "Neutral Zone";
}

function getMACDSignal() {
  const priceChange = parseFloat(getPriceChangePercentage());
  if (priceChange > 5) return "Bullish Cross";
  if (priceChange > 0) return "Positive";
  if (priceChange > -5) return "Negative";
  return "Bearish Cross";
}

function getMACDClass() {
  const signal = getMACDSignal();
  if (signal.includes("Bullish")) return "bullish";
  if (signal === "Positive") return "positive";
  if (signal === "Negative") return "negative";
  return "bearish";
}

function getMACDDescription() {
  const signal = getMACDSignal();
  if (signal === "Bullish Cross") return "Strong upward momentum detected";
  if (signal === "Positive") return "Upward momentum building";
  if (signal === "Negative") return "Downward pressure increasing";
  return "Strong downward momentum";
}

function getMASignal() {
  const priceChange = parseFloat(getPriceChangePercentage());
  if (priceChange > 3) return "Above MA";
  if (priceChange > -3) return "Near MA";
  return "Below MA";
}

function getMAClass() {
  const signal = getMASignal();
  if (signal === "Above MA") return "bullish";
  if (signal === "Near MA") return "neutral";
  return "bearish";
}

function getMADescription() {
  const signal = getMASignal();
  if (signal === "Above MA") return "Price trading above moving averages - bullish trend";
  if (signal === "Near MA") return "Price consolidating around moving averages";
  return "Price below moving averages - bearish trend";
}

// Support & Resistance Calculations
function getResistanceLevel() {
  const current = hargaJual.value;
  const volatility = Math.abs(parseFloat(getPriceChangePercentage())) / 100;
  return Math.round(current * (1 + Math.max(0.03, volatility * 1.5)));
}

function getSupportLevel() {
  const current = hargaJual.value;
  const volatility = Math.abs(parseFloat(getPriceChangePercentage())) / 100;
  return Math.round(current * (1 - Math.max(0.03, volatility * 1.5)));
}

function getResistanceDistance() {
  const resistance = getResistanceLevel();
  const current = hargaJual.value;
  return (((resistance - current) / current) * 100).toFixed(1);
}

function getSupportDistance() {
  const support = getSupportLevel();
  const current = hargaJual.value;
  return (((current - support) / current) * 100).toFixed(1);
}

// Trading Signals Generation
function getTradingSignals() {
  const signals = [];
  const priceChange = parseFloat(getPriceChangePercentage());
  const rsi = getSimulatedRSI();

  // Momentum Signal
  if (priceChange > 8) {
    signals.push({
      type: "momentum",
      icon: "🚀",
      title: "Strong Momentum",
      description: "Price showing strong upward momentum. Consider taking profits.",
      strength: "strong",
    });
  } else if (priceChange < -8) {
    signals.push({
      type: "momentum",
      icon: "📉",
      title: "Weak Momentum",
      description: "Price showing strong downward momentum. Consider cutting losses.",
      strength: "strong",
    });
  }

  // RSI Signal
  if (rsi > 75) {
    signals.push({
      type: "rsi",
      icon: "⚠️",
      title: "Overbought Warning",
      description: "RSI indicates overbought conditions. Price may reverse soon.",
      strength: "medium",
    });
  } else if (rsi < 25) {
    signals.push({
      type: "rsi",
      icon: "💡",
      title: "Oversold Opportunity",
      description: "RSI indicates oversold conditions. Potential buying opportunity.",
      strength: "medium",
    });
  }

  // Volume Signal (simulated)
  if (Math.abs(priceChange) > 5) {
    signals.push({
      type: "volume",
      icon: "📊",
      title: "High Volume Activity",
      description: "Significant price movement suggests high trading volume.",
      strength: "weak",
    });
  }

  return signals;
}

// Market Sentiment Analysis
function getSentimentScore() {
  const priceChange = parseFloat(getPriceChangePercentage());
  const rsi = getSimulatedRSI();

  // Calculate sentiment based on multiple factors
  let sentiment = 50; // Neutral baseline

  // Price change influence (40% weight)
  sentiment += priceChange * 2;

  // RSI influence (30% weight)
  sentiment += (rsi - 50) * 0.6;

  // Volatility influence (30% weight)
  const volatility = Math.abs(priceChange);
  if (volatility > 10) sentiment += priceChange > 0 ? 10 : -10;

  return Math.max(0, Math.min(100, Math.round(sentiment)));
}

function getSentimentClass() {
  const score = getSentimentScore();
  if (score > 70) return "bullish";
  if (score > 30) return "neutral";
  return "bearish";
}

function getSentimentDescription() {
  const score = getSentimentScore();
  const priceChange = parseFloat(getPriceChangePercentage());

  if (score > 80) return `Extremely bullish sentiment! Market showing strong confidence with ${priceChange > 0 ? "positive" : "negative"} price action.`;
  if (score > 60) return `Bullish sentiment. Investors are optimistic about price direction.`;
  if (score > 40) return `Neutral sentiment. Market is undecided on direction.`;
  if (score > 20) return `Bearish sentiment. Investors are pessimistic about near-term prospects.`;
  return `Extremely bearish sentiment! Market showing significant concern.`;
}

// Compact Analysis Helper Functions
function getQuickAnalysis() {
  const percentage = persentaseKeuntungan.value;
  if (percentage >= 15) return "Profit besar! Pertimbangkan take profit.";
  if (percentage >= 5) return "Profit bagus. Monitor terus.";
  if (percentage >= 0) return "Profit kecil. Tunggu momentum lebih baik.";
  if (percentage >= -10) return "Rugi ringan. Evaluasi strategi.";
  return "Rugi besar. Pertimbangkan cut loss.";
}

function getTopRecommendations() {
  const recs = getRecommendations();
  return recs.slice(0, 2); // Only show top 2 recommendations
}

function getSentimentLevel() {
  const score = getSentimentScore();
  if (score > 70) return "Bullish";
  if (score > 30) return "Neutral";
  return "Bearish";
}

function getSentimentLevelWithExplanation() {
  const score = getSentimentScore();
  if (score > 70) return "Bullish (Bull Market - Optimis)";
  if (score > 30) return "Neutral (Sideways - Tidak Jelas)";
  return "Bearish (Bear Market - Pesimis)";
}

// Helper function to check if modal tooltip should be shown
function shouldShowModalTooltip() {
  return jumlahKoinInput.value > 0 && hargaBeliKoin.value > 0;
}

// Calculate total modal for tooltip
function calculateTotalModal() {
  if (jumlahKoinInput.value && hargaBeliKoin.value) {
    return jumlahKoinInput.value * hargaBeliKoin.value;
  }
  return 0;
}
</script>

<style scoped>
.calculator {
  max-width: 800px;
  margin: 1rem auto;
  padding: 1rem;
  background: var(--bg);
  border-radius: 0.8rem;
  box-shadow: 0 2px 16px #0001;
  color: var(--text);
  transition: background 0.3s, color 0.3s;
  min-height: calc(100vh - 2rem);
  display: flex;
  flex-direction: column;
}
.calculator.dark {
  --bg: #23272f;
  --text: #f3f3f3;
  --input: #2d323b;
  --border: #444;
}
.calculator:not(.dark) {
  --bg: #fff;
  --text: #222;
  --input: #f7f7f7;
  --border: #ccc;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.header h2 {
  margin: 0;
  font-size: 1.4rem;
}

.mode-selector {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 0.6rem;
  background: var(--input);
  border-radius: 0.6rem;
}
.mode-selector label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
}
.mode-selector input[type="radio"] {
  margin: 0;
}

/* Compact Input Layout */
.inputs {
  margin-bottom: 1rem;
}
.input-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
  align-items: start;
}
.input-section {
  display: flex;
  gap: 0.8rem;
}
.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  flex: 1;
}
.input-group label {
  font-size: 0.85rem;
  font-weight: 500;
}
.input-group input {
  padding: 0.5rem 0.7rem;
  border-radius: 0.4rem;
  border: 1.5px solid var(--border);
  background: var(--input);
  color: var(--text);
  font-size: 0.9rem;
  outline: none;
  transition: border 0.2s;
}
.input-group input.error {
  border-color: #e74c3c;
}
.error-msg {
  color: #e74c3c;
  font-size: 0.8rem;
}

.button-row {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.8rem;
}
.button-row button {
  flex: 1;
  padding: 0.6rem;
  border: none;
  border-radius: 0.4rem;
  font-size: 0.9rem;
  font-weight: 600;
  background: #646cff;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s;
}
.button-row .reset {
  background: #e74c3c;
}
.button-row .toggle-analysis {
  background: #17a2b8;
}
.button-row .toggle-mode {
  background: #222;
  flex: 0 0 auto;
  padding: 0.6rem 0.8rem;
}
.calculator.dark .button-row .toggle-mode {
  background: #f3f3f3;
  color: #23272f;
}
.button-row button:hover {
  opacity: 0.9;
}

/* Compact Results */
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
.calculator.dark .summary-item .label {
  color: #aaa;
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

/* Compact Advanced Analysis */
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
.calculator.dark .rec-content p {
  color: #aaa;
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
.calculator.dark .metric-compact .metric-label {
  color: #aaa;
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
.calculator.dark .risk-bar-compact {
  background: #444;
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

/* Modal Tooltip Styles */
.input-with-tooltip {
  position: relative;
}

.modal-tooltip {
  position: absolute;
  top: -50px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--bg);
  border: 2px solid #27ae60;
  border-radius: 0.6rem;
  padding: 0.5rem 0.7rem;
  box-shadow: 0 4px 16px rgba(39, 174, 96, 0.3);
  z-index: 10;
  min-width: 160px;
  animation: tooltipFadeIn 0.3s ease;
}

.modal-tooltip::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: #27ae60;
}

.tooltip-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  text-align: center;
}

.tooltip-icon {
  font-size: 1rem;
}

.tooltip-content strong {
  font-size: 0.75rem;
  color: #666;
}

.calculator.dark .tooltip-content strong {
  color: #aaa;
}

.modal-amount {
  font-size: 0.9rem;
  font-weight: 700;
  color: #27ae60;
}

@keyframes tooltipFadeIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.profit {
  color: #27ae60;
}
.loss {
  color: #e74c3c;
}

/* Clickable elements */
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

/* Term Explanation Modal */
.term-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.term-modal {
  background: var(--bg);
  border-radius: 0.8rem;
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  animation: modalFadeIn 0.3s ease;
}

.term-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.5rem 0.5rem;
  border-bottom: 1px solid var(--border);
}

.term-modal-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #646cff;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text);
  padding: 0.2rem 0.5rem;
  border-radius: 0.3rem;
  transition: background 0.2s;
}

.close-btn:hover {
  background: var(--input);
}

.term-modal-content {
  padding: 1.5rem;
}

.term-definition,
.term-explanation,
.term-example {
  margin-bottom: 1.5rem;
}

.term-definition h4,
.term-explanation h4,
.term-example h4 {
  margin: 0 0 0.8rem 0;
  font-size: 1rem;
  color: var(--text);
}

.term-definition p,
.term-example p {
  margin: 0;
  line-height: 1.6;
  color: #666;
}

.calculator.dark .term-definition p,
.calculator.dark .term-example p {
  color: #aaa;
}

.term-explanation ul {
  margin: 0;
  padding-left: 1.2rem;
}

.term-explanation li {
  margin-bottom: 0.8rem;
  line-height: 1.5;
}

.term-explanation li strong {
  color: #646cff;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .calculator {
    margin: 0.5rem;
    padding: 0.8rem;
    min-height: calc(100vh - 1rem);
  }

  .input-row {
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }

  .input-section {
    flex-direction: column;
    gap: 0.6rem;
  }

  .result-summary {
    grid-template-columns: repeat(2, 1fr);
  }

  .tech-metrics-row {
    grid-template-columns: 1fr;
    gap: 0.4rem;
  }

  .modal-tooltip {
    min-width: 140px;
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .result-summary {
    grid-template-columns: 1fr;
  }

  .mode-selector {
    flex-direction: column;
    gap: 0.4rem;
  }

  .results-header {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
}
</style>
