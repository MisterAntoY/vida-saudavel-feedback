import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Profile, UserRole } from "@/lib/types";

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, nome, email, role, department_id")
    .eq("id", user.id)
    .single();

  return profile as Profile | null;
}

export async function requireUser() {
  const profile = await getCurrentUser();
  if (!profile) redirect("/login");
  return profile;
}

export async function requireRole(allowed: UserRole[]) {
  const profile = await requireUser();
  if (!allowed.includes(profile.role)) {
    redirect("/dashboard");
  }
  return profile;
}