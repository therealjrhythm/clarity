import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
      <Link className="mb-8 text-sm font-semibold text-accent" href="/">
        Clarity
      </Link>
      <section className="rounded-[var(--radius)] border border-line bg-surface p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <p className="mt-2 text-sm leading-6 text-ink-muted">
          Access your Clarity project workspace.
        </p>
        <div className="mt-6">
          <LoginForm error={params.error} next={params.next} />
        </div>
        <p className="mt-5 text-sm text-ink-muted">
          New to Clarity?{" "}
          <Link className="font-semibold text-accent" href="/signup">
            Create an account
          </Link>
        </p>
      </section>
    </main>
  );
}
