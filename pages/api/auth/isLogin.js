import jwtDecode from "jwt-decode";
import cookie from "cookie";

export default async function (req, res) {
  try {
    const { eppidV2 } = cookie.parse(req.headers.cookie);
    if (!eppidV2)
      return res.status(401).json({ message: "Akses Tidak Dikenal" });
    const decoded = jwtDecode(eppidV2);
    res.json(decoded);
  } catch (err) {
    res.status(401).json({ message: "Akses Tidak Dikenal" });
  }
}
