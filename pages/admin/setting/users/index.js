import { useEffect, useState } from "react";
import axios from "axios";

function Users() {
  const [data, setdata] = useState([]);

  useEffect(() => {
    function fetchData() {
      axios
        .get(`/api/setting/users`)
        .then((res) => {
          setdata(res.data);
        })
        .catch((err) => {
          console.log(err.response);
        });
    }
    fetchData();
  }, []);
  return (
    <div>
      <h1>Halaman Manajemen User</h1>
      {JSON.stringify(data)}
    </div>
  );
}

Users.auth = true;
Users.breadcrumb = [
  {
    path: "/admin",
    title: "Home",
  },
  {
    path: "/admin/setting/users",
    title: "Users",
  },
];
export default Users;
