// ============================================
// Calculator — Premium Glass UI
// ============================================

// --- DOM Elements ---
const resultEl = document.getElementById('result');
const expressionEl = document.getElementById('expression');
const toastEl = document.getElementById('toast');
const historyPanel = document.getElementById('history-panel');
const historyList = document.getElementById('history-list');
const themeIconSun = document.getElementById('theme-icon-sun');
const themeIconMoon = document.getElementById('theme-icon-moon');

// --- State ---
let currentValue = '0';
let previousValue = '';
let operator = null;
let shouldResetDisplay = false;
let history = [];

// --- Initialize ---
function init() {
  // Restore theme from localStorage
  const savedTheme = localStorage.getItem('calc-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcons(savedTheme);

  // Restore history from localStorage
  const savedHistory = localStorage.getItem('calc-history');
  if (savedHistory) {
    try {
      history = JSON.parse(savedHistory);
      renderHistory();
    } catch (e) {
      history = [];
    }
  }

  // Bind button events
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', handleButtonClick);
    btn.addEventListener('click', createRipple);
  });

  // Header actions
  document.getElementById('theme-btn').addEventListener('click', toggleTheme);
  document.getElementById('history-btn').addEventListener('click', toggleHistory);
  document.getElementById('history-close').addEventListener('click', toggleHistory);
  document.getElementById('history-clear').addEventListener('click', clearHistory);

  // Keyboard
  document.addEventListener('keydown', handleKeyboard);
}

// --- Display Update ---
function updateDisplay() {
  resultEl.textContent = currentValue;

  // Build expression string
  if (previousValue && operator) {
    const opSymbol = { '+': '+', '-': '−', '*': '×', '/': '÷' }[operator] || operator;
    expressionEl.textContent = `${previousValue} ${opSymbol}`;
  } else {
    expressionEl.textContent = '';
  }
}

// --- Button Click Handler ---
function handleButtonClick(e) {
  const btn = e.currentTarget;
  const action = btn.dataset.action;
  const value = btn.dataset.value;

  switch (action) {
    case 'number':
      inputNumber(value);
      break;
    case 'operator':
      inputOperator(value);
      break;
    case 'decimal':
      inputDecimal();
      break;
    case 'equals':
      calculate();
      break;
    case 'clear':
      clearAll();
      break;
    case 'sign':
      toggleSign();
      break;
    case 'percent':
      applyPercent();
      break;
  }
}

// --- Core Calculator Logic ---
function inputNumber(num) {
  if (shouldResetDisplay) {
    currentValue = num;
    shouldResetDisplay = false;
  } else {
    currentValue = currentValue === '0' ? num : currentValue + num;
  }
  // Limit display length
  if (currentValue.length > 15) {
    currentValue = currentValue.slice(0, 15);
  }
  updateDisplay();
}

function inputOperator(op) {
  if (operator && !shouldResetDisplay) {
    calculate(true);
  }
  previousValue = currentValue;
  operator = op;
  shouldResetDisplay = true;
  updateDisplay();
}

function inputDecimal() {
  if (shouldResetDisplay) {
    currentValue = '0.';
    shouldResetDisplay = false;
    updateDisplay();
    return;
  }
  if (!currentValue.includes('.')) {
    currentValue += '.';
  }
  updateDisplay();
}

function calculate(isChained = false) {
  if (!operator || !previousValue) return;

  const prev = parseFloat(previousValue);
  const curr = parseFloat(currentValue);
  let result;

  switch (operator) {
    case '+': result = prev + curr; break;
    case '-': result = prev - curr; break;
    case '*': result = prev * curr; break;
    case '/':
      if (curr === 0) {
        showToast('Cannot divide by zero');
        clearAll();
        return;
      }
      result = prev / curr;
      break;
    default: return;
  }

  // Format result
  const resultStr = formatNumber(result);

  // Save to history (only on explicit equals, not chained)
  if (!isChained) {
    const opSymbol = { '+': '+', '-': '−', '*': '×', '/': '÷' }[operator] || operator;
    addToHistory(`${previousValue} ${opSymbol} ${currentValue}`, resultStr);
  }

  currentValue = resultStr;
  previousValue = '';
  operator = null;
  shouldResetDisplay = true;
  updateDisplay();
  expressionEl.textContent = '';
}

function clearAll() {
  currentValue = '0';
  previousValue = '';
  operator = null;
  shouldResetDisplay = false;
  updateDisplay();
}

function toggleSign() {
  if (currentValue === '0') return;
  currentValue = currentValue.startsWith('-')
    ? currentValue.slice(1)
    : '-' + currentValue;
  updateDisplay();
}

function applyPercent() {
  const num = parseFloat(currentValue);
  if (isNaN(num)) return;
  currentValue = formatNumber(num / 100);
  updateDisplay();
}

