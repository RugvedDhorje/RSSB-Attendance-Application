"use client";
import React from "react";
import AttendanceMarking from "./AttendanceMarking";
import { FileDown, SquareUser } from "lucide-react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

const Main = () => {
  const { signOut } = useAuth();
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="w-full max-auto">
      <div className="max-w-screen-2xl mx-auto">
        <div className="w-full mx-auto">
          {/* <h1 className="md:text-[36px] text-[24px] font-bold text-center mb-8 text-[#8A1912] px-4">
          Attendance Management System
        </h1> */}
          <hr className="text-[#FFFAF0]" />
          <div className="w-full mx-auto bg-[#8A1912] rounded-b-[50px] ">
            <AttendanceMarking />
          </div>
          <div className="max-w-screen-2xl flex justify-center items-center md:mt-5 px-5 py-3 md:py-5 gap-x-3">
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
          <div className="mx-auto flex justify-center items-center pb-[50px] md:pb-0">
            <button
              onClick={handleSignOut}
              className="bg-red-600 text-white text-[16px] px-10 py-2 md:text-[20px] font-medium rounded-lg"
            >
              Logout
            </button>
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
      </div>
    </div>
  );
};
export default Main;
