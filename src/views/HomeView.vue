<script setup>
import { computed, onMounted, reactive, ref } from 'vue'

const tools = [
  {
    id: 'json-formatter',
    title: 'JSON Formatter',
    description: 'Pretty-print and validate JSON payloads.',
    icon: '🧩',
  },
  {
    id: 'json-validator',
    title: 'JSON Validator',
    description: 'Check whether your JSON parses correctly.',
    icon: '✅',
  },
  {
    id: 'jwt-decoder',
    title: 'JWT Decoder',
    description: 'Decode JWT header and payload in seconds.',
    icon: '🔐',
  },
  {
    id: 'password-generator',
    title: 'Password Generator',
    description: 'Create strong random passwords quickly.',
    icon: '🔑',
  },
  {
    id: 'uuid-generator',
    title: 'UUID Generator',
    description: 'Generate version 4 UUID values.',
    icon: '🆔',
  },
  {
    id: 'base64',
    title: 'Base64 Encode/Decode',
    description: 'Transform text to and from Base64.',
    icon: '🧠',
  },
  {
    id: 'timestamp',
    title: 'Timestamp Converter',
    description: 'Switch between human-readable dates and Unix timestamps.',
    icon: '⏱️',
  },
  {
    id: 'hash',
    title: 'Hash Generator',
    description: 'Generate common hashes for any string input.',
    icon: '🧪',
  },
  {
    id: 'cron',
    title: 'Cron Builder',
    description: 'Build cron expressions and inspect them.',
    icon: '🗓️',
  },
  {
    id: 'json-compare',
    title: 'JSON Compare',
    description: 'Compare two JSON objects and surface differences.',
    icon: '🔍',
  },
]

const isDarkMode = ref(false)

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark-mode')
  } else {
    document.documentElement.classList.remove('dark-mode')
  }
}

const syncDarkModeWithSystem = () => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  isDarkMode.value = prefersDark
  if (prefersDark) {
    document.documentElement.classList.add('dark-mode')
  } else {
    document.documentElement.classList.remove('dark-mode')
  }
}

const selectedTool = ref('json-formatter')
const selectedToolMeta = computed(
  () => tools.find((tool) => tool.id === selectedTool.value) ?? tools[0],
)

const jsonFormatterInput = ref('{"name":"Ada","skills":["vue","node"]}')
const jsonFormatterOutput = ref('')
const jsonValidatorInput = ref('{"valid":true,"count":2}')
const jsonValidatorOutput = ref('Paste a JSON payload to validate it.')

const jwtInput = ref('eyJhbGciOiJub25lIn0.eyJzdWIiOiIxMjMifQ.')
const jwtOutput = ref('')

const passwordLength = ref(16)
const includeNumbers = ref(true)
const includeSymbols = ref(true)
const includeUppercase = ref(true)
const passwordOutput = ref('')
const copyStatus = ref('')

const uuidOutput = ref('')

const base64Input = ref('Developer Toolbox')
const base64Mode = ref('encode')
const base64Output = ref('')

const timestampInput = ref('')
const timestampMode = ref('date')
const timestampOutput = ref('')

const hashInput = ref('Hello from Developer Toolbox')
const hashAlgorithm = ref('SHA-256')
const hashOutput = ref('')

const cronMinute = ref('*')
const cronHour = ref('*')
const cronDay = ref('*')
const cronMonth = ref('*')
const cronWeekday = ref('*')
const cronOutput = ref('')

const jsonCompareLeft = ref('{"name":"Ada","role":"engineer","stack":["vue"]}')
const jsonCompareRight = ref('{"name":"Ada","role":"developer","stack":["vue","node"]}')
const jsonCompareOutput = ref('')

const state = reactive({
  formatError: '',
  validateError: '',
})

const selectTool = (toolId) => {
  selectedTool.value = toolId
}

const slideTransition = ref('slide-in')

