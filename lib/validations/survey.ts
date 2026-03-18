import { z } from "zod";

export const surveySchema = z.object({
  cycle_id: z.string().uuid(),
  satisfacao: z.number().min(1).max(5),
  stress: z.number().min(1).max(5),
  comunicacao: z.number().min(1).max(5),
  relacao_chefia: z.number().min(1).max(5),
  equilibrio_vida_trabalho: z.number().min(1).max(5),
  carga_trabalho: z.number().min(1).max(5),
  recomendaria_empresa: z.number().min(1).max(5),
  comentario: z.string().max(2000).optional().or(z.literal("")),
  reclamacao: z.string().max(2000).optional().or(z.literal("")),
  sugestao: z.string().max(2000).optional().or(z.literal("")),
});

export type SurveySchema = z.infer<typeof surveySchema>;