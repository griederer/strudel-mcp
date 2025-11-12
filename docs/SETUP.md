# Setup Guide - Strudel MCP

Complete installation and configuration instructions for Strudel MCP.

---

## Prerequisites

Before installing, ensure you have:

- **Node.js 18+** - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/)
- **Claude Code CLI** - [Installation](https://docs.anthropic.com/claude-code)
- **Audio output device** - Working speakers or headphones
- **Internet connection** - Required for strudel.cc

### Verify Requirements

```bash
# Check Node.js version (should be 18+)
node --version

# Check npm
npm --version

# Check Git
git --version

# Check Claude Code
claude --version
```

---

## Installation

### 1. Clone Repository

```bash
# Clone the repository
git clone https://github.com/griederer/strudel-mcp.git

# Navigate to project directory
cd strudel-mcp
```

### 2. Install Dependencies

```bash
# Install npm packages
npm install

# This will install:
# - @modelcontextprotocol/sdk - MCP protocol implementation
# - puppeteer - Browser automation (includes Chromium)
# - puppeteer-extra - Puppeteer plugins
# - puppeteer-extra-plugin-stealth - Anti-detection
```

**Note**: Puppeteer will download Chromium (~170MB) automatically.

### 3. Configure Environment (Optional)

```bash
# Copy example environment file
cp .env.example .env

# Edit if needed (defaults work for most users)
nano .env
```

**Environment Variables**:
```env
STRUDEL_URL=https://strudel.cc
HEADLESS=true
DEFAULT_BPM=120
PATTERNS_DIR=./patterns
DEBUG=false
```

### 4. Test Installation

```bash
# Run the MCP server directly (for testing)
npm start

# You should see:
# Strudel MCP server running on stdio
```

Press `Ctrl+C` to stop.

---

## Claude Code Integration

### Method 1: Using claude mcp add (Recommended)

```bash
# Get absolute path to project
cd ~/strudel-mcp
STRUDEL_PATH=$(pwd)

# Add to Claude Code MCP config
claude mcp add strudel-mcp \
  --command "node ${STRUDEL_PATH}/src/index.js"
```

### Method 2: Manual Configuration

Edit Claude Code's MCP config file:

```bash
# Open config file
nano ~/.config/claude-code/mcp-config.json
```

Add this entry:

```json
{
  "mcpServers": {
    "strudel-mcp": {
      "command": "node",
      "args": ["/absolute/path/to/strudel-mcp/src/index.js"],
      "env": {}
    }
  }
}
```

**Replace** `/absolute/path/to/` with your actual path.

### Verify Integration

```bash
# Start Claude Code
claude

# Check if Strudel MCP is loaded
# You should see it in the MCP servers list
```

In Claude Code, ask:
```
> "What MCP servers are available?"
```

You should see **strudel-mcp** listed.

---

## Troubleshooting

### Puppeteer Audio Not Working

**Problem**: Pattern executes but no audio plays.

**Solution 1**: Run browser in non-headless mode
```bash
# Edit .env
HEADLESS=false
```

**Solution 2**: Check system audio
- Ensure volume is up
- Check audio output device is selected
- Test with: `afplay /System/Library/Sounds/Glass.aiff` (macOS)

### Chromium Download Fails

**Problem**: `npm install` fails to download Chromium.

**Solution**: Manual Puppeteer install
```bash
# Clear cache
rm -rf node_modules
npm cache clean --force

# Reinstall
npm install

# If still fails, set download host
PUPPETEER_DOWNLOAD_HOST=https://storage.googleapis.com npm install
```

### Port Already in Use

**Problem**: Error about port being in use.

**Solution**: Strudel MCP uses stdio, not ports. If you see this error, another process is interfering. Check for:
```bash
# Find processes using port (if applicable)
lsof -i :3000

# Kill if needed
kill -9 <PID>
```

### MCP Server Not Found in Claude Code

**Problem**: Claude Code doesn't recognize the MCP server.

**Solution 1**: Check config path
```bash
# Verify config exists
cat ~/.config/claude-code/mcp-config.json

# Verify paths are absolute
```

**Solution 2**: Restart Claude Code
```bash
# Exit completely
exit

# Start again
claude
```

### Pattern Doesn't Play

**Problem**: Pattern created but no audio.

**Solution**: Check browser console
```bash
# Run with debug mode
DEBUG=true npm start

# Check logs for errors
```

---

## Updating

```bash
# Navigate to project
cd ~/strudel-mcp

# Pull latest changes
git pull origin main

# Reinstall dependencies
npm install

# Restart Claude Code
```

---

## Uninstalling

```bash
# Remove from Claude Code MCP config
claude mcp remove strudel-mcp

# Delete project directory
rm -rf ~/strudel-mcp
```

---

## Next Steps

- Read [Usage Guide](USAGE.md) for examples
- Check [API Reference](API.md) for tool documentation
- Browse example patterns in `patterns/examples/`

---

## Getting Help

- **GitHub Issues**: [Report bugs](https://github.com/griederer/strudel-mcp/issues)
- **Strudel Discord**: [Join community](https://discord.gg/tidalcycles)
- **Strudel Docs**: [Learn Strudel](https://strudel.cc/learn)
