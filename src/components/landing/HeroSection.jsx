function HeroSection() {
  return (
    <section className="py-20 border-b border-gray-300 shadow-sm">
      <div className="container w-7xl mx-auto">
        <div className="row flex justify-around items-center">
          <div className="col flex-col space-y-7">
            <span className="bg-blue-600 text-white px-4 py-1 rounded-2xl">
              NEW: Automated Payment Reminders
            </span>

            <h1 className="text-5xl font-bold mt-5">
              <span>Professional Invoicing</span>
              <br />
              <span className="text-blue-600">Made Simple</span>
            </h1>

            <p className="text-gray-500">
              <span>
                Save hours of manual paperwork and get paid up to 3x faster with
                intuitive
              </span>
              <br />
              <span>
                templates,real-time tracking, and seamless online payments.
              </span>
            </p>

            <div className="flex gap-6">
              <button className="bg-blue-600 px-5 py-3 text-white rounded-lg hover:cursor-pointer hover:bg-white hover:text-blue-600 border hover:border-blue-600">
                Get Started for Free
              </button>
              <button className="px-5 py-3 text-blue-600 rounded-lg hover:cursor-pointer hover:bg-blue-600 hover:text-white border border-blue-600">Watch a Demo</button>
            </div>

            <div className="flex gap-2 items-center">
              <img src="/reviews.png" alt="reviews" width={150} />
              <span className="text-gray-500">Trusted bt 5,000 + freelancers</span>
            </div>
          </div>
          <div className="col">
            <img src="/hero.png" alt="hero" width={700} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
