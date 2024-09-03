import "./AdminDashboard.css";
import AppFooter from "./Components/AppFooter";
import PageContent from "./Components/PageContent";

function AdminDashboard() {
  return (
    <div className="admin">
      <div className="SideMenuAndPageContent">
        <PageContent />
      </div>
      <AppFooter />
    </div>
  );
}

export default AdminDashboard;
