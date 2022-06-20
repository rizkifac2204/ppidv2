import { serialize } from "cookie";

const Logout = async (req, res) => {
  const serialized = serialize("eppidV2", null, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: -1,
    path: "/",
  });

  res.setHeader("Set-Cookie", serialized);
  res.status(200).json({ message: "Success Logout" });
};

export default Logout;
