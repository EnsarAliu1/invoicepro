import About from "../components/landing/About"
import Footer from "../components/landing/Footer"
import GetStarted from "../components/landing/GetStarted"
import HeroSection from "../components/landing/HeroSection"

function LandingPage() {
  return (
      <>
          <HeroSection />
          <About />
          <GetStarted />
          <Footer/>
      </>
  )
}

export default LandingPage