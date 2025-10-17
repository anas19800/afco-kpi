import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Role } from '@prisma/client';
import { prisma } from './prisma';

const SESSION_COOKIE = 'afco-session';

type SessionData = {
  id: string;
  role: Role;
  email: string;
  name: string;
};

export async function createSession(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.password !== password) {
    return null;
  }
  const data: SessionData = {
    id: user.id,
    role: user.role,
    email: user.email,
    name: user.name
  };
  cookies().set(SESSION_COOKIE, Buffer.from(JSON.stringify(data)).toString('base64'), {
    httpOnly: true,
    sameSite: 'lax'
  });
  return data;
}

export function destroySession() {
  cookies().delete(SESSION_COOKIE);
}

export function getSessionUser() {
  const raw = cookies().get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    const decoded = Buffer.from(raw, 'base64').toString('utf-8');
    return JSON.parse(decoded) as SessionData;
  } catch (error) {
    return null;
  }
}

export function requireRole(roles: Role[]) {
  const user = getSessionUser();
  if (!user || !roles.includes(user.role)) {
    redirect('/auth/sign-in');
  }
  return user;
}

export function requireSignedIn() {
  const user = getSessionUser();
  if (!user) {
    redirect('/auth/sign-in');
  }
  return user;
}
