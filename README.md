# Mapa de Emergencia Venezuela — Fase 1: Mapa + Feed

Esta es la primera fase del proyecto: mapa interactivo + feed cronológico,
sincronizados entre sí y conectados en tiempo real a una base de datos
Supabase real (sin datos simulados).

## 1. Configurar la base de datos

1. Entra al dashboard de tu proyecto en supabase.com
2. Ve a **SQL Editor → New query**
3. Pega el contenido completo de `supabase/schema.sql` y ejecútalo
4. Esto crea la tabla `reports` (y tablas relacionadas para fases futuras),
   los índices, triggers, políticas de seguridad (RLS) y habilita Realtime.

## 2. Configurar las variables de entorno

1. Copia `.env.example` como `.env`
2. En tu dashboard de Supabase, ve a **Project Settings → API**
3. Copia el **Project URL** y la **anon public key** (NO la secret key)
   y pégalos en `.env`

## 3. Instalar y correr

```bash
npm install
npm run dev
```

Abre http://localhost:5173 — deberías ver el mapa centrado en Venezuela
y el feed vacío debajo (todavía no hay reportes).

## 4. Probar que funciona con datos reales

Para verificar que todo está conectado, puedes insertar un reporte de
prueba directamente desde el SQL Editor de Supabase:

```sql
insert into public.reports (latitude, longitude, address, category, title, description, priority)
values (10.4806, -66.9036, 'Caracas, Distrito Capital', 'refugios', 'Refugio temporal en polideportivo', 'Capacidad para 80 personas, agua y electricidad disponibles', 'media');
```

Si la app está abierta en el navegador, el marcador y la tarjeta del feed
deberían aparecer **al instante, sin recargar la página** — eso confirma
que Realtime está funcionando correctamente.

## Próximas fases

- ~~Fase 2: Botón "Reportar" y "Necesito ayuda"~~ ✅ Completada
- ~~Fase 3: Capas del mapa, filtros, heatmap~~ ✅ Completada
- ~~Fase 4: Autenticación y roles~~ ✅ Completada
- ~~Fase 5: Panel de administración~~ ✅ Completada
- Fase 6: PWA, modo offline, optimización de rendimiento

## Notas de la Fase 3 — Capas y heatmap

- Se eliminó la categoría "inundaciones" del sistema. Si ya habías ejecutado
  el `schema.sql` original, corré `supabase/migrations/002_remove_inundaciones.sql`
  en el SQL Editor para actualizar tu base de datos existente.
- Se aplicó la paleta de colores funcional completa (ver `src/lib/theme.ts`
  y `src/lib/categoryConfig.ts`): cada color tiene un significado específico,
  no decorativo.
- El botón "Capas" (barra superior) abre un panel con checkboxes para
  mostrar/ocultar cada categoría, y un toggle de mapa de calor (heatmap)
  que muestra densidad únicamente de categorías de urgencia inmediata.
- El feed respeta las mismas capas activas que el mapa.

## Notas de la Fase 4 — Autenticación y roles

- Login **opcional**: reportar y pedir ayuda sigue funcionando sin cuenta.
  El login solo es necesario para roles de voluntario/moderador/admin o
  para gestionar tus propios reportes en el futuro.
- Métodos: email + contraseña, y Google (OAuth).
- Para habilitar Google, en el dashboard de Supabase ve a
  **Authentication → Providers → Google** y completa el Client ID/Secret
  de un proyecto de Google Cloud (OAuth consent screen).
- Roles disponibles: `usuario`, `voluntario`, `moderador`, `administrador`.
  Se asignan por defecto como `usuario` al registrarse — un administrador
  los puede cambiar desde el Panel de Administración.
- Ejecutá `supabase/migrations/003_auth_and_roles.sql` en el SQL Editor
  para crear la tabla de perfiles y las políticas de seguridad asociadas.

### Cómo crear tu primer administrador

Las cuentas nuevas siempre empiezan como `usuario`. Para crear el primer
admin (necesario para poder asignar roles desde la UI), registrate
normalmente en la app y después corré esto en el SQL Editor:

```sql
update public.profiles set role = 'administrador' where id = (
  select id from auth.users where email = 'tu-correo@ejemplo.com'
);
```

## Notas de la Fase 5 — Panel de administración

Accesible desde el ícono de perfil (barra superior) → solo visible si tu
rol es `administrador`. Incluye:

- **Dashboard**: total de reportes, críticos activos, sin verificar,
  resueltos, y categorías más reportadas.
- **Usuarios**: lista de todos los perfiles registrados con selector
  de rol (cambia en tiempo real).
- **Reportes**: cambiar el estado de cualquier reporte (verificado, en
  proceso, resuelto, etc.) o eliminarlo (con confirmación).

Moderadores también pueden cambiar el estado de cualquier reporte
directamente vía las políticas RLS, aunque el panel completo solo es
visible para administradores en esta fase.


