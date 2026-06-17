import React, { useState, useEffect, useCallback } from "react";
import Nav from "./components/Nav.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Framework from "./pages/Framework.jsx";
import Architecture from "./pages/Architecture.jsx";
import Observability from "./pages/Observability.jsx";
import Cases from "./pages/Cases.jsx";
import Roadmap from "./pages/Roadmap.jsx";
import Docs from "./pages/Docs.jsx";
import Contact from "./pages/Contact.jsx";

const ROUTES = { home: Home, framework: Framework, architecture: Architecture, observability: Observability, cases: Cases, roadmap: Roadmap, docs: Docs, contact: Contact };

function parseHash() {
  const raw = window.location.hash.replace(/^#\/?/, "");
  const [route, anchor] = raw.split("#");
  return { route: ROUTES[route] ? route : "home", anchor };
}

export default function App() {
  const [route, setRoute] = useState(() => parseHash().route);

  const go = useCallback((to, hash) => {
    window.location.hash = `/${to}${hash || ""}`;
  }, []);

  useEffect(() => {
    const onHash = () => {
      const { route: r, anchor } = parseHash();
      setRoute(r);
      requestAnimationFrame(() => {
        if (anchor) {
          const el = document.getElementById(anchor);
          if (el) { el.scrollIntoView({ behavior: "smooth" }); return; }
        }
        window.scrollTo({ top: 0, behavior: "auto" });
      });
    };
    window.addEventListener("hashchange", onHash);
    onHash();
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const Page = ROUTES[route] || Home;

  return (
    <>
      <ResponsiveCSS />
      <Nav route={route} go={go} />
      <main><Page go={go} /></main>
      <Footer go={go} />
    </>
  );
}

function ResponsiveCSS() {
  return (
    <style>{`
      .grid-4 { grid-template-columns: repeat(4, 1fr); }
      .grid-3 { grid-template-columns: repeat(3, 1fr); }
      .grid-2 { grid-template-columns: 1fr 1fr; }
      @media (max-width: 1000px) {
        .grid-4 { grid-template-columns: repeat(2, 1fr) !important; }
      }
      @media (max-width: 900px) {
        .nav-links { display: none !important; }
        .footer-grid { grid-template-columns: 1fr 1fr !important; }
        .grid-3 { grid-template-columns: 1fr !important; }
        .grid-2 { grid-template-columns: 1fr !important; direction: ltr !important; }
      }
      @media (max-width: 560px) {
        .footer-grid { grid-template-columns: 1fr !important; }
        .grid-4 { grid-template-columns: 1fr !important; }
        .hero-cta { flex-direction: column !important; align-items: stretch !important; }
      }
    `}</style>
  );
}
