import React, { useEffect, useState } from "react";

export default function BackToTop({ scrollContainerRef }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const container = scrollContainerRef?.current;
    if (!container) return;

    const onScroll = () => {
      setShow(container.scrollTop > 300);
    };
    container.addEventListener("scroll", onScroll);
    return () => container.removeEventListener("scroll", onScroll);
  }, [scrollContainerRef]);

  if (!show) return null;

  return (
    <button
      className="fixed right-8 bottom-8 z-20 bg-gray-800 text-white rounded-full shadow-lg p-2 hover:bg-blue-600 transition"
      onClick={() => {
        if (scrollContainerRef?.current) {
          scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
        }
      }}
      aria-label="Back to Top"
    >
      ↑ Back to Top
    </button>
  );
} 