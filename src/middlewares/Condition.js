export const labelTingkat = (level) => {
  if (level <= 2) return "Se-Nasional";
  if (level === 3) return "Se-Provinsi";
  if (level === 4) return "Se-Kabupaten/Kota";
  return null;
};

export const labelKepada = (level) => {
  if (level <= 2) return "Bawaslu Republik Indonesia";
  if (level === 3) return "Bawaslu Provinsi";
  if (level === 4) return "Bawaslu";
  return null;
};

export const createWill = (level, prov, kab) => {
  if (level <= 2) return 0;
  if (level === 3) return prov;
  if (level === 4) return kab;
  return null;
};

export const conditionFilterUser = (builder, user) => {
  if (user.level <= 2) {
    builder.whereNot("tbl_users.level", 4);
  }
  if (user.level === 3) {
    builder.where("tbl_users.id_prov", user.id_prov);
  }
  if (user.level === 4) {
    builder.where("tbl_users.id_kabkot", user.id_kabkot);
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
  if (user.level <= 2) {
    // builder.whereNotIn(
    //   `${table}.id_will`,
    //   db.from("tbl_kabupaten").select("id")
    // );
  }
  if (user.level === 3) {
    builder.where(`${table}.id_will`, "like", `${user.id_prov}%`);
  }
  if (user.level === 4) {
    builder.where(`${table}.id_will`, "=", user.id_kabkot);
  }
};
