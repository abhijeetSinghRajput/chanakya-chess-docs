export default function BitboardMotif() {
  const cells = Array.from({ length: 64 });
  // A sparse, deliberate "occupancy" pattern reminiscent of a mid-game
  // bitboard mask rather than random noise — evokes the subject directly.
  const lit = new Set([
    3, 4, 11, 12, 18, 19, 20, 27, 28, 29, 35, 36, 44, 45, 51, 52, 59, 60,
  ]);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.5]"
    >
      <div className="grid grid-cols-8 gap-[3px] w-[420px] max-w-[80vw] aspect-square [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,black,transparent)]">
        {cells.map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-[2px]"
            style={{
              background: lit.has(i)
                ? "rgba(201,162,75,0.35)"
                : "rgba(255,255,255,0.03)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
