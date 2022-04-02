import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "PPID",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "Username",
          required: true,
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
          required: true,
        },
      },
      async authorize(credentials, req) {
        // pemanggilan data
        try {
          const url = process.env.HOST + "/api/login/loginCredential";
          const res = await fetch(url, {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" },
          });
          const user = await res.json();

          // Jika tidak ada error dan user terdeteksi return user
          if (res.ok && user) {
            return user;
          }
          // Return null Jika Tidak ada user
          return null;
        } catch (e) {
          // Return null Jika Tidak ada user
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // disini bisa cek kalau berbasis database, apakah email user terdaftar atau tidak
      // bagus untuk login menggunakan google kalau user sudah mempunyai data email pada tabel
      if (account.provider === "google") {
        // pemanggilan data
        const url = process.env.HOST + "/api/login/checkEmail";
        const res = await fetch(url, {
          method: "POST",
          body: JSON.stringify({ email: user.email }),
          headers: { "Content-Type": "application/json" },
        });
        const newDataUser = await res.json();
        if (res.ok) {
          // ganti/tambahkan data user dan return berhasil
          user.id = newDataUser.id;
          user.level = newDataUser.level;
          user.bawaslu_id = newDataUser.bawaslu_id;
          user.email_admin = newDataUser.email_admin;
          return true;
        } else {
          // jika gagal
          return false;
        }
      }

      // lewati kalau BUKAN login dengan google
      return true;
    },
    // disini diatur data apa saja yang akan masuk ke JSON Web Token
    async jwt({ token, user }) {
      // usert terbaca hanya after signin
      if (user) {
        token.id = user.id;
        token.level = user.level;
        token.bawaslu_id = user.bawaslu_id;
        token.email_admin = user.email_admin;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.level = token.level;
        session.user.bawaslu_id = token.bawaslu_id;
        session.user.email_admin = token.email_admin;
      }
      return session;
    },
  },
  secret: process.env.JWT_SECRET_KEY,
  jwt: {
    secret: process.env.JWT_SECRET_KEY,
    encryption: true,
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  // Jika menggunakan page custom, theme wajib dihilangkan
  // theme: {
  //   colorScheme: "light", // "auto" | "dark" | "light"
  //   brandColor: "#0EAFC1", // Hex color value
  //   logo: '/images/logo-dark.png' // Absolute URL to logo image
  // }
});
