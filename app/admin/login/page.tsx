import { LoginForm } from "@/app/components/admin/LoginForm";

export const metadata = {
  title: "Admin | Pao Vergara",
  robots: { index: false, follow: false }
};

export default function AdminLoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-paper px-5 py-12 text-ink">
      <section className="w-full max-w-md border border-ink/15 bg-paper p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-graphite">Administración</p>
        <h1 className="mt-5 text-4xl font-semibold leading-none">Pao Vergara</h1>
        <p className="mt-4 leading-7 text-graphite">Acceso privado para administrar trabajos, leads, clientes y entregas.</p>
        <div className="mt-8">
          <LoginForm mode="admin" />
        </div>
      </section>
    </main>
  );
}
