import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

export default function Footer(props) {
  return (
    <Typography
      sx={{ pt: 3 }}
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://loremit.com">
        Lorem IT
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
