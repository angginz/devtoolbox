<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useNotificationStore } from '@/stores/notifications'

const tools = [
  {
    id: 'json-formatter',
    title: 'JSON Formatter',
    description: 'Pretty-print and validate JSON payloads.',
    icon: '🧩',
    category: 'JSON',
  },
  {
    id: 'json-validator',
    title: 'JSON Validator',
    description: 'Check whether your JSON parses correctly.',
    icon: '✅',
    category: 'JSON',
  },
  {
    id: 'json-repair',
    title: 'JSON Repair',
    description: 'Fix common JSON issues like trailing commas and missing quotes.',
    icon: '🔧',
    category: 'JSON',
  },
  {
    id: 'json-compare',
    title: 'JSON Compare',
    description: 'Compare two JSON objects and surface differences.',
    icon: '🔍',
    category: 'JSON',
  },
  {
    id: 'jwt-decoder',
    title: 'JWT Decoder',
    description: 'Decode JWT header and payload in seconds.',
    icon: '🔐',
    category: 'Encoding',
  },
  {
    id: 'base64',
    title: 'Base64 Encode/Decode',
    description: 'Transform text to and from Base64.',
    icon: '🧠',
    category: 'Encoding',
  },
  {
    id: 'hash',
    title: 'Hash Generator',
    description: 'Generate common hashes for any string input.',
    icon: '🧪',
    category: 'Encoding',
  },
  {
    id: 'password-generator',
    title: 'Password Generator',
    description: 'Create strong random passwords quickly.',
    icon: '🔑',
    category: 'Generators',
  },
  {
    id: 'uuid-generator',
    title: 'UUID Generator',
    description: 'Generate version 4 UUID values.',
    icon: '🆔',
    category: 'Generators',
  },
  {
    id: 'timestamp',
    title: 'Timestamp Converter',
    description: 'Switch between human-readable dates and Unix timestamps.',
    icon: '⏱️',
    category: 'Converters',
  },
  {
    id: 'cron',
    title: 'Cron Builder',
    description: 'Build cron expressions and inspect them.',
    icon: '🗓️',
    category: 'Converters',
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
const jsonFormatterInputLineCount = ref(1)
const jsonFormatterOutputLineCount = ref(1)
const formatResult = ref('')
const jsonValidatorInput = ref('{"valid":true,"count":2}')
const jsonValidatorOutput = ref('')
const lineCount = ref(1)
const validateResult = ref('')

const jsonRepairInput = ref('{"name":"Ada","skills":["vue","node"],}')
const jsonRepairOutput = ref('')
const jsonRepairLineCount = ref(1)
const jsonRepairOutputLineCount = ref(1)

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
const jsonCompareLeftLineCount = ref(1)
const jsonCompareRightLineCount = ref(1)

const state = reactive({
  formatError: '',
  validateError: '',
  repairError: '',
})

const notificationStore = useNotificationStore()

const clearInput = (inputRef) => {
  const inputRefs = {
    jsonFormatterInput: jsonFormatterInput,
    jsonValidatorInput: jsonValidatorInput,
    jsonRepairInput: jsonRepairInput,
    jwtInput: jwtInput,
    base64Input: base64Input,
    timestampInput: timestampInput,
    hashInput: hashInput,
  }

  if (inputRefs[inputRef]) {
    inputRefs[inputRef].value = ''
    // Update line counts
    if (inputRef === 'jsonFormatterInput') jsonFormatterInputLineCount.value = 1
    else if (inputRef === 'jsonValidatorInput') lineCount.value = 1
    else if (inputRef === 'jsonRepairInput') jsonRepairLineCount.value = 1

    notificationStore.addNotification(
      `Cleared ${inputRef.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())} input`,
      'success',
    )
  }
}

const clearCompareInputs = () => {
  jsonCompareLeft.value = ''
  jsonCompareRight.value = ''
  jsonCompareLeftLineCount.value = 1
  jsonCompareRightLineCount.value = 1
  jsonCompareOutput.value = ''
  notificationStore.addNotification('Cleared both inputs', 'success')
}

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
    const formatted = JSON.stringify(parsed, null, 2)
    jsonFormatterOutput.value = formatted
    jsonFormatterOutputLineCount.value = formatted.split('\n').length
    state.formatError = ''

    const inputLines = jsonFormatterInput.value.split('\n').length
    const outputLines = formatted.split('\n').length
    formatResult.value = `Formatted successfully. Input: ${inputLines} lines → Output: ${outputLines} lines`
  } catch (error) {
    state.formatError = error.message
    jsonFormatterOutput.value = ''
    jsonFormatterOutputLineCount.value = 1
    formatResult.value = ''
  }
}

