import { useState } from "react";

// Equal-tempered tuning (A4 = 440Hz)
const noteFrequencies: Record<string, number> = {
  C3: 130.81, "C#3": 138.59, D3: 146.83, "D#3": 155.56, E3: 164.81,
  F3: 174.61, "F#3": 185.0, G3: 196.0, "G#3": 207.65, A3: 220.0,
  "A#3": 233.08, B3: 246.94,
  C4: 261.63, "C#4": 277.18, D4: 293.66, "D#4": 311.13, E4: 329.63,
  F4: 349.23, "F#4": 369.99, G4: 392.0, "G#4": 415.3, A4: 440.0,
  "A#4": 466.16, B4: 493.88,
  C5: 523.25, "C#5": 554.37, D5: 587.33, "D#5": 622.25, E5: 659.25,
  F5: 698.46, "F#5": 739.99, G5: 783.99, "G#5": 830.61, A5: 880.0,
  "A#5": 932.33, B5: 987.77,
};

const semitones = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const roots = [...semitones];

// chord suffixes under each roman numeral
const chordTypes = ["", "min", "7", "maj7", "m7", "dim", "aug", "sus2", "sus4", "9"];

// roman numeral mappings
const romanNumeralsMajor = ["I", "ii", "iii", "IV", "V", "vi", "vii°"];
const romanNumeralsMinor = ["i", "ii°", "III", "iv", "v", "VI", "VII"];

// scale degrees for major and natural minor
const majorScale = [0, 2, 4, 5, 7, 9, 11];
const minorScale = [0, 2, 3, 5, 7, 8, 10];

// chord voicings
const chordVoicings: Record<string, string[]> = {};

function buildChord(root: string, quality: string): string[] {
  const intervals: Record<string, number[]> = {
    "": [0, 4, 7],
    min: [0, 3, 7],
    "7": [0, 4, 7, 10],
    maj7: [0, 4, 7, 11],
    m7: [0, 3, 7, 10],
    dim: [0, 3, 6],
    aug: [0, 4, 8],
    sus2: [0, 2, 7],
    sus4: [0, 5, 7],
    "9": [0, 4, 7, 10, 14],
  };

  const rootIndex = semitones.indexOf(root);
  const steps = intervals[quality];
  if (!steps) return [];

  return steps.map((s) => {
    const pitchIndex = rootIndex + s;
    const octaveShift = Math.floor(pitchIndex / 12);
    const noteName = semitones[pitchIndex % 12];
    const octave = 3 + octaveShift;
    return noteName + octave;
  });
}

roots.forEach((root) => {
  chordTypes.forEach((suffix) => {
    const notes = buildChord(root, suffix);
    if (notes.length) {
      chordVoicings[root + (suffix === "" ? "" : suffix)] = notes;
    }
  });
});

// Shared audio context to avoid performance issues
let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
}

// play chord
function playChord(notes: string[]) {
  try {
    const audioCtx = getAudioContext();

    // Resume context if suspended (required after user interaction in some browsers)
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;

    // Calculate per-note volume to prevent clipping
    const noteVolume = Math.min(0.25, 0.8 / notes.length);

  notes.forEach((note) => {
    const freq = noteFrequencies[note];
    if (!freq) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(noteVolume, now + 0.05);
    gain.gain.setValueAtTime(noteVolume, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

    osc.connect(gain).connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 2);
  });

  } catch (error) {
    console.error('Audio error:', error);
  }
}

export default function App() {
  const [activeChord, setActiveChord] = useState<string | null>(null);
  const [selectedKey, setSelectedKey] = useState<string>("C");
  const [mode, setMode] = useState<"major" | "minor">("major");

  const handlePlay = (chord: string) => {
    setActiveChord(chord);
    playChord(chordVoicings[chord]);
    setTimeout(() => setActiveChord(null), 250);
  };

  // figure out scale degrees for selected key & mode
  const keyIndex = semitones.indexOf(selectedKey);
  const scale = mode === "major" ? majorScale : minorScale;
  const romanNumerals = mode === "major" ? romanNumeralsMajor : romanNumeralsMinor;

  const degreeRoots = scale.map((offset) => semitones[(keyIndex + offset) % 12]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-6">Chord Player</h1>

      {/* Key and mode selectors */}
      <div className="flex space-x-4 mb-6">
        <select
          value={selectedKey}
          onChange={(e) => setSelectedKey(e.target.value)}
          className="px-3 py-2 rounded bg-gray-800 border border-gray-600"
        >
          {roots.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as "major" | "minor")}
          className="px-3 py-2 rounded bg-gray-800 border border-gray-600"
        >
          <option value="major">Major</option>
          <option value="minor">Minor</option>
        </select>
      </div>

      {/* Chords grouped by roman numerals */}
      <div className="space-y-6 w-full max-w-3xl">
        {degreeRoots.map((root, i) => (
          <div key={i}>
            <h2 className="text-lg font-semibold mb-2 text-gray-300">
              {romanNumerals[i]}
            </h2>
            <div className="flex flex-wrap gap-2">
              {chordTypes.map((suffix) => {
                const chordName = root + (suffix === "" ? "" : suffix);
                if (!chordVoicings[chordName]) return null;
                return (
                  <button
                    key={chordName}
                    onClick={() => handlePlay(chordName)}
                    onTouchStart={() => handlePlay(chordName)}
                    className={`px-3 py-2 rounded-lg text-base font-semibold transition ${
                      activeChord === chordName
                        ? "bg-blue-500 scale-95"
                        : "bg-gray-700 hover:bg-gray-600"
                    }`}
                  >
                    {chordName}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
