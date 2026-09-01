export type Role = "free" | "pro" | "admin";

const RANK: Record<Role, number> = {
  free: 1,
  pro: 2,
  admin: 3,
};

export function hasRole(userRole: string | undefined, required: Role): boolean {
  if (userRole !== "free" && userRole !== "pro" && userRole !== "admin") {
    return false;
  }
  return RANK[userRole] >= RANK[required];
}
