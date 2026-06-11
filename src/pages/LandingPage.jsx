import About from "../components/landing/About"
import Footer from "../components/landing/Footer"
import GetStarted from "../components/landing/GetStarted"
import HeroSection from "../components/landing/HeroSection"
import Navbar from "../components/landing/Navbar"

function LandingPage() {
  return (
      <>
          <Navbar />
          <HeroSection />
          <About />
          <GetStarted />
          <Footer/>
      </>
  )
}

export default LandingPage