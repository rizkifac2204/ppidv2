import Link from "next/link";

const Begin = () => {
  return (
    <>
      <h1>Halaman Awal</h1>
      Halaman ini belum ditentukan untuk apa
      <ul>
        <li>1. Tampilan selamat datang; atau </li>
        <li>2. Tampilan Formulir dan pencarian data semua Bawaslu; atau</li>
        <li>3. dll</li>
      </ul>
      <Link href="/login">
        <a>Ke Halaman Login Admin</a>
      </Link>
    </>
  );
};

Begin.auth = false;
export default Begin;
