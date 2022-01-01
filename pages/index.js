import Link from "next/link";
import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

const Begin = () => {
  const { data: session } = useSession();
  return (
    <>
      <h1>Halaman Awal</h1>
      Halaman ini belum ditentukan untuk apa
      <ul>
        <li>1. Tampilan selamat datang; atau </li>
        <li>2. Tampilan Formulir dan pencarian data semua Bawaslu; atau</li>
        <li>3. dll woy</li>
      </ul>
      {JSON.stringify(session)}
      {session ? (
        <>
          <Link href="/admin">
            <a>Ke Halaman Admin</a>
          </Link>
          <button onClick={() => signOut()}>Logout</button>
        </>
      ) : (
        <Link href="/login">
          <a>Ke Halaman Login Admin</a>
        </Link>
      )}
    </>
  );
};

Begin.auth = false;
export default Begin;
