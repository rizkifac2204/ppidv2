import db from "libs/db";
import bcrypt from "bcrypt";
import sha1 from "js-sha1";
import { sign } from "jsonwebtoken";
import { serialize } from "cookie";

const Handler = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  const { username, password } = req.body;

  if (!username || !password) {
    res.status(401).json({ message: "Isi Semua Data" });
    return;
  }

  const checkUser = await db
    .select(`admin.*`, `bawaslu.level_bawaslu as level`)
    .from(`admin`)
    .innerJoin(`bawaslu`, `admin.bawaslu_id`, `bawaslu.id`)
    .where(`admin.username`, username)
    .first();

  if (!checkUser) {
    res.status(401).json({ message: "Data Tidak Ditemukan" });
    return;
  }

  // disini ditambahkan hash mengikuti encryp sebelumnya
  const old = sha1(sha1(password));
  const match = await bcrypt.compare(password, checkUser.password);
  if (!match) {
    if (old !== checkUser.password)
      return res.status(401).json({ message: "Data Tidak Ditemukan" });
  }

  const token = sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 hari
      id: checkUser.id,
      level: checkUser.level,
      bawaslu_id: checkUser.bawaslu_id,
      email_admin: checkUser.email_admin,
      name: checkUser.nama_admin,
      image: null,
    },
    process.env.JWT_SECRET_KEY
  );

  const serialized = serialize("eppidV2", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  res.setHeader("Set-Cookie", serialized);
  res.status(200).json({ message: "Success Login" });
};

export default Handler;
