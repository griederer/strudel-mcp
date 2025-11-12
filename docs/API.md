# API Reference - Strudel MCP

Complete reference for all MCP tools provided by Strudel MCP server.

---

## Tool Overview

Strudel MCP exposes 9 tools for controlling Strudel live coding from Claude Code:

| Tool | Category | Description |
|------|----------|-------------|
| `strudel_create` | Creation | Create new pattern from description |
| `strudel_modify` | Modification | Modify active pattern |
| `strudel_set_tempo` | Control | Set global tempo (BPM) |
| `strudel_stop` | Control | Stop playback |
| `strudel_start` | Control | Resume playback |
| `strudel_save_pattern` | Persistence | Save pattern to file |
| `strudel_load_pattern` | Persistence | Load pattern from file |
| `strudel_list_patterns` | Persistence | List all saved patterns |
| `strudel_get_current` | State | Get current pattern info |

---

## Tools

### strudel_create

Create a new Strudel pattern from natural language description.

**Parameters**:
- `description` (string, required): Natural language description of the pattern
- `code` (string, required): Generated Strudel code (Claude generates this)

**Returns**:
```json
{
  "success": true,
  "code": "s(\"bd bd bd bd\")",
  "playing": true,
  "message": "Pattern created and playing: s(\"bd bd bd bd\")"
}
```

**Example Usage** (from Claude Code):
```
User: "Create a 4 on the floor kick"

Claude internally:
- Interprets request
- Generates Strudel code: s("bd bd bd bd")
- Calls: strudel_create({
    description: "4 on the floor kick",
    code: "s(\"bd bd bd bd\")"
  })

Result: Pattern plays immediately
```

**Errors**:
- Browser connection failed
- Invalid Strudel syntax
- Execution timeout

---

### strudel_modify

Modify the currently active Strudel pattern.

**Parameters**:
- `modification` (string, required): Natural language description of modification
- `code` (string, required): Modified Strudel code (Claude generates this)

**Returns**:
```json
{
  "success": true,
  "code": "s(\"bd bd bd bd\").room(0.5)",
  "playing": true,
  "message": "Pattern modified: ..."
}
```

**Example Usage**:
```
User: "Add reverb to the kick"

Claude:
- Gets current pattern: s("bd bd bd bd")
- Modifies: s("bd bd bd bd").room(0.5).size(0.8)
- Calls: strudel_modify({
    modification: "add reverb",
    code: "s(\"bd bd bd bd\").room(0.5).size(0.8)"
  })

Result: Updated pattern plays
```

**Errors**:
- No active pattern to modify
- Invalid syntax in modified code

---

### strudel_set_tempo

Set the global tempo in beats per minute.

**Parameters**:
- `bpm` (number, required): Tempo (20-300 BPM typically)

**Returns**:
```json
{
  "success": true,
  "bpm": 128,
  "cps": 0.533,
  "message": "Tempo set to 128 BPM"
}
```

**Example Usage**:
```
User: "Set tempo to 140 BPM"

Claude: strudel_set_tempo({ bpm: 140 })

Result: All patterns now play at 140 BPM
```

**Notes**:
- BPM → CPS conversion: `cps = bpm / 60 / 4`
- Affects all playing patterns
- Persists until changed

---

### strudel_stop

Stop audio playback.

**Parameters**: None

**Returns**:
```json
{
  "success": true,
  "playing": false,
  "message": "Playback stopped"
}
```

**Example Usage**:
```
User: "Stop the music"

Claude: strudel_stop()

Result: Audio stops, pattern remains loaded
```

---

### strudel_start

Resume audio playback.

**Parameters**: None

**Returns**:
```json
{
  "success": true,
  "playing": true,
  "message": "Playback started"
}
```

**Example Usage**:
```
User: "Resume playback"

Claude: strudel_start()

Result: Previously loaded pattern starts playing
```

---

### strudel_save_pattern

Save the current pattern to a file.

**Parameters**:
- `name` (string, required): Pattern name (no extension)
- `description` (string, optional): Pattern description
- `tags` (array of strings, optional): Tags for categorization

**Returns**:
```json
{
  "success": true,
  "name": "techno-beat-v1",
  "filepath": "/path/to/patterns/techno-beat-v1.strudel",
  "message": "Pattern saved as \"techno-beat-v1\""
}
```

**File Format**:
```
# Pattern Name: techno-beat-v1
# Created: 2025-01-12T10:00:00Z
# Modified: 2025-01-12T10:00:00Z
# BPM: 128
# Description: Classic techno groove
# Tags: techno, drums, groove

s("bd bd bd bd").room(0.5)
```

**Example Usage**:
```
User: "Save this as techno-groove"

Claude: strudel_save_pattern({
  name: "techno-groove",
  description: "Four on the floor techno pattern with reverb",
  tags: ["techno", "kick", "reverb"]
})

Result: File saved to patterns/techno-groove.strudel
```

**Notes**:
- Name is sanitized (lowercase, no spaces)
- Overwrites existing files with same name
- Saves current BPM with pattern

---

### strudel_load_pattern

Load a saved pattern from file and start playing it.

**Parameters**:
- `name` (string, required): Pattern name (without .strudel extension)

**Returns**:
```json
{
  "success": true,
  "name": "techno-groove",
  "code": "s(\"bd bd bd bd\").room(0.5)",
  "bpm": 128,
  "description": "Classic techno groove",
  "tags": ["techno", "drums"],
  "playing": true,
  "message": "Pattern \"techno-groove\" loaded and playing"
}
```