const handleToolSelection = (toolId) => {
  if (toolId === selectedTool.value) return

  slideTransition.value = 'slide-out'
  window.setTimeout(() => {
    selectTool(toolId)
    slideTransition.value = 'slide-in'
  }, 140)
}

const base64Transform = () => {
  try {
    const text = base64Input.value
    if (base64Mode.value === 'encode') {
      const bytes = new TextEncoder().encode(text)
      const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('')
      base64Output.value = btoa(binary)
    } else {
      const binary = atob(text)
      const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
      base64Output.value = new TextDecoder().decode(bytes)
    }
  } catch (error) {
    base64Output.value = `Error: ${error.message}`
  }
}

const formatJson = () => {
  try {
    const parsed = JSON.parse(jsonFormatterInput.value)
    jsonFormatterOutput.value = JSON.stringify(parsed, null, 2)
    state.formatError = ''
  } catch (error) {
    state.formatError = error.message
    jsonFormatterOutput.value = ''
  }
}

const validateJson = () => {
  try {
    JSON.parse(jsonValidatorInput.value)
    jsonValidatorOutput.value = 'Valid JSON payload.'
    state.validateError = ''
  } catch (error) {
    jsonValidatorOutput.value = `Invalid JSON: ${error.message}`
    state.validateError = error.message
  }
}

const decodeJwt = () => {
  try {
    const [header, payload] = jwtInput.value.split('.')
    if (!header || !payload) {
      jwtOutput.value = 'Enter a valid JWT token.'
      return
    }

    const decodePart = (part) => {
      const normalized = part.replace(/-/g, '+').replace(/_/g, '/')
      const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4)
      const binary = atob(padded)
      const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
      return JSON.stringify(JSON.parse(new TextDecoder().decode(bytes)), null, 2)
    }

    jwtOutput.value = `Header:\n${decodePart(header)}\n\nPayload:\n${decodePart(payload)}`
  } catch (error) {
    jwtOutput.value = `Unable to decode JWT: ${error.message}`
  }
}

const generatePassword = () => {
  const lower = 'abcdefghijklmnopqrstuvwxyz'
  const upper = includeUppercase.value ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' : ''
  const numbers = includeNumbers.value ? '0123456789' : ''
  const symbols = includeSymbols.value ? '!@#$%^&*()-_=+' : ''
  const pool = `${lower}${upper}${numbers}${symbols}`

  if (!pool) {
    passwordOutput.value = 'Select at least one character type.'
    return
  }

  let generated = ''
  for (let index = 0; index < passwordLength.value; index += 1) {
    const randomIndex = Math.floor(Math.random() * pool.length)
    generated += pool[randomIndex]
  }

  passwordOutput.value = generated
}

const copyPassword = async () => {
  if (!passwordOutput.value) return
  try {
    await navigator.clipboard.writeText(passwordOutput.value)
    copyStatus.value = 'Copied!'
    window.setTimeout(() => {
      if (copyStatus.value === 'Copied!') {
        copyStatus.value = ''
      }
    }, 2000)
  } catch (error) {
    copyStatus.value = 'Copy failed'
    window.setTimeout(() => {
      if (copyStatus.value === 'Copy failed') {
        copyStatus.value = ''
      }
    }, 2000)
  }
}

const generateUuid = () => {
  if (window.crypto?.randomUUID) {
    uuidOutput.value = window.crypto.randomUUID()
  } else {
    uuidOutput.value = 'UUID generation is not available in this browser.'
  }
}

const convertTimestamp = () => {
  const inputValue = timestampInput.value.trim()
  if (!inputValue) {
    timestampOutput.value = 'Enter a value to convert.'
    return
  }

  if (timestampMode.value === 'date') {
    const timestamp = Date.parse(inputValue)
    timestampOutput.value = Number.isNaN(timestamp) ? 'Invalid date input.' : `${timestamp}`
  } else {
    const numericValue = Number(inputValue)
    const date = Number.isNaN(numericValue) ? null : new Date(numericValue * 1000)
    timestampOutput.value = date ? date.toISOString() : 'Invalid timestamp input.'
  }
}

