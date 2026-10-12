import GalleryCard, { type GalleryRow } from "./GalleryCard";

export default function GalleryGrid({ rows }: { rows: GalleryRow[] }) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {rows.map((row, i) => (
        <div
          key={row.id}
          className={i % 5 === 1 ? "lg:mt-6" : i % 5 === 3 ? "lg:mt-3" : ""}
        >
          <GalleryCard row={row} />
        </div>
      ))}
    </div>
  );
}
