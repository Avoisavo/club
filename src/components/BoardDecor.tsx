/**
 * The bits that make the board somebody's rather than the school's: a satin
 * bow on one corner, stickers stuck to the frame, washi tape, and a little
 * bear doll swinging off a string.
 */

function Bow() {
  return (
    <svg width="96" height="86" viewBox="0 0 96 86" className="drop-shadow-[0_3px_4px_rgba(60,30,10,0.45)]">
      <defs>
        <linearGradient id="satin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f2708a" />
          <stop offset="45%" stopColor="#d93b5c" />
          <stop offset="100%" stopColor="#9e1f3c" />
        </linearGradient>
        <linearGradient id="satinTail" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e04a68" />
          <stop offset="100%" stopColor="#a52344" />
        </linearGradient>
      </defs>
      {/* tails */}
      <path d="M46 34 C 40 52, 30 62, 18 74 L 34 82 C 42 66, 48 52, 50 40 Z" fill="url(#satinTail)" />
      <path d="M52 34 C 60 50, 68 58, 82 66 L 72 80 C 58 68, 50 54, 47 41 Z" fill="url(#satinTail)" opacity="0.92" />
      {/* loops */}
      <path d="M47 30 C 30 8, 4 12, 8 30 C 11 45, 34 42, 47 34 Z" fill="url(#satin)" />
      <path d="M51 30 C 68 8, 93 12, 89 30 C 86 45, 63 42, 51 34 Z" fill="url(#satin)" />
      <path d="M47 30 C 34 20, 20 20, 14 27" stroke="rgba(255,255,255,0.45)" strokeWidth="2" fill="none" />
      <path d="M51 30 C 64 20, 78 20, 84 27" stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none" />
      {/* knot */}
      <ellipse cx="49" cy="33" rx="10" ry="9" fill="url(#satin)" />
      <ellipse cx="46" cy="30" rx="4" ry="3" fill="rgba(255,255,255,0.4)" />
    </svg>
  );
}

function BearDoll() {
  return (
    <svg width="84" height="150" viewBox="0 0 84 150">
      <defs>
        <radialGradient id="fur" cx="0.35" cy="0.3" r="0.85">
          <stop offset="0%" stopColor="#d8a468" />
          <stop offset="70%" stopColor="#bd8446" />
          <stop offset="100%" stopColor="#946231" />
        </radialGradient>
        <linearGradient id="tee" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#79b7d8" />
          <stop offset="100%" stopColor="#4a86a9" />
        </linearGradient>
      </defs>
      {/* string + knot */}
      <path d="M42 0 C 38 16, 46 24, 42 36" stroke="#e8dcc0" strokeWidth="2.5" fill="none" />
      <circle cx="42" cy="38" r="4" fill="#c8b48c" />
      {/* ears */}
      <circle cx="22" cy="52" r="11" fill="url(#fur)" />
      <circle cx="62" cy="52" r="11" fill="url(#fur)" />
      <circle cx="22" cy="52" r="5.5" fill="#e8b98c" />
      <circle cx="62" cy="52" r="5.5" fill="#e8b98c" />
      {/* body */}
      <ellipse cx="42" cy="112" rx="26" ry="27" fill="url(#fur)" />
      <path d="M18 108 a24 24 0 0 0 48 0 a24 24 0 0 1 -48 0" fill="url(#tee)" />
      <rect x="17" y="100" width="50" height="22" rx="9" fill="url(#tee)" />
      {/* arms + legs */}
      <ellipse cx="14" cy="108" rx="9" ry="7" fill="url(#fur)" transform="rotate(-18 14 108)" />
      <ellipse cx="70" cy="108" rx="9" ry="7" fill="url(#fur)" transform="rotate(18 70 108)" />
      <ellipse cx="28" cy="136" rx="10" ry="8" fill="url(#fur)" />
      <ellipse cx="56" cy="136" rx="10" ry="8" fill="url(#fur)" />
      {/* head */}
      <circle cx="42" cy="66" r="24" fill="url(#fur)" />
      <ellipse cx="42" cy="74" rx="12" ry="9" fill="#f0cfa4" />
      <ellipse cx="42" cy="69" rx="4.5" ry="3.4" fill="#4b3018" />
      <path d="M42 72 v4" stroke="#4b3018" strokeWidth="1.6" />
      <path d="M42 76 q -4 4 -7 1 M42 76 q 4 4 7 1" stroke="#4b3018" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <circle cx="32" cy="60" r="3.2" fill="#3a230f" />
      <circle cx="52" cy="60" r="3.2" fill="#3a230f" />
      <circle cx="33" cy="59" r="1.1" fill="#fff" />
      <circle cx="53" cy="59" r="1.1" fill="#fff" />
      <circle cx="24" cy="70" r="4" fill="rgba(226,110,110,0.35)" />
      <circle cx="60" cy="70" r="4" fill="rgba(226,110,110,0.35)" />
      {/* scarf */}
      <rect x="26" y="88" width="32" height="8" rx="4" fill="#d9576f" />
      <rect x="46" y="92" width="8" height="16" rx="4" fill="#c44a61" transform="rotate(12 50 96)" />
    </svg>
  );
}

