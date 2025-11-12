# PRD: Strudel AI Music Director MCP

**Project Number**: 0001
**Project Name**: Strudel AI Music Director MCP
**Created**: 2025-01-12
**Author**: Gonzalo Riederer
**Status**: Planning Phase

---

## 1. Introduction / Overview

The **Strudel AI Music Director MCP** is a Model Context Protocol (MCP) server that enables natural language control of the Strudel live coding music environment from Claude Code. Users can create, modify, and control algorithmic music patterns by describing their intentions in plain language, while the AI interprets and translates these into Strudel pattern code that executes in real-time.

This project bridges the gap between human musical intent and the technical syntax of Strudel's pattern language, making live coding accessible through conversation.

---

## 2. Goals

1. **Enable natural language music creation**: Users can describe musical ideas ("create a 4 on the floor kick") without knowing Strudel syntax
2. **Provide real-time audio feedback**: Patterns execute immediately and produce audible results
3. **Support iterative composition**: Users can modify existing patterns incrementally ("add reverb to the kick", "change tempo to 140 BPM")
4. **Persist musical work**: Patterns can be saved, loaded, and resumed across sessions
5. **Integrate seamlessly with Claude Code**: Works as a standard MCP tool accessible from the Claude Code CLI

### Measurable Success Metrics

- User can create a basic beat (kick + snare + hi-hat) in under 2 minutes using natural language
- Pattern modifications execute within 1 second of user request
- Saved patterns can be loaded and played without errors
- Zero Strudel syntax knowledge required from user
- Audio output latency < 100ms from pattern execution

---

## 3. User Stories

### Primary User Persona: Gonzalo (Music Creator)
**Background**: Interested in algorithmic music and live coding but doesn't want to learn complex syntax. Prefers iterative creative process through conversation.

**Core User Stories**:

1. **As a user**, I want to create drum patterns using natural language so I can quickly experiment with rhythmic ideas
   - "Create a classic 4 on the floor kick"
   - "Add a snare on beats 2 and 4"

2. **As a user**, I want to modify existing patterns so I can refine my music iteratively
   - "Add reverb to the kick"
   - "Make the hi-hats twice as fast"
   - "Change the tempo to 140 BPM"

3. **As a user**, I want to add melodic elements so I can create complete musical compositions
   - "Create a bass line in C minor that complements the kick"
   - "Add a chord progression using a saw wave"

4. **As a user**, I want to save my patterns so I can return to them later
   - "Save this pattern as 'techno-beat-v1'"
   - "Load my pattern called 'techno-beat-v1'"

5. **As a user**, I want to control global parameters so I can adjust the overall feel
   - "Set tempo to 128 BPM"
   - "Lower the master volume"

6. **As a user**, I want immediate audio feedback so I can hear results instantly
   - Patterns start playing automatically upon creation
   - Modifications apply in real-time

### Secondary User Stories

7. **As a user**, I want to layer multiple instruments so I can build complex arrangements
   - "Stack the kick with a bass drum sample"
   - "Play the synth and bass simultaneously"

8. **As a user**, I want to browse my saved patterns so I can find previous work
   - "List all my saved patterns"
   - "Show me patterns I created last week"

9. **As a user**, I want to stop/start playback so I can control when audio plays
   - "Stop the music"
   - "Resume playback"

---

## 4. Functional Requirements

### FR-1: Natural Language Pattern Creation
The system SHALL interpret natural language descriptions and generate valid Strudel pattern code.

**Examples**:
- Input: "Create a kick on every beat"
- Output: `s("bd bd bd bd")`

- Input: "Create a bass line in C minor"
- Output: `note("c2 eb2 g2 bb2").s("sawtooth").lpf(400)`

### FR-2: Real-Time Pattern Execution
The system SHALL execute generated patterns immediately and produce audible audio output.

**Technical Requirements**:
- Audio starts within 1 second of pattern creation
- Uses Strudel's default sample library
- Runs in headless browser environment via Puppeteer

### FR-3: Incremental Pattern Modification
The system SHALL maintain current pattern state and apply modifications to existing patterns.

**Examples**:
- If current pattern is `s("bd bd bd bd")`
- User says: "add reverb"
- New pattern: `s("bd bd bd bd").room(0.5).size(0.8)`

**Requirements**:
- Maintain pattern history (undo capability)
- Support additive operations (add instrument, add effect)
- Support replacement operations (change instrument, change note)
- Support parameter adjustments (tempo, volume, pitch)

