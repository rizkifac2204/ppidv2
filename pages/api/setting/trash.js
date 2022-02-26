import db from "libs/db";
import Handler from "middlewares/Handler";
import { conditionWillSpesific } from "middlewares/Condition";
import { DeleteUpload } from "services/UploadService";

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
  // delete one by one
  .post(async (req, res) => {
    const { id, jenis } = req.body;

    // pisahkan id dengan param
    const setID = id.split("-");

    const table =
      jenis === "online" ? "tbl_permohonan" : "tbl_permohonan_offline";

    // get detail untuk ambil nama file / ktp / response
    const cek = await db(table)
      .modify((q) => {
        if (jenis === "online") {
          q.select(table + ".*", "tbl_permohonan_response.file").leftJoin(
            "tbl_permohonan_response",
            "tbl_permohonan_response.id_permohonan",
            table + ".id"
          );
        }
      })
      .where(table + ".id", setID[1])
      .first();

    // proses
    const proses = await db(table).where("id", setID[1]).del();

    // failed
    if (!proses)
      return res.status(400).json({
        message: "Gagal Hapus Data",
      });

    if (jenis === "online") {
      // console.log("hapus di folder upload dan response");
      DeleteUpload("./public/response", cek.file);
      DeleteUpload("./public/upload", cek.ktp);
    } else {
      // console.log("hapus di folder offline");
      DeleteUpload("./public/offline", cek.file);
    }

    // success
    res.json({ message: "Berhasil Hapus Data", type: "success" });
  })
  // delete selected
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

    // get detail untuk ambil nama file / ktp / response
    const cekOnline = await db("tbl_permohonan")
      .select("tbl_permohonan.ktp", "tbl_permohonan_response.file")
      .leftJoin(
        "tbl_permohonan_response",
        "tbl_permohonan_response.id_permohonan",
        "tbl_permohonan.id"
      )
      .whereIn("tbl_permohonan.id", onlineID);
    const offlineValues = await db("tbl_permohonan_offline")
      .select({ filename: "file" })
      .whereIn("id", offlineID);

    const uploadValues = cekOnline.map(function (value) {
      return value.ktp;
    });
    const responseValues = cekOnline.map(function (value) {
      return value.file;
    });

    DeleteUpload("./public/upload", uploadValues);
    DeleteUpload("./public/response", responseValues);
    DeleteUpload("./public/offline", offlineValues);

    // proses hapus
    await db("tbl_permohonan").whereIn("id", onlineID).del();
    await db("tbl_permohonan_offline").whereIn("id", offlineID).del();

    res.json({ message: "Berhasil Hapus Permanen", type: "success" });
  });
