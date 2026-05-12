import React, {useEffect, useRef, useState} from "react";

export function ScrollReveal({children, delay = 0, className = "", style = {}}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {if (entry.isIntersecting) {setVisible(true); observer.disconnect();}},
      {threshold: 0.1}
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

export function StaggerContainer({children, className = "", style = {}}) {
  return <div className={className} style={style}>{children}</div>;
}

export function StaggerItem({children, index = 0, className = ""}) {
  return <ScrollReveal delay={index * 0.08} className={className}>{children}</ScrollReveal>;
}
