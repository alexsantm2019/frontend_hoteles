import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'business/**', // Aplica a todas las rutas privadas
    renderMode: RenderMode.Client, // Fuerza CSR, ignora SSR
  },
  {
    path: '**',
    renderMode: RenderMode.Server, // El resto (login, público) usa SSR
  },
];
