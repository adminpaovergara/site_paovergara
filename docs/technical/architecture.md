# Arquitectura

## Capas

### 1. Presentacion

Ubicacion:

- `app/[locale]`
- `app/components`

Responsabilidad:

- Render de paginas.
- Interaccion de usuario.
- Estados visuales.
- Formularios.
- Navegacion bilingue.

No debe contener:

- Llaves privadas.
- Credenciales SMTP.
- Service role keys.
- Logica directa de escritura a base de datos.

### 2. Backend de Aplicacion

Ubicacion:

- `app/api`

Responsabilidad:

- Recibir requests del navegador.
- Validar payloads.
- Aplicar protecciones anti-spam.
- Ejecutar operaciones privadas usando variables server-side.
- Responder con mensajes seguros.

Endpoint actual:

- `POST /api/leads`

### 3. Logica de Dominio e Integraciones

Ubicacion:

- `app/lib`

Archivos principales:

- `contact-catalogs.ts`: obtiene paises, tipos de proyecto, urgencias y preferencias desde Supabase.
- `leads.ts`: inserta leads usando server-side credentials.
- `supabase-rest.ts`: cliente REST centralizado para Supabase.
- `smtp.ts`: envio de notificaciones por SMTP.
- `metadata.ts`: metadata SEO por pagina.

### 4. Datos

Ubicacion:

- `app/data`
- `supabase/migrations`

Estado actual:

- Portfolio, servicios y textos principales siguen en codigo para Fase 1.
- Catalogos del formulario ya viven en Supabase.
- Leads se guardan en Supabase por API server-side.

## Flujo del Formulario

1. La pagina de contacto carga catalogos desde Supabase en servidor.
2. El usuario completa el formulario.
3. El frontend envia JSON a `/api/leads`.
4. La API valida origen, tipo de contenido, anti-spam y valores permitidos.
5. La API guarda el lead en Supabase con `SUPABASE_SERVICE_ROLE_KEY`.
6. La API envia notificacion por SMTP.
7. El frontend limpia el formulario y muestra confirmacion.

## Futuro Admin

Cuando se implemente backoffice, se recomienda migrar progresivamente a Supabase:

- `portfolio_projects`
- `services`
- `testimonials`
- contenido bilingue editable
- usuarios admin con Supabase Auth

Mantener el sitio publico desacoplado del admin. El admin debe usar rutas protegidas y RLS.
