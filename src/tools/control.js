/**
 * Playback Control Tool
 *
 * Controls playback state and tempo
 */

import { stopPlayback, startPlayback, setTempo as strudelSetTempo } from '../strudel.js';
import { setPlaying, setBpm, getCurrentBpm, getState } from '../state.js';
import { debug } from '../utils.js';

/**
 * Stop playback
 *
 * @returns {Promise<Object>} Result
 */
export async function stop() {
  try {
    debug('Stopping playback');

    await stopPlayback();

    // Update state
    setPlaying(false);

    return {
      success: true,
      playing: false,
      message: 'Playback stopped',
    };
  } catch (error) {
    debug('Stop failed', { error: error.message });
    throw error;
  }
}

/**
 * Start/resume playback
 *
 * @returns {Promise<Object>} Result
 */
export async function start() {
  try {
    debug('Starting playback');

    await startPlayback();

    // Update state
    setPlaying(true);

    return {
      success: true,
      playing: true,
      message: 'Playback started',
    };
  } catch (error) {
    debug('Start failed', { error: error.message });
    throw error;
  }
}

/**
 * Set tempo (BPM)
 *
 * @param {number} bpm - Beats per minute
 * @returns {Promise<Object>} Result
 */
export async function setTempo(bpm) {
  try {
    debug('Setting tempo', { bpm });

    const result = await strudelSetTempo(bpm);

    // Update state
    setBpm(bpm);

    return {
      success: true,
      bpm,
      cps: result.cps,
      message: `Tempo set to ${bpm} BPM`,
    };
  } catch (error) {
    debug('Set tempo failed', { error: error.message });
    throw error;
  }
}

/**
 * Get current state
 *
 * @returns {Promise<Object>} Current state
 */
export async function getCurrent() {
  try {
    const state = getState();

    return {
      success: true,
      code: state.currentCode,
      bpm: state.currentBpm,
      playing: state.isPlaying,
      lastModified: state.lastModified,
    };
  } catch (error) {
    debug('Get current failed', { error: error.message });
    throw error;
  }
}
