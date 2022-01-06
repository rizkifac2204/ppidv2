import nextConnect from "next-connect";
import { getSession } from "next-auth/react";

export default function Handler() {
  return nextConnect({
    onError: (err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ message: err.toString(), type: "error" });
    },
    onNoMatch: () => {
      res.status(404).json({ message: "Not found", type: "error" });
    },
  }).use(async (req, res, next) => {
    req.session = await getSession({ req });
    if (!req.session) return res.status(401).json({ message: "Siapa kamu?" });
    next();
  });
}
