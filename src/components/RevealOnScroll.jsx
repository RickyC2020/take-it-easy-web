import React, { useEffect, useRef, useState } from 'react';

/**
 * Reusable Scroll-Reveal component using native browser IntersectionObserver API.
 * Provides high-end, luxury fade-in and slide-up physics.
 * Respects prefers-reduced-motion / motion-safe accessibility.
 */
export default function RevealOnScroll({
  children,
  delay = 0,
  duration = 700,
  className = '',
  as: Component = 'div',
  threshold = 0.12,
  rootMargin = '0px 0px -50px 0px',
  immediate = false,
  style = {},
  ...props
}) {
  const [isVisible, setIsVisible] = useState(() => {
    if (immediate) return true;
    // Fallback for SSR or environments without IntersectionObserver
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return true;
    }
    return false;
  });

  const elementRef = useRef(null);

  useEffect(() => {
    if (isVisible) return;
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    const node = elementRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            // Trigger once: unobserve so element stays visible and doesn't flicker/re-animate
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(node);

    return () => {
      if (node) observer.unobserve(node);
      observer.disconnect();
    };
  }, [threshold, rootMargin, isVisible]);

  const combinedStyle = {
    ...style,
    transitionDelay: isVisible && delay ? `${delay}ms` : '0ms',
    transitionDuration: `${duration}ms`,
  };

  return (
    <Component
      ref={elementRef}
      style={combinedStyle}
      className={`motion-safe:transition-all motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[opacity,transform] motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:transform-none ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'motion-safe:opacity-0 motion-safe:translate-y-8 motion-safe:scale-[0.98]'
      } ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
