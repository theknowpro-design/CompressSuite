function About() {
  return (
    <>
      <style>{`.app-header, .faq { display: none !important; }`}</style>
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "2rem", textAlign: "center" }}>
        <h1>About CompressSuite</h1>
        <p>
          CompressSuite is a fast, modern media compression tool built for creators, entrepreneurs,
          and everyday users who need smaller files without losing quality. Our mission is to make
          compression effortless, accessible, and lightning‑quick — whether you're optimizing images
          for a website, shrinking videos for social media, or preparing files for storage.
        </p>
        <p>
          CompressSuite runs on a streamlined, browser‑based engine with no installs, no sign‑ups,
          and no friction. Just drag, drop, and compress.
        </p>
      </div>
    </>
  );
}

export default About;
