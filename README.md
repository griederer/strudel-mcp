# 🎵 Strudel MCP - AI Music Director

**Natural language control of Strudel live coding from Claude Code**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org/)
[![MCP Compatible](https://img.shields.io/badge/MCP-Compatible-blue)](https://modelcontextprotocol.io)

---

## Overview

**Strudel MCP** is a Model Context Protocol (MCP) server that enables natural language control of the [Strudel live coding music environment](https://strudel.cc) directly from Claude Code. Create, modify, and control algorithmic music patterns by simply describing your musical intentions in plain language.

No need to learn Strudel syntax - just talk to Claude, and the music happens.

---

## Features

- 🗣️ **Natural Language Interface**: Create music by describing what you want
- 🎹 **Real-time Playback**: Hear your patterns immediately
- 🔄 **Iterative Composition**: Modify existing patterns incrementally
- 💾 **Pattern Persistence**: Save and load your musical creations
- 🎚️ **Global Controls**: Adjust tempo, volume, and playback state
- 🔌 **Seamless Integration**: Works natively with Claude Code CLI

---

## Quick Start

### Installation

```bash
# Clone repository
git clone https://github.com/griederer/strudel-mcp.git
cd strudel-mcp

# Install dependencies
npm install

# Add to Claude Code MCP config
claude mcp add strudel-mcp --command "node /path/to/strudel-mcp/src/index.js"
```

### Usage

```bash
# Start Claude Code
claude

# Start creating music with natural language
> "Create a 4 on the floor kick drum"
🔊 Playing: s("bd bd bd bd")

> "Add a snare on beats 2 and 4"
🔊 Playing: stack(s("bd bd bd bd"), s("~ sd ~ sd"))

> "Add some reverb"
🔊 Playing: stack(s("bd bd bd bd"), s("~ sd ~ sd")).room(0.5)

> "Save this as techno-beat-v1"
✓ Pattern saved to patterns/techno-beat-v1.strudel
```

---

## Example Interactions

### Building a Techno Beat

```
User: "Create a techno kick on every beat"
🔊 Four-on-floor kick plays

User: "Add fast hi-hats"
🔊 Kick + hi-hats play

User: "Create a dark bass line in C minor"
🔊 Full techno groove plays

User: "Make it 128 BPM"
🔊 Tempo adjusts to 128 BPM

User: "Save this as my-techno-groove"
✓ Pattern saved
```

### Loading and Modifying

```
User: "Load my pattern called my-techno-groove"
🔊 Pattern resumes playing

User: "Add more reverb to the kick"
🔊 Modified pattern plays

User: "Stop the music"
✓ Playback stopped
```

---

## MCP Tools

The server exposes 9 MCP tools for complete control:

| Tool | Description |
|------|-------------|
| `strudel_create` | Create new pattern from natural language |
| `strudel_modify` | Modify current active pattern |
| `strudel_set_tempo` | Set global tempo (BPM) |
| `strudel_stop` | Stop audio playback |
| `strudel_start` | Resume audio playback |
| `strudel_save_pattern` | Save current pattern to file |
| `strudel_load_pattern` | Load saved pattern |
| `strudel_list_patterns` | List all saved patterns |
| `strudel_get_current` | Get current pattern state |

---

## Architecture

```
┌─────────────────┐
│   Claude Code   │  Natural language input
└────────┬────────┘
         │ MCP Protocol
         ▼
┌─────────────────────────┐
│  Strudel MCP Server     │  Code generation
│  (Node.js)              │  State management
└────────┬────────────────┘
         │ Puppeteer
         ▼
┌─────────────────────────┐
│  Headless Chromium      │  Pattern execution
│  https://strudel.cc     │  Audio playback
└─────────────────────────┘
         │
         ▼
    🔊 Audio Output
```

---

## Project Status

**Current Phase**: Planning / PRD Complete

- ✅ Product Requirements Document (PRD) complete
- ✅ Repository structure created
- ⏳ Implementation in progress
- ⏳ Documentation in progress

See [PRD](docs/PRD.md) for complete product requirements.

---

## Documentation

- [Setup Guide](docs/SETUP.md) - Installation and configuration
- [Usage Guide](docs/USAGE.md) - Usage examples and workflows
- [API Reference](docs/API.md) - MCP tool reference
- [PRD](docs/PRD.md) - Product Requirements Document

---

## Requirements

- Node.js 18 or higher
- macOS / Linux (Windows with WSL)
- 2GB RAM minimum
- Audio output device
- Internet connection (for strudel.cc)

---

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run tests
npm test

# Lint code
npm run lint
```

---

## Technology Stack

- **Runtime**: Node.js 18+
- **MCP SDK**: `@modelcontextprotocol/sdk`
- **Browser Automation**: Puppeteer
- **Audio Platform**: Strudel.cc (Web Audio API)
- **Pattern Storage**: File system (`.strudel` files)

---

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## License

MIT License - see [LICENSE](LICENSE) file for details

---

## Credits

- **Strudel**: Created by Felix Roos and the TidalCycles community
- **TidalCycles**: Original pattern language by Alex McLean
- **MCP**: Model Context Protocol by Anthropic

---

## Links

- [Strudel Website](https://strudel.cc)
- [Strudel Repository](https://codeberg.org/uzu/strudel)
- [TidalCycles](https://tidalcycles.org)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [Claude Code](https://claude.ai)

---

**Made with ❤️ for the live coding community**
