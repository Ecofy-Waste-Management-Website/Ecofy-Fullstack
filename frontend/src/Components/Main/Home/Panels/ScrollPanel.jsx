import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ScrollPanel = ({ children, offset = 0, bgColor = 'bg-white', isLast = false, zIndex = 10 }) => {
  const panelRef = useRef(null);
  const contentRef = useRef(null);

  useLayoutEffect(() => {
    if (isLast) return;

    const panel = panelRef.current;
    const content = contentRef.current;

    const ctx = gsap.context(() => {
      // Scale-down effect as next panel slides over — smooth scrub with lag
      gsap.to(panel, {
        scale: 0.93,
        borderRadius: '3rem',         // maintain border-radius during scale
        transformOrigin: 'center top', // shrink from the top so it feels buried
        ease: 'none',
        scrollTrigger: {
          trigger: panel,
          start: `top ${offset}px`,
          end: `+=${window.innerHeight}`,
          scrub: 1.2,                  // smooth lag instead of instant 1:1 sync
          invalidateOnRefresh: true,
        },
      });

      // Content: subtle upward parallax + fade out so buried panel is invisible
      gsap.to(content, {
        y: -40,
        opacity: 0.4,
        ease: 'none',
        scrollTrigger: {
          trigger: panel,
          start: `top ${offset}px`,
          end: `+=${window.innerHeight * 0.7}`,
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      });
    }, panel);

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
        boxShadow: !isLast ? '0 -24px 80px rgba(0,0,0,0.35)' : 'none',
        zIndex: zIndex,
        marginTop: !isLast && offset !== 0 ? '-24px' : '0',
        transformOrigin: 'center top',
        willChange: 'transform',
      }}
    >
      <div ref={contentRef} className="max-w-7xl mx-auto w-full flex flex-col items-center text-center pt-10 pb-20">
        {children}
      </div>
    </section>
  );
};

export default ScrollPanel;
