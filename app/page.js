"use client";
import { useState } from "react";
import MemberManagement from "../components/MemberManagement";
import AttendanceMarking from "../components/AttendanceMarking";
import AttendanceReports from "../components/AttendanceReports";
import Navbar from "@/components/Navbar";

export default function Home() {
  const [activeTab, setActiveTab] = useState("attendance");

  const tabs = [

    {
      id: "attendance",
      label: "Mark Attendance",
      component: AttendanceMarking,
    },
    { id: "members", label: "Members", component: MemberManagement },
    { id: "reports", label: "Reports", component: AttendanceReports },
  ];

  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-[#FFFAF0]">
      <Navbar/>
      <div className="container mx-auto py-8">
        <h1 className="md:text-[36px] text-[24px] font-bold text-center mb-8 text-[#8A1912]">
          Attendance Management System
        </h1>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="rounded-lg shadow-md p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`md:px-6 px-4 py-2 rounded-md font-medium transition-colors ${activeTab === tab.id
                  ? "bg-[#8A1912] text-white"
                  : "text-gray-600 hover:text-[#8A1912]"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-6xl mx-auto">
          {ActiveComponent && <ActiveComponent />}
        </div>
      </div>
    </div>
  );
}
