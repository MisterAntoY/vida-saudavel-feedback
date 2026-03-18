"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function AppHeader({ nome, role }: { nome: string; role: string }) {
  const supabase = createClient();
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div>
        <div className="font-medium">{nome}</div>
        <div className="text-sm text-slate-500">{role}</div>
      </div>
      <Button variant="outline" onClick={handleLogout}>
        Sair
      </Button>
    </header>
  );
}