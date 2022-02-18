import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
// MUI
import Grid from "@mui/material/Grid";
//Component
import WaitLoadingComponent from "components/WaitLoadingComponent";
import ProfileCard from "components/ProfileCard";
import UserUpdate from "components/UserUpdateForm";

function UsersDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [detail, setDetail] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchDetail = () => {
        axios
          .get(`/api/setting/users/` + id)
          .then((res) => {
            setDetail(res.data);
          })
          .catch((err) => {
            toast.error(err.response.data.message);
            setTimeout(() => router.push("/admin/setting/users"), 2000);
          })
          .then(() => setLoading(false));
      };
      fetchDetail();
    }
    return () => {
      // console.log("clear");
    };
  }, [id, router]);

  const handleDelete = () => {
    const ask = confirm("Yakin Hapus Data?");
    if (ask) {
      const toastProses = toast.loading("Tunggu Sebentar...");
      axios
        .delete(`/api/setting/users/` + id)
        .then((res) => {
          toast.update(toastProses, {
            render: res.data.message,
            type: "success",
            isLoading: false,
            autoClose: 2000,
          });
          router.push("/admin/setting/users");
        })
        .catch((err) => {
          toast.update(toastProses, {
            render: err.response.data.message,
            type: "error",
            isLoading: false,
            autoClose: 2000,
          });
        });
    }
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={3}>
        <WaitLoadingComponent loading={loading} />
        {!loading && (
          <ProfileCard profile={detail} handleDelete={handleDelete} />
        )}
      </Grid>
      <Grid item xs={12} md={9}>
        <WaitLoadingComponent loading={loading} />
        {!loading && <UserUpdate profile={detail} setDetail={setDetail} />}
      </Grid>
    </Grid>
  );
}

UsersDetail.auth = true;
UsersDetail.breadcrumb = [
  {
    path: "/admin",
    title: "Home",
  },
  {
    path: "/admin/setting/users",
    title: "Users",
  },
  {
    path: "/admin/setting/users/detail",
    title: "Detail",
  },
];
export default UsersDetail;
