/**
 * Pattern State Management Module
 *
 * Manages current pattern state and history
 */

const DEBUG = process.env.DEBUG === 'true';

/**
 * Current state
 */
let state = {
  currentCode: '',
  currentBpm: parseInt(process.env.DEFAULT_BPM) || 120,
  isPlaying: false,
  history: [],
  lastModified: null,
};

/**
 * Get current state
 *
 * @returns {Object} Current state
 */
export function getState() {
  return { ...state };
}

/**
 * Update pattern code
 *
 * @param {string} code - New pattern code
 */
export function setCode(code) {
  // Add to history
  if (state.currentCode) {
    state.history.push(state.currentCode);
    // Keep only last 50 items
    if (state.history.length > 50) {
      state.history.shift();
    }
  }

  state.currentCode = code;
  state.lastModified = new Date().toISOString();

  if (DEBUG) console.error(`State updated: ${code.substring(0, 50)}...`);
}

/**
 * Update BPM
 *
 * @param {number} bpm - New BPM
 */
export function setBpm(bpm) {
  state.currentBpm = bpm;
  state.lastModified = new Date().toISOString();

  if (DEBUG) console.error(`BPM updated: ${bpm}`);
}

/**
 * Update playing state
 *
 * @param {boolean} playing - Is playing
 */
export function setPlaying(playing) {
  state.isPlaying = playing;

  if (DEBUG) console.error(`Playing state: ${playing}`);
}

/**
 * Get current code
 *
 * @returns {string} Current code
 */
export function getCurrentCode() {
  return state.currentCode;
}

/**
 * Get current BPM
 *
 * @returns {number} Current BPM
 */
export function getCurrentBpm() {
  return state.currentBpm;
}

/**
 * Check if playing
 *
 * @returns {boolean} Is playing
 */
export function getIsPlaying() {
  return state.isPlaying;
}

/**
 * Get history
 *
 * @returns {Array<string>} Code history
 */
export function getHistory() {
  return [...state.history];
}

/**
 * Undo last change (get previous code)
 *
 * @returns {string|null} Previous code or null
 */
export function undo() {
  if (state.history.length === 0) {
    return null;
  }

  const previousCode = state.history.pop();

  if (DEBUG) console.error('Undo: restored previous pattern');

  return previousCode;
}

/**
 * Clear history
 */
export function clearHistory() {
  state.history = [];

  if (DEBUG) console.error('History cleared');
}

/**
 * Reset state
 */
export function resetState() {
  state = {
    currentCode: '',
    currentBpm: parseInt(process.env.DEFAULT_BPM) || 120,
    isPlaying: false,
    history: [],
    lastModified: null,
  };

  if (DEBUG) console.error('State reset');
}

/**
 * Get last modified time
 *
 * @returns {string|null} ISO timestamp
 */
export function getLastModified() {
  return state.lastModified;
}
