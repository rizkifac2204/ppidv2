import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import LinkNext from "next/link";
import { useRouter } from "next/router";

export default function BreadcrumbsHead({ list }) {
  const router = useRouter();
  const { id } = router.query;
  return (
    <Breadcrumbs mb={3} ml={2} aria-label="breadcrumb" separator="›">
      {list &&
        list.map((item, idx, arr) =>
          idx + 1 === arr.length ? (
            <Typography key={idx} color="text.primary">
              {item.title}
            </Typography>
          ) : item.path.includes("getID") && id ? (
            <LinkNext key={idx} href={item.path.replace("getID", id)}>
              <a>{item.title}</a>
            </LinkNext>
          ) : (
            <LinkNext key={idx} href={item.path}>
              <a>{item.title}</a>
            </LinkNext>
          )
        )}
    </Breadcrumbs>
  );
}
