function GetStarted() {
  return (
    <section className="bg-slate-900 border-t border-white/10 py-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-16 text-center shadow-2xl shadow-blue-900/50">
          {/* Decorative circles */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-300 opacity-10 rounded-full blur-2xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

          <div className="relative">
            <span className="inline-block bg-white/10 border border-white/20 text-white/80 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
              Limited time offer
            </span>
            <h2 className="text-5xl font-extrabold text-white mb-5 leading-tight tracking-tight">
              Ready to transform<br />your business?
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
              Join thousands of freelancers and small business owners who trust InvoicePro for their professional needs.{" "}
              <span className="font-semibold text-white">No credit card required.</span>
            </p>
            <button className="bg-white text-blue-700 hover:bg-blue-50 font-bold text-lg px-8 py-4 rounded-xl shadow-lg transition-all duration-200 active:scale-[0.98]">
              Start Your 14-Day Free Trial
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default GetStarted