const generateHash = async () => {
  try {
    const encoder = new TextEncoder()
    const buffer = encoder.encode(hashInput.value)
    const digest = await window.crypto.subtle.digest(hashAlgorithm.value, buffer)
    const bytes = Array.from(new Uint8Array(digest), (byte) =>
      byte.toString(16).padStart(2, '0'),
    ).join('')
    hashOutput.value = bytes
  } catch (error) {
    hashOutput.value = `Unable to generate hash: ${error.message}`
  }
}

const buildCron = () => {
  cronOutput.value = `${cronMinute.value} ${cronHour.value} ${cronDay.value} ${cronMonth.value} ${cronWeekday.value}`
}

const compareJson = () => {
  try {
    const left = JSON.parse(jsonCompareLeft.value)
    const right = JSON.parse(jsonCompareRight.value)

    if (JSON.stringify(left) === JSON.stringify(right)) {
      jsonCompareOutput.value = 'The JSON payloads are identical.'
      return
    }

    const leftKeys = Object.keys(left)
    const rightKeys = Object.keys(right)
    const onlyInLeft = leftKeys.filter((key) => !(key in right))
    const onlyInRight = rightKeys.filter((key) => !(key in left))
    const commonKeys = leftKeys.filter((key) => key in right)
    const changedValues = commonKeys.filter(
      (key) => JSON.stringify(left[key]) !== JSON.stringify(right[key]),
    )

    jsonCompareOutput.value = [
      `Only in left: ${onlyInLeft.length ? onlyInLeft.join(', ') : 'none'}`,
      `Only in right: ${onlyInRight.length ? onlyInRight.join(', ') : 'none'}`,
      `Changed values: ${changedValues.length ? changedValues.join(', ') : 'none'}`,
    ].join('\n')
  } catch (error) {
    jsonCompareOutput.value = `Comparison failed: ${error.message}`
  }
}

onMounted(() => {
  syncDarkModeWithSystem()
  formatJson()
  validateJson()
  decodeJwt()
  generatePassword()
  generateUuid()
  base64Transform()
  convertTimestamp()
  void generateHash()
  buildCron()
  compareJson()
})
</script>

