import { createSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function signIn(formData: FormData) {
  'use server';
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));
  const redirectTo = String(formData.get('redirectTo') ?? '/');
  const session = await createSession(email, password);
  if (!session) {
    return { error: 'Invalid credentials' };
  }
  redirect(redirectTo || '/');
}

export default async function SignInPage({ searchParams }: { searchParams: { redirectTo?: string } }) {
  const action = signIn;
  return (
    <div className="mx-auto max-w-md rounded-lg border border-slate-800 bg-slate-900 p-8">
      <h1 className="text-2xl font-semibold text-slate-100">Sign in</h1>
      <p className="mt-2 text-sm text-slate-400">Use one of the seeded accounts to access the dashboard.</p>
      <form action={action} className="mt-6 space-y-4">
        <input type="hidden" name="redirectTo" value={searchParams.redirectTo ?? '/'} />
        <div className="space-y-1">
          <label className="text-sm text-slate-300" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:border-sky-500 focus:outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm text-slate-300" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:border-sky-500 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-500"
        >
          Sign in
        </button>
      </form>
      <div className="mt-6 text-xs text-slate-400">
        <p>Admin: admin@example.com / admin123</p>
        <p>Analyst: analyst@example.com / analyst123</p>
        <p>Viewer: viewer@example.com / viewer123</p>
      </div>
    </div>
  );
}
