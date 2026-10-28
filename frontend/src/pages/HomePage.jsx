import { createElement } from "react";
import { ArrowRight, ShieldCheck, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";

const roles = [
  {
    title: "Admin",
    description: "Manage customers, orders, deliveries, and the business dashboard.",
    href: "/admin/login",
    icon: ShieldCheck,
    styles: {
      icon: "bg-blue-100 text-blue-700",
      button: "bg-blue-600 hover:bg-blue-700",
    },
  },
  {
    title: "Manager",
    description: "Access daily operations, customer orders, and delivery updates.",
    href: "/manager/login",
    icon: UsersRound,
    styles: {
      icon: "bg-cyan-100 text-cyan-700",
      button: "bg-cyan-600 hover:bg-cyan-700",
    },
  },
];

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-5">
      <div className="w-full max-w-4xl">
        <header className="mb-10 text-center text-white">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500 text-3xl shadow-lg shadow-blue-950/40">
            💧
          </span>
          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
            RO Water Management
          </p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Welcome</h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-300 sm:text-base">
            Select your account type to continue to the appropriate login.
          </p>
        </header>

        <section aria-label="Choose your account type" className="grid gap-4 sm:grid-cols-2">
          {roles.map(({ title, description, href, icon, styles }) => (
            <article
              key={title}
              className="rounded-3xl border border-white/10 bg-white p-6 shadow-2xl sm:p-8"
            >
              <span className={`inline-flex rounded-2xl p-3 ${styles.icon}`}>
                {createElement(icon, { size: 28 })}
              </span>
              <h2 className="mt-5 text-2xl font-bold text-slate-900">
                {title}
              </h2>
              <p className="mt-2 min-h-12 text-sm leading-6 text-slate-600">
                {description}
              </p>
              <Link
                to={href}
                className={`mt-6 flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold text-white transition ${styles.button}`}
              >
                Continue as {title}
                <ArrowRight size={18} />
              </Link>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
