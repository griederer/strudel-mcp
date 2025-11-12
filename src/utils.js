/**
 * Utility Functions Module
 *
 * Helper functions for pattern generation and manipulation
 */

const DEBUG = process.env.DEBUG === 'true';

/**
 * Generate Strudel code from natural language description
 *
 * This function uses heuristics to map common musical descriptions
 * to Strudel pattern code. Claude will enhance this with context.
 *
 * @param {string} description - Natural language description
 * @returns {string} Strudel code
 */
export function generateCodeFromDescription(description) {
  const desc = description.toLowerCase();

  // This is a simple mapper - Claude's intelligence does the real work
  // These are just fallback patterns

  // Drum patterns
  if (desc.includes('kick') && desc.includes('4 on the floor')) {
    return 's("bd bd bd bd")';
  }
  if (desc.includes('kick') && desc.includes('every beat')) {
    return 's("bd bd bd bd")';
  }
  if (desc.includes('snare') && (desc.includes('2 and 4') || desc.includes('backbeat'))) {
    return 's("~ sd ~ sd")';
  }
  if (desc.includes('hi-hat') && desc.includes('fast')) {
    return 's("hh*8")';
  }
  if (desc.includes('hi-hat')) {
    return 's("hh*4")';
  }

  // Bass patterns
  if (desc.includes('bass') && desc.includes('c minor')) {
    return 'note("c2 eb2 g2 bb2").s("sawtooth").lpf(400)';
  }
  if (desc.includes('bass') && desc.includes('dark')) {
    return 'note("c2 eb2 g2").s("sawtooth").lpf(300).room(0.3)';
  }

  // Generic patterns
  if (desc.includes('kick')) {
    return 's("bd")';
  }
  if (desc.includes('snare')) {
    return 's("sd")';
  }

  // Default
  return 's("bd")'; // Fallback: simple kick
}

/**
 * Modify existing code based on modification description
 *
 * @param {string} currentCode - Current Strudel code
 * @param {string} modification - Natural language modification
 * @returns {string} Modified code
 */
export function modifyCode(currentCode, modification) {
  const mod = modification.toLowerCase();
  let newCode = currentCode;

  // Add reverb
  if (mod.includes('reverb') || mod.includes('room')) {
    if (!newCode.includes('.room(')) {
      newCode = newCode.replace(/\)$/, '').trim() + '.room(0.5).size(0.8)';
    }
  }

  // Add delay
  if (mod.includes('delay') || mod.includes('echo')) {
    if (!newCode.includes('.delay(')) {
      newCode = newCode.replace(/\)$/, '').trim() + '.delay(0.3).delaytime(0.25)';
    }
  }

  // Add filter
  if (mod.includes('filter') || mod.includes('darker') || mod.includes('muffled')) {
    if (!newCode.includes('.lpf(')) {
      newCode = newCode.replace(/\)$/, '').trim() + '.lpf(800)';
    }
  }

  // Volume adjustments
  if (mod.includes('louder') || mod.includes('increase volume')) {
    if (!newCode.includes('.gain(')) {
      newCode = newCode.replace(/\)$/, '').trim() + '.gain(1.2)';
    }
  }
  if (mod.includes('quieter') || mod.includes('decrease volume') || mod.includes('lower volume')) {
    if (!newCode.includes('.gain(')) {
      newCode = newCode.replace(/\)$/, '').trim() + '.gain(0.7)';
    }
  }

  // Speed modifications
  if (mod.includes('faster') || mod.includes('speed up')) {
    if (!newCode.includes('.fast(')) {
      newCode = newCode.replace(/\)$/, '').trim() + '.fast(2)';
    }
  }
  if (mod.includes('slower') || mod.includes('slow down')) {
    if (!newCode.includes('.slow(')) {
      newCode = newCode.replace(/\)$/, '').trim() + '.slow(2)';
    }
  }

  // If no modification detected, return original
  // Claude should handle the actual intelligent modification
  return newCode;
}

/**
 * Add instrument to existing pattern (stack)
 *
 * @param {string} currentCode - Current code
 * @param {string} newInstrument - New instrument code
 * @returns {string} Stacked code
 */
export function stackPatterns(currentCode, newInstrument) {
  if (!currentCode) {
    return newInstrument;
  }

  // If already stacked, add to existing stack
  if (currentCode.startsWith('stack(')) {
    // Remove closing parenthesis and add new pattern
    const withoutClose = currentCode.slice(0, -1);
    return `${withoutClose},\n  ${newInstrument}\n)`;
  }

  // Create new stack
  return `stack(\n  ${currentCode},\n  ${newInstrument}\n)`;
}

