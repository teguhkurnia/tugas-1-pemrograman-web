const { createApp, nextTick } = Vue;

createApp({
    data: () => ({
        upbjjList: [
            { id: 1, nama: "Jakarta", ekspedisi: "JNE Regular" },
            { id: 2, nama: "Bandung", ekspedisi: "JNE Express" },
            { id: 3, nama: "Surabaya", ekspedisi: "JNE Regular" },
            { id: 4, nama: "Makassar", ekspedisi: "Pos Indonesia" },
            { id: 5, nama: "Padang", ekspedisi: "Pos Indonesia" },
            { id: 6, nama: "Denpasar", ekspedisi: "JNE Express" },
        ],
        kategoriList: ["MK Wajib", "MK Pilihan", "Praktikum", "Problem-Based"],
        pengirimanList: [
            { kode: "REG", nama: "Reguler (3-5 hari)" },
            { kode: "EXP", nama: "Ekspres (1-2 hari)" },
        ],
        paketList: [
            {
                id: 1,
                kodePaket: "PAK001",
                namaPaket: "PAKET IPS Dasar",
                isi: ["EKMA4116", "EKMA4115"],
                harga: 120000,
            },
            {
                id: 2,
                kodePaket: "PAK002",
                namaPaket: "PAKET IPA Dasar",
                isi: ["BIOL4201", "FISIP4001"],
                harga: 140000,
            },
            {
                id: 3,
                kodePaket: "PAK003",
                namaPaket: "PAKET Sains Terapan",
                isi: ["FISIP4002", "KIMIA4100"],
                harga: 200000,
            },
        ],

        deliveryOrders: [
            {
                noDO: "DO2025-001",
                nim: "031234567",
                nama: "Budi Santoso",
                ekspedisi: "JNE Regular",
                upbjj: "Jakarta",
                kodePaket: "PAK001",
                tanggalKirim: "2025-01-15",
                totalHarga: 150000,
                status: "delivered",
                timeline: [
                    {
                        tanggal: "2025-01-15",
                        jam: "08:30",
                        status: "Dikemas",
                        lokasi: "Jakarta",
                        deskripsi: "Paket dikemas dan siap dikirim",
                    },
                    {
                        tanggal: "2025-01-15",
                        jam: "14:45",
                        status: "Dikirim",
                        lokasi: "Jakarta",
                        deskripsi: "Paket dikirim ke kurir ekspedisi",
                    },
                    {
                        tanggal: "2025-01-17",
                        jam: "10:15",
                        status: "Transit",
                        lokasi: "Surabaya",
                        deskripsi: "Paket dalam perjalanan menuju tujuan",
                    },
                    {
                        tanggal: "2025-01-18",
                        jam: "16:20",
                        status: "Diterima",
                        lokasi: "Alamat Penerima",
                        deskripsi: "Paket telah diterima oleh penerima",
                    },
                ],
            },
            {
                noDO: "DO2025-002",
                nim: "031234568",
                nama: "Siti Nurhaliza",
                ekspedisi: "JNE Express",
                upbjj: "Bandung",
                kodePaket: "PAK002",
                tanggalKirim: "2025-01-16",
                totalHarga: 140000,
                status: "transit",
                timeline: [
                    {
                        tanggal: "2025-01-16",
                        jam: "09:00",
                        status: "Dikemas",
                        lokasi: "Bandung",
                        deskripsi: "Paket dikemas dan siap dikirim",
                    },
                    {
                        tanggal: "2025-01-16",
                        jam: "15:30",
                        status: "Dikirim",
                        lokasi: "Bandung",
                        deskripsi: "Paket dikirim ke kurir ekspedisi",
                    },
                    {
                        tanggal: "2025-01-17",
                        jam: "11:00",
                        status: "Transit",
                        lokasi: "Jakarta",
                        deskripsi: "Paket dalam perjalanan menuju tujuan",
                    },
                ],
            },
            {
                noDO: "DO2025-003",
                nim: "031234569",
                nama: "Ahmad Wijaya",
                ekspedisi: "JNE Regular",
                upbjj: "Surabaya",
                kodePaket: "PAK003",
                tanggalKirim: "2025-01-18",
                totalHarga: 200000,
                status: "shipped",
                timeline: [
                    {
                        tanggal: "2025-01-18",
                        jam: "08:00",
                        status: "Dikemas",
                        lokasi: "Surabaya",
                        deskripsi: "Paket dikemas dan siap dikirim",
                    },
                    {
                        tanggal: "2025-01-18",
                        jam: "16:00",
                        status: "Dikirim",
                        lokasi: "Surabaya",
                        deskripsi: "Paket dikirim ke kurir ekspedisi",
                    },
                ],
            },
        ],

        showForm: false,
        form: {
            nim: "",
            nama: "",
            upbjjId: "",
            kodePaket: "",
            ekspedisi: "",
            tanggalKirim: new Date().toISOString().split("T")[0],
        },

        searchQuery: "",
        searchResult: null,
        errorMessage: "",
    }),

    watch: {
        "form.upbjjId": function (newUpbjjId) {
            if (newUpbjjId) {
                const upbjj = this.upbjjList.find(
                    (u) => u.id === parseInt(newUpbjjId),
                );
                this.form.ekspedisi = upbjj ? upbjj.ekspedisi : "";
            } else {
                this.form.ekspedisi = "";
            }
        },

        searchQuery: function (newQuery) {
            if (newQuery.trim()) {
                this.searchDO();
            }
        },
    },

    computed: {
        nextNoDO() {
            const year = new Date().getFullYear();
            const currentYear = this.deliveryOrders.filter((delivery) =>
                delivery.noDO.includes(`DO${year}`),
            );
            const sequence = currentYear.length + 1;
            return `DO${year}-${String(sequence).padStart(3, "0")}`;
        },

        selectedPaket() {
            return (
                this.paketList.find(
                    (p) => p.kodePaket === this.form.kodePaket,
                ) || { harga: 0 }
            );
        },

        selectedUpbjj() {
            return (
                this.upbjjList.find(
                    (u) => u.id === parseInt(this.form.upbjjId),
                ) || { nama: "" }
            );
        },
    },

    methods: {
        openForm() {
            this.showForm = true;
            this.form = {
                nim: "",
                nama: "",
                upbjjId: "",
                kodePaket: "",
                ekspedisi: "",
                tanggalKirim: new Date().toISOString().split("T")[0],
            };
        },

        closeForm() {
            this.showForm = false;
            this.form = {
                nim: "",
                nama: "",
                upbjjId: "",
                kodePaket: "",
                ekspedisi: "",
                tanggalKirim: new Date().toISOString().split("T")[0],
            };
        },
        generateInitialTimeline() {
            return [
                {
                    tanggal: this.form.tanggalKirim,
                    jam: this.getCurrentTime(),
                    status: "Dikemas",
                    lokasi: this.selectedUpbjj.nama,
                    deskripsi: "Paket dikemas dan siap dikirim",
                },
                {
                    tanggal: this.form.tanggalKirim,
                    jam: this.getTimeOffset(this.getCurrentTime(), 6),
                    status: "Dikirim",
                    lokasi: this.selectedUpbjj.nama,
                    deskripsi: "Paket dikirim ke kurir ekspedisi",
                },
            ];
        },
        getCurrentTime() {
            const now = new Date();
            return `${String(now.getHours()).padStart(2, "0")}:${String(
                now.getMinutes(),
            ).padStart(2, "0")}`;
        },

        getTimeOffset(time, hours) {
            const [h, m] = time.split(":").map(Number);
            const newHour = (h + hours) % 24;
            return `${String(newHour).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
        },

        async saveDO() {
            if (
                !this.form.nim ||
                !this.form.nama ||
                !this.form.upbjjId ||
                !this.form.kodePaket ||
                !this.form.ekspedisi
            ) {
                alert("Semua field harus diisi!");
                return;
            }

            const selectedPaket = this.selectedPaket;
            if (!selectedPaket || selectedPaket.harga === 0) {
                alert("Paket tidak valid. Silakan pilih paket lagi!");
                return;
            }

            const selectedUpbjj = this.selectedUpbjj;
            if (!selectedUpbjj || !selectedUpbjj.nama) {
                alert("UPBJJ tidak valid. Silakan pilih UPBJJ lagi!");
                return;
            }
            const noDO = this.nextNoDO;

            const timeline = this.generateInitialTimeline();

            const newDO = {
                noDO: noDO,
                nim: this.form.nim,
                nama: this.form.nama,
                ekspedisi: this.form.ekspedisi,
                upbjj: selectedUpbjj.nama,
                kodePaket: this.form.kodePaket,
                tanggalKirim: this.form.tanggalKirim,
                totalHarga: selectedPaket.harga,
                status: "shipped",
                timeline: timeline,
            };

            this.deliveryOrders.push(newDO);

            this.searchQuery = noDO;
            this.searchDO();

            this.closeForm();
            await nextTick();
        },

        searchDO() {
            this.errorMessage = "";
            this.searchResult = null;

            const result = this.deliveryOrders.find(
                (delivery) => delivery.noDO === this.searchQuery.trim(),
            );

            if (result) {
                this.searchResult = result;
            } else {
                this.errorMessage = `Nomor DO "${this.searchQuery}" tidak dapat ditemukan di dalam sistem!`;
            }
        },

        getStatusInfo(status) {
            const statusMap = {
                shipped: { label: "Dalam Pengiriman", color: "info" },
                transit: { label: "Dalam Transit", color: "warning" },
                delivered: { label: "Diterima", color: "success" },
            };
            return (
                statusMap[status] || {
                    label: "Tidak Diketahui",
                    color: "muted",
                }
            );
        },

        getStatusProgress(status) {
            const progressMap = {
                shipped: 50,
                transit: 75,
                delivered: 100,
            };
            return progressMap[status] || 0;
        },

        formatCurrency(amount) {
            return new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
            }).format(amount);
        },

        formatDate(dateString) {
            return new Date(dateString).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        },
    },
}).mount("#app");
