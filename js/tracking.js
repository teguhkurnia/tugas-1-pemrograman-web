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

    document.getElementById("logoutBtn").addEventListener("click", (e) => {
        e.preventDefault();
        if (confirm("Apakah Anda yakin ingin keluar dari portal?")) {
            localStorage.removeItem("ut_user_session");
            window.location.replace("index.html");
        }
    });

    const trackingForm = document.getElementById("trackingForm");
    const doInput = document.getElementById("doNumber");
    const btnSearch = document.querySelector(".btn-search");

    const errorMsg = document.getElementById("errorMessage");
    const trackingResult = document.getElementById("trackingResult");

    const lblNama = document.getElementById("lblNama");
    const lblNoDO = document.getElementById("lblNoDO");
    const lblEkspedisi = document.getElementById("lblEkspedisi");
    const lblTanggal = document.getElementById("lblTanggal");
    const lblPaket = document.getElementById("lblPaket");
    const lblTotal = document.getElementById("lblTotal");
    const lblStatus = document.getElementById("lblStatus");
    const timelineList = document.getElementById("timelineList");

    const stepTransit = document.getElementById("stepTransit");
    const stepDelivered = document.getElementById("stepDelivered");

    trackingForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const value = doInput.value.trim();
        if (!value) return;

        btnSearch.innerHTML = `<i class='bx bx-loader-alt bx-spin'></i>`;
        errorMsg.style.display = "none";
        trackingResult.style.display = "none";

        setTimeout(() => {
            btnSearch.innerHTML = `<span>Lacak Paket</span>`;

            const resultList =
                typeof dataTracking !== "undefined" ? dataTracking : {};
            const item = resultList[value];

            if (item) {
                lblNama.textContent = item.nama;
                lblNoDO.textContent = item.nomorDO;
                lblEkspedisi.textContent = item.ekspedisi;
                lblTanggal.textContent = item.tanggalKirim;
                lblPaket.textContent = item.paket;
                lblTotal.textContent = item.total;

                stepTransit.classList.remove("active");
                stepDelivered.classList.remove("active");

                lblStatus.textContent = item.status;
                if (
                    item.status === "Selesai" ||
                    item.status === "Dikirim" ||
                    item.status.includes("Selesai")
                ) {
                    lblStatus.className = "badge success";
                    stepTransit.classList.add("active");
                    stepDelivered.classList.add("active");
                } else if (item.status.includes("Perjalanan")) {
                    lblStatus.className = "badge warning";
                    stepTransit.classList.add("active");
                } else {
                    lblStatus.className = "badge";
                }

                let timelineHTML = "";
                item.perjalanan.forEach((step, index) => {
                    const isLast = index === item.perjalanan.length - 1;
                    timelineHTML += `
                        <div class="timeline-item ${isLast ? "complete" : ""}">
                            <span class="time">${step.waktu}</span>
                            <p class="desc">${step.keterangan}</p>
                        </div>
                    `;
                });
                timelineList.innerHTML = timelineHTML;

                trackingResult.style.display = "block";

                window.scrollTo({
                    top: trackingResult.offsetTop - 50,
                    behavior: "smooth",
                });
            } else {
                errorMsg.style.display = "block";
            }
        }, 800);
    });
});
