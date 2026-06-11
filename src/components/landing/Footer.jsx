import { AtSign, Earth } from "lucide-react"

function Footer() {
  return (
    <section className="py-20">
      <div className="container w-7xl mx-auto">
        <div className="row flex justify-between items-center">
          <div className="col">
            <div>
              <p className="font-bold text-lg">InvoicePro</p>
              <p className="text-gray-500">2024 InvoicePro. All rights reserved.</p>
            </div>
          </div>
          <div className="col">
            <ul className="flex gap-6 text-gray-500 underline">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Contact</li>
            </ul>
          </div>
          <div className="col">
            <div className="flex gap-3">
              <Earth />
              <AtSign/>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Footer