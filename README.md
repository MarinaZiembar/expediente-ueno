# Expediente ueno

Recorrido interactivo en 3D (Next.js + React Three Fiber) por la información pública sobre el cierre de ueno bank. Estética de expediente / sala de evidencia. Todo gratis: Vercel Hobby + GitHub Actions.

## Cómo funciona

```
GitHub Actions (cada hora)
  └─ scripts/fetch-news.mjs  → Google News RSS + Bing News RSS
       └─ actualiza data/news.json y hace commit (solo si hay notas nuevas)
            └─ Vercel detecta el push y redeploya el sitio
```

No hay base de datos ni API keys. El historial de prensa queda versionado en git.

## Recorrido

| Tecla | Acción |
|---|---|
| ← → / A D | moverse entre secciones |
| 1–6 | saltar a una sección |
| Enter / E | abrir el expediente de la sección |
| Esc | cerrar |
| P | modo pixel |

En celular: deslizar o usar los botones de abajo.

## Qué editar a mano

| Archivo | Para qué |
|---|---|
| `content/empleados.ts` | Sección "Lo que sabemos los empleados" |
| `content/posts.ts` | Posteos de Instagram u otras redes |
| `content/timeline.ts` | Cronología (cada hecho con su fuente) |
| `content/graph.ts` | Red de vínculos y estados de cada persona/entidad |
| `content/meta.ts` | Aviso legal y créditos |
| `scripts/fetch-news.mjs` | Búsquedas y feeds RSS extra (`EXTRA_FEEDS`) |

Cada archivo tiene un ejemplo comentado. Commit + push y Vercel redeploya.

## Deploy (una sola vez)

1. Subí la carpeta a un repo nuevo de GitHub.
   - **Recomendado: repo público.** En el plan Hobby, Vercel puede bloquear deploys de repos privados cuando el commit lo hace otro autor (el bot de Actions). Si querés repo privado, en GitHub → Settings → Secrets and variables → Actions → *Variables* creá `COMMIT_NAME` y `COMMIT_EMAIL` con tu nombre y el email de tu cuenta de GitHub, así los commits automáticos salen a tu nombre.
2. En vercel.com → Add New → Project → importá el repo. Framework: Next.js (se detecta solo). Deploy.
3. En GitHub → pestaña Actions → "Actualizar archivo de prensa" → *Run workflow* para la primera corrida. Después corre sola cada hora.

## Desarrollo local

```bash
npm install
npm run dev          # http://localhost:3000
npm run fetch-news   # trae titulares ahora
```

## Límites conocidos

- Instagram no ofrece búsqueda pública por tema; por eso los posteos se cargan a mano.
- Google News y Bing devuelven titulares y links, no el texto completo de las notas.
- GitHub puede demorar unos minutos los cron programados en momentos de mucha carga.
- Los datos de la seed inicial de `data/news.json` tienen horarios aproximados; las notas nuevas usan la fecha del feed.
