# Seguridad

## Modelo de Exposicion

Todo codigo enviado al navegador puede inspeccionarse. La seguridad no depende de ocultar HTML, CSS o JavaScript publico. La seguridad depende de:

- No enviar secretos al cliente.
- Validar en servidor.
- Usar variables de entorno privadas.
- Limitar permisos en Supabase.
- Usar RLS y grants correctos.
- Registrar solo informacion necesaria.

## Secretos

Nunca exponer en frontend:

- `SUPABASE_SERVICE_ROLE_KEY`
- `SMTP_PASS`
- `SMTP_USER` si no es necesario mostrarlo
- tokens de Vercel
- tokens de GitHub
- claves de proveedores de video/storage

No usar prefijo `NEXT_PUBLIC_` salvo que el valor sea realmente publico.

## Supabase

Estado actual:

- `public.leads` no tiene privilegios publicos para `anon` ni `authenticated`.
- Los inserts de leads deben pasar por `/api/leads`.
- Los catalogos publicos solo permiten lectura de registros activos.

Catalogos publicos:

- `countries`
- `project_types`
- `urgency_options`
- `contact_preferences`

Estos datos no son sensibles.

## API de Leads

Protecciones actuales:

- Rechazo de origen externo.
- Solo `application/json`.
- Limite de tamano de payload.
- Rate limit en memoria por IP.
- Honeypot.
- Tiempo minimo antes de enviar.
- Validacion de email.
- Validacion de telefono.
- Validacion contra catalogos de Supabase.
- Limite de links en mensaje.
- Limites de longitud por campo.

Limitaciones:

- El rate limit en memoria no es distribuido entre regiones o instancias.
- Si hay spam en produccion, agregar Cloudflare Turnstile o Vercel Firewall.

## Buenas Practicas Para Nuevas APIs

- Validar metodo, origen y content type.
- Validar todos los campos en servidor.
- No confiar en validacion del navegador.
- No devolver detalles internos de errores.
- No loggear secretos ni payloads completos con datos personales.
- Usar service role solo dentro del servidor.
- Crear tests o pruebas manuales de casos invalidos.

## Datos Personales

Los leads contienen datos personales. Recomendaciones:

- Limitar acceso a Supabase.
- No exponer tabla `leads` al cliente.
- Evitar logs con telefono/email completos en produccion.
- Definir politica futura de retencion de leads.
- Agregar consentimiento/legal cuando el sitio pase a produccion si corresponde.
