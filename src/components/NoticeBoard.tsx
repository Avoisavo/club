"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import BoardDecor from "./BoardDecor";
import StickyNote from "./StickyNote";
import {
  NOTE_H,
  NOTE_MAX,
  NOTE_MIN,
  NOTE_W,
  PAPERS,
  PAPER_KEYS,
  PIN_KEYS,
  makeId,
  type Note,
  type PaperKey,
} from "@/lib/board";
import {
  getServerSnapshot,
  getSnapshot,
  setNotes,
  subscribe,
} from "@/lib/store";

type Drag = { id: string; dx: number; dy: number; moved: boolean } | null;

type Resize = {
  id: string;
  startX: number;
  startY: number;
  w0: number;
  h0: number;
  /** note tilt in radians, so the grip follows the corner it is drawn on */
  angle: number;
} | null;

const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));

export default function NoticeBoard() {
  const boardRef = useRef<HTMLDivElement>(null);
  const { loaded: ready, notes } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const [paper, setPaper] = useState<PaperKey>("lemon");
  const [editing, setEditing] = useState<string | null>(null);
  const [drag, setDrag] = useState<Drag>(null);
  const [resize, setResize] = useState<Resize>(null);
  const [dropping, setDropping] = useState(false);

  const topZ = useMemo(
    () => notes.reduce((m, n) => Math.max(m, n.z), 0),
    [notes],
  );

  /* ---- placing new paper --------------------------------------------- */

  const freeSpot = useCallback(() => {
    const board = boardRef.current;
    const w = board?.clientWidth ?? 900;
    const h = board?.clientHeight ?? 600;
    const maxX = Math.max(0, w - NOTE_W - 24);
    const maxY = Math.max(0, h - NOTE_H - 24);
    const cols = Math.max(1, Math.floor(maxX / (NOTE_W + 40)) + 1);

    for (let i = 0; i < 60; i++) {
      const x = clamp(24 + (i % cols) * (NOTE_W + 40), 24, maxX);
      const y = clamp(
        24 + Math.floor(i / cols) * (NOTE_H + 40),
        24,
        maxY || 24,
      );
      const taken = notes.some(
        (n) => Math.abs(n.x - x) < 40 && Math.abs(n.y - y) < 40,
      );
      if (!taken) return { x, y };
    }
    return {
      x: clamp(24 + Math.random() * maxX, 24, maxX),
      y: clamp(24 + Math.random() * maxY, 24, maxY || 24),
    };
  }, [notes]);

  const addNote = useCallback(
    (patch: Partial<Note> = {}) => {
      const id = makeId();
      const { x, y } = freeSpot();
      setNotes((prev) => {
        const z = prev.reduce((m, n) => Math.max(m, n.z), 0) + 1;
        return [
          ...prev,
          {
            id,
            kind: "text",
            text: "",
            paper,
            pin: PIN_KEYS[Math.floor(Math.random() * PIN_KEYS.length)],
            x,
            y,
            w: NOTE_W,
            h: NOTE_H,
            rotation: (Math.random() - 0.5) * 9,
            z,
            ...patch,
          },
        ];
      });
      return id;
    },
    [freeSpot, paper],
  );

  /* ---- paste & drop --------------------------------------------------- */

  const pinImage = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = () =>
        addNote({ kind: "image", src: String(reader.result), text: file.name });
      reader.readAsDataURL(file);
    },
    [addNote],
  );

  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (editing || target?.closest("[data-no-drag]")) return; // let the textarea have it

      const file = Array.from(e.clipboardData?.items ?? [])
        .find((it) => it.type.startsWith("image/"))
        ?.getAsFile();
      if (file) {
        e.preventDefault();
        pinImage(file);
        return;
      }
      const text = e.clipboardData?.getData("text/plain")?.trim();
      if (text) {
        e.preventDefault();
        addNote({ text });
      }
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [addNote, editing, pinImage]);

  /* ---- dragging -------------------------------------------------------- */

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>, note: Note) => {
      if ((e.target as HTMLElement).closest("[data-no-drag]")) return;
      if (editing && editing !== note.id) setEditing(null);
      const rect = boardRef.current?.getBoundingClientRect();
      if (!rect) return;
      setNotes((prev) =>
        prev.map((n) =>
          n.id === note.id ? { ...n, z: topZ + 1 } : n,
        ),
      );
      setDrag({
        id: note.id,
        dx: e.clientX - rect.left - note.x,
        dy: e.clientY - rect.top - note.y,
        moved: false,
      });
    },
    [editing, topZ],
  );

  useEffect(() => {
    if (!drag) return;
    const move = (e: PointerEvent) => {
      const rect = boardRef.current?.getBoundingClientRect();
      if (!rect) return;
      setNotes((prev) =>
        prev.map((n) => {
          if (n.id !== drag.id) return n;
          const w = n.w ?? NOTE_W;
          return {
            ...n,
            x: clamp(e.clientX - rect.left - drag.dx, 6, rect.width - w - 6),
            y: clamp(e.clientY - rect.top - drag.dy, 14, rect.height - 90),
          };
        }),
      );
    };
    const up = () => setDrag(null);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [drag]);

  /* ---- resizing --------------------------------------------------------- */

  const onResizeStart = useCallback(
    (e: React.PointerEvent<HTMLElement>, note: Note) => {
      e.stopPropagation();
      setEditing(null);
      setNotes((prev) =>
        prev.map((n) => (n.id === note.id ? { ...n, z: topZ + 1 } : n)),
      );
      setResize({
        id: note.id,
        startX: e.clientX,
        startY: e.clientY,
        w0: note.w ?? NOTE_W,
        h0: note.h ?? NOTE_H,
        angle: (note.rotation * Math.PI) / 180,
      });
    },
    [topZ],
  );

  useEffect(() => {
    if (!resize) return;
    const move = (e: PointerEvent) => {
      const rect = boardRef.current?.getBoundingClientRect();
      const dx = e.clientX - resize.startX;
      const dy = e.clientY - resize.startY;
      // undo the note's tilt so the grip tracks the corner under the cursor
      const cos = Math.cos(resize.angle);
      const sin = Math.sin(resize.angle);
      const gx = dx * cos + dy * sin;
      const gy = -dx * sin + dy * cos;
      setNotes((prev) =>
        prev.map((n) => {
          if (n.id !== resize.id) return n;
          const room = rect ? rect.width - n.x - 6 : NOTE_MAX;
          return {
            ...n,
            w: clamp(resize.w0 + gx, NOTE_MIN, Math.min(NOTE_MAX, room)),
            h: clamp(resize.h0 + gy, NOTE_MIN, NOTE_MAX),
          };
        }),
      );
    };
    const up = () => setResize(null);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [resize]);

  /* ---- note actions ---------------------------------------------------- */

  const changeText = useCallback((id: string, text: string) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, text } : n)));
  }, []);

  const removeNote = useCallback(
    (id: string) => {
      setNotes((prev) => prev.filter((n) => n.id !== id));
      setEditing((cur) => (cur === id ? null : cur));
    },
    [],
  );

  return (
    <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-16 pt-6 sm:px-6">
      <h1 className="sr-only">Club Notice Board</h1>

      {/* ---- toolbar ---- */}
      <div className="mb-4 flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-white/40 bg-white/35 px-4 py-3 shadow-sm backdrop-blur-sm">
        <div className="flex items-center gap-1.5">
          {PAPER_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setPaper(key)}
              aria-label={`${PAPERS[key].label} paper`}
              aria-pressed={paper === key}
              className={`h-7 w-7 rounded-[3px] shadow transition hover:-translate-y-0.5 ${
                paper === key
                  ? "ring-2 ring-[#4a2f16] ring-offset-2 ring-offset-transparent"
                  : ""
              }`}
              style={{
                background: `linear-gradient(160deg, ${PAPERS[key].base}, ${PAPERS[key].fold})`,
              }}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => setEditing(addNote())}
          className="rounded-full bg-[#7b4a24] px-4 py-1.5 text-sm font-medium text-[#fdf3df] shadow transition hover:bg-[#8d5828] active:translate-y-px"
        >
          + Pin a note
        </button>

        <label className="cursor-pointer rounded-full border border-[#7b4a24]/40 px-4 py-1.5 text-sm text-[#5c3a1c] transition hover:bg-white/50">
          Upload paper
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) pinImage(f);
              e.target.value = "";
            }}
          />
        </label>

        <button
          type="button"
          onClick={() => setNotes([])}
          className="rounded-full px-3 py-1.5 text-sm text-[#7a5734] underline-offset-4 transition hover:underline"
        >
          Clear board
        </button>
      </div>

      {/* ---- the board ---- */}
      <div className="board-frame relative mt-10 rounded-[24px] p-7 sm:p-11">
        <BoardDecor />
        <div className="board-rebate rounded-[10px] p-[10px]">
        <div
          ref={boardRef}
          className="cork relative h-[70vh] min-h-[520px] overflow-hidden rounded-[4px]"
          onDragOver={(e) => {
            e.preventDefault();
            setDropping(true);
          }}
          onDragLeave={() => setDropping(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDropping(false);
            const f = e.dataTransfer.files?.[0];
            if (f?.type.startsWith("image/")) pinImage(f);
            else {
              const t = e.dataTransfer.getData("text/plain")?.trim();
              if (t) addNote({ text: t });
            }
          }}
        >
          {ready &&
            notes.map((note) => (
              <StickyNote
                key={note.id}
                note={note}
                dragging={drag?.id === note.id}
                editing={editing === note.id}
                onPointerDown={onPointerDown}
                onResizeStart={onResizeStart}
                onStartEdit={setEditing}
                onStopEdit={() => setEditing(null)}
                onChange={changeText}
                onRemove={removeNote}
              />
            ))}

          {ready && notes.length === 0 && (
            <p className="font-hand pointer-events-none absolute inset-0 flex items-center justify-center text-center text-2xl text-[#e8cfa8]/70">
              Board&apos;s empty — paste something up.
            </p>
          )}

          {dropping && (
            <div className="pointer-events-none absolute inset-2 rounded border-2 border-dashed border-[#ffe6b0]/80" />
          )}
        </div>
        </div>

        {/* the screws holding it to the wall */}
        {[
          "left-3.5 top-3.5",
          "right-3.5 top-3.5",
          "left-3.5 bottom-3.5",
          "right-3.5 bottom-3.5",
        ].map((pos) => (
          <span
            key={pos}
            aria-hidden
            className={`absolute ${pos} h-3.5 w-3.5 rounded-full`}
            style={{
              background:
                "radial-gradient(circle at 34% 30%, #d8c39c 0%, #8d6d47 46%, #3f2c17 100%)",
              boxShadow:
                "0 1px 2px rgba(0,0,0,0.55), inset 0 -1px 1px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,236,200,0.35)",
            }}
          >
            <span
              className="absolute left-1/2 top-1/2 h-[1.5px] w-[9px] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ background: "rgba(38,24,10,0.75)" }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
