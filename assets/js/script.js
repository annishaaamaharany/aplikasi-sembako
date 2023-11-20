document.addEventListener("DOMContentLoaded", function () {
  // Tampilkan splash screen
  document.getElementById("splash-screen").style.display = "block";

  setTimeout(function () {
    document.getElementById("splash-screen").style.display = "none";
  }, 2000);

  const searchInput = document.getElementById("cari");
  const daftarItem = document.getElementsByClassName("box");
  const riwayatPembelian = [];

  searchInput.addEventListener("input", function () {
    const kataKunci = searchInput.value.toLowerCase();

    for (let item of daftarItem) {
      const teksItem = item.querySelector("h2").innerText.toLowerCase();
      const gambarItem = item.querySelector("img").getAttribute("alt").toLowerCase();

      if (teksItem.includes(kataKunci) || gambarItem.includes(kataKunci)) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    }
  });

  const tombolClickForMore = document.querySelectorAll(".teks-item-link");
  tombolClickForMore.forEach(function (tombol) {
    tombol.addEventListener("click", function () {
      const category = tombol.closest(".box").querySelector("h2").innerText.toLowerCase();
      const targetSection = document.getElementById(category.replace(/\s+/g, '-'));

      if (category === 'carbs' || category === 'flavoring') {
        alert(`Maaf, produk untuk kategori ${category} sedang kosong.`);
      } else if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  const tombolBuy = document.querySelectorAll(".teks-item-link-buy");
  tombolBuy.forEach(function (tombol) {
    tombol.addEventListener("click", function () {
      const parentBox = tombol.closest(".box");
      const productName = parentBox.querySelector("h2").innerText;
      const productPrice = parentBox.getAttribute("harga");

      document.getElementById("produk").value = productName;
      document.getElementById("harga").value = `Rp ${productPrice}`;

      // Tampilkan formulir pembayaran
      document.getElementById("formPembayaran").style.display = "block";

      document.getElementById("formPembayaran").scrollIntoView({ behavior: 'smooth' });
    });
  });

  const tombolBayar = document.querySelector("#formPembayaran button");
  tombolBayar.addEventListener("click", function (event) {
    event.preventDefault();

    const namaProduk = document.getElementById("produk").value;
    const hargaProduk = parseInt(document.getElementById("harga").value.replace(/\D/g, ''));
    const jumlahProduk = parseInt(document.getElementById("jumlah").value);

    // Hitung total harga
    const totalHarga = hargaProduk * jumlahProduk;

    riwayatPembelian.push({
      nama: namaProduk,
      harga: hargaProduk,
      jumlah: jumlahProduk,
      total: totalHarga,
    });

    // Kosongkan nilai-nilai formulir
    document.getElementById("produk").value = "";
    document.getElementById("harga").value = "";
    document.getElementById("jumlah").value = "";

    // Tampilkan riwayat pembelian
    tampilkanRiwayatPembelian();
  });

  function tampilkanRiwayatPembelian() {
    const tabelRiwayat = document.getElementById("riwayat");
    tabelRiwayat.innerHTML = "";

    const header = document.createElement("tr");
    header.innerHTML = "<th>Produk</th><th>Harga</th><th>Jumlah</th><th>Total</th><th>Aksi</th>";
    tabelRiwayat.appendChild(header);

    let totalPembayaran = 0;

    riwayatPembelian.forEach(function (pembelian, index) {
      const baris = document.createElement("tr");
      baris.innerHTML = `<td>${pembelian.nama}</td><td>Rp ${pembelian.harga}</td><td>${pembelian.jumlah}</td><td>Rp ${pembelian.total}</td><td><button type="button" onclick="editPembelian(${index})">Edit</button> <button type="button" onclick="hapusPembelian(${index})">Hapus</button></td>`;
      tabelRiwayat.appendChild(baris);

      totalPembayaran += pembelian.total;
    });

    // Tambahkan baris untuk total pembayaran
    const totalRow = document.createElement("tr");
    totalRow.innerHTML = `<td colspan="3"></td><td>Total Pembayaran</td><td>Rp ${totalPembayaran}</td>`;
    tabelRiwayat.appendChild(totalRow);
  }

  // Tambahkan fungsi editPembelian dan hapusPembelian ke dalam lingkup global
  window.editPembelian = function (index) {
    const pembelian = riwayatPembelian[index];
    document.getElementById("produk").value = pembelian.nama;
    document.getElementById("harga").value = `Rp ${pembelian.harga}`;
    document.getElementById("jumlah").value = pembelian.jumlah;

    // Hapus pembelian dari riwayat (karena akan diedit)
    hapusPembelian(index);

    // Tampilkan formulir pembayaran untuk edit
    document.getElementById("formPembayaran").style.display = "block";

    document.getElementById("formPembayaran").scrollIntoView({ behavior: 'smooth' });
  };

  window.hapusPembelian = function (index) {
    riwayatPembelian.splice(index, 1);
    tampilkanRiwayatPembelian();
  }
});
