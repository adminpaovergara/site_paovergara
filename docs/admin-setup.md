# Admin Setup

## Objetivo

El admin usa Supabase Auth para autenticar usuarios y la tabla `profiles` para decidir permisos.

## Primer Usuario Admin

1. En Supabase, crea un usuario en Authentication > Users.
2. Copia el `id` del usuario.
3. Inserta el perfil admin:

```sql
insert into public.profiles (
  id,
  email,
  full_name,
  role,
  active
) values (
  'AUTH_USER_ID',
  'admin@paovergara.com',
  'Pao Vergara',
  'admin',
  true
)
on conflict (id) do update set
  role = excluded.role,
  active = true,
  updated_at = now();
```

## Roles

- `admin`: administra todo.
- `editor`: administra contenido, leads y catálogos.
- `client`: entra al portal privado `/client`.

## Variables Necesarias

```env
SUPABASE_URL=
SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

`SUPABASE_PUBLISHABLE_KEY` se usa solo server-side para autenticar email + contraseña contra Supabase Auth. `SUPABASE_SERVICE_ROLE_KEY` nunca debe exponerse en componentes frontend.
