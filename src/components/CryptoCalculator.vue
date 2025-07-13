<template>
  <div class="calculator" :class="{ dark: isDarkMode }">
    <CalculatorHeader :is-dark-mode="isDarkMode" @toggle-dark-mode="toggleDarkMode" />

    <InputSection v-model:input-mode="inputMode" v-model:modal="modal" v-model:harga-beli="hargaBeli" v-model:jumlah-koin-input="jumlahKoinInput" v-model:harga-beli-koin="hargaBeliKoin" v-model:harga-jual="hargaJual" :errors="errors" :show-advanced="showAdvanced" @calculate="calculateProfit" @reset="resetForm" @toggle-analysis="toggleAnalysis" />

    <ResultsSection :show-result="showResult" :show-advanced="showAdvanced" :profit="profit" :persentase-keuntungan="persentaseKeuntungan" :jumlah-koin="jumlahKoin" :modal-used="modalUsed" :total-nilai="totalNilai" :harga-jual="hargaJual" :harga-beli-used="hargaBeliUsed" @show-term="showTermExplanation" />

    <TermModal :show="showTermModal" :term="currentTerm" @close="closeTermModal" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import CalculatorHeader from "./CalculatorHeader.vue";
import InputSection from "./InputSection.vue";
import ResultsSection from "./ResultsSection.vue";
import TermModal from "./TermModal.vue";
import { useTermDefinitions } from "../composables/useTermDefinitions";

// State for input fields
const inputMode = ref("modal");
const modal = ref("");
const hargaBeli = ref("");
const jumlahKoinInput = ref("");
const hargaBeliKoin = ref("");
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

// UI state
const isDarkMode = ref(false);
const showAdvanced = ref(false);
const showTermModal = ref(false);
const currentTerm = ref({});

// Use composables
const { getTermDefinition } = useTermDefinitions();

// Validation function
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
    jumlahKoin.value = modal.value / hargaBeli.value;
    modalUsed.value = modal.value;
    hargaBeliUsed.value = hargaBeli.value;
  } else {
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

// Toggle functions
function toggleDarkMode() {
  isDarkMode.value = !isDarkMode.value;
}

function toggleAnalysis() {
  showAdvanced.value = !showAdvanced.value;
}

// Term explanation functions
function showTermExplanation(term) {
  currentTerm.value = getTermDefinition(term);
  showTermModal.value = true;
}

function closeTermModal() {
  showTermModal.value = false;
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

@media (max-width: 768px) {
  .calculator {
    margin: 0.5rem;
    padding: 0.8rem;
    min-height: calc(100vh - 1rem);
  }
}
</style>
