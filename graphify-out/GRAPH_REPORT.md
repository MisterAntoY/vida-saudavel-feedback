# Graph Report - vida-saudavel-feedback  (2026-10-28)

## Corpus Check
- 62 files · ~5,820 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 2, .ico 1, .css 1)

## Summary
- 273 nodes · 487 edges · 47 communities (12 shown, 35 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `35ffda17`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- cn
- survey-form.tsx
- next
- components.json
- 0001_initial_schema.sql
- compilerOptions
- package.json
- dependencies
- auth.ts
- eslint.config.mjs
- scripts
- README.md
- clsx
- @hookform/resolvers
- next-themes@^0.4.6
- react-dom@19.2.3
- resend@^6.9.3
- shadcn@^4.0.8
- @supabase/supabase-js@^2.99.1
- tailwind-merge
- tw-animate-css@^1.4.0
- zod
- postcss.config.mjs

## God Nodes (most connected - your core abstractions)
1. `cn()` - 48 edges
2. `compilerOptions` - 16 edges
3. `react` - 14 edges
4. `next` - 13 edges
5. `SurveyForm()` - 12 edges
6. `Card()` - 12 edges
7. `CardHeader()` - 12 edges
8. `CardTitle()` - 12 edges
9. `CardContent()` - 12 edges
10. `Button()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `DashboardPage()` --calls--> `requireUser()`  [EXTRACTED]
  app/(protected)/dashboard/page.tsx → lib/auth.ts
- `ProtectedLayout()` --calls--> `AppHeader()`  [EXTRACTED]
  app/(protected)/layout.tsx → components/layout/app-header.tsx
- `QuestionarioPage()` --calls--> `requireUser()`  [EXTRACTED]
  app/(protected)/questionario/page.tsx → lib/auth.ts
- `QuestionarioPage()` --calls--> `createClient()`  [EXTRACTED]
  app/(protected)/questionario/page.tsx → lib/supabase/server.ts
- `POST()` --calls--> `createClient()`  [EXTRACTED]
  app/api/survey/route.ts → lib/supabase/server.ts

## Import Cycles
- None detected.

## Communities (47 total, 35 thin omitted)

### Community 0 - "cn"
Cohesion: 0.09
Nodes (33): Badge(), badgeVariants, CardAction(), CardDescription(), CardFooter(), SelectContent(), SelectGroup(), SelectItem() (+25 more)

### Community 1 - "survey-form.tsx"
Cohesion: 0.24
Nodes (16): LoginPage(), DashboardPage(), QuestionarioPage(), KpiCard(), ScaleField(), SurveyForm(), AppHeader(), Button() (+8 more)

### Community 2 - "next"
Cohesion: 0.11
Nodes (14): POST(), geistMono, geistSans, metadata, updateSession(), createClient(), SurveySchema, config (+6 more)

### Community 3 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 4 - "0001_initial_schema.sql"
Cohesion: 0.18
Nodes (18): idx_survey_responses_cycle_id, idx_survey_responses_department_id, idx_survey_responses_user_id, on_auth_user_created, public.app_settings, public.current_user_department(), public.current_user_role(), public.departments (+10 more)

### Community 5 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 6 - "package.json"
Cohesion: 0.16
Nodes (16): devDependencies, tailwindcss@^4, @tailwindcss/postcss@^4, @types/node@^20, @types/react@^19, @types/react-dom@^19, typescript@^5, name (+8 more)

### Community 7 - "dependencies"
Cohesion: 0.12
Nodes (16): dependencies, class-variance-authority@^0.7.1, lucide-react@^0.577.0, next@^13.4.19, openai@^6.29.0, radix-ui@^1.4.3, react@19.2.3, react-hook-form@^7.71.2 (+8 more)

### Community 8 - "auth.ts"
Cohesion: 0.22
Nodes (9): ProtectedLayout(), AppSidebar(), items, getCurrentUser(), requireRole(), requireUser(), Profile, SurveyResponseInput (+1 more)

### Community 9 - "eslint.config.mjs"
Cohesion: 0.33
Nodes (5): eslintConfig, eslint@^9, eslint-config-next@16.1.6, eslint, eslint-config-next

### Community 10 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, start

### Community 11 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

## Knowledge Gaps
- **35 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `auth.ts`, `survey-form.tsx`, `package.json`, `dependencies`?**
  _High betweenness centrality (0.114) - this node is a cross-community bridge._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.08788159111933395 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `cn` to `auth.ts`, `survey-form.tsx`?**
  _High betweenness centrality (0.088) - this node is a cross-community bridge._
- **Should `next` be split into smaller, more focused modules?**
  _Cohesion score 0.10666666666666667 - nodes in this community are weakly interconnected._
- **Why does `react` connect `cn` to `survey-form.tsx`, `package.json`, `dependencies`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **Should `components.json` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._