/**
 * Validate Strudel code syntax (basic check)
 *
 * @param {string} code - Code to validate
 * @returns {Object} Validation result
 */
export function validateCode(code) {
  const errors = [];

  // Check balanced parentheses
  let parenCount = 0;
  for (const char of code) {
    if (char === '(') parenCount++;
    if (char === ')') parenCount--;
    if (parenCount < 0) {
      errors.push('Unbalanced parentheses');
      break;
    }
  }
  if (parenCount > 0) {
    errors.push('Unclosed parentheses');
  }

  // Check balanced quotes
  const singleQuotes = (code.match(/'/g) || []).length;
  const doubleQuotes = (code.match(/"/g) || []).length;
  if (singleQuotes % 2 !== 0) {
    errors.push('Unclosed single quotes');
  }
  if (doubleQuotes % 2 !== 0) {
    errors.push('Unclosed double quotes');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Format BPM to CPS (cycles per second)
 *
 * @param {number} bpm - Beats per minute
 * @returns {number} Cycles per second
 */
export function bpmToCps(bpm) {
  // Assuming 4/4 time: 1 cycle = 1 bar = 4 beats
  return bpm / 60 / 4;
}

/**
 * Format CPS to BPM
 *
 * @param {number} cps - Cycles per second
 * @returns {number} Beats per minute
 */
export function cpsToBpm(cps) {
  return cps * 60 * 4;
}

/**
 * Format code for display (prettify)
 *
 * @param {string} code - Code to format
 * @returns {string} Formatted code
 */
export function formatCode(code) {
  // Basic formatting: add newlines for readability
  return code
    .replace(/stack\(/g, 'stack(\n  ')
    .replace(/,(?!\s*\n)/g, ',\n  ')
    .replace(/\)(?!\s*$)/g, '\n)');
}

/**
 * Extract pattern metadata from code comments
 *
 * @param {string} fileContent - File content with comments
 * @returns {Object} Metadata
 */
export function extractMetadata(fileContent) {
  const metadata = {
    name: '',
    created: '',
    modified: '',
    bpm: 120,
    description: '',
    tags: [],
  };

  const lines = fileContent.split('\n');
  for (const line of lines) {
    if (line.startsWith('# Pattern Name:')) {
      metadata.name = line.substring('# Pattern Name:'.length).trim();
    } else if (line.startsWith('# Created:')) {
      metadata.created = line.substring('# Created:'.length).trim();
    } else if (line.startsWith('# Modified:')) {
      metadata.modified = line.substring('# Modified:'.length).trim();
    } else if (line.startsWith('# BPM:')) {
      metadata.bpm = parseInt(line.substring('# BPM:'.length).trim());
    } else if (line.startsWith('# Description:')) {
      metadata.description = line.substring('# Description:'.length).trim();
    } else if (line.startsWith('# Tags:')) {
      const tagsStr = line.substring('# Tags:'.length).trim();
      metadata.tags = tagsStr.split(',').map((t) => t.trim());
    }
  }

  return metadata;
}

/**
 * Extract code from pattern file (remove comments)
 *
 * @param {string} fileContent - File content
 * @returns {string} Code only
 */
export function extractCode(fileContent) {
  const lines = fileContent.split('\n');
  const codeLines = lines.filter((line) => !line.startsWith('#') && line.trim() !== '');
  return codeLines.join('\n').trim();
}

/**
 * Create pattern file content with metadata
 *
 * @param {string} name - Pattern name
 * @param {string} code - Strudel code
 * @param {number} bpm - BPM
 * @param {string} description - Optional description
 * @param {Array<string>} tags - Optional tags
 * @returns {string} File content
 */
export function createPatternFile(name, code, bpm, description = '', tags = []) {
  const now = new Date().toISOString();
  const tagsStr = tags.join(', ');

  return `# Pattern Name: ${name}
# Created: ${now}
# Modified: ${now}
# BPM: ${bpm}
# Description: ${description}
# Tags: ${tagsStr}

${code}
`;
}

/**
 * Log debug message
 *
 * @param {string} message - Debug message
 * @param {any} data - Optional data
 */
export function debug(message, data = null) {
  if (DEBUG) {
    console.error(`[DEBUG] ${message}`);
    if (data) {
      console.error(JSON.stringify(data, null, 2));
    }
  }
}
