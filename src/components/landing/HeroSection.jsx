function HeroSection() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 overflow-hidden flex items-center">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-600 opacity-15 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600 opacity-15 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-16 w-full">
        <div className="flex justify-between items-center gap-12">
          {/* Left content */}
          <div className="flex flex-col space-y-7 max-w-xl">
            <span className="inline-flex items-center gap-2 self-start bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-medium px-4 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              NEW: Automated Payment Reminders
            </span>

            <h1 className="text-5xl font-extrabold leading-tight text-white tracking-tight">
              Professional Invoicing
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Made Simple
              </span>
            </h1>

            <p className="text-slate-400 text-lg leading-relaxed">
              Save hours of manual paperwork and get paid up to 3x faster with
              intuitive templates, real-time tracking, and seamless online payments.
            </p>

            <div className="flex gap-4">
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-blue-500/30 transition-all duration-200 active:scale-[0.98]">
                Get Started for Free
              </button>
              <button className="flex items-center gap-2 text-slate-300 hover:text-white border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 font-medium px-6 py-3 rounded-xl transition-all duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Watch a Demo
              </button>
            </div>

            <div className="flex gap-2 items-center">
              <img src="/reviews.png" alt="reviews" width={150} />
              <span className="text-slate-500 text-sm">Trusted by 5,000+ freelancers</span>
            </div>
          </div>

          {/* Right image */}
          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-3xl blur-2xl scale-110" />
              <img src="/hero.png" alt="hero" width={600} className="relative drop-shadow-2xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
