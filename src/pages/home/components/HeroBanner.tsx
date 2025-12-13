import React from 'react';

const HeroBanner: React.FC = () => {
  return (
    <div className="bg-primary text-white text-center py-20">
      <h1 className="text-4xl font-bold">Welcome to Regiverse</h1>
      <p className="text-xl mt-4">Your all-in-one event management platform.</p>
      <button className="mt-8 bg-white text-primary font-bold py-2 px-4 rounded-full hover:bg-gray-200 transition-colors duration-200">
        Create an Event
      </button>
    </div>
  );
};

export default HeroBanner;
