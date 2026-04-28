document.addEventListener('DOMContentLoaded', () => {
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.querySelector('#password');
    const loginForm = document.querySelector('#loginForm');
    const btnPrimary = document.querySelector('.btn-primary');

    if (!togglePassword || !passwordInput || !loginForm || !btnPrimary) {
        console.error("DOM Elements missing.");
        return;
    }

    // toggle show password
    togglePassword.addEventListener('click', function () {
        const isPassword = passwordInput.getAttribute('type') === 'password';
        passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
        this.classList.toggle('bx-show');
        this.classList.toggle('bx-hide');
        this.style.color = 'var(--primary)';
        setTimeout(() => {
            this.style.color = '';
        }, 300);
    });


    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const originalHtml = btnPrimary.innerHTML;
        const originalBg = btnPrimary.style.backgroundColor;

        const emailValue = document.querySelector('#username').value.trim();
        const passwordValue = passwordInput.value.trim();

        btnPrimary.innerHTML = `<i class='bx bx-loader-alt bx-spin'></i> <span>Memproses...</span>`;
        btnPrimary.style.opacity = '0.9';
        btnPrimary.disabled = true;
        btnPrimary.style.cursor = 'wait';

        setTimeout(() => {
            let authenticatedUser = null;
            if (typeof dataPengguna !== 'undefined') {
                authenticatedUser = dataPengguna.find(
                    user => user.email === emailValue && user.password === passwordValue
                );
            }

            if (authenticatedUser) {
                btnPrimary.innerHTML = `<i class='bx bx-check-circle'></i> <span>Login Berhasil</span>`;
                btnPrimary.style.backgroundColor = 'var(--success)';
                btnPrimary.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.35)'; // success glow

                localStorage.setItem('ut_user_session', JSON.stringify(authenticatedUser));

                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            } else {
                btnPrimary.innerHTML = `<i class='bx bx-x-circle'></i> <span>Email / Sandi Salah</span>`;
                btnPrimary.style.backgroundColor = 'var(--error)';
                btnPrimary.style.boxShadow = '0 8px 25px rgba(239, 68, 68, 0.35)'; // error glow

                setTimeout(() => {
                    alert('Autentikasi Gagal!\n\nEmail atau kata sandi yang Anda masukkan salah. Silakan periksa kembali data Anda sesuai yang ada di database.');
                    resetButton();
                }, 1000);
            }

            function resetButton() {
                btnPrimary.innerHTML = originalHtml;
                btnPrimary.style.opacity = '1';
                btnPrimary.disabled = false;
                btnPrimary.style.cursor = 'pointer';
                btnPrimary.style.backgroundColor = originalBg;
                btnPrimary.style.boxShadow = '';
                passwordInput.value = '';
            }

        }, 1500);
    });
});
