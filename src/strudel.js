/**
 * Strudel Code Injection Module
 *
 * Handles code injection and execution in strudel.cc
 */

import { getPage } from './browser.js';

const DEBUG = process.env.DEBUG === 'true';

/**
 * Execute Strudel pattern code
 *
 * @param {string} code - Strudel pattern code
 * @returns {Promise<Object>} Execution result
 */
export async function executePattern(code) {
  try {
    const page = await getPage();

    if (DEBUG) console.error(`Executing pattern: ${code.substring(0, 50)}...`);

    // Set editor content using Strudel's API
    await page.evaluate((codeToExecute) => {
      // Access CodeMirror instance
      const editorElement = document.querySelector('.cm-editor');
      if (!editorElement) {
        throw new Error('Editor not found');
      }

      // Get CodeMirror view
      const view = editorElement.cmView?.view;
      if (view) {
        // Replace entire document content
        view.dispatch({
          changes: {
            from: 0,
            to: view.state.doc.length,
            insert: codeToExecute,
          },
        });
      } else {
        // Fallback: try direct text manipulation
        const textarea = document.querySelector('textarea');
        if (textarea) {
          textarea.value = codeToExecute;
          textarea.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }
    }, code);

    // Wait a bit for code to update
    await page.waitForTimeout(200);

    // Trigger playback (Ctrl+Enter)
    await page.keyboard.down('Control');
    await page.keyboard.press('Enter');
    await page.keyboard.up('Control');

    // Wait for pattern to start
    await page.waitForTimeout(500);

    if (DEBUG) console.error('Pattern executed successfully');

    return {
      success: true,
      code,
      playing: true,
    };
  } catch (error) {
    if (DEBUG) console.error('Pattern execution failed:', error);
    throw new Error(`Failed to execute pattern: ${error.message}`);
  }
}

/**
 * Stop pattern playback
 *
 * @returns {Promise<Object>} Result
 */
export async function stopPlayback() {
  try {
    const page = await getPage();

    if (DEBUG) console.error('Stopping playback...');

    // Stop via Ctrl+.
    await page.keyboard.down('Control');
    await page.keyboard.press('Period');
    await page.keyboard.up('Control');

    await page.waitForTimeout(200);

    if (DEBUG) console.error('Playback stopped');

    return {
      success: true,
      playing: false,
    };
  } catch (error) {
    if (DEBUG) console.error('Stop failed:', error);
    throw new Error(`Failed to stop playback: ${error.message}`);
  }
}

/**
 * Start pattern playback
 *
 * @returns {Promise<Object>} Result
 */
export async function startPlayback() {
  try {
    const page = await getPage();

    if (DEBUG) console.error('Starting playback...');

    // Start via Ctrl+Enter
    await page.keyboard.down('Control');
    await page.keyboard.press('Enter');
    await page.keyboard.up('Control');

    await page.waitForTimeout(500);

    if (DEBUG) console.error('Playback started');

    return {
      success: true,
      playing: true,
    };
  } catch (error) {
    if (DEBUG) console.error('Start failed:', error);
    throw new Error(`Failed to start playback: ${error.message}`);
  }
}

/**
 * Get current editor content
 *
 * @returns {Promise<string>} Current code
 */
export async function getCurrentCode() {
  try {
    const page = await getPage();

    const code = await page.evaluate(() => {
      const editorElement = document.querySelector('.cm-editor');
      if (!editorElement) return '';

      const view = editorElement.cmView?.view;
      if (view) {
        return view.state.doc.toString();
      }

      // Fallback
      const textarea = document.querySelector('textarea');
      return textarea?.value || '';
    });

    return code;
  } catch (error) {
    if (DEBUG) console.error('Failed to get current code:', error);
    return '';
  }
}

/**
 * Check if pattern is playing
 *
 * @returns {Promise<boolean>} Playing state
 */
export async function isPlaying() {
  try {
    const page = await getPage();

    const playing = await page.evaluate(() => {
      // Check if audio context is running
      // This is a heuristic - Strudel might not expose a direct API
      return document.querySelector('[data-playing="true"]') !== null;
    });

    return playing;
  } catch (error) {
    if (DEBUG) console.error('Failed to check playing state:', error);
    return false;
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
    const page = await getPage();

    if (DEBUG) console.error(`Setting tempo to ${bpm} BPM...`);

    // Calculate CPS (cycles per second)
    // BPM / 60 / 4 = CPS (assuming 4/4 time)
    const cps = bpm / 60 / 4;

    // Inject setcps command
    await page.evaluate((cycles) => {
      // Execute in console
      try {
        eval(`setcps(${cycles})`);
      } catch (e) {
        console.error('setcps failed:', e);
      }
    }, cps);

    await page.waitForTimeout(200);

    if (DEBUG) console.error(`Tempo set to ${bpm} BPM (${cps} CPS)`);

    return {
      success: true,
      bpm,
      cps,
    };
  } catch (error) {
    if (DEBUG) console.error('Failed to set tempo:', error);
    throw new Error(`Failed to set tempo: ${error.message}`);
  }
}