<template>
  <main class="page-shell">
    <aside class="sidebar-card">
      <div class="brand-block">
        <p class="eyebrow">Developer Toolbox</p>
        <h1>All-in-one utilities for modern developers.</h1>
        <p class="brand-copy">
          Build faster with compact tools for formatting, validation, hashing, encoding, and more.
        </p>
      </div>

      <div class="sidebar-tools" aria-label="Developer tools">
        <button
          v-for="tool in tools"
          :key="tool.id"
          class="tool-card"
          :class="{ active: tool.id === selectedTool }"
          @click="handleToolSelection(tool.id)"
        >
          <span class="tool-icon">{{ tool.icon }}</span>
          <div>
            <h3>{{ tool.title }}</h3>
            <p>{{ tool.description }}</p>
          </div>
        </button>
      </div>
    </aside>

    <section class="content-area">
      <div class="hero-card">
        <div>
          <p class="eyebrow">Selected tool</p>
          <h2>{{ selectedToolMeta.title }}</h2>
          <p class="hero-copy">{{ selectedToolMeta.description }}</p>
        </div>
        <div class="hero-pill">10 tools • Fast • No signup</div>
        <button class="dark-mode-toggle" @click="toggleDarkMode" title="Toggle dark mode">
          <span class="toggle-icon">{{ isDarkMode ? '☀️' : '🌙' }}</span>
          <span class="toggle-text">{{ isDarkMode ? 'Light' : 'Dark' }} mode</span>
        </button>
      </div>

      <div class="workspace-card">
        <div class="workspace-header">
          <div>
            <p class="eyebrow">Workspace</p>
            <h3>Execute your daily developer operations</h3>
          </div>
        </div>

        <div class="tool-panel" :class="slideTransition">
          <template v-if="selectedTool === 'json-formatter'">
            <label class="field-label" for="json-formatter-input">JSON input</label>
            <textarea id="json-formatter-input" v-model="jsonFormatterInput" rows="10" />
            <div class="action-row">
              <button class="primary-btn" @click="formatJson">Format JSON</button>
              <span class="helper-text">{{ state.formatError || 'Ready to format' }}</span>
            </div>
            <label class="field-label" for="json-formatter-output">Formatted output</label>
            <textarea id="json-formatter-output" :value="jsonFormatterOutput" rows="10" readonly />
          </template>

          <template v-else-if="selectedTool === 'json-validator'">
            <label class="field-label" for="json-validator-input">JSON input</label>
            <textarea id="json-validator-input" v-model="jsonValidatorInput" rows="10" />
            <div class="action-row">
              <button class="primary-btn" @click="validateJson">Validate JSON</button>
              <span class="helper-text">{{ state.validateError || jsonValidatorOutput }}</span>
            </div>
          </template>

          <template v-else-if="selectedTool === 'jwt-decoder'">
            <label class="field-label" for="jwt-input">JWT token</label>
            <textarea id="jwt-input" v-model="jwtInput" rows="6" />
            <div class="action-row">
              <button class="primary-btn" @click="decodeJwt">Decode JWT</button>
            </div>
            <pre class="result-box">{{ jwtOutput }}</pre>
          </template>

          <template v-else-if="selectedTool === 'password-generator'">
            <div class="form-grid password-grid">
              <label class="input-group length-control">
                <span class="label-text">Length</span>
                <div class="length-row">
                  <input
                    v-model.number="passwordLength"
                    type="range"
                    min="8"
                    max="64"
                    class="range-input"
                  />
                </div>
                <input v-model.number="passwordLength" type="number" min="8" max="64" />
              </label>
              <label class="checkbox-group">
                <input v-model="includeUppercase" type="checkbox" />
                <span class="checkbox-label">Uppercase</span>
              </label>
              <label class="checkbox-group">
                <input v-model="includeNumbers" type="checkbox" />
                <span class="checkbox-label">Numbers</span>
              </label>
              <label class="checkbox-group">
                <input v-model="includeSymbols" type="checkbox" />
                <span class="checkbox-label">Symbols</span>
              </label>
            </div>
            <div class="action-row">
              <button class="primary-btn" @click="generatePassword">Generate password</button>
              <button class="secondary-btn" @click="copyPassword" :disabled="!passwordOutput">
                Copy
              </button>
              <span class="copy-tooltip">{{ copyStatus || 'Copy the password to clipboard' }}</span>
            </div>
            <div class="output-panel">
              <span class="output-label">Result</span>
              <pre class="result-box">{{ passwordOutput }}</pre>
            </div>
          </template>

          <template v-else-if="selectedTool === 'uuid-generator'">
            <div class="action-row">
              <button class="primary-btn" @click="generateUuid">Generate UUID</button>
            </div>
            <pre class="result-box">{{ uuidOutput }}</pre>
          </template>

          <template v-else-if="selectedTool === 'base64'">
            <div class="row-fields">
              <label>
                Mode
                <select v-model="base64Mode">
                  <option value="encode">Encode</option>
                  <option value="decode">Decode</option>
                </select>
              </label>
            </div>
            <label class="field-label" for="base64-input">Text input</label>
            <textarea id="base64-input" v-model="base64Input" rows="8" />
            <div class="action-row">
              <button class="primary-btn" @click="base64Transform">Transform</button>
            </div>
            <pre class="result-box">{{ base64Output }}</pre>
          </template>

          <template v-else-if="selectedTool === 'timestamp'">
            <div class="row-fields">
              <label>
                Mode
                <select v-model="timestampMode">
                  <option value="date">Date to timestamp</option>
                  <option value="timestamp">Timestamp to date</option>
                </select>
              </label>
            </div>
            <label class="field-label" for="timestamp-input">Value</label>
            <input
              id="timestamp-input"
              v-model="timestampInput"
              type="text"
              placeholder="2026-07-01T12:30:00Z"
            />
            <div class="action-row">
              <button class="primary-btn" @click="convertTimestamp">Convert</button>
            </div>
            <pre class="result-box">{{ timestampOutput }}</pre>
          </template>

          <template v-else-if="selectedTool === 'hash'">
            <label class="field-label" for="hash-input">Text input</label>
            <textarea id="hash-input" v-model="hashInput" rows="6" />
            <div class="row-fields">
              <label>
                Algorithm
                <select v-model="hashAlgorithm">
                  <option value="SHA-256">SHA-256</option>
                  <option value="SHA-1">SHA-1</option>
                  <option value="SHA-384">SHA-384</option>
                  <option value="SHA-512">SHA-512</option>
                </select>
              </label>
            </div>
            <div class="action-row">
              <button class="primary-btn" @click="generateHash">Generate hash</button>
            </div>
            <pre class="result-box">{{ hashOutput }}</pre>
          </template>

          <template v-else-if="selectedTool === 'cron'">
            <div class="row-fields">
              <label>Minute <input v-model="cronMinute" type="text" /></label>
              <label>Hour <input v-model="cronHour" type="text" /></label>
              <label>Day <input v-model="cronDay" type="text" /></label>
              <label>Month <input v-model="cronMonth" type="text" /></label>
              <label>Weekday <input v-model="cronWeekday" type="text" /></label>
            </div>
            <div class="action-row">
              <button class="primary-btn" @click="buildCron">Build cron</button>
            </div>
            <pre class="result-box">{{ cronOutput }}</pre>
          </template>

          <template v-else-if="selectedTool === 'json-compare'">
            <label class="field-label" for="json-compare-left">Left JSON</label>
            <textarea id="json-compare-left" v-model="jsonCompareLeft" rows="8" />
            <label class="field-label" for="json-compare-right">Right JSON</label>
            <textarea id="json-compare-right" v-model="jsonCompareRight" rows="8" />
            <div class="action-row">
              <button class="primary-btn" @click="compareJson">Compare JSON</button>
            </div>
            <pre class="result-box">{{ jsonCompareOutput }}</pre>
          </template>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.page-shell {
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr);
  gap: 24px;
  min-height: 100vh;
  padding: 24px;
  color: #0f172a;
  background: linear-gradient(135deg, #f8fbff 0%, #eef4ff 100%);
}

