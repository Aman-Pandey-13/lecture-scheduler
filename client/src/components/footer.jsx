export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-8 text-sm text-muted sm:flex-row">
        <p>© {new Date().getFullYear()} Scheduler. Built for course teams that hate double-booking.</p>
        <p className="font-mono text-xs">v1.0</p>
      </div>
    </footer>
  );
}
