import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import LinkNext from "next/link";

export default function BreadcrumbsHead({ list }) {
  return (
    <Breadcrumbs mb={3} ml={2} aria-label="breadcrumb" separator="›">
      {list &&
        list.map((item, idx, arr) =>
          idx + 1 === arr.length ? (
            <Typography key={idx} color="text.primary">
              {item.title}
            </Typography>
          ) : (
            <LinkNext key={idx} href={item.path}>
              <a>{item.title}</a>
            </LinkNext>
          )
        )}
    </Breadcrumbs>
  );
}
