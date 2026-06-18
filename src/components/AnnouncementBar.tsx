import { BRAND } from "@/lib/constants";

// Barra de anuncio superior (manual §12.6). Editable desde constants.
export function AnnouncementBar() {
  return (
    <div className="bg-ink text-paper">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-xs font-medium tracking-wide sm:text-[13px]">
        <span>{BRAND.announcement}</span>
      </div>
    </div>
  );
}
