<script>
export default {
  name: 'App',
}
</script>

<template>
  <router-view />
</template>

<style>
:root {
  --primary-color: #4caf50;
  --secondary-color: #2196f3;
}

body {
  margin: 0;
  font-family: 'Segoe UI', sans-serif;
  background: #f5f5f5;
}

* {
  box-sizing: border-box;
}

.tool-icon {
  color: var(--primary-color);
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

/* Dark mode styles */
html.dark-mode body {
  background: #0f172a;
}

html.dark-mode .page-shell {
  color: #e2e8f0 !important;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%) !important;
}

html.dark-mode .sidebar-card,
html.dark-mode .hero-card,
html.dark-mode .workspace-card {
  background: rgba(30, 41, 59, 0.88) !important;
  border-color: rgba(71, 85, 105, 0.3) !important;
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.3) !important;
}

html.dark-mode .brand-copy,
html.dark-mode .hero-copy {
  color: #94a3b8 !important;
}

html.dark-mode .eyebrow {
  color: #60a5fa !important;
}

html.dark-mode .tool-card {
  background: #1e293b !important;
  border-color: #334155 !important;
}

html.dark-mode .tool-card:hover,
html.dark-mode .tool-card.active {
  box-shadow: 0 12px 24px rgba(59, 130, 246, 0.2) !important;
  border-color: #3b82f6 !important;
}

html.dark-mode .tool-card p {
  color: #94a3b8 !important;
}

html.dark-mode .hero-pill {
  background: linear-gradient(135deg, #1e3a5f 0%, #1e40af 100%) !important;
  color: #93c5fd !important;
}

html.dark-mode textarea,
html.dark-mode input,
html.dark-mode select {
  background: #1e293b !important;
  border-color: #475569 !important;
  color: #e2e8f0 !important;
}

html.dark-mode .checkbox-group {
  background: #1e293b !important;
  border-color: #475569 !important;
}

html.dark-mode .label-text,
html.dark-mode .checkbox-label,
html.dark-mode .length-value {
  color: #e2e8f0 !important;
}

html.dark-mode .secondary-btn {
  background: #1e293b !important;
  border-color: #3b82f6 !important;
  color: #60a5fa !important;
}

html.dark-mode .output-label {
  color: #cbd5e1 !important;
}

html.dark-mode .result-box {
  background: #020617 !important;
  color: #e2e8f0 !important;
}

html.dark-mode .copy-tooltip {
  color: #94a3b8 !important;
}

html.dark-mode .helper-text {
  color: #94a3b8 !important;
}

html.dark-mode .dark-mode-toggle {
  background: linear-gradient(135deg, #334155 0%, #475569 100%) !important;
  border-color: #64748b !important;
  color: #e2e8f0 !important;
}

html.dark-mode .dark-mode-toggle:hover {
  background: linear-gradient(135deg, #475569 0%, #64748b 100%) !important;
}

html.dark-mode h1,
html.dark-mode h2,
html.dark-mode h3 {
  color: #f1f5f9 !important;
}

html.dark-mode p,
html.dark-mode span:not(.toggle-icon):not(.tool-icon) {
  color: #cbd5e1 !important;
}

html.dark-mode .field-label {
  color: #e2e8f0 !important;
}

html.dark-mode ::placeholder {
  color: #64748b !important;
}

html.dark-mode .tool-card h3 {
  color: #f1f5f9 !important;
}
</style>
