// Warm, editorial light design system — premium sales-grade aesthetic.
// Near-black ink on sand, generous whitespace, refined display type.
export const T = {
  bg: "#f7f4ee",        // warm sand page
  bgWarm: "#f1ece2",    // slightly deeper sand for alternating sections
  ink: "#1a1613",       // near-black text
  ink2: "#5c554c",      // secondary text
  ink3: "#8c8377",      // muted / captions
  paper: "#ffffff",     // cards
  paperAlt: "#fbf9f4",
  line: "#e4ddd0",      // hairline borders
  lineSoft: "#ece6da",
  // restrained brand triad for the framework branches
  red: "#c1452f",       // CLAMP — safety
  blue: "#2f5fc1",      // PEST — correctness
  green: "#2f7d52",     // GHTPWR — production
  accent: "#1a1613",    // primary buttons are ink (Braintrust-like)
  amber: "#b87514",
  ring: "#1a161312",
  brand: "#292862",       // brand navy
  brandGold: "#fca61b",   // brand amber/gold accent
};

export const PARTNERS = ["QK AI Labs", "DevRev", "Arize AX"];

export const BRANCH = {
  CLAMP: { color: "#c1452f", label: "CLAMP", full: "Governance & Risk Gates", q: "Is the agent safe to deploy?" },
  PEST: { color: "#2f5fc1", label: "PEST", full: "Evaluation & Testing", q: "Does the agent work correctly?" },
  GHTPWR: { color: "#2f7d52", label: "GHTPWR", full: "Production Readiness & Ops", q: "Can the agent operate at scale?" },
};

export const MAXW = 1200;

// Product identity
export const PRODUCT = {
  name: "Litmus",
  by: "QK AI Labs",
  tagline: "The definitive test for production AI agents.",
};

// The live evaluation tool — intentionally NOT linked publicly. Only surfaced
// via a small "Launch live demo" button on the Contact page. Point this at the
// hosted URL once deployed (Replit / Vercel).
export const LIVE_TOOL_URL = "https://litmus-engine.replit.app";
