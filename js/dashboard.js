/**
 * js/dashboard.js
 * Frontend logic for Dashboard UT-Daerah
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Validasi Autentikasi Sesi (Melindungi Dashboard)
    const sessionData = localStorage.getItem('ut_user_session');
    
    // Jika tidak ada data sesi maka otomatis tendang ke halaman login
    if (!sessionData) {
        alert('Akses Ditolak! Anda belum login. Silakan login terlebih dahulu.');
        window.location.replace('index.html');
        return;
    }

    // Ekstrak data user tersimpan
    const userData = JSON.parse(sessionData);

    // Menampilkan Nama, Role, dan Lokasi ke dalam UI Profile Card
    document.getElementById('userName').textContent = userData.nama;
    document.getElementById('userRole').textContent = `${userData.role} • ${userData.lokasi}`;

    // 2. Fitur Greeting Dinamis (Pagi/Siang/Sore/Malam)
    const greetingTextElement = document.getElementById('greetingText');
    const dateTextElement = document.getElementById('dateText');
    
    function setDynamicGreeting() {
        const now = new Date();
        const hour = now.getHours(); // Format 0 - 23
        let greeting = 'Selamat Pagi';
        
        // Logika Waktu
        if (hour >= 0 && hour < 11) {
            greeting = 'Selamat Pagi';
        } else if (hour >= 11 && hour < 15) {
            greeting = 'Selamat Siang';
        } else if (hour >= 15 && hour < 18) {
            greeting = 'Selamat Sore';
        } else {
            greeting = 'Selamat Malam';
        }
        
        // Memecah nama menjadi nama panggilan (mengambil kata pertama)
        const namaPanggilan = userData.nama.split(' ')[0];
        greetingTextElement.textContent = `${greeting}, ${namaPanggilan}!`;
        
        // Format Tanggal dalam bahasa Indonesia
        const optionTanggal = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateTextElement.textContent = now.toLocaleDateString('id-ID', optionTanggal);
    }
    
    setDynamicGreeting();

    // 3. Fitur Log Out (Keluar)
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const confirmLogout = confirm('Apakah Anda yakin ingin keluar dari portal?');
        if (confirmLogout) {
            // Hapus data sesi di local storage
            localStorage.removeItem('ut_user_session');
            // Redirect aman ke login
            window.location.replace('index.html');
        }
    });

    // 4. Data Binding from data.js
    if (typeof dataBahanAjar !== 'undefined' && typeof dataTracking !== 'undefined') {
        
        // a. Hitung Total Stok Bahan Ajar Aktif
        let totalStok = 0;
        dataBahanAjar.forEach(item => totalStok += item.stok);
        document.getElementById('statBahanAjar').innerHTML = `${totalStok.toLocaleString('id-ID')} <small>Item</small>`;

        // b. Hitung Status Tracking DO
        let totalPerjalanan = 0;
        let totalSelesai = 0;
        const arrayTrackingObj = Object.values(dataTracking);

        arrayTrackingObj.forEach(track => {
            if (track.status.toLowerCase().includes('perjalanan') || track.status.toLowerCase().includes('dikirim')) {
                totalPerjalanan++;
            } else if (track.status.toLowerCase().includes('selesai') || track.status.toLowerCase().includes('diterima') || track.status.toLowerCase() === 'dikirim' /* jika pakai asumsi dikirim = selesai */) {
                // Adjusting 'Dikirim' depending on business logic, here we set "Selesai" as fulfilled.
                // Wait, in data.js Agus has "status: 'Dikirim'" and the last step says "Selesai Antar". Let's count "Dikirim" or "Selesai" as totalSelesai.
                totalSelesai++;
            }
        });
        
        // Memastikan jika status 'Dikirim' masuk ke selesai / perjalanan berdasarkan history:
        // Di data.js Agus is 'Dikirim' and last history is 'Selesai Antar'. So it's completed.
        // Rina is 'Dalam Perjalanan'.
        // To be safe and precise checking array dataTracking:
        let countJalan = 0;
        let countSelesai = 0;
        arrayTrackingObj.forEach(track => {
            if(track.status === 'Dalam Perjalanan') countJalan++;
            else countSelesai++;
        });

        document.getElementById('statPerjalanan').innerHTML = `${countJalan} <small>DO</small>`;
        document.getElementById('statSelesai').innerHTML = `${countSelesai} <small>DO</small>`;

        // c. Render Tabel Aktivitas Terbaru
        const tabelAktivitas = document.getElementById('statAktivitasTerbaru');
        let htmlTabel = '';
        
        arrayTrackingObj.forEach(track => {
            // Find corresponding modul detail if needed (to get name from paket code) 
            // We can just use the paket code or search dataBahanAjar
            const produk = dataBahanAjar.find(b => b.kodeLokasi === track.paket);
            const namaModul = produk ? `${produk.namaBarang} (${produk.kodeBarang})` : `Paket Gudang (${track.paket})`;
            
            // Format Badge css
            let badgeClass = track.status === 'Dalam Perjalanan' ? 'warning' : 'success';

            // Tanggal Pembaruan (ambil dari elemen terakhir perjalanan)
            let lastUpdate = track.perjalanan[track.perjalanan.length - 1].waktu;

            htmlTabel += `
                <tr>
                    <td>${track.nomorDO}</td>
                    <td>${namaModul}</td>
                    <td><span class="badge ${badgeClass}">${track.status}</span></td>
                    <td>${lastUpdate}</td>
                </tr>
            `;
        });
        
        // Jika tidak ada data
        if(arrayTrackingObj.length === 0) {
            htmlTabel = `<tr><td colspan="4" style="text-align: center;">Belum ada riwayat aktivitas.</td></tr>`;
        }

        tabelAktivitas.innerHTML = htmlTabel;
    }
});
