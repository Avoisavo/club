export type PaperKey = "lemon" | "mint" | "lilac" | "rose" | "sky" | "sun";
export type PinKey = "red" | "blue" | "silver" | "olive" | "amber";

export type Note = {
  id: string;
  kind: "text" | "image";
  text: string;
  src?: string;
  paper: PaperKey;
  pin: PinKey;
  x: number;
  y: number;
  /** undefined on notes pinned before sizes were adjustable */
  w?: number;
  h?: number;
  rotation: number;
  z: number;
};

export const PAPERS: Record<
  PaperKey,
  { label: string; base: string; fold: string; ink: string }
> = {
  lemon: { label: "Lemon", base: "#e9ec7a", fold: "#d3d65f", ink: "#4a4a17" },
  mint: { label: "Mint", base: "#8ee08a", fold: "#74c771", ink: "#1f4a21" },
  lilac: { label: "Lilac", base: "#e2bce8", fold: "#cba2d2", ink: "#4b2352" },
  rose: { label: "Rose", base: "#f5a6d8", fold: "#dd8cc0", ink: "#571b41" },
  sky: { label: "Sky", base: "#a9daf3", fold: "#8ec2de", ink: "#173e52" },
  sun: { label: "Sun", base: "#f7dd52", fold: "#e0c53c", ink: "#4d3c05" },
};

export const PAPER_KEYS = Object.keys(PAPERS) as PaperKey[];

export const PINS: Record<PinKey, { head: string; shine: string }> = {
  red: { head: "#d93b3b", shine: "#ff9a8f" },
  blue: { head: "#3468c4", shine: "#8fb6ff" },
  silver: { head: "#b9bfc7", shine: "#ffffff" },
  olive: { head: "#5f8a3a", shine: "#b7e08b" },
  amber: { head: "#e0902a", shine: "#ffd48a" },
};

export const PIN_KEYS = Object.keys(PINS) as PinKey[];

/** Deterministic pseudo-random so SSR and the client agree. */
export function seeded(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    s >>>= 0;
    return s / 4294967296;
  };
}

export function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

export const NOTE_W = 190;
export const NOTE_H = 190;
export const NOTE_MIN = 120;
export const NOTE_MAX = 520;

/** Handwriting scales with the paper so a big note isn't mostly margin. */
export function inkSize(width: number) {
  return Math.round(Math.max(13, Math.min(34, width * 0.105)));
}

export const STORAGE_KEY = "club.noticeboard.v1";

export function defaultNotes(): Note[] {
  const seats: Array<[number, number]> = [
    [80, 60],
    [330, 40],
    [590, 74],
    [140, 300],
    [400, 286],
    [660, 318],
  ];
  const copy = [
    "Assembly moved to\nHall B — 8:15am",
    "Chess club sign-up\nsheet is on my door",
    "Lost: blue water\nbottle, room 204",
    "Paste anything here\n(⌘V / Ctrl+V)",
    "Drag me around.\nDouble-click to edit.",
    "Bake sale Friday —\nbring coins!",
  ];
  const rand = seeded(20260826);
  return seats.map(([x, y], i) => ({
    id: `seed-${i}`,
    kind: "text" as const,
    text: copy[i],
    paper: PAPER_KEYS[i % PAPER_KEYS.length],
    pin: PIN_KEYS[i % PIN_KEYS.length],
    x,
    y,
    w: NOTE_W + i * 26,
    h: NOTE_H + (i % 3) * 30,
    rotation: (rand() - 0.5) * 8,
    z: i + 1,
  }));
}
