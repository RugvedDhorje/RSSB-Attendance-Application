"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supebase";
import { Html5QrcodeScanner } from "html5-qrcode";
// import { Html5Qrcode } from "html5-qrcode";

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

  // const startScanner = () => {
  //   setScannerActive(true);
  //   setTimeout(() => {
  //     html5QrcodeScannerRef.current = new Html5QrcodeScanner(
  //       "qr-rea der",
  //       {
  //         fps: 10,
  //         qrbox: { width: 250, height: 250 },
  //         facingMode: "environment",
  //         // Optionally, disable camera selection UI
  //         disableFlip: true, // Prevents switching between cameras
  //       },
  //       false
  //     );

  //     html5QrcodeScannerRef.current.render(
  //       (decodedText, decodedResult) => {
  //         try {
  //           const qrData = JSON.parse(decodedText);
  //           if (qrData.type === "attendance" && qrData.member_id) {
  //             markAttendance(qrData.member_id);
  //             stopScanner();
  //           } else {
  //             alert("Invalid QR code format!");
  //           }
  //         } catch (error) {
  //           // If it's not JSON, treat as plain member ID
  //           markAttendance(decodedText.trim());
  //           console.log(decodedText);
  //           stopScanner();
  //         }
  //       },
  //       (error) => {
  //         // Handle scan errors silently
  //       }
  //     );
  //   }, 100);
  // };
  const startScanner = async () => {
    setScannerActive(true);

    // Wait for the next render cycle to ensure qr-reader div is in the DOM
    setTimeout(async () => {
      const qrReaderDiv = document.getElementById("qr-reader");
      if (!qrReaderDiv) {
        console.error("QR reader div not found!");
        alert("Error: QR reader container not found!");
        setScannerActive(false);
        return;
      }

      try {
        // Check if camera access is available
        const cameras = await Html5Qrcode.getCameras();
        if (!cameras || cameras.length === 0) {
          console.error("No cameras found!");
          alert("No cameras available on this device!");
          setScannerActive(false);
          return;
        }

        // Initialize the scanner
        html5QrcodeScannerRef.current = new Html5QrcodeScanner(
          "qr-reader",
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            facingMode: "environment", // Use back camera
            disableFlip: true, // Prevent camera switching
          },
          false
        );

        // Render the scanner
        await html5QrcodeScannerRef.current.render(
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
              markAttendance(decodedText.trim());
              console.log("Decoded QR text:", decodedText);
              stopScanner();
            }
          },
          (error) => {
            console.warn("QR scan error:", error);
          }
        );
      } catch (error) {
        console.error("Error initializing QR scanner:", error);
        alert(
          "Failed to start QR scanner. Please ensure camera permissions are granted."
        );
        setScannerActive(false);
      }
    }, 0); // Use 0ms to wait for the next render cycle
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
    <div className="max-w-screen-md mx-auto p-6 rounded-lg">
      <h2 className="text-2xl text-white font-bold mb-4 md:mb-6 text-center">
        Mark Attendance
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
            onClick={() => markAttendance(manualMemberId)}
            disabled={loading || !manualMemberId}
            className="text-[#8A1912] text-[20px] bg-[#FFFAF0] px-4 py-2 font-semibold rounded hover:bg-opacity-90 disabled:opacity-90 "
          >
            {loading ? "Marking..." : "Mark Attendance"}
          </button>
        </div>
      </div>

      {/* QR Code Scanner */}
      <div className="md:mb-8 mb-6 flex flex-col justify-center items-center">
        <h3 className="text-2xl font-bold md:mb-4 mb-2 text-white">
          QR Code Scanner
        </h3>
        {!scannerActive ? (
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
        )}
      </div>
    </div>
  );
}
