import adminStyle from "../../styles/globals.css";
import publicStyles from "../../public/ui/css/style.css";

function AdminStyle() {
  return (
    <style jsx global>
      {adminStyles}
    </style>
  );
}

function PublicStyle() {
  return (
    <style jsx global>
      {publicStyles}
    </style>
  );
}

export default function AppStyles({ admin = true }) {
  if (admin) return <AdminStyles />;
  return <PublicStyles />;
}
