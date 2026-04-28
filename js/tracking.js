/**
 * js/tracking.js
 * Frontend logic specifically for the Tracking Page
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Session Validation (Protecting the page)
    const sessionData = localStorage.getItem('ut_user_session');
    if (!sessionData) {
        alert('Akses Ditolak! Anda belum login. Silakan login terlebih dahulu.');
        window.location.replace('index.html');
        return;
    }

    // Ekstrak profil user
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

    // 2. Logika Search Delivery Order (DO)
    const trackingForm = document.getElementById('trackingForm');
    const doInput = document.getElementById('doNumber');
    const btnSearch = document.querySelector('.btn-search');
    
    // UI Elements for Rendering
    const errorMsg = document.getElementById('errorMessage');
    const trackingResult = document.getElementById('trackingResult');
    
    // DOM Elements to Bind Data
    const lblNama = document.getElementById('lblNama');
    const lblNoDO = document.getElementById('lblNoDO');
    const lblEkspedisi = document.getElementById('lblEkspedisi');
    const lblTanggal = document.getElementById('lblTanggal');
    const lblPaket = document.getElementById('lblPaket');
    const lblTotal = document.getElementById('lblTotal');
    const lblStatus = document.getElementById('lblStatus');
    const timelineList = document.getElementById('timelineList');
    
    const stepTransit = document.getElementById('stepTransit');
    const stepDelivered = document.getElementById('stepDelivered');

    trackingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const value = doInput.value.trim();
        if(!value) return;

        // Visual loading effect
        btnSearch.innerHTML = `<i class='bx bx-loader-alt bx-spin'></i>`;
        errorMsg.style.display = 'none';
        trackingResult.style.display = 'none';

        setTimeout(() => {
            btnSearch.innerHTML = `<span>Lacak Paket</span>`;
            
            // Check in dataTracking (mock API DB)
            const resultList = typeof dataTracking !== 'undefined' ? dataTracking : {};
            const item = resultList[value];

            if (item) {
                // If found, populate data
                lblNama.textContent = item.nama;
                lblNoDO.textContent = item.nomorDO;
                lblEkspedisi.textContent = item.ekspedisi;
                lblTanggal.textContent = item.tanggalKirim;
                lblPaket.textContent = item.paket;
                lblTotal.textContent = item.total;
                
                // Reset stepper status
                stepTransit.classList.remove('active');
                stepDelivered.classList.remove('active');

                // Adjust Status Badge & Stepper
                lblStatus.textContent = item.status;
                if(item.status === 'Selesai' || item.status === 'Dikirim' || item.status.includes('Selesai')) {
                    lblStatus.className = 'badge success';
                    stepTransit.classList.add('active');
                    stepDelivered.classList.add('active'); // Diterima
                } else if(item.status.includes('Perjalanan')) {
                    lblStatus.className = 'badge warning';
                    stepTransit.classList.add('active'); // Transit active, delivered inactive
                } else {
                    lblStatus.className = 'badge';
                }

                // Render Timeline Journey
                // Reverse the array so the newest information appears at the top (bottom of actual execution list depending on layout context)
                // Actually let's render it sequentially
                let timelineHTML = '';
                item.perjalanan.forEach((step, index) => {
                    // Mark as complete if it's the last updated step for design effect
                    const isLast = index === item.perjalanan.length - 1;
                    timelineHTML += `
                        <div class="timeline-item ${isLast ? 'complete' : ''}">
                            <span class="time">${step.waktu}</span>
                            <p class="desc">${step.keterangan}</p>
                        </div>
                    `;
                });
                timelineList.innerHTML = timelineHTML;

                // Show result container
                trackingResult.style.display = 'block';
                
                 // Smooth scrolling down to result
                 window.scrollTo({
                     top: trackingResult.offsetTop - 50,
                     behavior: 'smooth'
                 });
                
            } else {
                // If not found
                errorMsg.style.display = 'block';
            }
        }, 800); // 0.8 detik mock API Fetch
    });
});
