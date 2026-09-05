import type { User } from "./store";
export function publicUser(user: User) {
  return { id: user.id, email: user.email, name: user.name, plan: user.plan, createdAt: user.createdAt };
}
