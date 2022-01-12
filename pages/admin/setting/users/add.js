import React from "react";

function AddUsers() {
  return (
    <div>
      <i>Formulir Tambah User</i>
    </div>
  );
}

AddUsers.auth = true;
AddUsers.breadcrumb = [
  {
    path: "/admin",
    title: "Home",
  },
  {
    path: "/admin/setting/users",
    title: "Users",
  },
  {
    path: "/admin/setting/users/add",
    title: "Tambah Users",
  },
];
export default AddUsers;
