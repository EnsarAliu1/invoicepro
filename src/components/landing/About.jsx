import { ChartArea, FileIcon, Zap } from "lucide-react"

function About() {
  return (
    <section className="bg-slate-900 border-t border-white/10 py-24">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <span className="inline-block text-blue-400 text-sm font-semibold uppercase tracking-widest mb-4">Features</span>
        <h2 className="text-4xl font-extrabold text-white tracking-tight">Everything you need to grow</h2>
        <p className="mt-3 text-slate-400 text-lg">Focus on your work, we'll handle the paperwork.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {/* Card 1 */}
          <div className="group backdrop-blur-xl bg-white/5 border border-white/10 hover:border-blue-500/40 rounded-2xl p-8 text-left transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 mb-5">
              <FileIcon className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="font-bold text-xl text-white mb-3">Create in Seconds</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Choose from beautiful, professional templates tailored to your brand. Generate PDFs or web-based invoices instantly.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group backdrop-blur-xl bg-white/5 border border-white/10 hover:border-indigo-500/40 rounded-2xl p-8 text-left transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10">
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 mb-5">
              <ChartArea className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="font-bold text-xl text-white mb-3">Track Everything</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Know exactly when an invoice is opened, viewed, and paid with real-time notifications and a centralized dashboard.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group backdrop-blur-xl bg-white/5 border border-white/10 hover:border-green-500/40 rounded-2xl p-8 text-left transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10">
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-green-500/10 border border-green-500/20 mb-5">
              <Zap className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="font-bold text-xl text-white mb-3">Get Paid Faster</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Accept credit cards, bank transfers, and digital wallets directly on your invoice. Most users get paid within 24 hours.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About