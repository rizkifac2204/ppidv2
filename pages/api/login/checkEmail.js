import db from "libs/db";

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

  const checkUser = await db
    .select(`admin.*`, `bawaslu.level_bawaslu as level`)
    .from(`admin`)
    .innerJoin(`bawaslu`, `admin.bawaslu_id`, `bawaslu.id`)
    .where(`admin.email_admin`, email)
    .first();

  if (!checkUser) {
    res.status(401).json({ message: "Data Tidak Ditemukan" });
    return;
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
