import { signIn } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({
  next,
  error,
}: {
  next?: string;
  error?: string;
}) {
  return (
    <form action={signIn} className="space-y-5">
      <input name="next" type="hidden" value={next || "/dashboard"} />
      {error ? (
        <p className="rounded-[var(--radius)] border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
          {error}
        </p>
      ) : null}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" required type="email" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" required type="password" />
      </div>
      <Button className="w-full" type="submit">
        Sign in
      </Button>
    </form>
  );
}