const loadFormatterExample = (type) => {
  const examples = {
    minified: '{"name":"Ada","skills":["vue","node"],"active":true}',
    nested: '{"user":{"name":"Ada","age":25,"address":{"city":"Jakarta","country":"ID"}}}',
    array: '[{"id":1,"name":"Item 1"},{"id":2,"name":"Item 2"},{"id":3,"name":"Item 3"}]',
  }
  jsonFormatterInput.value = examples[type] || ''
  jsonFormatterOutput.value = ''
  formatResult.value = ''
  state.formatError = ''
  updateFormatterInputLineCount()
  jsonFormatterOutputLineCount.value = 1
}

const updateFormatterInputLineCount = () => {
  const lines = jsonFormatterInput.value.split('\n').length
  jsonFormatterInputLineCount.value = lines
}

const validateJson = () => {
  try {
    JSON.parse(jsonValidatorInput.value)
    jsonValidatorOutput.value = 'Valid JSON payload.'
    state.validateError = ''

    const parsed = JSON.parse(jsonValidatorInput.value)
    const keys = Object.keys(parsed).length
    const isArray = Array.isArray(parsed)
    validateResult.value = `Valid ${isArray ? 'array' : 'object'} with ${keys} ${isArray ? 'items' : 'keys'}`
  } catch (error) {
    jsonValidatorOutput.value = `Invalid JSON: ${error.message}`
    state.validateError = error.message
    validateResult.value = ''
  }
}

const loadValidatorExample = (type) => {
  const examples = {
    valid: '{"name":"Ada","age":25,"active":true}',
    invalid: '{"name":"Ada", "age":25,}',
    nested: '{"user":{"name":"Ada","age":25}}',
    array: '[{"id":1,"name":"Item 1"},{"id":2,"name":"Item 2"}]',
  }
  jsonValidatorInput.value = examples[type] || ''
  jsonValidatorOutput.value = ''
  validateResult.value = ''
  state.validateError = ''
  updateLineCount()
}

const updateLineCount = () => {
  const lines = jsonValidatorInput.value.split('\n').length
  lineCount.value = lines
}

const syncScroll = (event) => {
  const lineNumbers = event.target.previousElementSibling
  if (lineNumbers) {
    lineNumbers.scrollTop = event.target.scrollTop
  }
}

