// src/components/HomePage.jsx
import React from "react";

const Home = () => {
  return (
    <div className="bg-green-50 min-h-screen font-sans">
      {/* Hero + About Section Combined */}
      <section className="relative bg-cover bg-center h-screen">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFF8DC] to-green-400 bg-opacity-60"></div>
        <div className="relative container mx-auto px-6 py-24 text-white flex flex-col justify-center items-center h-full text-center">
          <h1 className="text-5xl text-green-800 font-extrabold leading-tight max-w-4xl">
            Growing Smarter with AgriBot AI
          </h1>
          <p className="mt-6 text-lg max-w-3xl text-gray-600">
            AgriBot AI combines data, machine learning, and precision tools to
            help farmers make smarter decisions. From predicting climate impacts
            to tracking market prices and monitoring crop health — AI is
            transforming how we grow, manage, and sustain food production
            globally.
          </p>
          <a
            href="#benefits"
            className="mt-8 inline-block bg-white text-green-800 px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-100 transition duration-300"
          >
            Explore Key Benefits
          </a>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section id="benefits" className="py-20 bg-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-green-800 mb-10">
            Key Benefits of Agriculture AI
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-6">
            {/* Climate Analysis */}
            <div className="bg-green-100 p-6 rounded-lg shadow-md text-left">
              <h3 className="text-xl font-bold text-green-900 mb-3">
                Climate Analysis
              </h3>
              <p className="text-green-700">
                AI analyzes weather patterns and soil conditions to help farmers
                anticipate droughts, rainfall, and temperature changes —
                optimizing planning and reducing risk.
              </p>
            </div>

            {/* Precision Farming */}
            <div className="bg-green-100 p-6 rounded-lg shadow-md text-left">
              <h3 className="text-xl font-bold text-green-900 mb-3">
                Precision Farming
              </h3>
              <p className="text-green-700">
                Optimize water, fertilizer, and pesticide usage by leveraging
                AI-powered sensors and drones — improving crop yield while
                minimizing environmental impact.
              </p>
            </div>

            {/* Market Price Tracking */}
            <div className="bg-green-100 p-6 rounded-lg shadow-md text-left">
              <h3 className="text-xl font-bold text-green-900 mb-3">
                Market Price Tracking
              </h3>
              <p className="text-green-700">
                Stay informed about real-time market prices and trends. AI tools
                help farmers decide the best time to sell produce and maximize
                profits.
              </p>
            </div>

            {/* Crop Insights */}
            <div className="bg-green-100 p-6 rounded-lg shadow-md text-left">
              <h3 className="text-xl font-bold text-green-900 mb-3">
                Detailed Crop Insights
              </h3>
              <p className="text-green-700">
                Monitor plant health, growth stages, and nutrient deficiencies
                using AI — empowering data-backed decisions for every crop
                cycle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 bg-green-700 text-white text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-6">Empower Your Farm with AI</h2>
          <p className="text-lg max-w-2xl mx-auto">
            Ready to elevate your farming strategy? Discover how Agriculture AI
            can increase efficiency, profitability, and sustainability — all
            while supporting our planet.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