### FR-4: Pattern Persistence
The system SHALL save and load patterns to/from the file system.

**File Format**: Plain text `.strudel` files containing:
```
# Pattern Name: techno-beat-v1
# Created: 2025-01-12 14:30:00
# BPM: 128

stack(
  s("bd bd bd bd").room(0.5),
  s("~ sd ~ sd"),
  s("hh*8").gain(0.6)
)
```

**Storage Location**: `{repo}/patterns/` directory in GitHub repository

**Operations**:
- `save_pattern(name, code, metadata)` → Save pattern to file
- `load_pattern(name)` → Load pattern from file and execute
- `list_patterns()` → Return list of available patterns
- `delete_pattern(name)` → Remove pattern file

### FR-5: Global Parameter Control
The system SHALL control global playback parameters.

**Parameters**:
- **Tempo (BPM)**: `setcps(bpm / 60 / 4)` - cycles per second conversion
- **Master Volume**: `.gain(level)` applied to all patterns
- **Playback State**: Start/stop/pause

**Natural Language Examples**:
- "Set tempo to 140 BPM"
- "Make it quieter" → reduce gain by 20%
- "Stop the music"

### FR-6: MCP Tool Interface
The system SHALL expose the following MCP tools:

1. **`strudel_create`**
   - Input: `{ description: string }`
   - Output: `{ code: string, playing: boolean, audio_url?: string }`
   - Creates new pattern from natural language

2. **`strudel_modify`**
   - Input: `{ modification: string }`
   - Output: `{ code: string, playing: boolean }`
   - Modifies current active pattern

3. **`strudel_set_tempo`**
   - Input: `{ bpm: number }`
   - Output: `{ bpm: number, cps: number }`
   - Sets global tempo

4. **`strudel_stop`**
   - Output: `{ status: "stopped" }`
   - Stops all audio playback

5. **`strudel_start`**
   - Output: `{ status: "playing" }`
   - Resumes audio playback

6. **`strudel_save_pattern`**
   - Input: `{ name: string, description?: string }`
   - Output: `{ saved: boolean, file_path: string }`
   - Saves current pattern to file

7. **`strudel_load_pattern`**
   - Input: `{ name: string }`
   - Output: `{ code: string, playing: boolean }`
   - Loads and plays saved pattern

8. **`strudel_list_patterns`**
   - Output: `{ patterns: Array<{ name, created, description }> }`
   - Lists all saved patterns

9. **`strudel_get_current`**
   - Output: `{ code: string, bpm: number, playing: boolean }`
   - Returns current pattern state

### FR-7: Code Generation Intelligence
The system SHALL leverage Claude's understanding of Strudel syntax to generate appropriate code.

**Requirements**:
- Use Strudel mini notation for rhythm patterns
- Apply appropriate effects based on musical context
- Select suitable synthesizer/sample sounds
- Handle musical scales and chord progressions correctly
- Generate syntactically valid Strudel code

**Quality Standards**:
- Generated code must execute without errors
- Patterns should sound musically coherent
- Effects should be applied with sensible default values

---

## 5. Non-Goals (Out of Scope for v1)

The following features are explicitly **NOT** included in the initial version:

1. **Audio Analysis**: No automatic detection or transcription of playing audio
2. **Audio Export**: No WAV/MP3 recording/export functionality (future v2)
3. **DAW Integration**: No MIDI sync or Ableton Link support
4. **Visual Editor**: No GUI or visual pattern editor
5. **Collaboration**: No multi-user or network features
6. **Custom Samples**: No upload/management of user audio samples (uses Strudel defaults only)
7. **Advanced Synthesis**: No custom synthesizer programming or Csound integration
8. **Performance Mode**: No setlist or live performance management features
9. **Mobile Support**: Desktop/laptop only (no mobile devices)
10. **Offline Mode**: Requires internet connection for Strudel web resources

---

## 6. Design Considerations

### Architecture Overview

```
┌─────────────────┐
│   Claude Code   │
│   (Terminal)    │
└────────┬────────┘
         │ MCP Protocol
         │ (stdio)
         ▼
┌─────────────────────────┐
│  Strudel MCP Server     │
│  (Node.js)              │
│                         │
│  - NL → Code Generator  │
│  - Pattern State Mgmt   │
│  - File I/O (patterns/) │
└────────┬────────────────┘
         │ Puppeteer
         │ WebSocket
         ▼
┌─────────────────────────┐
│  Headless Chromium      │
│  https://strudel.cc     │
│                         │
│  - Audio Playback       │
│  - Web Audio API        │
│  - Pattern Execution    │
└─────────────────────────┘
         │
         ▼
    🔊 Audio Output
```

