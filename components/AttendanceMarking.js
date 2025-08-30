"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supebase";
import { Html5QrcodeScanner } from "html5-qrcode";
// import { Html5Qrcode } from "html5-qrcode";
import Scanner from "../components/Scanner";
import { useAuth } from "../context/AuthContext";

export default function AttendanceMarking() {
  const [manualMemberId, setManualMemberId] = useState("");
  const [loading, setLoading] = useState(false);
  const { markAttendance } = useAuth();

  // const markAttendance = async (memberId) => {
  //   setLoading(true);
  //   const today = new Date().toISOString().split("T")[0];
  //   const currentTime = new Date().toTimeString().split(" ")[0];

  //   try {
  //     // Check if member exists
  //     const { data: member, error: memberError } = await supabase
  //       .from("members")
  //       .select("*")
  //       .ilike("qr_id", memberId.trim())
  //       // .or(`qr_id.ilike.${memberId.trim()},id.eq.${memberId.trim()}`)
  //       .single();

  //     if (memberError || !member) {
  //       alert("Member not found!");
  //       setLoading(false);
  //       return;
  //     }

  //     // Check if attendance already marked today
  //     // const { data: existingAttendance, error: checkError } = await supabase
  //     //   .from("attendance")
  //     //   .select("*")
  //     //   .eq("qr_id", memberId)
  //     //   .eq("date", today);

  //     // if (checkError) {
  //     //   alert("Error checking attendance: " + checkError.message);
  //     //   setLoading(false);
  //     //   return;
  //     // }

  //     // if (existingAttendance && existingAttendance.length > 0) {
  //     //   alert("Attendance already marked for today!");
  //     //   setLoading(false);
  //     //   return;
  //     // }

  //     // Mark attendance
  //     const attendanceData = {
  //       qr_id: member.qr_id,
  //       name: member.name,
  //       dept: member.dept,
  //       date: today,
  //       time: currentTime,
  //     };
  //     const { error: insertError } = await supabase
  //       .from("attendance")
  //       .insert([attendanceData]);

  //     if (insertError) {
  //       alert("Error marking attendance: " + insertError.message);
  //     } else {
  //       alert(`Attendance marked successfully for ${member.name}!`);
  //       setManualMemberId("");
  //     }
  //   } catch (error) {
  //     alert("Error: " + error.message);
  //   }
  //   setLoading(false);
  // };
  const manualMarkAttendance = () => {
    markAttendance(manualMemberId);
    setManualMemberId("");
  };
  return (
    <div className="max-w-screen-md mx-auto p-6 rounded-lg">
      <h2 className="text-2xl text-white font-bold mb-4 md:mb-6 text-center">
        Enter Member ID
      </h2>

      {/* Manual Entry */}
      <div className="mb-8">
        {/* <h3 className="text-lg font-semibold mb-4">Manual Entry</h3> */}
        <div className="w-10/12 md:w-1/2 mx-auto flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter Member ID"
            value={manualMemberId}
            onChange={(e) => setManualMemberId(e.target.value)}
            className="border p-2 rounded flex-1 focus:ring-1 focus:ring-[#FFFAF0] focus:outline-none"
          />
          <button
            onClick={manualMarkAttendance}
            disabled={loading || !manualMemberId}
            className="text-[#8A1912] text-[20px] bg-[#FFFAF0] px-4 py-2 font-semibold rounded hover:bg-opacity-90 disabled:opacity-90 cursor-pointer"
          >
            {loading ? "Marking..." : "Mark Attendance"}
          </button>
        </div>
      </div>

      {/* QR Code Scanner */}
      <div className=" flex flex-col justify-center items-center">
        <h3 className="text-2xl font-bold md:mb-4 mb-2 text-white">
          QR Code Scanner
        </h3>
        {/* {!scannerActive ? (
          <button
            onClick={startScanner}
            className="bg-green-500 w-10/12 md:w-1/2 text-white text-[20px] font-semibold px-4 py-2 rounded hover:bg-green-600"
          >
            Start QR Scanner
          </button>
        ) : (
          <div className="w-full mx-auto flex flex-col items-center">
            <button
              onClick={stopScanner}
              className="bg-red-500 w-10/12 md:w-1/2 text-[20px] text-white font-semibold px-4 py-2 rounded hover:bg-red-600 mb-4"
            >
              Stop Scanner
            </button>
            <div id="qr-reader" className="w-full max-w-md mx-auto"></div>
          </div>
        )} */}
      </div>
      <Scanner />
    </div>
  );
}
