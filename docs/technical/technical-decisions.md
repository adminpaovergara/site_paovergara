# Decisiones Tecnicas

Este documento registra decisiones para que futuras sesiones no repitan debates ya resueltos.

## 001. Next.js App Router

Decision:

- Usar Next.js App Router con rutas bilingues bajo `app/[locale]`.

Motivo:

- Buen soporte para Vercel, SEO, server components y crecimiento hacia APIs/admin.

## 002. Supabase Para Datos Dinamicos

Decision:

- Usar Supabase para leads y catalogos del formulario en Fase 1.
- Migrar portfolio/servicios a Supabase en Fase 2 cuando exista admin.

Motivo:

- Evita depender de WordPress.
- Permite avanzar rapido sin construir backoffice completo desde el inicio.

## 003. Formulario Por API Server-Side

Decision:

- El frontend no escribe directo en `public.leads`.
- El navegador llama a `/api/leads`.
- La API valida y guarda usando service role.

Motivo:

- Evita exponer permisos de escritura a usuarios anonimos.
- Centraliza anti-spam, validacion y notificaciones.

## 004. Catalogos Publicos Controlados

Decision:

- Paises, tipos de proyecto, urgencias y preferencias se leen desde Supabase con acceso publico solo a registros activos.

Motivo:

- No son datos sensibles.
- Permiten que el formulario sea administrable mas adelante.

## 005. SMTP Google Workspace Para Fase 1

Decision:

- Usar SMTP de Google Workspace para notificaciones de lead.

Motivo:

- Ya existe la cuenta disponible.
- Reduce dependencias de pago al inicio.

Nota:

- Para escala o mayor entregabilidad, evaluar Resend con dominio verificado.

## 006. Dominio Al Final

Decision:

- Conectar `paovergara.com` al final.

Motivo:

- Evita afectar el sitio actual, DNS o Google Workspace antes de aprobar contenido, formulario, SEO y redirecciones.

## 007. Plantillas de Email Editables

Decision:

- Guardar el autorresponder del lead en `public.email_templates`.
- Usar placeholders como `{{name}}` y `{{booking_url}}`.
- Mantener un fallback en codigo si la plantilla no existe o Supabase no responde.

Motivo:

- Permite modificar el asunto, texto y HTML desde el futuro portal de administracion sin programar.
- Mantiene el flujo de contacto funcionando aunque falte temporalmente la plantilla.