function backspace() {
  if (shouldResetDisplay || currentValue.length === 1 || (currentValue.length === 2 && currentValue.startsWith('-'))) {
    currentValue = '0';
  } else {
    currentValue = currentValue.slice(0, -1);
  }
  updateDisplay();
}

// --- Number Formatting ---
function formatNumber(num) {
  if (Number.isInteger(num) && Math.abs(num) < 1e15) {
    return num.toString();
  }
  // Remove trailing zeros from decimal
  const str = parseFloat(num.toPrecision(12)).toString();
  return str.length > 15 ? parseFloat(num.toPrecision(10)).toString() : str;
}

// --- History ---
function addToHistory(expression, result) {
  history.unshift({ expression, result, timestamp: Date.now() });
  if (history.length > 50) history.pop(); // Keep last 50
  localStorage.setItem('calc-history', JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  if (history.length === 0) {
    historyList.innerHTML = '<div class="history-empty">No calculations yet</div>';
    return;
  }

  historyList.innerHTML = history.map((item, index) => `
    <div class="history-item" data-index="${index}" onclick="loadHistoryItem(${index})">
      <div class="history-expression">${escapeHtml(item.expression)}</div>
      <div class="history-result">= ${escapeHtml(item.result)}</div>
    </div>
  `).join('');
}

function loadHistoryItem(index) {
  const item = history[index];
  if (!item) return;
  currentValue = item.result;
  previousValue = '';
  operator = null;
  shouldResetDisplay = true;
  updateDisplay();
  expressionEl.textContent = item.expression + ' =';
  toggleHistory();
}

function clearHistory() {
  history = [];
  localStorage.removeItem('calc-history');
  renderHistory();
  showToast('History cleared');
}

function toggleHistory() {
  historyPanel.classList.toggle('open');
}

// --- Theme Toggle ---
function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('calc-theme', next);
  updateThemeIcons(next);
  showToast(next === 'dark' ? 'Dark Mode 🌙' : 'Light Mode ☀️');
}

function updateThemeIcons(theme) {
  if (theme === 'dark') {
    themeIconSun.style.display = 'block';
    themeIconMoon.style.display = 'none';
  } else {
    themeIconSun.style.display = 'none';
    themeIconMoon.style.display = 'block';
  }
}

// --- Toast ---
function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add('show');
  setTimeout(() => {
    toastEl.classList.remove('show');
  }, 1800);
}

// --- Ripple Effect ---
function createRipple(e) {
  const btn = e.currentTarget;
  const ripple = document.createElement('span');
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = e.clientX - rect.left - size / 2;
  const y = e.clientY - rect.top - size / 2;

  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = x + 'px';
  ripple.style.top = y + 'px';
  ripple.classList.add('ripple');

  // Remove old ripples
  const oldRipple = btn.querySelector('.ripple');
  if (oldRipple) oldRipple.remove();

  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 500);
}

// --- Keyboard Input ---
const KEY_MAP = {
  '0': () => inputNumber('0'),
  '1': () => inputNumber('1'),
  '2': () => inputNumber('2'),
  '3': () => inputNumber('3'),
  '4': () => inputNumber('4'),
  '5': () => inputNumber('5'),
  '6': () => inputNumber('6'),
  '7': () => inputNumber('7'),
  '8': () => inputNumber('8'),
  '9': () => inputNumber('9'),
  '.': () => inputDecimal(),
  '+': () => inputOperator('+'),
  '-': () => inputOperator('-'),
  '*': () => inputOperator('*'),
  '/': () => inputOperator('/'),
  'Enter': () => calculate(),
  '=': () => calculate(),
  'Backspace': () => backspace(),
  'Delete': () => clearAll(),
  'Escape': () => clearAll(),
  '%': () => applyPercent(),
};

function handleKeyboard(e) {
  const handler = KEY_MAP[e.key];
  if (handler) {
    e.preventDefault();
    handler();

    // Visual feedback: briefly highlight the matching button
    highlightKey(e.key);
  }
}

function highlightKey(key) {
  let selector;
  if (key >= '0' && key <= '9') selector = `[data-value="${key}"]`;
  else if (key === '.') selector = '[data-action="decimal"]';
  else if (key === '+') selector = '[data-value="+"]';
  else if (key === '-') selector = '[data-value="-"]';
  else if (key === '*') selector = '[data-value="*"]';
  else if (key === '/') selector = '[data-value="/"]';
  else if (key === 'Enter' || key === '=') selector = '[data-action="equals"]';
  else if (key === 'Backspace' || key === 'Delete' || key === 'Escape') selector = '[data-action="clear"]';
  else if (key === '%') selector = '[data-action="percent"]';

  if (selector) {
    const btn = document.querySelector(selector);
    if (btn) {
      btn.style.transform = 'translateY(0) scale(0.94)';
      setTimeout(() => {
        btn.style.transform = '';
      }, 120);
    }
  }
}

// --- Utility ---
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// --- Start ---
document.addEventListener('DOMContentLoaded', init);
