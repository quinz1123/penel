export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send();

  const { username, token, ram } = req.body;

  if (token !== "RIZKY123") {
    return res.status(403).json({ ok: false, message: "Token Salah!" });
  }

  const PANEL_URL = "https://danz-tsuyoi.flixiazone.my.id"; 
  const PTLA = "ptla_HDoMsQBrkjxBYtS0ei6h4pV7NwBHPxZfqgmQBMeczbv"; 

  try {
    // 1. Buat User
    const uRes = await fetch(`${PANEL_URL}/api/application/users`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${PTLA}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `${username}@gmail.com`, username, first_name: username, last_name: 'User', password: `${username}001`
      })
    });
    const uData = await uRes.json();
    if (!uRes.ok) return res.status(400).json({ ok: false, message: "User Error" });

    // 2. Buat Server dengan RAM dinamis
    const sRes = await fetch(`${PANEL_URL}/api/application/servers`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${PTLA}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: username, user: uData.attributes.id,
        egg: 15, nest: 5,
        docker_image: "ghcr.io/pterodactyl/yolks:debian",
        startup: "bash",
        environment: { BASH_VARIABLE: "value", CMD_RUN: "npm start" },
        limits: { 
            memory: parseInt(ram), // Menggunakan pilihan RAM dari Frontend
            swap: 0, disk: 0, io: 500, cpu: 0 
        },
        feature_limits: { databases: 5, backups: 5, allocations: 1 },
        deploy: { locations: [1], dedicated_ip: false, port_range: [] }
      })
    });

    if (sRes.ok) {
        return res.status(200).json({ ok: true, result: { username, password: `${username}001`, panel: PANEL_URL }});
    } else {
        return res.status(400).json({ ok: false, message: "Gagal buat server" });
    }
  } catch (e) {
    return res.status(500).json({ ok: false, message: "Internal Error" });
  }
}