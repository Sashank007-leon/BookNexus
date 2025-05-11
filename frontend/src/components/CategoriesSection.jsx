import React from 'react';
import { categories } from '../constants/categories';
import { useNavigate } from 'react-router-dom';

const CategoriesSection = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/category/${encodeURIComponent(category)}`);
  };

  return (
    <section className="py-10 text-center">
      <h2 className="text-3xl font-semibold mb-6">Browse by Category</h2>
      <div className="flex flex-wrap justify-center gap-4">
        {categories.map((category) => (
          <div
            key={category}
            onClick={() => handleCategoryClick(category)}
            className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-6 py-3 rounded-xl cursor-pointer transition"
          >
            {category}
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoriesSection;
