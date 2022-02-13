import Skeleton from "@mui/material/Skeleton";
export default function WaitLoadingComponent({ loading = false }) {
  if (loading) {
    return (
      <Skeleton variant="rectangular" width="100%" sx={{ minHeight: 300 }} />
    );
  }
  return <></>;
}
