import { ChartArea, FileIcon, Zap } from "lucide-react"

function About() {
  return (
    <section className="py-20 border-b border-gray-300 shadow-sm">
      <div className="container w-7xl mx-auto text-center">
        <h2 className="text-2xl font-bold">Everything you need to grow</h2>
        <p className="mt-2 text-gray-500">Focus on your work, we'll handle the paperwork.</p>
        <div className="row flex justify-between items-center gap-5 mt-20">
          <div className="col">
            <div className="card border border-gray-700 py-5 px-3 rounded-2xl">
              <FileIcon className="w-12 h-12 text-blue-600 bg-gray-200 py-2 px-2 rounded-lg ml-8" />
              <h3 className="text-left ml-8 mt-3 font-bold text-xl">Create in Seconds</h3>
              <p className="text-left ml-8 mt-3 text-gray-500">
                Choose from beautiful, professional templates tailored to you brand. Generate PDFs or web-based invoices instantly.
              </p>
            </div>
          </div>
          <div className="col">
            <div className="card border border-gray-700 py-5 px-3 rounded-2xl">
              <ChartArea className="w-12 h-12 text-blue-600 bg-gray-200 py-2 px-2 rounded-lg ml-8" />
            <h3 className="text-left ml-8 mt-3 font-bold text-xl">Track Everything</h3>
            <p className="text-left ml-8 mt-3 text-gray-500">
              Know exactly when an invoice is opened, viewed, and paid with real-time notifications and a centralized dashboard.
            </p>
            </div>
          </div>
          <div className="col">
            <div className="card border border-gray-700 py-5 px-3 rounded-2xl">
              <Zap className="w-12 h-12 text-green-600 bg-gray-200 py-2 px-2 rounded-lg ml-8" />
              <h3 className="text-left ml-8 mt-3 font-bold text-xl">Get Paid Faster</h3>
              <p className="text-left ml-8 mt-3 text-gray-500">
                Accept credit cards, bank transfers, and digital wallets directly on you invoice. Most users get paid within 24 hours.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About