function Sticker({
  kind,
  className,
  rotate,
}: {
  kind: "star" | "heart" | "smile" | "flower";
  className: string;
  rotate: number;
}) {
  const art = {
    star: {
      bg: "#ffd34d",
      ring: "#fff6d8",
      path: (
        <path
          d="M20 7 L23.6 15.4 L32.6 16.2 L25.8 22.2 L27.8 31 L20 26.4 L12.2 31 L14.2 22.2 L7.4 16.2 L16.4 15.4 Z"
          fill="#f0872b"
        />
      ),
    },
    heart: {
      bg: "#ff8fb4",
      ring: "#ffe4ee",
      path: (
        <path
          d="M20 30 C 8 22, 8 12, 14.5 11 C 17.6 10.6, 19.3 12.8, 20 14.4 C 20.7 12.8, 22.4 10.6, 25.5 11 C 32 12, 32 22, 20 30 Z"
          fill="#e03e73"
        />
      ),
    },
    smile: {
      bg: "#8fdc9b",
      ring: "#e6fbe9",
      path: (
        <g fill="none" stroke="#1f6b3a" strokeWidth="2.4" strokeLinecap="round">
          <path d="M13 24 q 7 7 14 0" />
          <path d="M14 15 v2.5" />
          <path d="M26 15 v2.5" />
        </g>
      ),
    },
    flower: {
      bg: "#c9a9ec",
      ring: "#f3ebfd",
      path: (
        <g fill="#7b4fb0">
          <circle cx="20" cy="12" r="5.2" />
          <circle cx="28" cy="18" r="5.2" />
          <circle cx="25" cy="27" r="5.2" />
          <circle cx="15" cy="27" r="5.2" />
          <circle cx="12" cy="18" r="5.2" />
          <circle cx="20" cy="20" r="4.4" fill="#ffe066" />
        </g>
      ),
    },
  }[kind];

  return (
    <span
      className={`pointer-events-none absolute ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        className="drop-shadow-[0_2px_3px_rgba(50,26,8,0.5)]"
      >
        <circle cx="20" cy="20" r="19" fill={art.ring} />
        <circle cx="20" cy="20" r="16" fill={art.bg} />
        {art.path}
        <path
          d="M6 12 A 19 19 0 0 1 20 1"
          stroke="rgba(255,255,255,0.75)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

function WashiTape({
  className,
  rotate,
}: {
  className: string;
  rotate: number;
}) {
  return (
    <span
      className={`pointer-events-none absolute h-[26px] w-[112px] ${className}`}
      style={{
        transform: `rotate(${rotate}deg)`,
        background:
          "repeating-linear-gradient(45deg, rgba(255,255,255,0.85) 0 7px, rgba(126,196,214,0.85) 7px 14px)",
        boxShadow: "0 2px 4px rgba(50,26,8,0.35)",
        maskImage:
          "linear-gradient(90deg, transparent 0, #000 3px, #000 calc(100% - 3px), transparent 100%)",
      }}
    />
  );
}

export default function BoardDecor() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-20">
      {/* bow tied to the top-left corner */}
      <span className="decor-sway absolute -left-6 -top-8 origin-top">
        <Bow />
      </span>

      {/* the bear, hanging off the top-right corner */}
      <span className="decor-swing absolute -top-16 right-16 origin-top scale-110">
        <BearDoll />
      </span>

      <WashiTape className="left-[26%] -top-[9px]" rotate={-3} />
      <WashiTape className="bottom-[-8px] right-[26%]" rotate={2} />

      <Sticker kind="star" className="-bottom-3 left-6" rotate={-14} />
      <Sticker kind="heart" className="bottom-4 -left-4" rotate={12} />
      <Sticker kind="smile" className="-bottom-4 right-8" rotate={9} />
      <Sticker kind="flower" className="-right-4 top-[38%]" rotate={-8} />
    </div>
  );
}
