# Medium AI SpecFlow — Example Project

> **Este repositorio es un proyecto de ejemplo** que demuestra la implementación del paquete [`ai-specflow`](https://www.npmjs.com/package/ai-specflow) en una aplicación real con Next.js.

## Sobre ai-specflow

[`ai-specflow`](https://www.npmjs.com/package/ai-specflow) es un paquete npm que proporciona una capa de operación de IA estandarizada para proyectos de software. Define agentes, comandos y flujos de trabajo que permiten desarrollar funcionalidades de forma estructurada siguiendo un ciclo completo:

`/create-spec` → `/enrich-user-story` → `/plan-ticket` → `/develop-from-plan` → `/review-ticket`

## Qué demuestra este ejemplo

Este proyecto implementa **AI PDF Pro**, un generador de presupuestos PDF client-side para freelancers, construido enteramente con el flujo de trabajo de `ai-specflow`:

- **Specs como fuente de verdad** — Cada feature parte de una user story documentada en `docs/sdd/specs/`.
- **Desarrollo guiado por plan** — Criterios de aceptación, contratos (Zod schemas), plan de tareas y test plan generados antes de escribir código.
- **Trazabilidad completa** — Desde la user story hasta el código implementado, con changelog y matriz de riesgos.

## Stack técnico

- **Framework**: Next.js 16 (App Router) + React 19
- **Estilos**: TailwindCSS
- **Formularios**: React Hook Form + Zod
- **PDF**: @react-pdf/renderer (generación 100% client-side)
- **Lenguaje**: TypeScript

## Getting Started

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver el resultado.

## Estructura del proyecto

```
.ai/                  # Capa de operación AI (generada por ai-specflow)
  ├── agents/         # Roles de agentes IA
  ├── commands/       # Flujos de trabajo estructurados
  ├── specs/          # Estándares base
  └── adapters/       # Bridges para herramientas específicas
docs/sdd/             # Documentación de diseño del software
  └── specs/          # Especificaciones y user stories
src/
  ├── app/            # Rutas de Next.js (App Router)
  └── features/       # Módulos por dominio (quote/)
```

## Demo

🌐 [Ver demo en vivo](https://medium-ia-specflow-example.vercel.app/quote)

## Aprende más

- [Artículo en Medium](https://medium.com/@olivarigabriel/ai-specflow-69f068b8298b)
- [ai-specflow en npm](https://www.npmjs.com/package/ai-specflow)
- [Next.js Documentation](https://nextjs.org/docs)
