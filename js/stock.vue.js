const { createApp, nextTick } = Vue;

createApp({
    data: () => ({
        stok: [
            {
                kode: "EKMA4116",
                judul: "Pengantar Manajemen",
                kategori: "MK Wajib",
                upbjj: "Jakarta",
                lokasiRak: "R1-A3",
                harga: 65000,
                qty: 28,
                safety: 20,
                catatanHTML: "<em>Edisi 2024, cetak ulang</em>",
            },
            {
                kode: "EKMA4115",
                judul: "Pengantar Akuntansi",
                kategori: "MK Wajib",
                upbjj: "Jakarta",
                lokasiRak: "R1-A4",
                harga: 60000,
                qty: 7,
                safety: 15,
                catatanHTML: "<strong>Cover baru</strong>",
            },
            {
                kode: "BIOL4201",
                judul: "Biologi Umum (Praktikum)",
                kategori: "Praktikum",
                upbjj: "Surabaya",
                lokasiRak: "R3-B2",
                harga: 80000,
                qty: 12,
                safety: 10,
                catatanHTML: "Butuh <u>pendingin</u> untuk kit basah",
            },
            {
                kode: "FISIP4001",
                judul: "Dasar-Dasar Sosiologi",
                kategori: "MK Pilihan",
                upbjj: "Makassar",
                lokasiRak: "R2-C1",
                harga: 55000,
                qty: 2,
                safety: 8,
                catatanHTML: "Stok <i>menipis</i>, prioritaskan reorder",
            },
            {
                kode: "EKMA4117",
                judul: "Teori Organisasi",
                kategori: "MK Wajib",
                upbjj: "Bandung",
                lokasiRak: "R2-B1",
                harga: 70000,
                qty: 0,
                safety: 10,
                catatanHTML: "Stok habis, urgent reorder",
            },
            {
                kode: "BIOL4202",
                judul: "Kimia Dasar",
                kategori: "Praktikum",
                upbjj: "Bandung",
                lokasiRak: "R3-C1",
                harga: 75000,
                qty: 5,
                safety: 15,
                catatanHTML: "Stok menipis",
            },
            {
                kode: "FISIP4002",
                judul: "Antropologi Budaya",
                kategori: "MK Pilihan",
                upbjj: "Surabaya",
                lokasiRak: "R2-A2",
                harga: 58000,
                qty: 25,
                safety: 10,
                catatanHTML: "Stok aman",
            },
        ],
        openModal: false,
        form: {
            kode: "",
            judul: "",
            kategori: "",
            upbjj: "",
            lokasiRak: "",
            harga: 0,
            qty: 0,
            safety: 0,
            catatanHTML: "",
        },
        filters: {
            upbjj: "",
            kategori: "",
            reorderWarning: false,
        },
        sortBy: "judul",
        sortOrder: "asc",
    }),
    computed: {
        upbjjList() {
            return [...new Set(this.stok.map((item) => item.upbjj))].sort();
        },

        kategoriList() {
            if (!this.filters.upbjj) {
                return [];
            }
            return [
                ...new Set(
                    this.stok
                        .filter((item) => item.upbjj === this.filters.upbjj)
                        .map((item) => item.kategori),
                ),
            ].sort();
        },

        filteredData() {
            let result = this.stok;
            if (this.filters.upbjj) {
                result = result.filter(
                    (item) => item.upbjj === this.filters.upbjj,
                );
            }
            if (this.filters.kategori && this.filters.upbjj) {
                result = result.filter(
                    (item) => item.kategori === this.filters.kategori,
                );
            }
            if (this.filters.reorderWarning) {
                result = result.filter(
                    (item) => item.qty === 0 || item.qty < item.safety,
                );
            }

            return result;
        },

        sortedData() {
            let result = [...this.filteredData];

            if (this.sortBy) {
                result.sort((a, b) => {
                    let aVal = a[this.sortBy];
                    let bVal = b[this.sortBy];

                    // Untuk string, gunakan localeCompare
                    if (typeof aVal === "string") {
                        aVal = aVal.toLowerCase();
                        bVal = bVal.toLowerCase();
                        return this.sortOrder === "asc"
                            ? aVal.localeCompare(bVal)
                            : bVal.localeCompare(aVal);
                    }

                    if (this.sortOrder === "asc") {
                        return aVal - bVal;
                    } else {
                        return bVal - aVal;
                    }
                });
            }

            return result;
        },
    },
    watch: {
        "filters.upbjj"() {
            this.filters.kategori = "";
        },
    },
    methods: {
        closeModal() {
            this.openModal = false;
            this.resetForm();
        },
        resetForm() {
            this.form = {
                kode: "",
                judul: "",
                kategori: "",
                upbjj: "",
                lokasiRak: "",
                harga: 0,
                qty: 0,
                safety: 0,
                catatanHTML: "",
            };
        },
        openAddModal() {
            this.resetForm();
            this.openModal = true;
        },
        openEditModal(item) {
            this.form = { ...item };
            this.openModal = true;
        },
        async saveItem() {
            if (
                !this.form.kode ||
                !this.form.judul ||
                !this.form.kategori ||
                !this.form.upbjj
            ) {
                alert("Kode, Judul, Kategori, dan UT-daerah wajib diisi.");
                return;
            }

            const index = this.stok.findIndex((i) => i.kode === this.form.kode);
            if (index !== -1) {
                this.stok.splice(index, 1, { ...this.form });
            } else {
                this.stok.push({ ...this.form });
            }
            this.closeModal();
            await nextTick();
        },

        resetFilters() {
            this.filters = {
                upbjj: "",
                kategori: "",
                reorderWarning: false,
            };
            this.sortBy = "";
            this.sortOrder = "asc";
        },

        toggleReorderWarning() {
            this.filters.reorderWarning = !this.filters.reorderWarning;
        },

        handleSort(field) {
            if (this.sortBy === field) {
                this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc";
            } else {
                this.sortBy = field;
                this.sortOrder = "asc";
            }
        },
    },
}).mount("#app");
