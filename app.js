document.getElementById('btn-create')?.addEventListener('click', async () => {
    const username = document.getElementById('username').value;
    const token = document.getElementById('token').value;
    const ram = document.getElementById('ram').value;
    const btn = document.getElementById('btn-create');
    const out = document.getElementById('output');
    const loader = document.getElementById('loader');

    if (!username || !token) return alert("Isi semua field!");

    btn.classList.add('hidden');
    loader.classList.remove('hidden');
    out.classList.add('hidden');

    try {
        const response = await fetch('/api/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, token, ram })
        });

        const data = await response.json();

        loader.classList.add('hidden');
        btn.classList.remove('hidden');
        out.classList.remove('hidden');

        if (data.ok) {
            out.textContent = `✅ BERHASIL!\n\nUser: ${data.result.username}\nPass: ${data.result.password}\nRAM: ${ram === '0' ? 'Unlimited' : ram + 'MB'}\nURL: ${data.result.panel}`;
        } else {
            out.textContent = `❌ GAGAL: ${data.message}`;
        }
    } catch (e) {
        alert("Koneksi gagal");
        btn.classList.remove('hidden');
        loader.classList.add('hidden');
    }
});