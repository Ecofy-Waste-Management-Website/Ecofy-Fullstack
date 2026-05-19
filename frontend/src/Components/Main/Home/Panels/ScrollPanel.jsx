import React from 'react';

const ScrollPanel = ({ children, bgColor = 'bg-white' }) => {
  return (
    <section
      className={`relative w-full min-h-screen flex flex-col items-center justify-center px-6 lg:px-16 ${bgColor}`}
    >
      <div className="max-w-7xl mx-auto w-full flex flex-col items-center text-center pt-10 pb-20">
        {children}
      </div>
    </section>
  );
};

export default ScrollPanel;