.sidebar-card,
.hero-card,
.workspace-card {
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 24px;
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.08);
}

.sidebar-card {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-height: calc(100vh - 48px);
  overflow: hidden;
}

.sidebar-tools {
  overflow-y: auto;
  padding-right: 8px;
  scrollbar-width: thin;
}

.sidebar-tools::-webkit-scrollbar {
  width: 8px;
}

.sidebar-tools::-webkit-scrollbar-thumb {
  background: rgba(37, 99, 235, 0.28);
  border-radius: 999px;
}

.sidebar-tools::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-card {
  padding: 20px;
}

.sidebar-card > .sidebar-tools {
  padding: 8px 0 4px;
}

.brand-block h1 {
  font-size: 1.4rem;
  margin: 0 0 8px;
}

.brand-copy,
.hero-copy {
  color: #64748b;
  line-height: 1.6;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.24em;
  font-size: 0.72rem;
  font-weight: 700;
  color: #2563eb;
  margin: 0 0 8px;
}

.sidebar-tools {
  display: grid;
  gap: 10px;
}

.tool-card {
  width: 100%;
  border: 1px solid #dbeafe;
  background: #fff;
  border-radius: 16px;
  padding: 12px 14px;
  text-align: left;
  cursor: pointer;
  display: flex;
  gap: 12px;
  align-items: flex-start;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
  box-sizing: border-box;
}

.tool-card:hover,
.tool-card.active {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(37, 99, 235, 0.12);
  border-color: #2563eb;
}

