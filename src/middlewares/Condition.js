export const labelTingkat = (level) => {
  if (level === 1) return "Se-Nasional";
  if (level === 2) return "Se-Provinsi";
  if (level === 3) return "Se-Kabupaten/Kota";
  return null;
};

export const labelKepada = (level) => {
  if (level === 1) return "Bawaslu Republik Indonesia";
  if (level === 2) return "Bawaslu Provinsi";
  if (level === 3) return "Bawaslu";
  return null;
};

export const createWill = (level, prov, kab) => {
  if (level === 1) return 0;
  if (level === 2) return prov;
  if (level === 3) return kab;
  return null;
};

export const conditionFilterUser = (builder, user) => {
  if (user.level === 1) {
    // skip untuk semua
  }
  if (user.level === 2) {
    builder.where("admin.bawaslu_id", "like", `${user.bawaslu_id}%`);
  }
  if (user.level === 3) {
    builder.where("admin.bawaslu_id", user.bawaslu_id);
  }
};

export const conditionWill = (db, builder, user) => {
  if (user.level <= 2) {
    builder.whereNotIn("id_will", db.from("tbl_kabupaten").select("id"));
  }
  if (user.level === 3) {
    builder.where("id_will", "like", `${user.id_prov}%`);
  }
  if (user.level === 4) {
    builder.where("id_will", user.id_kabkot);
  }
};

export const conditionWillSpesific = (db, builder, user, table) => {
  if (user.level === 1) {
    // skip untuk semua
  }
  if (user.level === 2) {
    builder.where(`${table}.bawaslu_id`, "like", `${user.bawaslu_id}%`);
  }
  if (user.level === 3) {
    builder.where(`${table}.bawaslu_id`, "=", user.bawaslu_id);
  }
};

export const buatTiketByAdmin = (length, level, bawaslu_id) => {
  var firstCode = "";
  var result = "";
  var characters = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  if (level !== 1) {
    firstCode = bawaslu_id;
  } else {
    firstCode = "01";
  }
  return firstCode + "-" + result;
};
