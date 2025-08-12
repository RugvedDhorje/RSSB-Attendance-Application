"use client";
import { useState } from "react";
// import MemberManagement from "../components/MemberManagement";
import AttendanceMarking from "../components/AttendanceMarking";
// import AttendanceReports from "../components/AttendanceReports";
import Navbar from "../components/Navbar";
import { SquareUser, FileDown } from "lucide-react";
import Footer from "../components/Footer";
import Link from "next/link";
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
      <Navbar />
      <div className=" mx-auto">
        {/* <h1 className="md:text-[36px] text-[24px] font-bold text-center mb-8 text-[#8A1912] px-4">
          Attendance Management System
        </h1> */}
        <hr className="text-[#FFFAF0]" />
        <div className="w-full mx-auto bg-[#8A1912] rounded-b-[50px] ">
          <AttendanceMarking />
        </div>
        <div className="max-w-screen-2xl flex justify-center items-center md:mt-5 p-5 gap-x-3">
          <Link href={"/newMember"}>
            <div className="shadow-lg p-4 flex flex-col justify-center items-center rounded-md">
              <SquareUser size={50} className="text-[#8A1912]" />
              <h4 className="text-[20px] font-medium text-[#8A1912] text-center">
                Create Member
              </h4>
            </div>
          </Link>
          <Link href={"/report"}>
            <div className="shadow-lg p-4 flex flex-col justify-center items-center rounded-md">
              <FileDown size={50} className="text-[#8A1912]" />
              <h4 className="text-[20px] font-medium text-[#8A1912] text-center">
                Download Attendance
              </h4>
            </div>
          </Link>
        </div>
        {/* Tab Navigation */}
        {/* <div className="flex justify-center mb-8">
          <div className="rounded-lg shadow-md p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`md:px-6 px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-[#8A1912] text-white"
                    : "text-gray-600 hover:text-[#8A1912]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div> */}

        {/* Tab Content */}
        {/* <div className="max-w-6xl mx-auto">
          {ActiveComponent && <ActiveComponent />}
        </div> */}
      </div>
      <Footer />
    </div>
  );
}
