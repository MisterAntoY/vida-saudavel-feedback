import { UserRole } from "@/lib/types";

export function canAccess(
  userRole: UserRole,
  allowed: UserRole[]
): boolean {
  return allowed.includes(userRole);
}