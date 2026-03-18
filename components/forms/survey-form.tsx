"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { surveySchema, SurveySchema } from "@/lib/validations/survey";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

function ScaleField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            type="button"
            key={n}
            onClick={() => onChange(n)}
            className={`h-10 w-10 rounded-md border text-sm font-medium ${
              value === n ? "bg-slate-900 text-white" : "bg-white hover:bg-slate-100"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

export function SurveyForm({ cycleId }: { cycleId: string }) {
  const [loading, setLoading] = useState(false);

  const form = useForm<SurveySchema>({
    resolver: zodResolver(surveySchema),
    defaultValues: {
      cycle_id: cycleId,
      satisfacao: 3,
      stress: 3,
      comunicacao: 3,
      relacao_chefia: 3,
      equilibrio_vida_trabalho: 3,
      carga_trabalho: 3,
      recomendaria_empresa: 3,
      comentario: "",
      reclamacao: "",
      sugestao: "",
    },
  });

  async function onSubmit(values: SurveySchema) {
    setLoading(true);

    const res = await fetch("/api/survey", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      toast.error(data.error || "Erro ao enviar questionário");
      return;
    }

    toast.success("Questionário enviado com sucesso");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Questionário mensal</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <Controller
            control={form.control}
            name="satisfacao"
            render={({ field }) => (
              <ScaleField label="Satisfação geral com o trabalho" value={field.value} onChange={field.onChange} />
            )}
          />

          <Controller
            control={form.control}
            name="stress"
            render={({ field }) => (
              <ScaleField label="Nível de stress" value={field.value} onChange={field.onChange} />
            )}
          />

          <Controller
            control={form.control}
            name="comunicacao"
            render={({ field }) => (
              <ScaleField label="Qualidade da comunicação interna" value={field.value} onChange={field.onChange} />
            )}
          />

          <Controller
            control={form.control}
            name="relacao_chefia"
            render={({ field }) => (
              <ScaleField label="Relação com a chefia" value={field.value} onChange={field.onChange} />
            )}
          />

          <Controller
            control={form.control}
            name="equilibrio_vida_trabalho"
            render={({ field }) => (
              <ScaleField label="Equilíbrio entre vida pessoal e trabalho" value={field.value} onChange={field.onChange} />
            )}
          />

          <Controller
            control={form.control}
            name="carga_trabalho"
            render={({ field }) => (
              <ScaleField label="Carga de trabalho" value={field.value} onChange={field.onChange} />
            )}
          />

          <Controller
            control={form.control}
            name="recomendaria_empresa"
            render={({ field }) => (
              <ScaleField label="Recomendaria a empresa para outra pessoa?" value={field.value} onChange={field.onChange} />
            )}
          />

          <div className="space-y-2">
            <Label>Comentário livre</Label>
            <Textarea {...form.register("comentario")} rows={4} />
          </div>

          <div className="space-y-2">
            <Label>Reclamação livre</Label>
            <Textarea {...form.register("reclamacao")} rows={4} />
          </div>

          <div className="space-y-2">
            <Label>Sugestão livre</Label>
            <Textarea {...form.register("sugestao")} rows={4} />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Enviando..." : "Enviar questionário"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}