"use client";

import { useEffect, useRef } from "react";
import Pin from "./Pin";
import { NOTE_W, PAPERS, type Note } from "@/lib/board";

type Props = {
  note: Note;
  dragging: boolean;
  editing: boolean;
  onPointerDown: (e: React.PointerEvent<HTMLDivElement>, note: Note) => void;
  onStartEdit: (id: string) => void;
  onStopEdit: () => void;
  onChange: (id: string, text: string) => void;
  onRemove: (id: string) => void;
};

export default function StickyNote({
  note,
  dragging,
  editing,
  onPointerDown,
  onStartEdit,
  onStopEdit,
  onChange,
  onRemove,
}: Props) {
  const paper = PAPERS[note.paper];
  const textarea = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing) {
      const el = textarea.current;
      el?.focus();
      el?.setSelectionRange(el.value.length, el.value.length);
    }
  }, [editing]);

  return (
    <div
      className="note absolute select-none"
      data-dragging={dragging}
      style={{
        left: 0,
        top: 0,
        width: NOTE_W,
        zIndex: note.z + (dragging ? 1000 : 0),
        transform: `translate3d(${note.x}px, ${note.y}px, 0) rotate(${note.rotation}deg)`,
        cursor: editing ? "text" : dragging ? "grabbing" : "grab",
        background: `linear-gradient(165deg, ${paper.base} 0%, ${paper.base} 72%, ${paper.fold} 100%)`,
        color: paper.ink,
      }}
      onPointerDown={(e) => onPointerDown(e, note)}
      onDoubleClick={() => note.kind === "text" && onStartEdit(note.id)}
    >
      <Pin kind={note.pin} tilt={note.rotation * -0.6} />

      {/* paper grain + a soft crease of hallway light across the sheet */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(115deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 42%), linear-gradient(0deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0) 30%)",
        }}
      />

      <button
        type="button"
        data-no-drag
        aria-label="Take note off the board"
        onClick={() => onRemove(note.id)}
        className="absolute right-1 top-1 z-10 h-6 w-6 rounded-full text-sm leading-none opacity-0 transition hover:bg-black/10 focus-visible:opacity-100 group-hover:opacity-100 [.note:hover_&]:opacity-70"
        style={{ color: paper.ink }}
      >
        ✕
      </button>

      {note.kind === "image" ? (
        <div className="p-2 pt-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={note.src}
            alt={note.text || "Pinned image"}
            draggable={false}
            className="pointer-events-none block w-full rounded-[2px] object-cover"
            style={{ maxHeight: 220 }}
          />
        </div>
      ) : editing ? (
        <textarea
          ref={textarea}
          data-no-drag
          value={note.text}
          onChange={(e) => onChange(note.id, e.target.value)}
          onBlur={onStopEdit}
          onKeyDown={(e) => {
            if (e.key === "Escape") onStopEdit();
            e.stopPropagation();
          }}
          className="note-ink block h-[150px] w-full resize-none bg-transparent px-4 pb-4 pt-7 outline-none"
          style={{ color: paper.ink }}
        />
      ) : (
        <p className="note-ink min-h-[150px] whitespace-pre-wrap break-words px-4 pb-4 pt-7">
          {note.text || (
            <span className="opacity-45">Double-click to write…</span>
          )}
        </p>
      )}
    </div>
  );
}
