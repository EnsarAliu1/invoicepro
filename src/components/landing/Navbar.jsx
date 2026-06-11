import { NavLink } from "react-router"

function Navbar() {
  return (
      <header>
          <nav>
              <div className="container py-6 border-b border-gray-300 shadow-sm">
                  <div className="row flex justify-between items-center">
                      <div className="col ml-10">
                          <span className="text-xl font-bold text-blue-500">InvoicePro</span>
                      </div>
                      <div className="col mr-10">
                          <ul className="flex space-x-7">
                              <li className="hover:text-blue-500">
                                  <a href="#" >Home</a>
                              </li>
                              <li className="hover:text-blue-500">
                                  <a href="#">About</a>
                              </li>
                              <li className="hover:text-blue-500">
                                  <NavLink to="/login" className="border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white h-10 py-2 px-4 rounded-lg">Login</NavLink>
                              </li>
                              <li className="hover:text-blue-500">
                                  <NavLink to="/register" className="border border-blue-500 text-white bg-blue-500 hover:text-blue-500 hover:bg-white h-10 py-2 px-4 rounded-lg">Get Started</NavLink>
                              </li>
                          </ul>
                      </div>
                  </div>
              </div>
          </nav>
    </header>
  )
}

export default Navbar