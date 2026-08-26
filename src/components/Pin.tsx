import { PINS, type PinKey } from "@/lib/board";

/** A little needle pin: metal shaft driven into the cork, glossy head on top. */
export default function Pin({ kind, tilt = 0 }: { kind: PinKey; tilt?: number }) {
  const { head, shine } = PINS[kind];
  return (
    <span
      className="pointer-events-none absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1/2"
      style={{ transform: `translate(-50%, -46%) rotate(${tilt}deg)` }}
      aria-hidden
    >
      {/* shadow the pin casts on the paper */}
      <span
        className="absolute left-1/2 top-[13px] h-[7px] w-[20px] -translate-x-1/2 rounded-full blur-[3px]"
        style={{ background: "rgba(40,20,6,0.42)" }}
      />
      {/* needle */}
      <span
        className="absolute left-1/2 top-[7px] h-[15px] w-[2.5px] -translate-x-1/2 rounded-b-full"
        style={{
          background:
            "linear-gradient(90deg, #6d7178 0%, #eef1f5 40%, #9aa1aa 70%, #5b6067 100%)",
        }}
      />
      {/* head */}
      <span
        className="relative block h-[17px] w-[17px] rounded-full"
        style={{
          background: `radial-gradient(circle at 32% 28%, ${shine} 0%, ${head} 46%, rgba(0,0,0,0.55) 100%)`,
          boxShadow:
            "0 1px 2px rgba(0,0,0,0.45), inset 0 -1px 2px rgba(0,0,0,0.35)",
        }}
      >
        <span
          className="absolute left-[3px] top-[2.5px] h-[5px] w-[6px] rounded-full opacity-90 blur-[0.5px]"
          style={{ background: "rgba(255,255,255,0.9)" }}
        />
      </span>
    </span>
  );
}
