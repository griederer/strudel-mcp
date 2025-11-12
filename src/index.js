#!/usr/bin/env node

/**
 * Strudel MCP Server
 *
 * MCP server for natural language control of Strudel live coding
 * from Claude Code.
 *
 * @author Gonzalo Riederer
 * @license MIT
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// TODO: Import tool implementations
// import { createPattern } from './tools/create.js';
// import { modifyPattern } from './tools/modify.js';
// import { controlPlayback } from './tools/control.js';
// import { savePattern, loadPattern, listPatterns } from './tools/persistence.js';

/**
 * MCP Server instance
 */
const server = new Server(
  {
    name: 'strudel-mcp',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * Tool Definitions
 *
 * These are the MCP tools exposed to Claude Code
 */
const tools = [
  {
    name: 'strudel_create',
    description: 'Create a new Strudel pattern from natural language description',
    inputSchema: {
      type: 'object',
      properties: {
        description: {
          type: 'string',
          description: 'Natural language description of the musical pattern to create',
        },
      },
      required: ['description'],
    },
  },
  {
    name: 'strudel_modify',
    description: 'Modify the current active Strudel pattern',
    inputSchema: {
      type: 'object',
      properties: {
        modification: {
          type: 'string',
          description: 'Natural language description of how to modify the pattern',
        },
      },
      required: ['modification'],
    },
  },
  {
    name: 'strudel_set_tempo',
    description: 'Set the global tempo in BPM',
    inputSchema: {
      type: 'object',
      properties: {
        bpm: {
          type: 'number',
          description: 'Tempo in beats per minute',
        },
      },
      required: ['bpm'],
    },
  },
  {
    name: 'strudel_stop',
    description: 'Stop audio playback',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'strudel_start',
    description: 'Resume audio playback',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'strudel_save_pattern',
    description: 'Save the current pattern to a file',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name for the pattern file (without extension)',
        },
        description: {
          type: 'string',
          description: 'Optional description of the pattern',
        },
      },
      required: ['name'],
    },
  },
  {
    name: 'strudel_load_pattern',
    description: 'Load a saved pattern from file',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name of the pattern to load',
        },
      },
      required: ['name'],
    },
  },
  {
    name: 'strudel_list_patterns',
    description: 'List all saved patterns',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'strudel_get_current',
    description: 'Get the current pattern state',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
];

/**
 * Handler: List Tools
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools,
  };
});

/**
 * Handler: Call Tool
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'strudel_create':
        // TODO: Implement pattern creation
        return {
          content: [
            {
              type: 'text',
              text: `Pattern creation not yet implemented. Would create: ${args.description}`,
            },
          ],
        };

      case 'strudel_modify':
        // TODO: Implement pattern modification
        return {
          content: [
            {
              type: 'text',
              text: `Pattern modification not yet implemented. Would modify: ${args.modification}`,
            },
          ],
        };

      case 'strudel_set_tempo':
        // TODO: Implement tempo control
        return {
          content: [
            {
              type: 'text',
              text: `Tempo control not yet implemented. Would set to: ${args.bpm} BPM`,
            },
          ],
        };

      case 'strudel_stop':
        // TODO: Implement stop
        return {
          content: [
            {
              type: 'text',
              text: 'Playback stop not yet implemented.',
            },
          ],
        };

      case 'strudel_start':
        // TODO: Implement start
        return {
          content: [
            {
              type: 'text',
              text: 'Playback start not yet implemented.',
            },
          ],
        };

      case 'strudel_save_pattern':
        // TODO: Implement save
        return {
          content: [
            {
              type: 'text',
              text: `Pattern save not yet implemented. Would save as: ${args.name}`,
            },
          ],
        };

      case 'strudel_load_pattern':
        // TODO: Implement load
        return {
          content: [
            {
              type: 'text',
              text: `Pattern load not yet implemented. Would load: ${args.name}`,
            },
          ],
        };

      case 'strudel_list_patterns':
        // TODO: Implement list
        return {
          content: [
            {
              type: 'text',
              text: 'Pattern listing not yet implemented.',
            },
          ],
        };

      case 'strudel_get_current':
        // TODO: Implement get current
        return {
          content: [
            {
              type: 'text',
              text: 'Get current pattern not yet implemented.',
            },
          ],
        };

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

/**
 * Start Server
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Strudel MCP server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
