/**
 * Students walking down the corridor in front of the board. Pure CSS walk
 * cycle: the legs and arms swing on opposite phases, the body bobs at double
 * the stride rate, and the whole figure strolls across and then stays off
 * screen for a while before coming round again.
 */

type Kit = {
  skin: string;
  hair: string;
  shirt: string;
  lower: string;
  bag: string;
  shoe: string;
};

function Student({ kit, bagOnBack = true }: { kit: Kit; bagOnBack?: boolean }) {
  return (
    <svg width="130" height="300" viewBox="0 0 130 300">
      {/* back arm and back leg sit behind the body */}
      <g className="limb-back" style={{ transformOrigin: "56px 84px" }}>
        <rect x="50" y="80" width="14" height="62" rx="7" fill={kit.skin} opacity="0.82" />
      </g>
      <g className="leg-back" style={{ transformOrigin: "64px 190px" }}>
        <rect x="56" y="188" width="16" height="70" rx="8" fill={kit.lower} opacity="0.85" />
        <path d="M56 254 h16 v10 a6 6 0 0 1 -6 6 h-16 a4 4 0 0 1 0 -8 l6 -2 Z" fill={kit.shoe} opacity="0.85" />
      </g>

      {bagOnBack && (
        <g>
          <rect x="30" y="84" width="26" height="58" rx="9" fill={kit.bag} />
          <rect x="34" y="96" width="18" height="4" rx="2" fill="rgba(0,0,0,0.18)" />
          <path d="M56 88 q 10 2 12 14" stroke={kit.bag} strokeWidth="6" fill="none" strokeLinecap="round" />
        </g>
      )}

      {/* body */}
      <path d="M52 76 h30 a10 10 0 0 1 10 10 v58 a8 8 0 0 1 -8 8 h-34 a8 8 0 0 1 -8 -8 v-58 a10 10 0 0 1 10 -10 Z" fill={kit.shirt} />
      <path d="M50 148 h42 l6 46 h-54 Z" fill={kit.lower} />
      <path d="M64 76 l8 10 l8 -10 Z" fill="rgba(255,255,255,0.75)" />

      {/* head */}
      <rect x="62" y="64" width="14" height="14" rx="6" fill={kit.skin} />
      <circle cx="70" cy="46" r="23" fill={kit.skin} />
      <path d="M47 46 a23 23 0 0 1 40 -14 q -14 8 -30 10 q -6 2 -6 12 Z" fill={kit.hair} />
      <path d="M46 42 q -8 8 -4 22 q 2 8 8 6 q -6 -14 0 -26 Z" fill={kit.hair} />
      <circle cx="82" cy="46" r="2.2" fill="#3a2a1a" />
      <path d="M86 54 q -5 4 -9 1" stroke="#3a2a1a" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <circle cx="66" cy="52" r="3.2" fill={kit.skin} stroke="rgba(0,0,0,0.12)" />

      {/* front leg and front arm */}
      <g className="leg-front" style={{ transformOrigin: "72px 190px" }}>
        <rect x="64" y="188" width="17" height="70" rx="8" fill={kit.lower} />
        <path d="M64 254 h17 v10 a6 6 0 0 1 -6 6 h-17 a4 4 0 0 1 0 -8 l6 -2 Z" fill={kit.shoe} />
      </g>
      <g className="limb-front" style={{ transformOrigin: "70px 84px" }}>
        <rect x="64" y="80" width="15" height="60" rx="7.5" fill={kit.shirt} />
        <rect x="64" y="122" width="15" height="22" rx="7.5" fill={kit.skin} />
      </g>
    </svg>
  );
}

const KIT_A: Kit = {
  skin: "#e8b98f",
  hair: "#3c2a1c",
  shirt: "#f4f1e6",
  lower: "#4a5f86",
  bag: "#d4586f",
  shoe: "#2f2a26",
};

const KIT_B: Kit = {
  skin: "#c98d5e",
  hair: "#1f1a15",
  shirt: "#e9ecef",
  lower: "#59524a",
  bag: "#3f7f6d",
  shoe: "#241f1b",
};

export default function Passerby() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      <div className="stroll-right absolute bottom-[5vh]">
        <div className="walk-bob">
          <Student kit={KIT_A} />
        </div>
      </div>

      <div className="stroll-left absolute bottom-[7vh]">
        <div className="scale-90">
          <div className="walk-bob" style={{ animationDelay: "-0.22s" }}>
            <div className="scale-x-[-1]">
              <Student kit={KIT_B} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
