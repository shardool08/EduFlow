export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="text-2xl font-bold text-[#496580]">PedaStudio API</h1>
      <p className="mt-3 max-w-sm text-sm text-[#496580]/70">
        This server powers the PedaStudio Android app. Teachers use the mobile app — not this website.
      </p>
      <p className="mt-6 text-xs text-[#496580]/50">
        Health check: <code className="rounded bg-[#F0FAF8] px-1">/api/health</code>
      </p>
    </main>
  );
}