### Technology Stack

**MCP Server**:
- **Runtime**: Node.js 18+
- **Language**: JavaScript (ES modules)
- **MCP SDK**: `@modelcontextprotocol/sdk`
- **Browser Automation**: Puppeteer
- **File System**: Node.js `fs/promises`

**Audio Environment**:
- **Platform**: Strudel.cc (web REPL)
- **Audio Engine**: Web Audio API via Strudel's superdough
- **Sample Library**: Strudel's default dough-samples
- **Browser**: Chromium (headless mode with audio)

**Storage**:
- **Pattern Files**: Plain text `.strudel` files
- **Location**: `{repo}/patterns/` directory
- **Format**: Strudel code + metadata comments
- **Version Control**: Git-tracked in GitHub repo

### User Experience Flow

1. **User opens Claude Code terminal**
   ```bash
   claude
   ```

2. **User describes musical intent in natural language**
   ```
   User: "Create a techno kick drum on every beat"
   ```

3. **Claude interprets and uses MCP tool**
   ```javascript
   strudel_create({
     description: "techno kick drum on every beat"
   })
   ```

4. **MCP server generates Strudel code**
   ```javascript
   s("bd bd bd bd")
   ```

5. **Code injected into strudel.cc via Puppeteer**
   - Opens headless browser (if not running)
   - Navigates to strudel.cc
   - Injects code into editor
   - Simulates Ctrl+Enter (play)

6. **Audio plays immediately**
   - User hears the kick drum
   - Pattern loops continuously

7. **User iterates**
   ```
   User: "Add some reverb to that kick"
   ```

   Claude: Uses `strudel_modify`
   ```javascript
   s("bd bd bd bd").room(0.5).size(0.8)
   ```

   Audio updates in real-time.

8. **User saves work**
   ```
   User: "Save this as techno-kick-v1"
   ```

   Claude: Uses `strudel_save_pattern`

   File created: `patterns/techno-kick-v1.strudel`

### Error Handling

**Invalid Code Generation**:
- If generated code has syntax errors, catch exception
- Retry with corrected code
- Inform user if pattern fails after 3 attempts

**Browser Crashes**:
- Detect Puppeteer disconnection
- Automatically restart headless browser
- Resume pattern playback

**File System Errors**:
- Handle missing patterns/ directory (create if needed)
- Handle duplicate pattern names (offer to overwrite)
- Handle filesystem permissions issues

### Security Considerations

**Code Injection**:
- All Strudel code generated by Claude (trusted source)
- No user-provided code execution (only natural language)
- Puppeteer runs in sandboxed headless browser

**File System Access**:
- MCP server only writes to `{repo}/patterns/` directory
- Read-only access to Strudel web resources
- No execution of arbitrary shell commands

**Network**:
- Only connects to strudel.cc (official site)
- No external API calls except Strudel resources
- No data transmission to third parties

---

## 7. Technical Considerations

### Puppeteer Headless Audio

**Challenge**: Headless browsers typically don't produce audio output.

**Solution**: Launch Chromium with audio flags:
```javascript
puppeteer.launch({
  headless: 'new', // New headless mode
  args: [
    '--autoplay-policy=no-user-gesture-required',
    '--enable-features=WebAudioBypassOutputBuffering',
    '--disable-features=AudioServiceOutOfProcess'
  ]
})
```

**Alternative**: Run Puppeteer with `headless: false` but hide window (macOS specific).

### Pattern State Management

**State Structure**:
```javascript
{
  currentCode: string,
  currentBpm: number,
  isPlaying: boolean,
  history: string[], // Code history for undo
  lastModified: Date
}
```

**State Persistence**:
- In-memory during MCP server session
- Saved patterns persist to disk
- No database required

### Natural Language → Code Mapping

**Approach**: Use Claude's reasoning to interpret user intent

**Example Mappings**:

| User Intent | Strudel Code |
|-------------|--------------|
| "kick on every beat" | `s("bd bd bd bd")` |
| "snare on 2 and 4" | `s("~ sd ~ sd")` |
| "fast hi-hats" | `s("hh*8")` |
| "add reverb" | `.room(0.5).size(0.8)` |
| "C minor bass" | `note("c2 eb2 g2 bb2").s("sawtooth")` |
| "slower tempo" | `setcps(0.9)` (multiply current by 0.9) |

**Implementation**: Claude generates code directly in MCP tool response.

