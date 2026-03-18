insert into public.departments (nome)
values
  ('RH'),
  ('Comercial'),
  ('Operações'),
  ('Financeiro'),
  ('Tecnologia')
on conflict (nome) do nothing;

insert into public.email_settings (tipo_email, destinatarios, ativo)
values
  ('monthly_reminder', array['rh@vidasaudavel.com'], true),
  ('monthly_summary', array['rh@vidasaudavel.com'], true),
  ('quarterly_summary', array['rh@vidasaudavel.com'], true)
on conflict (tipo_email) do nothing;

insert into public.app_settings (company_name, ceo_email)
values ('Vida Saudável', 'ceo@vidasaudavel.com')
on conflict do nothing;