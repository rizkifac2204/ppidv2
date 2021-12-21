import db from "@/libs/db";

const Handler = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  const { email } = req.body;

  if (!email) {
    res.status(401).json({ message: "Not Detected" });
    return;
  }

  const checkUser = await db("tbl_users").where({ email }).first();

  if (!checkUser) {
    res.status(401).json({ message: "Data Tidak Ditemukan" });
    return;
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