const repairJson = () => {
  try {
    let json = jsonRepairInput.value

    // Remove single-line comments (// ...)
    json = json.replace(/\/\/.*$/gm, '')

    // Remove multi-line comments (/* ... */)
    json = json.replace(/\/\*[\s\S]*?\*\//g, '')

    // Replace single quotes with double quotes
    json = json.replace(/'/g, '"')

    // Fix unquoted keys: wrap unquoted keys with double quotes
    json = json.replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":')

    // Remove trailing commas before } or ]
    json = json.replace(/,\s*([}\]])/g, '$1')

    // Fix missing commas between key-value pairs and array items
    json = json.replace(/"\s*"/g, '", "')
    json = json.replace(/([}\]])\s*([{\[])/g, '$1,$2')
    json = json.replace(/([a-zA-Z0-9_])\s*([{\[])/g, '$1,$2')

    // Try to parse to validate
    const parsed = JSON.parse(json)
    jsonRepairOutput.value = JSON.stringify(parsed, null, 2)
    jsonRepairOutputLineCount.value = jsonRepairOutput.value.split('\n').length
    state.repairError = ''
  } catch (error) {
    // If still invalid, try a more aggressive approach
    try {
      let json = jsonRepairInput.value

      // Remove all comments
      json = json.replace(/\/\/.*$/gm, '')
      json = json.replace(/\/\*[\s\S]*?\*\//g, '')

      // Replace single quotes
      json = json.replace(/'/g, '"')

      // Fix unquoted keys
      json = json.replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":')

      // Remove trailing commas
      json = json.replace(/,\s*([}\]])/g, '$1')

      // Add missing commas before objects/arrays
      json = json.replace(/([}\]])\s*([{\[])/g, '$1,$2')

      // Fix missing commas between values
      json = json.replace(/([a-zA-Z0-9_])\s*([{\[])/g, '$1,$2')

      // Try parsing again
      const parsed = JSON.parse(json)
      jsonRepairOutput.value = JSON.stringify(parsed, null, 2)
      jsonRepairOutputLineCount.value = jsonRepairOutput.value.split('\n').length
      state.repairError = ''
    } catch (e) {
      jsonRepairOutput.value = ''
      jsonRepairOutputLineCount.value = 1
      state.repairError = `Could not repair JSON: ${e.message}`
    }
  }
}

const updateRepairLineCount = () => {
  const lines = jsonRepairInput.value.split('\n').length
  jsonRepairLineCount.value = lines
}

const loadExample = (type) => {
  const examples = {
    trailing: '{"name":"Ada","skills":["vue","node"],}',
    'single-quotes': "{'name':'Ada','skills':['vue','node']}",
    unquoted: '{name:"Ada",skills:["vue","node"]}',
    comments: '{"name":"Ada", // developer\n"skills":["vue","node"]}',
    truncated: '{"name":"Ada","skills":["vue","node"',
    missing: '{"name":"Ada" "skills":["vue","node"]}',
  }
  jsonRepairInput.value = examples[type] || ''
  jsonRepairOutput.value = ''
  state.repairError = ''
  updateRepairLineCount()
  jsonRepairOutputLineCount.value = 1
}

const loadCompareExample = (type) => {
  const examples = {
    identical: '{"name":"Ada","role":"engineer","stack":["vue"]}',
    different: '{"name":"Ada","role":"developer","stack":["vue","node"]}',
    nested: '{"user":{"name":"Ada","age":25,"address":{"city":"Jakarta","country":"ID"}}}',
    array: '[{"id":1,"name":"Item 1"},{"id":2,"name":"Item 2"}]',
  }

  if (type === 'identical') {
    jsonCompareLeft.value = examples.identical
    jsonCompareRight.value = examples.identical
  } else if (type === 'different') {
    jsonCompareLeft.value = examples.identical
    jsonCompareRight.value = examples.different
  } else if (type === 'nested') {
    jsonCompareLeft.value = examples.nested
    jsonCompareRight.value = examples.nested
  } else if (type === 'array') {
    jsonCompareLeft.value = examples.array
    jsonCompareRight.value = examples.array
  }

  jsonCompareOutput.value = ''
  updateCompareLeftLineCount()
  updateCompareRightLineCount()
}

const updateCompareLeftLineCount = () => {
  jsonCompareLeftLineCount.value = jsonCompareLeft.value.split('\n').length
}

const updateCompareRightLineCount = () => {
  jsonCompareRightLineCount.value = jsonCompareRight.value.split('\n').length
}

const loadJwtExample = (type) => {
  const examples = {
    standard: 'eyJhbGciOiJub25lIn0.eyJzdWIiOiIxMjMifQ.',
    admin:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkYSBMb3ZlY2FmZSIsImlhdCI6MTUxNjIzOTAyMn0.',
  }
  jwtInput.value = examples[type] || ''
  jwtOutput.value = ''
}

const loadBase64Example = (type) => {
  const examples = {
    encode: 'Developer Toolbox',
    decode: 'RGV2ZWxvcGVyIFRvb2xib3g=',
  }
  base64Input.value = examples[type] || ''
  base64Output.value = ''
}

const loadTimestampExample = (type) => {
  const examples = {
    now: new Date().toISOString(),
    epoch: '946684800',
  }
  timestampInput.value = examples[type] || ''
  timestampOutput.value = ''
}

const loadHashExample = (type) => {
  const examples = {
    hello: 'Hello from Developer Toolbox',
    lorem: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  }
  hashInput.value = examples[type] || ''
  hashOutput.value = ''
}

const loadCronExample = (type) => {
  const examples = {
    hourly: '0 * * * *',
    daily: '0 0 * * *',
    weekdays: '0 9 * * 1-5',
  }
  const parts = examples[type]?.split(' ') || []
  if (parts.length === 5) {
    cronMinute.value = parts[0]
    cronHour.value = parts[1]
    cronDay.value = parts[2]
    cronMonth.value = parts[3]
    cronWeekday.value = parts[4]
  }
  cronOutput.value = examples[type] || ''
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
  updateLineCount()
  updateFormatterInputLineCount()
  updateRepairLineCount()
  jsonRepairOutputLineCount.value = 1
  decodeJwt()
  generatePassword()
  generateUuid()
  base64Transform()
  convertTimestamp()
  void generateHash()
  buildCron()
  compareJson()
  updateCompareLeftLineCount()
  updateCompareRightLineCount()
})
</script>

<template>
  <main class="page-shell">
    <header class="top-bar">
      <div class="brand-section">
        <p class="eyebrow">Developer Toolbox</p>
        <h1>All-in-one utilities for modern developers.</h1>
      </div>
      <button class="dark-mode-toggle" @click="toggleDarkMode" title="Toggle dark mode">
        <span class="toggle-icon">{{ isDarkMode ? '☀️' : '🌙' }}</span>
        <span class="toggle-text">{{ isDarkMode ? 'Light' : 'Dark' }} mode</span>
      </button>
    </header>

    <nav class="tool-nav">
      <button
        v-for="tool in tools"
        :key="tool.id"
        class="nav-tool"
        :class="{ active: tool.id === selectedTool }"
        @click="handleToolSelection(tool.id)"
      >
        {{ tool.title }}
      </button>
    </nav>

    <section class="content-area">
      <div class="workspace-card" style="padding-top: 20px">
        <div class="workspace-header">
          <h2>{{ selectedToolMeta.title }}</h2>
          <p class="hero-copy">{{ selectedToolMeta.description }}</p>
        </div>

        <div class="tool-panel" :class="slideTransition">
          <template v-if="selectedTool === 'json-formatter'">
            <div class="json-tool-layout">
              <div class="json-tool-header">
                <div class="example-buttons">
                  <span class="try-example-text">Try an example:</span>
                  <button class="example-btn" @click="loadFormatterExample('minified')">
                    Minified JSON
                  </button>
                  <button class="example-btn" @click="loadFormatterExample('nested')">
                    Nested object
                  </button>
                  <button class="example-btn" @click="loadFormatterExample('array')">
                    Array of objects
                  </button>
                </div>
                <div class="action-row">
                  <button class="primary-btn" @click="formatJson">Format JSON</button>
                  <button class="secondary-btn" @click="clearInput('jsonFormatterInput')">
                    Clear
                  </button>
                  <span
                    class="helper-text"
                    :class="{ success: !state.formatError && formatResult }"
                  >
                    {{ state.formatError || formatResult || 'Ready to format' }}
                  </span>
                </div>
              </div>
              <div class="json-tool-panels">
                <div class="panel">
                  <label class="field-label">Input JSON</label>
                  <div class="editor-container">
                    <div class="line-numbers">
                      <div v-for="n in jsonFormatterInputLineCount" :key="n" class="line-number">
                        {{ n }}
                      </div>
                    </div>
                    <textarea
                      v-model="jsonFormatterInput"
                      class="code-textarea"
                      @input="updateFormatterInputLineCount"
                      @scroll="syncScroll"
                    />
                  </div>
                </div>
                <div class="panel">
                  <label class="field-label">Formatted Output</label>
                  <div class="editor-container">
                    <div class="line-numbers">
                      <div v-for="n in jsonFormatterOutputLineCount" :key="n" class="line-number">
                        {{ n }}
                      </div>
                    </div>
                    <textarea :value="jsonFormatterOutput" class="code-textarea" readonly />
                  </div>
                </div>
              </div>
            </div>
          </template>

          <template v-else-if="selectedTool === 'json-validator'">
            <div class="json-tool-layout">
              <div class="json-tool-header">
                <div class="example-buttons">
                  <span class="try-example-text">Try an example:</span>
                  <button class="example-btn" @click="loadValidatorExample('valid')">
                    Valid JSON
                  </button>
                  <button class="example-btn" @click="loadValidatorExample('invalid')">
                    Invalid JSON
                  </button>
                  <button class="example-btn" @click="loadValidatorExample('nested')">
                    Nested object
                  </button>
                  <button class="example-btn" @click="loadValidatorExample('array')">Array</button>
                </div>
                <div class="action-row">
                  <button class="primary-btn" @click="validateJson">Validate JSON</button>
                  <button class="secondary-btn" @click="clearInput('jsonValidatorInput')">
                    Clear
                  </button>
                  <span
                    class="helper-text"
                    :class="{ success: !state.validateError && validateResult }"
                  >
                    {{ state.validateError || validateResult || 'Ready to validate' }}
                  </span>
                </div>
              </div>
              <div class="json-tool-panels">
                <div class="panel">
                  <label class="field-label">JSON Input</label>
                  <div class="editor-container">
                    <div class="line-numbers">
                      <div v-for="n in lineCount" :key="n" class="line-number">{{ n }}</div>
                    </div>
                    <textarea
                      v-model="jsonValidatorInput"
                      class="code-textarea"
                      @input="updateLineCount"
                      @scroll="syncScroll"
                    />
                  </div>
                </div>
                <div class="panel">
                  <label class="field-label">Validation Result</label>
                  <div class="result-container">
                    <pre class="result-box">{{ jsonValidatorOutput }}</pre>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <template v-else-if="selectedTool === 'json-repair'">
            <div class="json-tool-layout">
              <div class="json-tool-header">
                <div class="example-buttons">
                  <span class="try-example-text">Try an example:</span>
                  <button class="example-btn" @click="loadExample('trailing')">
                    Trailing commas
                  </button>
                  <button class="example-btn" @click="loadExample('single-quotes')">
                    Single quotes
                  </button>
                  <button class="example-btn" @click="loadExample('unquoted')">
                    Unquoted keys
                  </button>
                  <button class="example-btn" @click="loadExample('comments')">Comments</button>
                  <button class="example-btn" @click="loadExample('truncated')">
                    Truncated JSON
                  </button>
                  <button class="example-btn" @click="loadExample('missing')">
                    Missing commas
                  </button>
                </div>
                <div class="action-row">
                  <button class="primary-btn" @click="repairJson">Repair JSON</button>
                  <button class="secondary-btn" @click="clearInput('jsonRepairInput')">
                    Clear
                  </button>
                  <span
                    class="helper-text"
                    :class="{ success: !state.repairError && jsonRepairOutput }"
                  >
                    {{
                      state.repairError ||
                      (jsonRepairOutput ? 'Repair successful!' : 'Ready to repair')
                    }}
                  </span>
                </div>
              </div>
              <div class="json-tool-panels">
                <div class="panel">
                  <label class="field-label">Broken JSON</label>
                  <div class="editor-container">
                    <div class="line-numbers">
                      <div v-for="n in jsonRepairLineCount" :key="n" class="line-number">
                        {{ n }}
                      </div>
                    </div>
                    <textarea
                      v-model="jsonRepairInput"
                      class="code-textarea"
                      @input="updateRepairLineCount"
                      @scroll="syncScroll"
                    />
                  </div>
                </div>
                <div class="panel">
                  <label class="field-label">Repaired JSON</label>
                  <div class="editor-container">
                    <div class="line-numbers">
                      <div v-for="n in jsonRepairOutputLineCount" :key="n" class="line-number">
                        {{ n }}
                      </div>
                    </div>
                    <textarea :value="jsonRepairOutput" class="code-textarea" readonly />
                  </div>
                </div>
              </div>
            </div>
          </template>

          <template v-else-if="selectedTool === 'jwt-decoder'">
            <div class="example-buttons">
              <span class="try-example-text">Try an example:</span>
              <button class="example-btn" @click="loadJwtExample('standard')">Standard JWT</button>
              <button class="example-btn" @click="loadJwtExample('admin')">Admin JWT</button>
            </div>
            <label class="field-label" for="jwt-input">JWT token</label>
            <textarea id="jwt-input" v-model="jwtInput" rows="6" />
            <div class="action-row">
              <button class="primary-btn" @click="decodeJwt">Decode JWT</button>
              <button class="secondary-btn" @click="clearInput('jwtInput')">Clear</button>
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
            <div class="example-buttons">
              <span class="try-example-text">Try an example:</span>
              <button class="example-btn" @click="loadBase64Example('encode')">Encode text</button>
              <button class="example-btn" @click="loadBase64Example('decode')">Decode text</button>
            </div>
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
              <button class="secondary-btn" @click="clearInput('base64Input')">Clear</button>
            </div>
            <pre class="result-box">{{ base64Output }}</pre>
          </template>

          <template v-else-if="selectedTool === 'timestamp'">
            <div class="example-buttons">
              <span class="try-example-text">Try an example:</span>
              <button class="example-btn" @click="loadTimestampExample('now')">Current date</button>
              <button class="example-btn" @click="loadTimestampExample('epoch')">Unix epoch</button>
            </div>
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
              <button class="secondary-btn" @click="clearInput('timestampInput')">Clear</button>
            </div>
            <pre class="result-box">{{ timestampOutput }}</pre>
          </template>

          <template v-else-if="selectedTool === 'hash'">
            <div class="example-buttons">
              <span class="try-example-text">Try an example:</span>
              <button class="example-btn" @click="loadHashExample('hello')">Hello text</button>
              <button class="example-btn" @click="loadHashExample('lorem')">Long text</button>
            </div>
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
              <button class="secondary-btn" @click="clearInput('hashInput')">Clear</button>
            </div>
            <pre class="result-box">{{ hashOutput }}</pre>
          </template>

          <template v-else-if="selectedTool === 'cron'">
            <div class="example-buttons">
              <span class="try-example-text">Try an example:</span>
              <button class="example-btn" @click="loadCronExample('hourly')">Every hour</button>
              <button class="example-btn" @click="loadCronExample('daily')">
                Daily at midnight
              </button>
              <button class="example-btn" @click="loadCronExample('weekdays')">
                Weekdays at 9 AM
              </button>
            </div>
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
            <div class="json-tool-layout">
              <div class="json-tool-header">
                <div class="example-buttons">
                  <span class="try-example-text">Try an example:</span>
                  <button class="example-btn" @click="loadCompareExample('identical')">
                    Identical objects
                  </button>
                  <button class="example-btn" @click="loadCompareExample('different')">
                    Different objects
                  </button>
                  <button class="example-btn" @click="loadCompareExample('nested')">
                    Nested objects
                  </button>
                  <button class="example-btn" @click="loadCompareExample('array')">Arrays</button>
                </div>
                <div class="action-row">
                  <button class="primary-btn" @click="compareJson">Compare JSON</button>
                  <button
                    class="secondary-btn"
                    @click="clearCompareInputs"
                    title="Clear both inputs"
                  >
                    Clear all
                  </button>
                </div>
              </div>
              <div class="json-tool-panels">
                <div class="panel">
                  <label class="field-label">Left JSON</label>
                  <div class="editor-container">
                    <div class="line-numbers">
                      <div v-for="n in jsonCompareLeftLineCount" :key="n" class="line-number">
                        {{ n }}
                      </div>
                    </div>
                    <textarea
                      id="json-compare-left"
                      v-model="jsonCompareLeft"
                      class="code-textarea"
                      rows="10"
                      @input="updateCompareLeftLineCount"
                      @scroll="syncScroll"
                    />
                  </div>
                </div>
                <div class="panel">
                  <label class="field-label">Right JSON</label>
                  <div class="editor-container">
                    <div class="line-numbers">
                      <div v-for="n in jsonCompareRightLineCount" :key="n" class="line-number">
                        {{ n }}
                      </div>
                    </div>
                    <textarea
                      id="json-compare-right"
                      v-model="jsonCompareRight"
                      class="code-textarea"
                      rows="10"
                      @input="updateCompareRightLineCount"
                      @scroll="syncScroll"
                    />
                  </div>
                </div>
              </div>
              <div class="output-panel">
                <label class="field-label">Comparison Result</label>
                <pre class="result-box">{{ jsonCompareOutput || 'Ready to compare' }}</pre>
              </div>
            </div>
          </template>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.page-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  color: #0f172a;
  background: linear-gradient(135deg, #f8fbff 0%, #eef4ff 100%);
}

.top-bar {
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 0 0 24px 24px;
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.06);
}

.brand-section h1 {
  font-size: 1.4rem;
  margin: 0 0 4px;
}

.brand-section .eyebrow {
  margin-bottom: 4px;
}

.tool-nav {
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 0;
  padding: 12px 24px;
  display: flex;
  gap: 4px;
  overflow-x: auto;
  box-shadow: 0 2px 12px rgba(15, 23, 42, 0.04);
}

.tool-nav::-webkit-scrollbar {
  height: 4px;
}

.tool-nav::-webkit-scrollbar-thumb {
  background: rgba(37, 99, 235, 0.28);
  border-radius: 999px;
}

.tool-nav::-webkit-scrollbar-track {
  background: transparent;
}

.nav-tool {
  border: none;
  background: transparent;
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease;
  font-size: 0.9rem;
  font-weight: 500;
  white-space: nowrap;
  color: #64748b;
}

.nav-tool:hover {
  background: rgba(37, 99, 235, 0.08);
  color: #2563eb;
}

.nav-tool.active {
  background: #2563eb;
  color: white;
}

.content-area {
  display: grid;
  gap: 24px;
  padding: 24px;
  min-height: 0;
}

.workspace-card {
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 0;
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.08);
  padding: 24px;
  overflow: auto;
  max-height: calc(100vh - 200px);
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

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.24em;
  font-size: 0.72rem;
  font-weight: 700;
  color: #2563eb;
  margin: 0 0 8px;
}

.hero-copy {
  color: #64748b;
  line-height: 1.6;
}

.tool-description {
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 16px;
}

.example-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.example-btn {
  border: 1px solid #cbd5e1;
  background: #fff;
  border-radius: 8px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s ease;
  color: #475569;
}

.example-btn:hover {
  background: #f1f5f9;
  border-color: #94a3b8;
}

.two-panel-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}

