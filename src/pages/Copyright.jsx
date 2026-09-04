function Copyright() {
  const currentYear = new Date().getFullYear();
  return (
    <>
      <style>{`.app-header, .faq { display: none !important; }`}</style>
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "2rem", textAlign: "center" }}>
        <h1>Copyright</h1>
        <p>© {currentYear} CompressSuite. All rights reserved.</p>
        <p>
          Unauthorized reproduction, distribution, or modification of this software or its content
          is prohibited.
        </p>
      </div>
    </>
  );
}

export default Copyright;
