# Usage Guide - Strudel MCP

Learn how to create music with Strudel MCP using natural language.

---

## Getting Started

### Starting Claude Code

```bash
# Open terminal
claude

# You're ready to create music!
```

### Your First Pattern

```
User: "Create a kick drum on every beat"

Claude: I'll create a 4 on the floor kick pattern for you.
🔊 Playing: s("bd bd bd bd")
```

**That's it!** Music is now playing from your computer.

---

## Basic Workflow

### 1. Create Pattern

Describe what you want in natural language:

```
"Create a techno kick"
"Make a snare drum"
"Create a bass line"
"Add some hi-hats"
```

### 2. Modify Pattern

Add to or change the existing pattern:

```
"Add reverb"
"Make it faster"
"Add a snare on beats 2 and 4"
"Change the tempo to 140 BPM"
```

### 3. Save Your Work

```
"Save this pattern as techno-beat-v1"
"Save as my-groove"
```

### 4. Load Saved Patterns

```
"Load my pattern called techno-beat-v1"
"Load my-groove"
"List my saved patterns"
```

---

## Common Tasks

### Creating Drum Patterns

**Basic Drums**:
```
"Create a kick on every beat"
→ s("bd bd bd bd")

"Add a snare on beats 2 and 4"
→ stack(s("bd bd bd bd"), s("~ sd ~ sd"))

"Add fast hi-hats"
→ stack(s("bd bd bd bd"), s("~ sd ~ sd"), s("hh*8"))
```

**Advanced Drums**:
```
"Create a broken beat pattern"
"Make a trap hi-hat pattern"
"Create a jungle breakbeat"
```

### Creating Melodies

**Bass Lines**:
```
"Create a bass line in C minor"
→ note("c2 eb2 g2 bb2").s("sawtooth").lpf(400)

"Make a dark techno bass"
"Create a funky bass line"
```

**Chords**:
```
"Create a chord progression in C major"
"Add ambient pads"
"Make a house piano chord"
```

**Leads**:
```
"Create a synth melody in D minor"
"Add a lead synth line"
"Make an arpeggiated pattern"
```

### Adding Effects

**Reverb**:
```
"Add reverb"
→ .room(0.5).size(0.8)

"Add more reverb"
→ .room(0.8).size(0.9)

"Less reverb"
→ .room(0.2).size(0.3)
```

**Delay**:
```
"Add delay"
"Add echo to the snare"
"Make a dub delay"
```

**Filters**:
```
"Add a low-pass filter"
"Make it darker" (lowers filter)
"Add a high-pass filter"
```

**Other Effects**:
```
"Add distortion"
"Add chorus"
"Make it louder"
"Make it quieter"
```

### Controlling Tempo

```
"Set tempo to 120 BPM"
"Make it faster" (increases by 10)
"Slow it down" (decreases by 10)
"Double the speed"
"Half the speed"
```

### Playback Control

```
"Stop the music"
"Resume playback"
"Start playing"
```

---

## Example Sessions

### Session 1: Building a Techno Track

```
You: "Create a 4 on the floor kick"
🔊 s("bd bd bd bd")

You: "Add a snare on 2 and 4"
🔊 stack(s("bd bd bd bd"), s("~ sd ~ sd"))

You: "Add fast closed hi-hats"
🔊 stack(s("bd bd bd bd"), s("~ sd ~ sd"), s("hh*8"))

You: "Set tempo to 128 BPM"
🔊 Tempo: 128 BPM

You: "Create a dark bass line in C minor"
🔊 + note("c2 eb2 g2 bb2").s("sawtooth").lpf(400)

You: "Add reverb to the kick and snare"
🔊 Reverb applied

You: "Add a bit of delay to the snare"
🔊 Delay applied

You: "Save this as techno-128-v1"
✓ Saved to patterns/techno-128-v1.strudel
```

### Session 2: Ambient Soundscape

