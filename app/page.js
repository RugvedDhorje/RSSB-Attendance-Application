import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Main from "../components/Main";
import ProtectedRoute from "../components/ProtectedRoute";
export default function Home() {
  // const [activeTab, setActiveTab] = useState("attendance");

  // const tabs = [
  //   {
  //     id: "attendance",
  //     label: "Mark Attendance",
  //     component: AttendanceMarking,
  //   },
  //   { id: "members", label: "Members", component: MemberManagement },
  //   { id: "reports", label: "Reports", component: AttendanceReports },
  // ];

  // const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component;

  return (
    <div className="min-h-screen w-full">
      <ProtectedRoute>
        <Navbar />
        <Main />
        <Footer />
      </ProtectedRoute>
    </div>
  );
}
