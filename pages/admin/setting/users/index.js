import React from "react";

function Users() {
  return (
    <div>
      <h1>Halaman Manajemen User</h1>
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
    path: "/admin/setting/user",
    title: "Users",
  },
];
export default Users;
