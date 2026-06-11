import { NavLink } from "react-router"

function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="backdrop-blur-xl bg-slate-900/70 border-b border-white/10 shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 4H7a2 2 0 01-2-2V6a2 2 0 012-2h5l2 2h3a2 2 0 012 2v12a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-xl font-extrabold text-white tracking-tight">InvoicePro</span>
          </div>

          {/* Links */}
          <ul className="flex items-center gap-8">
            <li>
              <NavLink
                to="/"
                className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-200"
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/"
                className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-200"
              >
                About
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/login"
                className="text-sm font-medium text-slate-300 hover:text-white border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl transition-all duration-200"
              >
                Login
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/register"
                className="text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-4 py-2 rounded-xl shadow-md shadow-blue-500/30 transition-all duration-200"
              >
                Get Started
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  )
}

export default Navbar