import { redirect } from "next/navigation";
import { ChangePasswordForm } from "@/app/components/admin/ChangePasswordForm";
import { getSessionProfile } from "@/app/lib/admin/auth";

export const metadata = {
  title: "Cambiar contraseña | Pao Vergara",
  robots: { index: false, follow: false }
};

export default async function ClientChangePasswordPage() {
  const profile = await getSessionProfile();

  if (!profile) {
    redirect("/client/login");
  }

  if (profile.role !== "client") {
    redirect("/admin/change-password");
  }

  if (!profile.must_change_password) {
    redirect("/client");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-paper px-5 py-12 text-ink">
      <section className="w-full max-w-md border border-ink/15 bg-paper p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-graphite">Primer acceso</p>
        <h1 className="mt-5 text-4xl font-semibold leading-none">Cambia tu contraseña</h1>
        <p className="mt-4 leading-7 text-graphite">Por seguridad, reemplaza la contraseña temporal antes de entrar al portal.</p>
        <div className="mt-8">
          <ChangePasswordForm mode="client" />
        </div>
      </section>
    </main>
  );
}
