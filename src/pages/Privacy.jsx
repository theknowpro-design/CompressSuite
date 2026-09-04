function Privacy() {
  return (
    <>
      <style>{`.app-header, .faq { display: none !important; }`}</style>
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "2rem", textAlign: "center" }}>
        <h1>Privacy Policy</h1>
        <p>
          Your privacy matters. CompressSuite does not store, analyze, or retain the files you upload.
          All compression happens directly in your browser or through secure, temporary processing.
          Once your session ends, your files are gone permanently.
        </p>
        <p>
          We do not sell your data, share your data, or track personal information beyond basic
          analytics used to improve performance. By using CompressSuite, you agree to responsible
          use of the platform and acknowledge that compressed files are provided as‑is.
        </p>
        <p>
          For privacy questions, contact us at info@compresssuite.com.
        </p>
      </div>
    </>
  );
}

export default Privacy;
