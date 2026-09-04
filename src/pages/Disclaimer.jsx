function Disclaimer() {
  return (
    <>
      <style>{`.app-header, .faq { display: none !important; }`}</style>
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "2rem", textAlign: "center" }}>
        <h1>Disclaimer</h1>
        <p>
          CompressSuite is a utility tool designed to help users reduce file sizes. While we aim
          for high‑quality results, compression may alter visual or audio fidelity depending on
          the file type and settings. Always keep backups of your original files.
        </p>
      </div>
    </>
  );
}

export default Disclaimer;
