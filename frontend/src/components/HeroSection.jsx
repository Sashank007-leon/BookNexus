import React from 'react';

const HeroSection = () => {
  return (
    <section
      className="h-[80vh] bg-cover bg-center flex items-center justify-center text-white text-center"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1512820790803-83ca734da794')",
      }}
    >
      <div className="bg-black bg-opacity-50 p-10 rounded-xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Discover Your Next Great Read</h1>
        <p className="text-lg mb-6">Browse thousands of books from every genre imaginable</p>
        <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-6 rounded">
          Shop Now
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