**Example Usage**:
```
User: "Load my pattern called techno-groove"

Claude: strudel_load_pattern({ name: "techno-groove" })

Result:
- Pattern loaded from file
- BPM set to saved value
- Audio starts playing immediately
```

**Errors**:
- Pattern not found
- File read error
- Invalid pattern syntax

---

### strudel_list_patterns

List all saved patterns with metadata.

**Parameters**: None

**Returns**:
```json
{
  "success": true,
  "count": 3,
  "patterns": [
    {
      "filename": "techno-groove.strudel",
      "name": "techno-groove",
      "created": "2025-01-12T10:00:00Z",
      "modified": "2025-01-12T11:30:00Z",
      "bpm": 128,
      "description": "Classic techno groove",
      "tags": ["techno", "drums"]
    },
    ...
  ],
  "message": "Found 3 saved patterns"
}
```

**Example Usage**:
```
User: "Show me my saved patterns"

Claude: strudel_list_patterns()

Result: Displays formatted list of all patterns
```

**Notes**:
- Sorted by modification date (newest first)
- Includes metadata from file headers
- Empty list if no patterns saved

---

### strudel_get_current

Get current pattern state (code, BPM, playing status).

**Parameters**: None

**Returns**:
```json
{
  "success": true,
  "code": "s(\"bd bd bd bd\").room(0.5)",
  "bpm": 128,
  "playing": true,
  "lastModified": "2025-01-12T10:30:00Z"
}
```

**Example Usage**:
```
User: "What's currently playing?"

Claude: strudel_get_current()

Result: Shows current pattern info
```

**Notes**:
- Returns empty code if no pattern loaded
- BPM shows last set value
- lastModified tracks state changes

---

## Error Handling

All tools return errors in this format:

```json
{
  "content": [{
    "type": "text",
    "text": "❌ Error: [error message]\n\nPlease try again..."
  }],
  "isError": true
}
```

**Common Errors**:
- Browser connection failed → Restart MCP server
- Pattern not found → Check pattern name spelling
- Invalid syntax → Check generated Strudel code
- Timeout → Browser may be unresponsive

---

## State Management

The MCP server maintains internal state:

```javascript
{
  currentCode: string,      // Active pattern code
  currentBpm: number,        // Current tempo
  isPlaying: boolean,        // Playback state
  history: string[],         // Code history (last 50)
  lastModified: string       // ISO timestamp
}
```

**State Updates**:
- `strudel_create` → Sets new code, starts playback
- `strudel_modify` → Updates code, adds to history
- `strudel_set_tempo` → Updates BPM
- `strudel_stop/start` → Updates playing state
- `strudel_load_pattern` → Replaces entire state

---

## Integration with Claude Code

### How Claude Uses These Tools

1. **User gives natural language input**
   ```
   "Create a techno kick with reverb"
   ```

2. **Claude interprets and generates Strudel code**
   ```javascript
   s("bd bd bd bd").room(0.5).size(0.8)
   ```

3. **Claude calls appropriate MCP tool**
   ```javascript
   strudel_create({
     description: "techno kick with reverb",
     code: "s(\"bd bd bd bd\").room(0.5).size(0.8)"
   })
   ```

4. **MCP server executes via Puppeteer**
   - Injects code into strudel.cc
   - Simulates Ctrl+Enter
   - Returns result

5. **User hears audio immediately**

### Claude's Role

Claude is responsible for:
- ✅ Interpreting natural language
- ✅ Generating valid Strudel syntax
- ✅ Deciding which tool to call
- ✅ Passing correct parameters

MCP server is responsible for:
- ✅ Browser automation
- ✅ Code execution
- ✅ State management
- ✅ File I/O

---

## Strudel Syntax Reference

**Common Patterns**:
- `s("bd")` - Bass drum
- `s("sd")` - Snare drum
- `s("hh")` - Hi-hat
- `note("c3")` - MIDI note
- `stack(p1, p2)` - Layer patterns
- `.room(0.5)` - Reverb
- `.delay(0.3)` - Delay
- `.lpf(800)` - Low-pass filter
- `.fast(2)` - Double speed
- `.slow(2)` - Half speed

See [Strudel Documentation](https://strudel.cc/learn) for complete syntax.

---

## Performance Considerations

**Latency**:
- Pattern creation: ~500-1000ms
- Pattern modification: ~500ms
- Tempo change: ~200ms
- Stop/Start: ~200ms

**Browser Resources**:
- Memory: ~200-300MB (Chromium)
- CPU: Low when idle, spikes during playback

**Limitations**:
- One browser instance per MCP server
- Pattern complexity limited by Web Audio API
- No parallel pattern execution

---

## Debugging

**Enable Debug Mode**:
```bash
DEBUG=true node src/index.js
```

**Debug Output**:
- Browser lifecycle events
- Pattern execution logs
- State changes
- Error details

**Common Issues**:
- "Editor not found" → strudel.cc not fully loaded
- "Pattern execution failed" → Syntax error in code
- "Browser disconnected" → Chromium crashed, will auto-restart

---

## Advanced Usage

### Custom Strudel URL

```bash
STRUDEL_URL=https://strudel.cc node src/index.js
```

### Non-Headless Mode (for debugging)

```bash
HEADLESS=false node src/index.js
```

### Custom Patterns Directory

Edit `src/tools/persistence.js`:
```javascript
const PATTERNS_DIR = '/custom/path/to/patterns';
```

---

## Future API Extensions

Planned tools (not yet implemented):
- `strudel_undo` - Undo last change
- `strudel_export_audio` - Record to WAV/MP3
- `strudel_import_samples` - Add custom samples
- `strudel_analyze_pattern` - Pattern analysis/suggestions

---

**For implementation details, see source code in `src/` directory.**
