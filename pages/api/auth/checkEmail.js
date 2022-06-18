import db from "libs/db";
import { sign } from "jsonwebtoken";
import { serialize } from "cookie";

const Handler = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  const { email, image } = req.body;

  if (!email) {
    res.status(401).json({ message: "Not Detected" });
    return;
  }

  const checkUser = await db
    .select(`admin.*`, `bawaslu.level_bawaslu as level`)
    .from(`admin`)
    .innerJoin(`bawaslu`, `admin.bawaslu_id`, `bawaslu.id`)
    .where(`admin.email_admin`, email)
    .first();

  if (!checkUser) {
    res.status(401).json({ message: "Data User Tidak Ditemukan" });
    return;
  }

  const token = sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 hari
      id: checkUser.id,
      level: checkUser.level,
      bawaslu_id: checkUser.bawaslu_id,
      email_admin: checkUser.email_admin,
      name: checkUser.nama_admin,
      image: image,
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
