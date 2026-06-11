import { useState } from "react"
import { loginClient } from "../services/client.service";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    loginClient(email, password)
      .then(() => {
        window.location.href = "/";
      }).catch((error) => {
        setError(error);
      })
  }

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center px-4">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600 opacity-20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600 opacity-20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/40 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 4H7a2 2 0 01-2-2V6a2 2 0 012-2h5l2 2h3a2 2 0 012 2v12a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Welcome back</h1>
          <p className="text-slate-400 mt-1 text-sm">Sign in to your InvoicePro account</p>
        </div>

        {/* Card */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-8">
          {error && (
            <div className="mb-5 flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-slate-300 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                id="login-email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value) }}
                className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/60 transition"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="login-password" className="block text-sm font-medium text-slate-300">
                  Password
                </label>
                <a href="#" className="text-xs text-blue-400 hover:text-blue-300 transition">Forgot password?</a>
              </div>
              <input
                type="password"
                id="login-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value) }}
                className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/60 transition"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-500/30 transition-all duration-200 active:scale-[0.98]"
            >
              Sign In
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            Don&apos;t have an account?{" "}
            <a href="/register" className="text-blue-400 hover:text-blue-300 font-medium transition">
              Create one
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login