import db from "libs/db";
import Handler from "middlewares/Handler";
import {
  conditionWillSpesific,
  labelKepada,
  createWill,
} from "middlewares/Condition";

export default Handler()
  .get(async (req, res) => {
    // colom id diubah dengan param agar tidak bentrok online dan offline
    const online = await db
      .select(
        "tbl_permohonan.*",
        "tbl_provinsi.provinsi",
        "tbl_kabupaten.kabupaten",
        "tbl_permohonan_response.status",
        "tbl_permohonan_response.alasan",
        "tbl_permohonan_response.waktu",
        "tbl_permohonan_response.response",
        "tbl_permohonan_response.file",
        db.raw(
          `"online" as jenis,
          CONCAT("online", "-", tbl_permohonan.id) as id`
        )
      )
      .from("tbl_permohonan")
      .leftJoin("tbl_provinsi", "tbl_permohonan.id_will", "tbl_provinsi.id")
      .leftJoin("tbl_kabupaten", "tbl_permohonan.id_will", "tbl_kabupaten.id")
      .leftJoin(
        "tbl_permohonan_response",
        "tbl_permohonan.id",
        "tbl_permohonan_response.id_permohonan"
      )
      .modify((builder) =>
        conditionWillSpesific(db, builder, req.session.user, "tbl_permohonan")
      )
      .whereNotNull("tbl_permohonan.deleted_at")
      .orderBy("tbl_permohonan.created_at", "desc");

    const offline = await db
      .select(
        "tbl_permohonan_offline.*",
        "tbl_provinsi.provinsi",
        "tbl_kabupaten.kabupaten",
        db.raw(`"offline" as jenis,
        CONCAT("offline", "-", tbl_permohonan_offline.id) as id`)
      )
      .from("tbl_permohonan_offline")
      .leftJoin(
        "tbl_provinsi",
        "tbl_permohonan_offline.id_will",
        "tbl_provinsi.id"
      )
      .leftJoin(
        "tbl_kabupaten",
        "tbl_permohonan_offline.id_will",
        "tbl_kabupaten.id"
      )
      .modify((builder) =>
        conditionWillSpesific(
          db,
          builder,
          req.session.user,
          "tbl_permohonan_offline"
        )
      )
      .whereNotNull("tbl_permohonan_offline.deleted_at")
      .orderBy("tbl_permohonan_offline.created_at", "desc");

    const result = online.concat(offline);
    res.json(result);
  })
  .post(async (req, res) => {
    const { id, jenis } = req.body;

    // pisahkan id dengan param
    const setID = id.split("-");

    // proses simpan
    const proses = await db(
      jenis === "online" ? "tbl_permohonan" : "tbl_permohonan_offline"
    )
      .where("id", setID[1])
      .del();

    // failed
    if (!proses)
      return res.status(400).json({
        message: "Gagal Hapus Data",
      });

    // success
    res.json({ message: "Berhasil Hapus Data", type: "success" });
  })
  .put(async (req, res) => {
    const { id, jenis } = req.body;

    // pisahkan id dengan param
    const setID = id.split("-");

    // proses
    const proses = await db(
      jenis === "online" ? "tbl_permohonan" : "tbl_permohonan_offline"
    )
      .where("id", setID[1])
      .update("deleted_at", null);

    // failed
    if (!proses)
      return res.status(400).json({
        message: "Gagal Proses Data",
      });

    // success
    res.json({ message: "Berhasil Mengembalikan Data", type: "success" });
  })
  .delete(async (req, res) => {
    const splitArrID = req.body.map((item) => {
      return item.split("-");
    });
    const onlineID = splitArrID
      .filter((item) => {
        return item[0] == "online";
      })
      .map((item) => {
        return item[1];
      });

    const offlineID = splitArrID
      .filter((item) => {
        return item[0] == "offline";
      })
      .map((item) => {
        return item[1];
      });

    // proses hapus
    await db("tbl_permohonan").whereIn("id", onlineID).del();
    await db("tbl_permohonan_offline").whereIn("id", offlineID).del();

    res.json({ message: "Berhasil Hapus Permanen", type: "success" });
  });