### File Format Specification

```
# Pattern Name: {name}
# Created: {ISO 8601 timestamp}
# Modified: {ISO 8601 timestamp}
# BPM: {number}
# Description: {optional user description}
# Tags: {comma-separated tags}

{Strudel pattern code}
```

**Example**:
```
# Pattern Name: techno-groove-v1
# Created: 2025-01-12T14:30:00Z
# Modified: 2025-01-12T15:45:00Z
# BPM: 128
# Description: Dark techno groove with layered drums
# Tags: techno, drums, dark

stack(
  s("bd bd bd bd").room(0.5),
  s("~ sd ~ sd").delay(0.3),
  s("hh*8").gain(0.6),
  note("c2 eb2 g2 bb2").s("sawtooth").lpf(400)
)
```

### Strudel Code Injection Method

**Puppeteer Script**:
```javascript
async function executePattern(page, code) {
  // Navigate to strudel.cc if needed
  if (page.url() !== 'https://strudel.cc') {
    await page.goto('https://strudel.cc', { waitUntil: 'networkidle2' });
  }

  // Wait for CodeMirror editor
  await page.waitForSelector('.cm-editor');

  // Set editor content
  await page.evaluate((code) => {
    // Access Strudel's global API
    window.strudelEditor.setValue(code);
  }, code);

  // Trigger playback (Ctrl+Enter)
  await page.keyboard.down('Control');
  await page.keyboard.press('Enter');
  await page.keyboard.up('Control');

  // Wait for pattern to start
  await page.waitForTimeout(500);
}
```

---

## 8. Success Metrics

### User Experience Metrics

1. **Time to First Sound**: < 5 seconds from user request to audio output
2. **Modification Latency**: < 1 second for pattern changes
3. **Code Generation Accuracy**: > 95% of patterns execute without errors
4. **User Satisfaction**: User reports "easy to use" without knowing Strudel syntax

### Technical Metrics

1. **MCP Response Time**: < 500ms for tool execution
2. **Browser Stability**: < 1 crash per 100 pattern executions
3. **File I/O Success**: 100% success rate for save/load operations
4. **Audio Latency**: < 100ms from pattern execution to sound

### Functional Completeness

- ✅ All 9 MCP tools implemented and working
- ✅ Natural language interpretation functional
- ✅ Pattern persistence working
- ✅ Global parameter control working
- ✅ Integration with Claude Code verified

---

## 9. Open Questions

1. **Browser Performance**: How many simultaneous patterns can run before audio glitches?
   - **Decision needed**: Implement pattern count limit or automatic cleanup

2. **Pattern Naming**: Should pattern names be unique? Overwrite or version?
   - **Recommendation**: Allow duplicates with timestamps, offer overwrite prompt

3. **Audio Output Device**: How to handle multiple audio devices?
   - **Recommendation**: Use system default, let OS handle routing

4. **Strudel Version**: Should we pin a specific Strudel version or use latest?
   - **Recommendation**: Use latest from strudel.cc, document version in pattern files

5. **Error Recovery**: What happens if strudel.cc is down?
   - **Recommendation**: Fall back to local Strudel installation (future enhancement)

6. **Pattern Complexity**: Is there a max pattern size/complexity?
   - **Recommendation**: No artificial limit, let Strudel's engine handle it

---

## 10. Implementation Phases

### Phase 1: Core MCP Server (MVP)
- MCP server setup with stdio transport
- Puppeteer integration with strudel.cc
- `strudel_create` tool (basic patterns)
- `strudel_stop` tool
- Manual testing with Claude Code

### Phase 2: Pattern Modification
- `strudel_modify` tool
- Pattern state management
- `strudel_get_current` tool
- `strudel_set_tempo` tool

### Phase 3: Persistence
- File I/O implementation
- `strudel_save_pattern` tool
- `strudel_load_pattern` tool
- `strudel_list_patterns` tool
- `patterns/` directory structure

### Phase 4: Polish & Documentation
- Error handling refinement
- User documentation
- Claude Code integration guide
- Example pattern library

---

## 11. Dependencies

**External Services**:
- strudel.cc (official Strudel web REPL)
- Chromium browser (via Puppeteer)

**npm Packages**:
- `@modelcontextprotocol/sdk` - MCP protocol implementation
- `puppeteer` - Browser automation
- `puppeteer-extra` - Puppeteer plugins
- `puppeteer-extra-plugin-stealth` - Avoid detection
- `dotenv` (optional) - Configuration management

