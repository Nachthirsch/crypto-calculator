<template>
  <div class="header">
    <h2>Crypto Calculator</h2>
    <button type="button" @click="$emit('toggleDarkMode')" class="toggle-mode">
      {{ isDarkMode ? "☀️" : "🌙" }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  isDarkMode: {
    type: Boolean,
    required: true,
  },
});

defineEmits(["toggleDarkMode"]);
</script>

<style scoped>
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

.toggle-mode {
  background: #222;
  flex: 0 0 auto;
  padding: 0.6rem 0.8rem;
  border: none;
  border-radius: 0.4rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s;
}
.toggle-mode:hover {
  opacity: 0.9;
}
</style>
