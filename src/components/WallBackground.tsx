/**
 * A school corridor wall: painted plaster up top, timber chair rail, tan
 * wainscot below it, skirting board, and a strip of waxed floor.
 */
export default function WallBackground() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
      {/* painted plaster */}
      <div className="wall-paint absolute inset-0" />
      <div className="wall-mottle absolute inset-0" />
      <div className="wall-grain absolute inset-0" />
      <div className="wall-tooth absolute inset-0" />
      <div className="wall-scuff absolute inset-0" />

      {/* lower half of the corridor */}
      <div className="wainscot absolute inset-x-0 bottom-[calc(9vh+18px)] h-[24vh]" />
      <div className="chair-rail absolute inset-x-0 bottom-[calc(9vh+18px+24vh)] h-[13px]" />
      <div className="skirting absolute inset-x-0 bottom-[9vh] h-[18px]" />
      <div className="floor absolute inset-x-0 bottom-0 h-[9vh]" />
    </div>
  );
}