**System Requirements**:
- Node.js 18 or higher
- macOS / Linux (Windows with WSL)
- 2GB RAM minimum
- Audio output device
- Internet connection

**Development Tools**:
- Git
- GitHub CLI (for repository creation)
- Claude Code CLI
- Text editor (VS Code recommended)

---

## 12. Repository Structure

```
strudel-mcp/
├── README.md              # Project overview and setup
├── package.json           # npm dependencies
├── .gitignore            # Ignore node_modules, etc.
├── .env.example          # Config template
├── src/
│   ├── index.js          # MCP server entry point
│   ├── tools/            # MCP tool implementations
│   │   ├── create.js
│   │   ├── modify.js
│   │   ├── control.js
│   │   └── persistence.js
│   ├── browser.js        # Puppeteer management
│   ├── strudel.js        # Strudel code injection
│   ├── state.js          # Pattern state management
│   └── utils.js          # Helper functions
├── patterns/             # Saved patterns directory
│   ├── .gitkeep
│   └── examples/         # Example patterns
│       ├── techno-kick.strudel
│       └── ambient-pad.strudel
├── test/                 # Tests (future)
└── docs/
    ├── SETUP.md          # Installation guide
    ├── USAGE.md          # Usage examples
    └── API.md            # MCP tool reference
```

---

## Appendix A: Strudel Syntax Quick Reference

**Basic Patterns**:
- `s("bd")` - Play bass drum sample
- `note("c3")` - Play MIDI note C3
- `sound("bd sd")` - Sequence: bd then sd

**Rhythm Notation**:
- `"bd bd bd bd"` - 4 beats
- `"bd*4"` - Repeat 4 times
- `"bd/2"` - Slow down by half
- `"[bd sd]"` - Subdivide
- `"bd?"` - 50% chance
- `"~"` - Rest/silence

**Effects**:
- `.room(n)` - Reverb amount (0-1)
- `.size(n)` - Reverb size (0-1)
- `.delay(n)` - Delay amount (0-1)
- `.gain(n)` - Volume (0-1)
- `.pan(n)` - Stereo position (-1 to 1)
- `.lpf(freq)` - Low-pass filter (Hz)
- `.hpf(freq)` - High-pass filter (Hz)

**Structure**:
- `stack(p1, p2)` - Layer patterns
- `cat(p1, p2)` - Sequence patterns
- `.fast(n)` - Speed up
- `.slow(n)` - Slow down

**Musical**:
- `.scale("C minor")` - Apply scale
- `.chord("Cm7")` - Play chord

---

## Appendix B: Example Interactions

### Example 1: Building a Techno Beat

```
User: "Create a 4 on the floor kick"

Claude: [Uses strudel_create]
Output: Playing: s("bd bd bd bd")
🔊 Audio: Four-on-floor kick plays

---

User: "Add a snare on beats 2 and 4"

Claude: [Uses strudel_modify]
Output: Playing: stack(
  s("bd bd bd bd"),
  s("~ sd ~ sd")
)
🔊 Audio: Kick + snare plays

---

User: "Add fast hi-hats"

Claude: [Uses strudel_modify]
Output: Playing: stack(
  s("bd bd bd bd"),
  s("~ sd ~ sd"),
  s("hh*8").gain(0.6)
)
🔊 Audio: Full beat plays

---

User: "Make it 128 BPM"

Claude: [Uses strudel_set_tempo]
Output: Tempo set to 128 BPM (2.133 cycles/second)
🔊 Audio: Beat speeds up

---

User: "Add some reverb to everything"

Claude: [Uses strudel_modify]
Output: Playing: stack(
  s("bd bd bd bd"),
  s("~ sd ~ sd"),
  s("hh*8").gain(0.6)
).room(0.5).size(0.8)
🔊 Audio: Reverb applied

---

User: "Save this as techno-beat-128"

Claude: [Uses strudel_save_pattern]
Output: Pattern saved to patterns/techno-beat-128.strudel
```

### Example 2: Creating Bass Lines

```
User: "Create a dark bass line in C minor"

Claude: [Uses strudel_create]
Output: Playing: note("c2 eb2 g2 bb2").s("sawtooth").lpf(400)
🔊 Audio: Dark bass plays

---

User: "Make it more aggressive"

Claude: [Uses strudel_modify]
Output: Playing: note("c2 eb2 g2 bb2")
  .s("sawtooth")
  .lpf(800)
  .resonance(8)
  .fast(2)
🔊 Audio: Aggressive bass plays
```

---

**END OF PRD**
