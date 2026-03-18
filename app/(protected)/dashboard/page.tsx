import { requireUser } from "@/lib/auth";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const user = await requireUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-slate-500">
          Visão geral do clima organizacional
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Satisfação média" value="4.2" description="Último ciclo" />
        <KpiCard title="Stress médio" value="3.1" description="Último ciclo" />
        <KpiCard title="Participação" value="78%" description="Último ciclo" />
        <KpiCard title="Departamento crítico" value="Operações" description="Maior stress médio" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resumo</CardTitle>
        </CardHeader>
        <CardContent className="text-slate-600">
          Área inicial pronta. Na próxima etapa, ligamos métricas reais do Supabase e adicionamos os gráficos com Recharts.
          A base funcional do sistema já está montada.
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Acesso atual</CardTitle>
        </CardHeader>
        <CardContent className="text-slate-600">
          Utilizador: {user.nome} | Perfil: {user.role}
        </CardContent>
      </Card>
    </div>
  );
}