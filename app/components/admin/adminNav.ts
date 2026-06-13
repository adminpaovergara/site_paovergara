import { Briefcase, Clapperboard, FolderKanban, Home, Inbox, Mail, Settings, Users } from "lucide-react";
import type { Profile } from "@/app/lib/admin/auth";

type AdminNavItem = {
  href: string;
  label: string;
  icon: typeof Home;
  roles: readonly Profile["role"][];
};

export const adminNavItems: readonly AdminNavItem[] = [
  { href: "/admin", label: "Dashboard", icon: Home, roles: ["admin", "editor"] },
  { href: "/admin/work", label: "Trabajos", icon: Clapperboard, roles: ["admin", "editor"] },
  { href: "/admin/leads", label: "Leads", icon: Inbox, roles: ["admin", "editor"] },
  { href: "/admin/clients", label: "Clientes", icon: Briefcase, roles: ["admin"] },
  { href: "/admin/users", label: "Usuarios", icon: Users, roles: ["admin"] },
  { href: "/admin/settings", label: "Settings", icon: Settings, roles: ["admin"] },
  { href: "/admin/catalogs", label: "Catálogos", icon: FolderKanban, roles: ["admin", "editor"] },
  { href: "/admin/email-templates", label: "Correos", icon: Mail, roles: ["admin"] }
];