```
You: "Create an ambient pad in C major"
🔊 note("c3 e3 g3 c4").s("triangle").slow(4).room(0.9)

You: "Add a slow arpeggio"
🔊 + note("c4 e4 g4 b4 c5").s("sine").slow(8)

You: "Make it very reverby"
🔊 .room(0.95).size(0.95)

You: "Set tempo to 60 BPM"
🔊 Tempo: 60 BPM

You: "Save as ambient-space"
✓ Saved
```

### Session 3: Modifying Saved Patterns

```
You: "Load techno-128-v1"
🔊 Pattern loaded and playing

You: "Remove the bass line"
🔊 Bass removed

You: "Add a different bass - more aggressive"
🔊 note("c2 eb2 g2 bb2").s("square").lpf(800).resonance(8)

You: "Save as techno-128-v2"
✓ Saved as new version
```

---

## Tips & Tricks

### Musical Descriptions

The more musical your description, the better:

**Good**:
- "Create a dark techno kick with lots of reverb"
- "Make a jazzy hi-hat pattern"
- "Add a dubstep wobble bass"

**Less Good**:
- "Make sound"
- "Do thing"

### Iterative Refinement

Build complexity gradually:

1. Start simple (kick only)
2. Add percussion (snare, hi-hats)
3. Add melodic elements (bass, chords)
4. Refine with effects
5. Adjust tempo and mixing

### Musical Genres

You can reference genres:

```
"Create a techno beat"
"Make a house groove"
"Add a trap hi-hat roll"
"Create a drum and bass breakbeat"
"Make a lo-fi hip hop beat"
```

### Naming Patterns

Use descriptive names for easy recall:

**Good Names**:
- `techno-kick-128-dark`
- `ambient-pad-cmajor`
- `dnb-break-fast`

**Less Good**:
- `pattern1`
- `test`
- `asdf`

---

## Understanding Strudel Code (Optional)

While you don't need to know Strudel syntax, here's what the generated code means:

### Basic Syntax

```javascript
s("bd")              // Play bass drum sample
note("c3")           // Play note C3
s("bd sd")           // Sequence: bd then sd
s("bd*4")            // Repeat bd 4 times
s("~ sd")            // Rest then sd
stack(p1, p2)        // Layer patterns
```

### Effects

```javascript
.room(0.5)           // Reverb amount
.size(0.8)           // Reverb size
.gain(0.8)           // Volume
.lpf(400)            // Low-pass filter
.hpf(200)            // High-pass filter
.delay(0.5)          // Delay amount
```

### Musical

```javascript
note("c3 e3 g3")                    // C major triad
note("c e g").scale("C minor")      // Scale mapping
.fast(2)                            // 2x speed
.slow(2)                            // Half speed
```

---

## Advanced Usage

### Combining Multiple Elements

```
"Create a full beat with kick, snare, hi-hats, and bass"
```

Claude will generate a full `stack()` with all elements.

### Complex Modifications

```
"Make the hi-hats more interesting"
"Add syncopation to the kick"
"Create a drum fill every 4 bars"
```

### Musical Theory

```
"Create a ii-V-I progression in C major"
"Add a minor 7th chord"
"Make it pentatonic"
```

---

## Troubleshooting

### "Nothing is playing"

```
"Is the music playing?"
"What's the current pattern?"
```

Claude will check status and restart if needed.

### "I don't like how it sounds"

Be specific about what to change:

```
"The kick is too loud"
"The bass is too bright"
"Need more high-end"
```

### "I want to start over"

```
"Stop the music"
"Create a new pattern with just a kick"
```

---

## Next Steps

- Experiment with different genres
- Save your favorite patterns
- Build a library of reusable grooves
- Explore the [API Reference](API.md) for technical details

---

## Community

Share your patterns:
- Post on Strudel Discord
- Share GitHub gists of `.strudel` files
- Contribute example patterns to this repo

**Happy live coding!** 🎵
