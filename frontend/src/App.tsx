import { Link, Navigate, Route, Routes } from "react-router-dom";

function LoginPage() {
  return <h2 className="text-2xl font-semibold">Login</h2>;
}

function DashboardPage() {
  return <h2 className="text-2xl font-semibold">Dashboard</h2>;
}

function PedidosPage() {
  return <h2 className="text-2xl font-semibold">Pedidos</h2>;
}

export default function App() {
  return (
    <main className="min-h-screen bg-slate-100 p-6 text-slate-900">
      <header className="mx-auto mb-8 flex max-w-4xl items-center gap-3 rounded-lg bg-white p-4 shadow-sm">
        <Link className="rounded bg-slate-900 px-3 py-2 text-sm font-medium text-white" to="/login">
          Login
        </Link>
        <Link className="rounded bg-slate-900 px-3 py-2 text-sm font-medium text-white" to="/dashboard">
          Dashboard
        </Link>
        <Link className="rounded bg-slate-900 px-3 py-2 text-sm font-medium text-white" to="/pedidos">
          Pedidos
        </Link>
      </header>

      <section className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-sm">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/pedidos" element={<PedidosPage />} />
        </Routes>
      </section>
    </main>
  );
}
