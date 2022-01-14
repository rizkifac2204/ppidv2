import { useRouter } from "next/router";

function OfflineEdit() {
  const router = useRouter();
  const { id } = router.query;

  return <div>Edit Permohonan Offline dengan ID = {id}</div>;
}

OfflineEdit.auth = true;
OfflineEdit.breadcrumb = [
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
  {
    path: "/admin/permohonan/offline",
    title: "Detail",
  },
];
export default OfflineEdit;
