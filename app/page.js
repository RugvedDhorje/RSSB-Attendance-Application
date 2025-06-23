"use client";
import { useState } from "react";
import MemberManagement from "../components/MemberManagement";
import AttendanceMarking from "../components/AttendanceMarking";
import AttendanceReports from "../components/AttendanceReports";

export default function Home() {
  const [activeTab, setActiveTab] = useState("members");

  const tabs = [
    { id: "members", label: "Members", component: MemberManagement },
    {
      id: "attendance",
      label: "Mark Attendance",
      component: AttendanceMarking,
    },
    { id: "reports", label: "Reports", component: AttendanceReports },
  ];

  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          Attendance Management System
        </h1>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-md p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:text-blue-500"
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