.json-tool-layout {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: calc(100vh - 320px);
}

.json-tool-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.json-tool-panels {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  flex: 1;
  overflow: hidden;
}

.json-tool-panels .panel {
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
}

.json-tool-panels .editor-container {
  flex: 1;
}

.json-tool-panels .code-textarea {
  height: 100%;
  min-height: 0;
}

.try-example-text {
  font-size: 0.85rem;
  color: #64748b;
  margin-right: 8px;
}

.result-container {
  flex: 1;
  overflow: auto;
}

.result-container .result-box {
  height: 100%;
  margin: 0;
}

.panel {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.helper-text.success {
  color: #16a34a;
  font-weight: 600;
}

.workspace-header {
  margin-bottom: 20px;
}

.workspace-header h2 {
  margin: 0 0 8px;
  font-size: 1.5rem;
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

.editor-container {
  display: flex;
  border: 1px solid #cbd5e1;
  border-radius: 0;
  overflow: hidden;
}

.line-numbers {
  background: #f1f5f9;
  padding: 10px 8px;
  text-align: right;
  user-select: none;
  overflow: hidden;
  min-width: 40px;
  border-right: 1px solid #cbd5e1;
}

.line-number {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
  color: #64748b;
  padding: 0 4px;
}

.code-textarea {
  border: none;
  border-radius: 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
  min-height: 120px;
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

/* JSON Compare output panel */
.json-compare-output {
  margin-top: 16px;
}

.json-compare-output .result-box {
  margin-top: 8px;
}
</style>
