import { LoginForm } from "@/app/components/admin/LoginForm";

export const metadata = {
  title: "Client Login | Pao Vergara",
  robots: { index: false, follow: false }
};

export default function ClientLoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-paper px-5 py-12 text-ink">
      <section className="w-full max-w-md border border-ink/15 bg-paper p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-graphite">Portal de clientes</p>
        <h1 className="mt-5 text-4xl font-semibold leading-none">Revisión privada</h1>
        <p className="mt-4 leading-7 text-graphite">Accede a proyectos, versiones de video, comentarios y aprobaciones.</p>
        <div className="mt-8">
          <LoginForm mode="client" />
        </div>
      </section>
    </main>
  );
}
