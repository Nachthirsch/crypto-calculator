<template>
  <div v-if="show" class="term-modal-overlay" @click="$emit('close')">
    <div class="term-modal" @click.stop>
      <div class="term-modal-header">
        <h3>{{ term.title }}</h3>
        <button @click="$emit('close')" class="close-btn">×</button>
      </div>
      <div class="term-modal-content">
        <div class="term-definition">
          <h4>Apa itu {{ term.title }}?</h4>
          <p>{{ term.definition }}</p>
        </div>
        <div class="term-explanation">
          <h4>Cara Membaca:</h4>
          <ul>
            <li v-for="(explanation, index) in term.explanations" :key="index">
              <strong>{{ explanation.condition }}:</strong> {{ explanation.meaning }}
            </li>
          </ul>
        </div>
        <div class="term-example">
          <h4>Contoh:</h4>
          <p>{{ term.example }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  term: {
    type: Object,
    required: true,
  },
});

defineEmits(["close"]);
</script>

<style scoped>
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
</style>
