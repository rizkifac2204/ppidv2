import React from "react";

function Email() {
  return <div></div>;
}

Email.auth = true;
Email.breadcrumb = [
  {
    path: "/admin",
    title: "Home",
  },
  {
    path: "/admin/subscriber",
    title: "Subscriber",
  },
  {
    path: "/admin/subscriber/email",
    title: "Email",
  },
];
export default Email;
