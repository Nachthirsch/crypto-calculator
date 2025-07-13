export function useAnalysisLogic(props) {
  function getPerformanceClass() {
    if (props.profit >= 0) {
      if (props.persentaseKeuntungan >= 20) return "excellent";
      if (props.persentaseKeuntungan >= 10) return "good";
      return "positive";
    } else {
      if (Math.abs(props.persentaseKeuntungan) >= 20) return "danger";
      if (Math.abs(props.persentaseKeuntungan) >= 10) return "warning";
      return "negative";
    }
  }

  function getPerformanceIcon() {
    const percentage = props.persentaseKeuntungan;
    if (percentage >= 20) return "🚀";
    if (percentage >= 10) return "📈";
    if (percentage >= 0) return "💚";
    if (percentage >= -10) return "🔸";
    if (percentage >= -20) return "📉";
    return "🔻";
  }

  function getPerformanceTitle() {
    const percentage = props.persentaseKeuntungan;
    if (percentage >= 20) return "Performa Luar Biasa!";
    if (percentage >= 10) return "Performa Bagus";
    if (percentage >= 0) return "Untung Ringan";
    if (percentage >= -10) return "Rugi Ringan";
    if (percentage >= -20) return "Rugi Cukup Besar";
    return "Rugi Besar";
  }

  function getPerformanceAnalysis() {
    const percentage = props.persentaseKeuntungan;
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

  function getRecommendations() {
    const recommendations = [];
    const percentage = props.persentaseKeuntungan;

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
    const percentage = Math.abs(props.persentaseKeuntungan);
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

  function getSimulatedRSI() {
    const priceChange = ((props.hargaJual - props.hargaBeliUsed) / props.hargaBeliUsed) * 100;
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

  function getMACDSignal() {
    const priceChange = ((props.hargaJual - props.hargaBeliUsed) / props.hargaBeliUsed) * 100;
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

  function getSentimentScore() {
    const priceChange = ((props.hargaJual - props.hargaBeliUsed) / props.hargaBeliUsed) * 100;
    const rsi = getSimulatedRSI();

    let sentiment = 50;
    sentiment += priceChange * 2;
    sentiment += (rsi - 50) * 0.6;

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

  return {
    getPerformanceClass,
    getPerformanceIcon,
    getPerformanceTitle,
    getPerformanceAnalysis,
    getRecommendations,
    getRiskLevel,
    getRiskClass,
    getRiskDescription,
    getSimulatedRSI,
    getRSIClass,
    getMACDSignal,
    getMACDClass,
    getSentimentScore,
    getSentimentClass,
    getSentimentLevel,
    getSentimentLevelWithExplanation,
  };
}
