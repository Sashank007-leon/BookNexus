import React from 'react';
import HeroSection from '../components/HeroSection';
import CategoriesSection from '../components/CategoriesSection';
import FeaturedBooks from '../components/FeaturedBooks';

const Homepage = () => {
  return (
    <div>
      <HeroSection />
      <CategoriesSection />
      <FeaturedBooks />
    </div>
  );
};

export default Homepage;
