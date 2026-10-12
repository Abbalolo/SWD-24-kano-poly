export default function Footer() {
  const year = new Date().getFullYear();
  const roman = toRoman(year);

  return (
    <footer className="mt-24 border-t border-[color:var(--color-border)]">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 py-10 sm:flex-row sm:items-center">
        <p className="font-hand text-2xl text-[color:var(--color-ink-soft)]">
          — with love, from all of us
        </p>
        <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--color-ink-mute)]">
          MMXXIV — {roman}
        </p>
      </div>
    </footer>
  );
}

function toRoman(num: number): string {
  const map: [number, string][] = [
    [1000, "M"],
    [900, "CM"],
    [500, "D"],
    [400, "CD"],
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];
  let n = num;
  let out = "";
  for (const [v, s] of map) {
    while (n >= v) {
      out += s;
      n -= v;
    }
  }
  return out;
}
