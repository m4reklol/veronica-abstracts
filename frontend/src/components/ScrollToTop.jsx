import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import AOS from "aos";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll nahoru při změně cesty
    window.scrollTo({ top: 0, behavior: "instant" });

    const timeout = setTimeout(() => {
      AOS.refresh();
    }, 100);

    return () => clearTimeout(timeout);
  }, [pathname]);

  useEffect(() => {
    const handleClick = (event) => {
      const anchor = event.target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (href === window.location.pathname) {
        // Scrolluj nahoru i při kliknutí na stejnou URL
        window.scrollTo({ top: 0, behavior: "instant" });
        AOS.refresh();
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
};

export default ScrollToTop;
