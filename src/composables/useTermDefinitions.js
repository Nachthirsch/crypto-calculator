export function useTermDefinitions() {
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

  function getTermDefinition(term) {
    return termDefinitions[term] || {};
  }

  return {
    getTermDefinition,
  };
}
