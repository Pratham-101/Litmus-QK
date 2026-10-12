import React from "react";
import { T } from "../theme.js";
import { Container, Eyebrow, H2 } from "../components/ui.jsx";

// Privacy policy for unitevals.com. It describes only what the site actually collects (see
// api/_lib/db.js and api/session.js); keep the two in step when either changes.
const UPDATED = "12 October 2026";
const CONTACT = "litmus.unitevals@gmail.com";

export default function Privacy() {
  return (
    <section style={{ padding: "84px 0 110px" }}>
      <Container style={{ maxWidth: 760 }}>
        <Eyebrow>Legal</Eyebrow>
        <H2 style={{ fontSize: "clamp(30px, 4vw, 42px)" }}>Privacy policy</H2>
        <p style={meta}>Last updated {UPDATED}</p>

        <P>
          This policy explains what the Litmus website (unitevals.com), run by QK AI Labs, collects when you
          use it, why, and what you can ask us to do with it. It covers this website only, not the Litmus
          desktop application, which runs on your own computer.
        </P>

        <H>What we collect</H>
        <ul style={list}>
          <li><b>When you sign up to download:</b> your name, your email address and, if you give it, your company.</li>
          <li><b>When you continue with Google:</b> the name and email address on your Google account. We do not
            receive your Google password or access to your Gmail, Drive or contacts.</li>
          <li><b>When you download:</b> which installer you downloaded and when.</li>
          <li><b>When you use "Talk to our FDE":</b> what you type into that form: name, work email, company, the
            kind of agent and your message.</li>
          <li><b>To stop abuse of the forms:</b> your network address, kept for up to an hour to limit repeated
            submissions.</li>
        </ul>
        <P>We do not use advertising or tracking cookies. The site sets one cookie that keeps you signed in to the
          download page for up to 30 days.</P>

        <H>Why we collect it</H>
        <ul style={list}>
          <li>To give you the download and know how many people use Litmus.</li>
          <li>To reply to a walkthrough request you sent us.</li>
          <li>To contact you about Litmus, for example about a new beta. You can tell us to stop at any time.</li>
        </ul>

        <H>Where it is kept</H>
        <P>
          Sign-ups, downloads and walkthrough requests are stored in a database hosted by Supabase. The website is
          hosted by Vercel, and the installers are served from GitHub. Google sign-in is handled by Google and
          Supabase. These providers process the data only to run these services for us. We do not sell your data
          or share it with anyone else.
        </P>

        <H>How long we keep it</H>
        <P>We keep sign-up and download records while the Litmus beta runs, and delete them when you ask.</P>

        <H>Your choices</H>
        <P>
          You can ask us to show you, correct or delete what we hold about you, or to stop contacting you. Email{" "}
          <a href={`mailto:${CONTACT}`} style={link}>{CONTACT}</a> from the address you signed up with, and we
          will act on it within 30 days.
        </P>

        <H>Changes</H>
        <P>If this policy changes, the date at the top changes with it.</P>

        <H>Contact</H>
        <P>
          QK AI Labs · <a href={`mailto:${CONTACT}`} style={link}>{CONTACT}</a>
        </P>
      </Container>
    </section>
  );
}

const meta = { fontFamily: "IBM Plex Mono", fontSize: 12.5, color: T.ink3, marginBottom: 28 };
const list = { paddingLeft: 22, margin: "0 0 16px", color: T.ink2, fontSize: 16, lineHeight: 1.7 };
const link = { color: T.ink, textDecoration: "underline" };

function H({ children }) {
  return <h3 style={{ fontFamily: "Schibsted Grotesk", fontSize: 20, fontWeight: 700, color: T.ink, margin: "34px 0 10px" }}>{children}</h3>;
}

function P({ children }) {
  return <p style={{ color: T.ink2, fontSize: 16, lineHeight: 1.7, margin: "0 0 14px" }}>{children}</p>;
}
