import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-4 px-4 py-32 text-center">
      <p className="font-display text-6xl text-accent">404</p>
      <h1 className="font-serif text-2xl text-ink">Página no encontrada</h1>
      <p className="text-ink-soft">
        El enlace que buscas no existe o el producto ya no está disponible.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-full bg-ink px-7 py-3 text-sm font-medium text-paper hover:bg-ink-soft"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
