# Checklist Antes de Produccion

## Codigo

- `pnpm build` pasa sin errores.
- No hay rutas rotas.
- No hay errores visibles en consola del navegador.
- Las paginas `es` y `en` cargan correctamente.
- Mobile revisado en paginas principales.

## Contenido

- Textos revisados en espanol.
- Textos revisados en ingles.
- Titulos y descripciones SEO por pagina.
- Imagen Open Graph revisada.
- Favicon/iconos revisados.
- Portfolio revisado con assets finales.

## Formulario

- Catalogos cargan desde Supabase.
- Campos obligatorios se marcan correctamente.
- Pais y codigo telefonico funcionan.
- Submit exitoso limpia formulario.
- Popup de gracias aparece en ES/EN.
- Lead se guarda en Supabase.
- Email de notificacion llega correctamente.

## Seguridad

- No hay secretos en frontend.
- No hay `NEXT_PUBLIC_` para claves privadas.
- `SUPABASE_SERVICE_ROLE_KEY` esta solo en Vercel/server.
- `SMTP_PASS` esta solo en Vercel/server.
- `public.leads` no tiene permisos publicos.
- API rechaza origen externo.
- API limita payload y spam basico.

## Vercel

- Proyecto conectado a GitHub.
- Deploy automatico activo.
- Variables de entorno configuradas.
- Preview revisado.
- Produccion revisada.

## Dominio

- DNS planificado.
- Redirecciones del sitio viejo definidas.
- Google Workspace revisado antes de tocar DNS.
- Dominio conectado al final.

## Post-Lanzamiento

- Probar formulario desde produccion.
- Probar WhatsApp/contacto real.
- Revisar logs de Vercel.
- Revisar leads en Supabase.
- Revisar indexacion basica.
