import Link from "next/link";
import { SignupForm } from "@/components/auth/signup-form";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
      <Link className="mb-8 text-sm font-semibold text-accent" href="/">
        Clarity
      </Link>
      <section className="rounded-[var(--radius)] border border-line bg-surface p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)]">
        <h1 className="text-2xl font-semibold">Create account</h1>
        <p className="mt-2 text-sm leading-6 text-ink-muted">
          Start with a secure workspace for shaping design systems.
        </p>
        <div className="mt-6">
          <SignupForm error={params.error} />
        </div>
        <p className="mt-5 text-sm text-ink-muted">
          Already have an account?{" "}
          <Link className="font-semibold text-accent" href="/login">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
