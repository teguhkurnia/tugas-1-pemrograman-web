/**
 * js/stock.js
 * Frontend logic to manage array data and DOM updates for Stock Page
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Session Validation
    const sessionData = localStorage.getItem('ut_user_session');
    if (!sessionData) {
        alert('Akses Ditolak! Anda belum login.');
        window.location.replace('index.html');
        return;
    }

    const userData = JSON.parse(sessionData);
    document.getElementById('userName').textContent = userData.nama;
    document.getElementById('userRole').textContent = `${userData.role} • ${userData.lokasi}`;

    // Fitur Log Out
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Apakah Anda yakin ingin keluar dari portal?')) {
            localStorage.removeItem('ut_user_session');
            window.location.replace('index.html');
        }
    });

    // 2. Local State Management (Data Array)
    // We clone the global `dataBahanAjar` array so we can mutate it safely on this page
    let localDataStok = [];
    if (typeof dataBahanAjar !== 'undefined') {
        localDataStok = [...dataBahanAjar];
    }

    const tableBody = document.getElementById('tableBodyStok');

    // Menderedering Tabel
    function renderTable() {
        tableBody.innerHTML = ''; // Kosongkan tabel dahulu

        if (localDataStok.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 2rem;">Belum ada data!</td></tr>`;
            return;
        }

        localDataStok.forEach((item) => {
            // Kita bikin dummy icon jika gambar belum ada untuk demo estetika
            const domRow = document.createElement('tr');

            domRow.innerHTML = `
                <td>
                    <div class="cover-wrapper">
                       <img src="${item.cover}" alt="${item.namaBarang}" onerror="this.style.display='none';">
                    </div>
                </td>
                <td>
                    <div class="book-title">
                        <strong>${item.namaBarang}</strong>
                        <span>Kode: ${item.kodeBarang}</span>
                    </div>
                </td>
                <td>${item.kodeLokasi}</td>
                <td><span class="badge ${item.jenisBarang === 'BMP' ? 'success' : 'warning'}">${item.jenisBarang}</span></td>
                <td>Edisi ${item.edisi}</td>
                <td><span class="stok-badge">${item.stok} Item</span></td>
            `;

            tableBody.appendChild(domRow);
        });
    }

    // Panggil render pertama kali
    renderTable();

    // 3. Modal Add New Logic
    const modalTambah = document.getElementById('modalTambah');
    const btnTambahStock = document.getElementById('btnTambahStock');
    const btnCloseModal = document.getElementById('btnCloseModal');
    const btnBatal = document.getElementById('btnBatal');
    const formTambahStok = document.getElementById('formTambahStok');

    // Buka Modal
    btnTambahStock.addEventListener('click', () => {
        modalTambah.classList.add('show');
    });

    // Tutup Modal
    const closeModalFunc = () => {
        modalTambah.classList.remove('show');
        formTambahStok.reset(); // Reset isi form
    };

    btnCloseModal.addEventListener('click', closeModalFunc);
    btnBatal.addEventListener('click', closeModalFunc);

    // Tangani Submit Data Tambah (Create/Add to DOM)
    formTambahStok.addEventListener('submit', (e) => {
        e.preventDefault();

        // 1. Ambil Variable Datanya
        const kodeBarang = document.getElementById('inKodeBarang').value.trim();
        const namaBarang = document.getElementById('inNamaBarang').value.trim();
        const kodeLokasi = document.getElementById('inKodeLokasi').value.trim();
        const jenisBarang = document.getElementById('inJenisBarang').value;
        const edisi = document.getElementById('inEdisi').value;
        const stok = parseInt(document.getElementById('inStok').value);

        // Validasi Sederhana
        if (!kodeBarang || !namaBarang || !kodeLokasi) return;

        // 2. Buat Ojek Baru
        const newItem = {
            kodeLokasi: kodeLokasi.toUpperCase(),
            kodeBarang: kodeBarang.toUpperCase(),
            namaBarang: namaBarang,
            jenisBarang: jenisBarang,
            edisi: edisi,
            stok: stok,
            cover: ""
        };

        // 3. Tambahkan ke Array (sebagai simulasi Post Request)
        localDataStok.unshift(newItem); // Tambahkan di baris paling atas (Awal)

        // 4. Render Ulang Tabel dan Tutup Modal
        renderTable();
        closeModalFunc();

        alert('Berhasil! Stok Modul Baru telah ditambahkan dengan Javascript DOM ke Daftar Info Bahan Ajar.');
    });

});
