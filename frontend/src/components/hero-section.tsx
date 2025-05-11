export function HeroSection() {
  return (
    <section className="w-full py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Secure Payment Processing for Your Business</h1>
          <p className="text-gray-600 mb-6">
            Fast, reliable, and secure payment processing solutions for businesses of all sizes.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#get-started" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Get Started
            </a>
            <a href="#learn-more" className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-100">
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