.tool-card h3 {
  margin: 0 0 4px;
  font-size: 0.95rem;
}

.tool-card p {
  margin: 0;
  color: #64748b;
  font-size: 0.84rem;
  line-height: 1.4;
}

.tool-icon {
  font-size: 1.1rem;
  margin-top: 2px;
}

.content-area {
  display: grid;
  gap: 24px;
  min-height: 0;
}

.hero-card,
.workspace-card {
  padding: 24px;
}

.workspace-card {
  overflow: auto;
  max-height: calc(100vh - 220px);
}

.hero-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.hero-card h2 {
  margin: 0 0 8px;
  font-size: 1.5rem;
}

.hero-pill {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  color: #1d4ed8;
  padding: 12px 16px;
  border-radius: 999px;
  font-weight: 600;
  white-space: nowrap;
}

.dark-mode-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  border: 1px solid #cbd5e1;
  border-radius: 999px;
  padding: 10px 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #475569;
}

.dark-mode-toggle:hover {
  background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
  transform: translateY(-1px);
}

.toggle-icon {
  font-size: 1.2rem;
}

.toggle-text {
  font-size: 0.9rem;
}

.workspace-header {
  margin-bottom: 18px;
}

.tool-panel {
  display: grid;
  gap: 12px;
}

textarea,
input,
select {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  padding: 10px 12px;
  font: inherit;
  box-sizing: border-box;
  background: #fff;
}

textarea {
  min-height: 120px;
  resize: vertical;
}

.field-label {
  font-weight: 600;
}

.action-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  align-items: center;
}

.password-grid {
  grid-template-columns: 180px repeat(3, minmax(140px, 1fr));
}

.input-group,
.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.label-text {
  font-weight: 600;
  color: #1e293b;
  font-size: 0.95rem;
}

.checkbox-group {
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 14px;
  background: #f8fafc;
}

.checkbox-group input {
  width: auto;
  height: auto;
  accent-color: #2563eb;
}

.secondary-btn {
  border: 1px solid rgba(37, 99, 235, 0.18);
  background: white;
  color: #2563eb;
  border-radius: 999px;
  padding: 10px 16px;
  font-weight: 600;
  cursor: pointer;
}

.secondary-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.primary-btn {
  border: none;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: white;
  border-radius: 999px;
  padding: 10px 16px;
  font-weight: 600;
  cursor: pointer;
}

.output-panel {
  display: grid;
  gap: 10px;
}

.output-label {
  font-weight: 600;
  color: #334155;
}

.result-box {
  padding: 14px;
  background: #0f172a;
  color: #e2e8f0;
  border-radius: 14px;
  white-space: pre-wrap;
  word-break: break-word;
}

.length-control {
  gap: 16px;
}

.length-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.range-input {
  width: 100%;
}

.length-value {
  min-width: 48px;
  text-align: right;
  font-weight: 700;
  color: #1e293b;
}

.checkbox-label {
  font-weight: 600;
  color: #0f172a;
}

.copy-tooltip {
  font-size: 0.9rem;
  color: #475569;
}

.checkbox-group input {
  width: 20px;
  height: 20px;
  accent-color: #2563eb;
}

.checkbox-group {
  padding: 12px 18px;
}

@keyframes slideOut {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(-12px);
  }
}

.tool-panel.slide-in {
  animation: slideIn 0.2s ease-out;
}

.tool-panel.slide-out {
  animation: slideOut 0.14s ease-in;
}

@media (max-width: 900px) {
  .page-shell {
    grid-template-columns: 1fr;
    padding: 16px;
  }

  .sidebar-card {
    order: 2;
  }

  .hero-card {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 700px) {
  .page-shell {
    padding: 14px;
    gap: 16px;
  }

  .sidebar-card,
  .hero-card,
  .workspace-card {
    padding: 16px;
    border-radius: 18px;
  }

  .hero-pill {
    width: 100%;
    text-align: center;
  }

  .action-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .primary-btn {
    width: 100%;
  }
}
</style>
