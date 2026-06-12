# Base de Datos y Supabase

## Proyecto

Proyecto Supabase actual:

- URL: `https://dghljunkjmvydpxcoqgh.supabase.co`

## Migraciones

Ubicacion:

- `supabase/migrations`

Reglas:

- Crear una nueva migracion por cambio de esquema o permisos.
- No editar migraciones antiguas si ya fueron aplicadas en produccion.
- Validar permisos despues de aplicar cambios sensibles.

## Tablas Actuales

### `leads`

Guarda contactos recibidos desde el formulario.

Campos relevantes:

- nombre
- email
- telefono
- preferencia de contacto
- empresa
- pais
- tipo de proyecto
- urgencia
- mensaje
- idioma
- fuente/referrer/UTM
- user agent
- estado

Acceso:

- Sin permisos publicos para `anon` ni `authenticated`.
- Insercion solo desde API server-side usando service role.

### `countries`

Catalogo publico de paises activos.

Incluye:

- codigo ISO
- nombre ES/EN
- codigo telefonico
- bandera
- orden
- estado activo

### `project_types`

Catalogo publico de tipos de proyecto.

### `urgency_options`

Catalogo publico de urgencias/plazos.

### `contact_preferences`

Catalogo publico de preferencias de contacto.

### `email_templates`

Plantillas editables de correos transaccionales.

Uso actual:

- `lead_auto_reply` en ES/EN para responder automaticamente al lead.

Campos relevantes:

- `template_key`
- `locale`
- `subject`
- `text_body`
- `html_body`
- `active`

Acceso:

- Sin acceso publico.
- Lectura server-side con service role.
- En Fase 2 se editara desde el portal de administracion.

Placeholders soportados:

- `{{name}}`
- `{{booking_url}}`
- `{{project_type}}`
- `{{country}}`
- `{{urgency}}`
- `{{company}}`
- `{{email}}`
- `{{phone}}`
- `{{message}}`

### `portfolio_projects`

Portafolio publico editable y preparado para Mux.

Uso actual:

- Base inicial para administrar los trabajos destacados.
- Estado actual: 6 videos publicados en Mux.
- Permite migrar temporalmente desde Vimeo/YouTube y luego cambiar a Mux sin modificar el frontend.

Campos relevantes:

- `slug`
- `title_es` / `title_en`
- `description_es` / `description_en`
- `client_name`
- `category`
- `year`
- `role_es` / `role_en`
- `thumbnail_url`
- `before_image_url`
- `after_image_url`
- `video_provider`: `mux`, `vimeo`, `youtube`, `r2`, `external`
- `video_status`: `draft`, `processing`, `ready`, `archived`
- `video_url`
- `mux_asset_id`
- `mux_playback_id`
- `featured`
- `published`
- `order_index`

Acceso:

- Lectura publica solo de proyectos `published = true`.
- En Fase 2 se editara desde el portal de administracion.

Modelo recomendado:

- Supabase guarda metadata y permisos.
- Mux guarda y procesa video para reproduccion.
- R2 puede guardar masters, archivos finales o entregables pesados.

## RLS y Permisos

Principio:

- Las tablas con datos personales no deben tener acceso publico.
- Las tablas catalogo pueden tener lectura publica limitada a `active = true`.

Consulta recomendada para revisar permisos:

```sql
select grantee, privilege_type
from information_schema.role_table_grants
where table_schema = 'public'
order by table_name, grantee, privilege_type;
```

Consulta recomendada para revisar policies:

```sql
select schemaname, tablename, policyname, cmd, roles
from pg_policies
where schemaname = 'public'
order by tablename, policyname;
```

## Fase 2

Tablas recomendadas:

- `profiles`
- `services`
- `testimonials`
- `content_blocks`

Agregar Supabase Auth, roles y RLS antes de exponer cualquier admin.
