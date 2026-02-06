const $ = s => document.querySelector(s);

function clean(u) {
  u = String(u || "").trim().toLowerCase();
  u = u.replace(/[^a-z0-9_]/g, "");
  return u;
}

$("#btn").addEventListener("click", async () => {
  const username = clean($("#username").value);
  const token = String($("#token").value || "").trim();
  const btn = $("#btn");

  if (!username) return alert("Username kosong");

  btn.disabled = true;
  btn.textContent = "Processing...";
  $("#out").textContent = "Memproses...";

  try {
    const r = await fetch("/api/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, token })
    });

    const j = await r.json().catch(() => ({}));

    if (!r.ok || !j.ok) {
      $("#out").textContent = `GAGAL\n\n${j.message || "Unknown error"}`;
      return;
    }

    const x = j.result;
    $("#out").textContent = `BERHASIL ✅\n\nPANEL: ${x.panel}\nSERVER ID: ${x.server_id}\n\nUSERNAME: ${x.username}\nPASSWORD: ${x.password}\nCREATED: ${x.created}\n\nSPEK SERVER\nRAM: ${x.ram}\nDISK: ${x.disk}\nCPU: ${x.cpu}`;

  } catch (err) {
    $("#out").textContent = "Error Connection";
  } finally {
    btn.disabled = false;
    btn.textContent = "Buat Sekarang (UNLI)";
  }
});