export type UserRole = "funcionario" | "rh" | "lider" | "admin";

export type Profile = {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  department_id: string | null;
};

export type SurveyResponseInput = {
  cycle_id: string;
  satisfacao: number;
  stress: number;
  comunicacao: number;
  relacao_chefia: number;
  equilibrio_vida_trabalho: number;
  carga_trabalho: number;
  recomendaria_empresa: number;
  comentario?: string;
  reclamacao?: string;
  sugestao?: string;
};