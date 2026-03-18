import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { surveySchema } from "@/lib/validations/survey";

export async function POST(req: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = surveySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, department_id")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: "Perfil não encontrado" }, { status: 404 });
  }

  const payload = {
    ...parsed.data,
    user_id: user.id,
    department_id: profile.department_id,
  };

  const { error } = await supabase.from("survey_responses").upsert(payload, {
    onConflict: "cycle_id,user_id",
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}