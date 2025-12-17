import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSettingsStore = defineStore('settings', () => {
  const zoomLevel = ref(1.0);
  const MIN_ZOOM = 0.8;
  const MAX_ZOOM = 1.5;
  const STEP = 0.1;

  function applyZoom() {
    const html = document.documentElement;
    const base = 16; // 1.0 = 16px
    html.style.fontSize = `${base * zoomLevel.value}px`;
  }

  function setZoom(newZoom) {
    if (newZoom >= MIN_ZOOM && newZoom <= MAX_ZOOM) {
      zoomLevel.value = parseFloat(newZoom.toFixed(1));
      applyZoom();
    }
  }

  function zoomIn() {
    setZoom(zoomLevel.value + STEP);
  }

  function zoomOut() {
    setZoom(zoomLevel.value - STEP);
  }

  function resetZoom() {
    zoomLevel.value = 1.0;
    applyZoom();
  }

  // aplica no load também
  applyZoom();

  return { zoomLevel, zoomIn, zoomOut, resetZoom };
});
