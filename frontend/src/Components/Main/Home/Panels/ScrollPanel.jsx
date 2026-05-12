import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ScrollPanel = ({ children, offset = 0, bgColor = 'bg-white', isLast = false, zIndex = 10 }) => {
  const panelRef = useRef(null);
  const contentRef = useRef(null);

  useLayoutEffect(() => {
    if (isLast) return;

    const ctx = gsap.context(() => {
      // Create the cinematic scale-down effect as the panel is buried
      gsap.to(panelRef.current, {
        scale: 0.9,
        ease: 'none',
        scrollTrigger: {
          trigger: panelRef.current,
          start: `top ${offset}px`,
          end: `+=${window.innerHeight * 0.8}`,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      // Subtle content parallax/fade
      gsap.to(contentRef.current, {
        y: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: panelRef.current,
          start: `top ${offset}px`,
          end: `+=${window.innerHeight * 0.8}`,
          scrub: true,
        },
      });
    }, panelRef);

    return () => ctx.revert();
  }, [offset, isLast]);

  return (
    <section
      ref={panelRef}
      className={`relative w-full h-screen flex flex-col items-center justify-center px-6 lg:px-16 overflow-hidden ${bgColor} ${
        !isLast ? 'sticky' : 'relative'
      }`}
      style={{
        top: !isLast ? `${offset}px` : 'auto',
        borderRadius: !isLast ? '3rem' : '0',
        boxShadow: !isLast ? '0 -20px 80px rgba(0,0,0,0.4)' : 'none',
        zIndex: zIndex,
        marginTop: !isLast && offset !== 0 ? '-30px' : '0',
      }}
    >
      <div ref={contentRef} className="max-w-7xl mx-auto w-full flex flex-col items-center text-center pt-10 pb-20">
        {children}
      </div>
    </section>
  );
};

export default ScrollPanel;
