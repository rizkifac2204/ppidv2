import db from "libs/db";
import bcrypt from "bcrypt";
import sha1 from "js-sha1";

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

  const checkUser = await db("tbl_users").where({ username }).first();

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

  const user = {
    id: checkUser.id,
    name: checkUser.nama,
    level: checkUser.level,
    id_prov: checkUser.id_prov,
    id_kabkot: checkUser.id_kabkot,
    wilayah: checkUser.wilayah,
    email: checkUser.email,
  };

  res.json(user);
};

export default Handler;
