import { useRouter } from "next/router";

function OfflineDetail() {
  const router = useRouter();
  const { id } = router.query;

  return <div>Detail Permohonan Offline dengan ID = {id}</div>;
}

OfflineDetail.auth = true;
OfflineDetail.breadcrumb = [
  {
    path: "/admin",
    title: "Home",
  },
  {
    path: "/admin/permohonan/offline",
    title: "Permohonan Offline",
  },
  {
    path: "/admin/permohonan/offline",
    title: "Detail",
  },
];

export default OfflineDetail;
