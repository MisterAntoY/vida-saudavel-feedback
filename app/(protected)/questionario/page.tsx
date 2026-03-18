import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { SurveyForm } from "@/components/forms/survey-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function QuestionarioPage() {
  await requireUser();
  const supabase = await createClient();

  const now = new Date();
  const mes = now.getMonth() + 1;
  const ano = now.getFullYear();

  let { data: cycle } = await supabase
    .from("survey_cycles")
    .select("id, mes, ano, status")
    .eq("mes", mes)
    .eq("ano", ano)
    .single();

  if (!cycle) {
    const { data: created } = await supabase
      .from("survey_cycles")
      .insert({
        mes,
        ano,
        status: "open",
      })
      .select("id, mes, ano, status")
      .single();

    cycle = created;
  }

  if (!cycle) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Erro</CardTitle>
        </CardHeader>
        <CardContent>Não foi possível carregar o ciclo atual.</CardContent>
      </Card>
    );
  }

  if (cycle.status !== "open") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Questionário indisponível</CardTitle>
        </CardHeader>
        <CardContent>O questionário deste mês não está aberto.</CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Questionário</h1>
        <p className="text-slate-500">
          Responda o questionário mensal de clima organizacional.
        </p>
      </div>

      <SurveyForm cycleId={cycle.id} />
    </div>
  );
}