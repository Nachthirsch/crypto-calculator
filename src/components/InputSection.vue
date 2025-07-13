<template>
  <div>
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
    <form @submit.prevent="$emit('calculate')" class="inputs">
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
        <button type="button" @click="$emit('reset')" class="reset">Reset</button>
        <button type="button" @click="$emit('toggleAnalysis')" class="toggle-analysis">
          {{ showAdvanced ? "Analisis ▲" : "Analisis ▼" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  inputMode: { type: String, required: true },
  modal: { type: [String, Number], required: true },
  hargaBeli: { type: [String, Number], required: true },
  jumlahKoinInput: { type: [String, Number], required: true },
  hargaBeliKoin: { type: [String, Number], required: true },
  hargaJual: { type: [String, Number], required: true },
  errors: { type: Object, required: true },
  showAdvanced: { type: Boolean, required: true },
});

const emit = defineEmits(["update:inputMode", "update:modal", "update:hargaBeli", "update:jumlahKoinInput", "update:hargaBeliKoin", "update:hargaJual", "calculate", "reset", "toggleAnalysis"]);

const inputMode = computed({
  get: () => props.inputMode,
  set: (value) => emit("update:inputMode", value),
});

const modal = computed({
  get: () => props.modal,
  set: (value) => emit("update:modal", value),
});

const hargaBeli = computed({
  get: () => props.hargaBeli,
  set: (value) => emit("update:hargaBeli", value),
});

const jumlahKoinInput = computed({
  get: () => props.jumlahKoinInput,
  set: (value) => emit("update:jumlahKoinInput", value),
});

const hargaBeliKoin = computed({
  get: () => props.hargaBeliKoin,
  set: (value) => emit("update:hargaBeliKoin", value),
});

const hargaJual = computed({
  get: () => props.hargaJual,
  set: (value) => emit("update:hargaJual", value),
});

function formatNumber(num) {
  return Number(num).toLocaleString("id-ID");
}

function shouldShowModalTooltip() {
  return props.jumlahKoinInput > 0 && props.hargaBeliKoin > 0;
}

function calculateTotalModal() {
  if (props.jumlahKoinInput && props.hargaBeliKoin) {
    return props.jumlahKoinInput * props.hargaBeliKoin;
  }
  return 0;
}
</script>

<style scoped>
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
.button-row button:hover {
  opacity: 0.9;
}

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

@media (max-width: 768px) {
  .input-row {
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }

  .input-section {
    flex-direction: column;
    gap: 0.6rem;
  }

  .modal-tooltip {
    min-width: 140px;
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .mode-selector {
    flex-direction: column;
    gap: 0.4rem;
  }
}
</style>
