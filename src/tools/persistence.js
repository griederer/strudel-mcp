/**
 * Pattern Persistence Tool
 *
 * Saves and loads patterns from filesystem
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { executePattern } from '../strudel.js';
import { getCurrentCode, getCurrentBpm, setCode, setBpm, setPlaying } from '../state.js';
import { createPatternFile, extractCode, extractMetadata, debug } from '../utils.js';

// Get directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PATTERNS_DIR = path.resolve(__dirname, '../../patterns');

/**
 * Ensure patterns directory exists
 */
async function ensurePatternsDir() {
  try {
    await fs.access(PATTERNS_DIR);
  } catch (error) {
    await fs.mkdir(PATTERNS_DIR, { recursive: true });
    debug('Created patterns directory', { path: PATTERNS_DIR });
  }
}

/**
 * Save current pattern to file
 *
 * @param {string} name - Pattern name
 * @param {string} description - Optional description
 * @param {Array<string>} tags - Optional tags
 * @returns {Promise<Object>} Result
 */
export async function savePattern(name, description = '', tags = []) {
  try {
    await ensurePatternsDir();

    const code = getCurrentCode();
    if (!code) {
      throw new Error('No active pattern to save');
    }

    const bpm = getCurrentBpm();

    // Create file content
    const content = createPatternFile(name, code, bpm, description, tags);

    // Sanitize filename
    const safeFilename = name.replace(/[^a-z0-9-_]/gi, '-').toLowerCase();
    const filename = `${safeFilename}.strudel`;
    const filepath = path.join(PATTERNS_DIR, filename);

    // Write file
    await fs.writeFile(filepath, content, 'utf8');

    debug('Pattern saved', { name, filepath });

    return {
      success: true,
      name,
      filepath,
      message: `Pattern saved to ${filepath}`,
    };
  } catch (error) {
    debug('Save pattern failed', { error: error.message });
    throw error;
  }
}

/**
 * Load pattern from file
 *
 * @param {string} name - Pattern name
 * @returns {Promise<Object>} Result
 */
export async function loadPattern(name) {
  try {
    await ensurePatternsDir();

    // Sanitize filename
    const safeFilename = name.replace(/[^a-z0-9-_]/gi, '-').toLowerCase();
    const filename = `${safeFilename}.strudel`;
    const filepath = path.join(PATTERNS_DIR, filename);

    // Read file
    const content = await fs.readFile(filepath, 'utf8');

    // Extract metadata and code
    const metadata = extractMetadata(content);
    const code = extractCode(content);

    if (!code) {
      throw new Error('Pattern file is empty');
    }

    debug('Pattern loaded', { name, code });

    // Execute pattern
    await executePattern(code);

    // Update state
    setCode(code);
    setBpm(metadata.bpm);
    setPlaying(true);

    return {
      success: true,
      name: metadata.name || name,
      code,
      bpm: metadata.bpm,
      description: metadata.description,
      tags: metadata.tags,
      playing: true,
      message: `Pattern "${metadata.name || name}" loaded and playing`,
    };
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`Pattern "${name}" not found`);
    }
    debug('Load pattern failed', { error: error.message });
    throw error;
  }
}

/**
 * List all saved patterns
 *
 * @returns {Promise<Object>} Result with pattern list
 */
export async function listPatterns() {
  try {
    await ensurePatternsDir();

    // Read directory
    const files = await fs.readdir(PATTERNS_DIR);

    // Filter .strudel files
    const patternFiles = files.filter((f) => f.endsWith('.strudel'));

    // Read metadata from each file
    const patterns = [];
    for (const filename of patternFiles) {
      const filepath = path.join(PATTERNS_DIR, filename);

      try {
        const content = await fs.readFile(filepath, 'utf8');
        const metadata = extractMetadata(content);

        patterns.push({
          filename,
          name: metadata.name || filename.replace('.strudel', ''),
          created: metadata.created,
          modified: metadata.modified,
          bpm: metadata.bpm,
          description: metadata.description,
          tags: metadata.tags,
        });
      } catch (error) {
        // Skip files that can't be read
        debug('Failed to read pattern file', { filename, error: error.message });
      }
    }

    // Sort by modified date (newest first)
    patterns.sort((a, b) => {
      const dateA = new Date(a.modified || a.created);
      const dateB = new Date(b.modified || b.created);
      return dateB - dateA;
    });

    return {
      success: true,
      count: patterns.length,
      patterns,
      message: `Found ${patterns.length} saved patterns`,
    };
  } catch (error) {
    debug('List patterns failed', { error: error.message });
    throw error;
  }
}

/**
 * Delete a pattern file
 *
 * @param {string} name - Pattern name
 * @returns {Promise<Object>} Result
 */
export async function deletePattern(name) {
  try {
    await ensurePatternsDir();

    // Sanitize filename
    const safeFilename = name.replace(/[^a-z0-9-_]/gi, '-').toLowerCase();
    const filename = `${safeFilename}.strudel`;
    const filepath = path.join(PATTERNS_DIR, filename);

    // Delete file
    await fs.unlink(filepath);

    debug('Pattern deleted', { name, filepath });

    return {
      success: true,
      name,
      message: `Pattern "${name}" deleted`,
    };
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`Pattern "${name}" not found`);
    }
    debug('Delete pattern failed', { error: error.message });
    throw error;
  }
}
