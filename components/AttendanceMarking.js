"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supebase";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function AttendanceMarking() {
  const [manualMemberId, setManualMemberId] = useState("");
  const [loading, setLoading] = useState(false);
  const [scannerActive, setScannerActive] = useState(false);
  const scannerRef = useRef(null);
  const html5QrcodeScannerRef = useRef(null);

  const markAttendance = async (memberId) => {
    setLoading(true);
    const today = new Date().toISOString().split("T")[0];
    const currentTime = new Date().toTimeString().split(" ")[0];

    try {
      // Check if member exists
      const { data: member, error: memberError } = await supabase
        .from("members")
        .select("*")
        .ilike("qr_id", memberId.trim())
        // .or(`qr_id.ilike.${memberId.trim()},id.eq.${memberId.trim()}`)
        .single();

      if (memberError || !member) {
        alert("Member not found!");
        setLoading(false);
        return;
      }

      // Check if attendance already marked today
      const { data: existingAttendance, error: checkError } = await supabase
        .from("attendance")
        .select("*")
        .eq("qr_id", memberId)
        .eq("date", today);

      if (checkError) {
        alert("Error checking attendance: " + checkError.message);
        setLoading(false);
        return;
      }

      if (existingAttendance && existingAttendance.length > 0) {
        alert("Attendance already marked for today!");
        setLoading(false);
        return;
      }

      // Mark attendance
      const attendanceData = {
        qr_id: member.qr_id,
        name: member.name,
        dept: member.dept,
        date: today,
        time: currentTime,
      };
      const { error: insertError } = await supabase
        .from("attendance")
        .insert([attendanceData]);

      if (insertError) {
        alert("Error marking attendance: " + insertError.message);
      } else {
        alert(`Attendance marked successfully for ${member.name}!`);
        setManualMemberId("");
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
    setLoading(false);
  };

  const startScanner = () => {
    setScannerActive(true);
    setTimeout(() => {
      html5QrcodeScannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      html5QrcodeScannerRef.current.render(
        (decodedText, decodedResult) => {
          try {
            const qrData = JSON.parse(decodedText);
            if (qrData.type === "attendance" && qrData.member_id) {
              markAttendance(qrData.member_id);
              stopScanner();
            } else {
              alert("Invalid QR code format!");
            }
          } catch (error) {
            // If it's not JSON, treat as plain member ID
            markAttendance(decodedText.trim());
            console.log(decodedText);
            stopScanner();
          }
        },
        (error) => {
          // Handle scan errors silently
        }
      );
    }, 100);
  };

  const stopScanner = () => {
    if (html5QrcodeScannerRef.current) {
      html5QrcodeScannerRef.current.clear();
      html5QrcodeScannerRef.current = null;
    }
    setScannerActive(false);
  };

  useEffect(() => {
    return () => {
      if (html5QrcodeScannerRef.current) {
        html5QrcodeScannerRef.current.clear();
      }
    };
  }, []);

  return (
    <div className="bg-[#FFFAF0] p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Mark Attendance</h2>

      {/* Manual Entry */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Manual Entry</h3>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Enter Member ID"
            value={manualMemberId}
            onChange={(e) => setManualMemberId(e.target.value)}
            className="border p-2 rounded flex-1"
          />
          <button
            onClick={() => markAttendance(manualMemberId)}
            disabled={loading || !manualMemberId}
            className="bg-[#8A1912] text-white px-4 py-2 rounded hover:bg-opacity-90 disabled:opacity-50 "
          >
            {loading ? "Marking..." : "Mark Attendance"}
          </button>
        </div>
      </div>

      {/* QR Code Scanner */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">QR Code Scanner</h3>
        {!scannerActive ? (
          <button
            onClick={startScanner}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Start QR Scanner
          </button>
        ) : (
          <div>
            <button
              onClick={stopScanner}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mb-4"
            >
              Stop Scanner
            </button>
            <div id="qr-reader" className="w-full max-w-md mx-auto"></div>
          </div>
        )}
      </div>
    </div>
  );
}
