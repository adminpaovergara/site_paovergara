# Guia para Codificar con IA

Esta guia existe para que cualquier sesion de IA trabaje con contexto suficiente, reduzca cambios accidentales y mantenga el proyecto estable.

## Antes de Cambiar Codigo

1. Leer esta carpeta de documentacion.
2. Revisar `git status`.
3. Identificar si hay cambios de otra persona o de otra sesion.
4. Revisar los archivos cercanos al cambio.
5. Entender la capa correcta: frontend, backend, lib, data, Supabase o docs.

## Reglas de Trabajo

- No mezclar refactors grandes con cambios funcionales pequenos.
- No mover archivos sin necesidad clara.
- No duplicar logica de integraciones.
- No poner secretos en componentes cliente.
- No usar `NEXT_PUBLIC_` para credenciales privadas.
- No exponer escritura directa a Supabase desde navegador para datos sensibles.
- No cambiar migraciones ya aplicadas en produccion; crear una nueva migracion correctiva.
- Actualizar documentacion cuando cambie arquitectura, seguridad, base de datos o despliegue.

## Prompts Recomendados

Para cambios de UI:

```text
Revisa primero la estructura actual del proyecto y aplica el cambio siguiendo los patrones existentes. Verifica responsive, build y que no se expongan secretos en frontend.
```

Para cambios de backend:

```text
Revisa app/api, app/lib y docs/technical/security.md antes de implementar. Mantén validacion en servidor, variables privadas y respuestas sin datos sensibles.
```

Para cambios de Supabase:

```text
Crea una migracion nueva, revisa RLS/permisos y valida con una consulta que anon/authenticated solo tengan los permisos esperados.
```

Para despliegue:

```text
Verifica build local, variables de entorno requeridas y estado de Git/Vercel antes de desplegar.
```

## Checklist de IA Antes de Finalizar

- `next build` pasa.
- No hay secretos nuevos en frontend.
- No se rompieron rutas `es` y `en`.
- Si se toco Supabase, hay migracion.
- Si se toco seguridad, se actualizo `security.md`.
- Si se toco produccion/env, se actualizo `production-env.md`.
- El resumen final dice que se cambio, que se probo y que falta.

## Archivos que una IA Debe Revisar con Frecuencia

- `docs/technical/README.md`
- `docs/technical/architecture.md`
- `docs/technical/security.md`
- `docs/production-env.md`
- `app/api/leads/route.ts`
- `app/lib/supabase-rest.ts`
- `supabase/migrations`
