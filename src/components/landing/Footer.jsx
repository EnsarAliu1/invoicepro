import { AtSign, Earth } from "lucide-react"

function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 4H7a2 2 0 01-2-2V6a2 2 0 012-2h5l2 2h3a2 2 0 012 2v12a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-white text-sm">InvoicePro</p>
              <p className="text-slate-500 text-xs">© 2024 All rights reserved.</p>
            </div>
          </div>

          {/* Links */}
          <ul className="flex gap-6 text-slate-400 text-sm">
            <li className="hover:text-white transition-colors cursor-pointer">Privacy Policy</li>
            <li className="hover:text-white transition-colors cursor-pointer">Terms of Service</li>
            <li className="hover:text-white transition-colors cursor-pointer">Contact</li>
          </ul>

          {/* Social icons */}
          <div className="flex gap-3">
            <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-slate-400 hover:text-white transition-all cursor-pointer">
              <Earth className="w-4 h-4" />
            </div>
            <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-slate-400 hover:text-white transition-all cursor-pointer">
              <AtSign className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer