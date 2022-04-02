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

  const user = {
    id: checkUser.id,
    level: checkUser.level,
    bawaslu_id: checkUser.bawaslu_id,
    email_admin: checkUser.email_admin,
  };

  res.json(user);
};

export default Handler;
