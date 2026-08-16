# HeroScouter Homepage

React + Vite + Tailwind CSS project for the HeroScouter website.

## Development

- `npm run dev` starts the Vite development server.
- `npm run build` creates the production build in `dist/`.
- `npm run preview` serves the production build locally.
- `npm run api` starts the Express API server.
- `npm run seed` seeds role data into MongoDB.

## Project Structure

- `src/main.tsx` - React entrypoint.
- `src/App.tsx` - Primary application component.
- `src/index.css` - Global CSS and Tailwind CSS import.
- `src/pages/` - Route-level pages.
- `src/components/` - Shared UI components.
- `src/data/` - Frontend data helpers and fallback data.
- `server/` - Express API, MongoDB connection, and seed scripts.
- `index.html` - Vite HTML shell.
- `vite.config.ts` - Vite configuration with React, Tailwind CSS, local API middleware, and the `@` alias for `src`.

## Notes

- Keep `.env` local; it is ignored by Git.
- Keep generated folders like `dist/` and `node_modules/` out of Git.
- Use Tailwind utility classes in JSX and put global styles in `src/index.css`.
