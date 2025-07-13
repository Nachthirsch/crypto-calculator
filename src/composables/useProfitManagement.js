export function useProfitManagement(props) {
  function formatNumber(num) {
    return Number(num).toLocaleString("id-ID");
  }

  function getProfitSuggestions() {
    const suggestions = [];
    const currentProfit = props.persentaseKeuntungan;

    // Conservative suggestion (lower risk)
    if (currentProfit >= 10) {
      const target = Math.max(currentProfit - 5, 10);
      suggestions.push({
        percentage: target,
        label: "Konservatif",
        priority: "high",
        sellPercentage: 60,
        action: "Ambil Profit Sekarang",
        profitAmount: calculateProfitAtLevel(target, 60),
        remainingValue: calculateRemainingValue(60),
        reason: "Amankan sebagian besar profit untuk mengurangi risiko",
      });
    }

    // Balanced suggestion
    if (currentProfit >= 15) {
      const target = Math.max(currentProfit - 8, 15);
      suggestions.push({
        percentage: target,
        label: "Seimbang",
        priority: "medium",
        sellPercentage: 40,
        action: "Ambil Profit Sebagian",
        profitAmount: calculateProfitAtLevel(target, 40),
        remainingValue: calculateRemainingValue(40),
        reason: "Balance antara profit taking dan growth potential",
      });
    }

    // Aggressive suggestion (higher risk, higher reward)
    if (currentProfit >= 20) {
      const target = Math.max(currentProfit - 10, 20);
      suggestions.push({
        percentage: target,
        label: "Agresif",
        priority: "low",
        sellPercentage: 25,
        action: "Hold Mayoritas",
        profitAmount: calculateProfitAtLevel(target, 25),
        remainingValue: calculateRemainingValue(25),
        reason: "Maksimalkan potential gain dengan risiko tinggi",
      });
    }

    // Emergency suggestion if loss is significant
    if (currentProfit < -15) {
      suggestions.push({
        percentage: Math.abs(currentProfit),
        label: "Emergency",
        priority: "high",
        sellPercentage: 70,
        action: "Cut Loss Sekarang",
        profitAmount: 0,
        remainingValue: calculateRemainingValue(70),
        reason: "Lindungi modal dari kerugian lebih besar",
      });
    }

    return suggestions;
  }

  function calculateProfitAtLevel(targetPercentage, sellPercentage) {
    const targetValue = props.modalUsed * (1 + targetPercentage / 100);
    const profitAtTarget = targetValue - props.modalUsed;
    return Math.max(0, (profitAtTarget * sellPercentage) / 100);
  }

  function calculateRemainingValue(sellPercentage) {
    const remainingPercentage = (100 - sellPercentage) / 100;
    return props.totalNilai * remainingPercentage;
  }

  function getStopLoss(percentage) {
    return props.hargaBeliUsed * (1 - percentage / 100);
  }

  function getCurrentRiskReward() {
    const currentLoss = Math.abs(props.hargaJual - props.hargaBeliUsed);
    const potentialGain = props.profit > 0 ? props.profit : props.hargaBeliUsed * 0.1; // Assume 10% target if in loss
    const ratio = potentialGain / currentLoss;

    if (ratio >= 2) return `1:${ratio.toFixed(1)} (Bagus)`;
    if (ratio >= 1) return `1:${ratio.toFixed(1)} (Cukup)`;
    return `1:${ratio.toFixed(1)} (Buruk)`;
  }

  function getRiskRewardClass() {
    const currentLoss = Math.abs(props.hargaJual - props.hargaBeliUsed);
    const potentialGain = props.profit > 0 ? props.profit : props.hargaBeliUsed * 0.1;
    const ratio = potentialGain / currentLoss;

    if (ratio >= 2) return "profit";
    if (ratio >= 1) return "neutral";
    return "loss";
  }

  function getRiskAssessment() {
    const ratio = getCurrentRiskReward();

    if (ratio.includes("Bagus")) {
      return "Risk/reward ratio sangat baik. Lanjutkan strategi saat ini.";
    } else if (ratio.includes("Cukup")) {
      return "Risk/reward ratio acceptable. Pertimbangkan take profit bertahap.";
    } else {
      return "Risk/reward ratio buruk. Pertimbangkan exit atau kurangi posisi.";
    }
  }

  function getTimingClass(period) {
    const profitPercentage = props.persentaseKeuntungan;

    if (period === "short") {
      if (profitPercentage > 10) return "bullish";
      if (profitPercentage < -5) return "bearish";
      return "neutral";
    } else if (period === "medium") {
      if (profitPercentage > 20) return "bullish";
      if (profitPercentage < -10) return "bearish";
      return "neutral";
    } else {
      if (profitPercentage > 30) return "bullish";
      if (profitPercentage < -20) return "bearish";
      return "neutral";
    }
  }

  function getTimingAdvice(period) {
    const profitPercentage = props.persentaseKeuntungan;

    if (period === "short") {
      if (profitPercentage > 15) {
        return "Profit tinggi dalam jangka pendek. Volatilitas tinggi, pertimbangkan take profit sebagian.";
      } else if (profitPercentage > 5) {
        return "Profit moderat. Monitor closely untuk timing yang tepat.";
      } else if (profitPercentage < -10) {
        return "Loss signifikan. Evaluasi fundamental dan market sentiment.";
      }
      return "Fluktuasi normal. Tunggu sinyal yang lebih jelas.";
    } else if (period === "medium") {
      if (profitPercentage > 25) {
        return "Growth yang sangat baik. Pertimbangkan rebalancing portfolio.";
      } else if (profitPercentage > 10) {
        return "Performa positif yang stabil. Maintain posisi dengan monitoring.";
      } else if (profitPercentage < -15) {
        return "Downtrend yang concerning. Review strategi investment.";
      }
      return "Performa dalam range normal. Continue dengan plan semula.";
    } else {
      if (profitPercentage > 40) {
        return "Exceptional performance! Definitely take some profits dan diversifikasi.";
      } else if (profitPercentage > 20) {
        return "Solid long-term growth. Hold dengan selective profit taking.";
      } else if (profitPercentage < -25) {
        return "Major correction. Re-evaluate investment thesis dan risk tolerance.";
      }
      return "Long-term perspective. Focus pada fundamental value.";
    }
  }

  function getTimingAction(period) {
    const profitPercentage = props.persentaseKeuntungan;

    if (period === "short") {
      if (profitPercentage > 15) return "Take Profit 30-50%";
      if (profitPercentage > 5) return "Monitor & Hold";
      if (profitPercentage < -10) return "Consider Cut Loss";
      return "Wait & See";
    } else if (period === "medium") {
      if (profitPercentage > 25) return "Rebalance Portfolio";
      if (profitPercentage > 10) return "Hold & Monitor";
      if (profitPercentage < -15) return "Review Strategy";
      return "Stay on Course";
    } else {
      if (profitPercentage > 40) return "Take Major Profits";
      if (profitPercentage > 20) return "Selective Profit Taking";
      if (profitPercentage < -25) return "Major Strategy Review";
      return "Long-term Hold";
    }
  }

  // Additional utility functions
  function getOptimalExitPoints() {
    const currentPrice = props.hargaJual;
    const buyPrice = props.hargaBeliUsed;

    return {
      conservative: buyPrice * 1.1, // 10% profit
      moderate: buyPrice * 1.2, // 20% profit
      aggressive: buyPrice * 1.35, // 35% profit
      stopLoss: buyPrice * 0.9, // 10% loss
    };
  }

  function calculateDollarCostAverage(additionalInvestment) {
    const currentValue = props.modalUsed;
    const currentShares = props.jumlahKoin;
    const currentPrice = props.hargaJual;

    const additionalShares = additionalInvestment / currentPrice;
    const totalShares = currentShares + additionalShares;
    const totalInvestment = currentValue + additionalInvestment;
    const newAveragePrice = totalInvestment / totalShares;

    return {
      newAveragePrice,
      totalShares,
      totalInvestment,
      priceReduction: props.hargaBeliUsed - newAveragePrice,
    };
  }

  return {
    getProfitSuggestions,
    formatNumber,
    getStopLoss,
    getCurrentRiskReward,
    getRiskRewardClass,
    getRiskAssessment,
    getTimingClass,
    getTimingAdvice,
    getTimingAction,
    getOptimalExitPoints,
    calculateDollarCostAverage,
    calculateProfitAtLevel,
    calculateRemainingValue,
  };
}
