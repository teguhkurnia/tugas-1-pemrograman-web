document.addEventListener("DOMContentLoaded", () => {
    const sessionData = localStorage.getItem("ut_user_session");
    if (!sessionData) {
        alert(
            "Akses Ditolak! Anda belum login. Silakan login terlebih dahulu.",
        );
        window.location.replace("index.html");
        return;
    }

    const userData = JSON.parse(sessionData);

    document.getElementById("userName").textContent = userData.nama;
    document.getElementById("userRole").textContent =
        `${userData.role} • ${userData.lokasi}`;

    const greetingTextElement = document.getElementById("greetingText");
    const dateTextElement = document.getElementById("dateText");

    function setDynamicGreeting() {
        const now = new Date();
        const hour = now.getHours();
        let greeting = "Selamat Pagi";

        if (hour >= 0 && hour < 11) {
            greeting = "Selamat Pagi";
        } else if (hour >= 11 && hour < 15) {
            greeting = "Selamat Siang";
        } else if (hour >= 15 && hour < 18) {
            greeting = "Selamat Sore";
        } else {
            greeting = "Selamat Malam";
        }

        const namaPanggilan = userData.nama.split(" ")[0];
        greetingTextElement.textContent = `${greeting}, ${namaPanggilan}!`;

        const optionTanggal = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        };
        dateTextElement.textContent = now.toLocaleDateString(
            "id-ID",
            optionTanggal,
        );
    }

    setDynamicGreeting();

    const logoutBtn = document.getElementById("logoutBtn");
    logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const confirmLogout = confirm(
            "Apakah Anda yakin ingin keluar dari portal?",
        );
        if (confirmLogout) {
            localStorage.removeItem("ut_user_session");
            window.location.replace("index.html");
        }
    });

    if (
        typeof dataBahanAjar !== "undefined" &&
        typeof dataTracking !== "undefined"
    ) {
        let totalStok = 0;
        dataBahanAjar.forEach((item) => (totalStok += item.stok));
        document.getElementById("statBahanAjar").innerHTML =
            `${totalStok.toLocaleString("id-ID")} <small>Item</small>`;

        let totalPerjalanan = 0;
        let totalSelesai = 0;
        const arrayTrackingObj = Object.values(dataTracking);

        arrayTrackingObj.forEach((track) => {
            if (
                track.status.toLowerCase().includes("perjalanan") ||
                track.status.toLowerCase().includes("dikirim")
            ) {
                totalPerjalanan++;
            } else if (
                track.status.toLowerCase().includes("selesai") ||
                track.status.toLowerCase().includes("diterima") ||
                track.status.toLowerCase() === "dikirim"
            ) {
                totalSelesai++;
            }
        });

        let countJalan = 0;
        let countSelesai = 0;
        arrayTrackingObj.forEach((track) => {
            if (track.status === "Dalam Perjalanan") countJalan++;
            else countSelesai++;
        });

        document.getElementById("statPerjalanan").innerHTML =
            `${countJalan} <small>DO</small>`;
        document.getElementById("statSelesai").innerHTML =
            `${countSelesai} <small>DO</small>`;

        const tabelAktivitas = document.getElementById("statAktivitasTerbaru");
        let htmlTabel = "";

        arrayTrackingObj.forEach((track) => {
            const produk = dataBahanAjar.find(
                (b) => b.kodeLokasi === track.paket,
            );
            const namaModul = produk
                ? `${produk.namaBarang} (${produk.kodeBarang})`
                : `Paket Gudang (${track.paket})`;

            let badgeClass =
                track.status === "Dalam Perjalanan" ? "warning" : "success";

            let lastUpdate =
                track.perjalanan[track.perjalanan.length - 1].waktu;

            htmlTabel += `
                <tr>
                    <td>${track.nomorDO}</td>
                    <td>${namaModul}</td>
                    <td><span class="badge ${badgeClass}">${track.status}</span></td>
                    <td>${lastUpdate}</td>
                </tr>
            `;
        });

        if (arrayTrackingObj.length === 0) {
            htmlTabel = `<tr><td colspan="4" style="text-align: center;">Belum ada riwayat aktivitas.</td></tr>`;
        }

        tabelAktivitas.innerHTML = htmlTabel;
    }
});
