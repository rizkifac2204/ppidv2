import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import LinkNext from "next/link";

export default function BasicBreadcrumbs() {
  return (
    <Breadcrumbs aria-label="breadcrumb" separator="›">
      <LinkNext href="/admin">Home</LinkNext>
      <LinkNext href="/admin/survey">
        <a>Coba</a>
      </LinkNext>
      <Typography color="text.primary">Breadcrumbs</Typography>
    </Breadcrumbs>
  );
}
