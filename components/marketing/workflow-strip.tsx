const steps = [
  "Secure workspace",
  "Owned projects",
  "Private storage",
  "Usage ledger",
];

export function WorkflowStrip() {
  return (
    <section className="border-y border-line bg-surface">
      <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-line px-4 sm:grid-cols-4 sm:divide-x sm:divide-y-0 sm:px-6 lg:px-8">
        {steps.map((step) => (
          <div className="py-5 sm:px-5" key={step}>
            <p className="text-sm font-semibold">{step}</p>
            <p className="mt-1 text-sm text-ink-muted">Phase 1 foundation</p>
          </div>
        ))}
      </div>
    </section>
  );
}
