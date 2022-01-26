import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
// MUI
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
//Component
import WaitLoadingComponent from "components/WaitLoadingComponent";
import ProfileCard from "components/ProfileCard";
import UserUpdate from "components/UserUpdate";

function UsersDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [detail, setDetail] = useState({});
  const [render, setRender] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchDetail = () => {
        axios
          .get(`/api/setting/users/` + id)
          .then((res) => {
            setDetail(res.data);
            setRender(true);
          })
          .catch((err) => {
            toast.error(err.response.data.message);
            setTimeout(() => router.push("/admin/setting/users"), 2000);
          });
      };
      fetchDetail();
    }
    return () => {
      // console.log("clear");
    };
  }, [id, router]);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={3}>
        {!render ? <WaitLoadingComponent /> : <ProfileCard profile={detail} />}
      </Grid>
      <Grid item xs={12} md={9}>
        {!render ? (
          <WaitLoadingComponent />
        ) : (
          <UserUpdate profile={detail} setDetail={setDetail} />
        )}
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
