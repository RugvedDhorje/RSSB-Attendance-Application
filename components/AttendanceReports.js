"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supebase";
import Navbar from "./Navbar";
import Link from "next/link";
import Footer from "./Footer";

export default function AttendanceReports() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [place, setPlace] = useState("");

  useEffect(() => {
    // Set today's date as default
    const today = new Date().toISOString().split("T")[0];
    setTo(today);
  }, []);

  const fetchAttendanceByDate = async (from, to, place) => {
    setLoading(true);

    let query = supabase
      .from("attendance")
      .select(
        `
      *,
      members (badge_id, name, dept, place, contact)
    `
      )
      .gte("date", from)
      .lte("date", to)
      .order("date", { ascending: true })
      .order("time", { ascending: true });

    // ✅ Apply filter only if place is selected and not empty
    const { data, error } = await query;

    if (place && place.trim() !== "") {
      const filteredData = data.filter(
        (record) => record.members?.place?.toLowerCase() === place.toLowerCase()
      );
      setAttendanceData(filteredData || []);
    } else {
      setAttendanceData(data || []);
    }

    if (error) {
      alert("Error fetching attendance: " + error.message);
    }
    // else {
    //   setAttendanceData(data || []);
    // }
    setLoading(false);
  };

  const downloadCSV = () => {
    if (attendanceData.length === 0) {
      alert("No data to download!");
      return;
    }

    // Group attendance records by qr_id and date
    const groupedData = attendanceData.reduce((acc, record) => {
      const key = `${record.qr_id}-${record.date}`;

      if (!acc[key]) {
        acc[key] = {
          qr_id: record.qr_id,
          date: record.date,
          member: record.members,
          times: [],
        };
      }

      if (record.time) {
        acc[key].times.push(record.time);
      }

      return acc;
    }, {});

    // Convert grouped data to CSV format with in_time and out_time
    const csvHeaders = [
      "Badge ID",
      "Name",
      "Dept",
      "Place",
      "Phone",
      "Date",
      "In Time",
      "Out Time",
    ];

    const csvRows = Object.values(groupedData).map((group) => {
      // Sort times to get first (in_time) and last (out_time)
      const sortedTimes = group.times.sort();
      const inTime = sortedTimes.length > 0 ? sortedTimes[0] : null;
      const outTime =
        sortedTimes.length > 1 ? sortedTimes[sortedTimes.length - 1] : null;

      // Format time function
      const formatTime = (timeStr) => {
        if (!timeStr) return "N/A";
        try {
          return new Date(`1970-01-01T${timeStr}`).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });
        } catch {
          return timeStr; // Return original if formatting fails
        }
      };

      return [
        group.member?.badge_id || "N/A",
        group.member?.name || "N/A",
        group.member?.dept || "N/A",
        group.member?.place || "N/A",
        group.member?.contact || "N/A",
        group.date || "N/A",
        formatTime(inTime),
        formatTime(outTime),
      ];
    });

    const csvContent = [csvHeaders, ...csvRows]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    // Include place in filename if selected
    const placeFilter = place && place.trim() !== "" ? `-${place}` : "";
    link.download = `attendance-${from}-to-${to}${placeFilter}.csv`;

    link.click();
    window.URL.revokeObjectURL(url);
  };

  console.log(attendanceData);

  return (
    <>
      <Navbar />
      <div className=" p-6 rounded-lg flex flex-col items-center justify-center">
        <h2 className="text-2xl text-center font-bold mb-6">
          Attendance Reports
        </h2>
        {/* Date Selection */}
        <div className="mb-6  flex flex-col md:flex-row gap-4 items-center">
          <div className="flex flex-col md:flex-row gap-5 justify-center items-center md:gap-x-5">
            <div>
              <label className="text-[18px] font-semibold">From : </label>
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="border p-2 rounded"
              />
            </div>
            <div>
              <label className="text-[18px] font-semibold">To : </label>
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="border p-2 rounded"
              />
            </div>
            <div>
              <label className="text-[18px] font-semibold">Area: </label>
              <select
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                className="border p-2 rounded"
              >
                <option value="">Select Area</option>
                <option value="mumbai">Mumbai</option>
                <option value="delhi">Delhi</option>
                <option value="bangalore">Bangalore</option>
                <option value="pune">Pune</option>
                <option value="hyderabad">Hyderabad</option>
                <option value="chennai">Chennai</option>
                <option value="kolkata">Kolkata</option>
              </select>
            </div>
          </div>
          <button
            onClick={() => fetchAttendanceByDate(from, to, place)}
            disabled={loading || !from || !to}
            className="bg-[#8A1912] text-white px-4 py-2 rounded hover:bg-opacity-90 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Get Attendance"}
          </button>
          <button
            onClick={downloadCSV}
            disabled={attendanceData.length === 0}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            Download CSV
          </button>
        </div>
        <div className="w-full flex items-center justify-center py-4 mb-10">
          <Link href={"/"}>
            <button className="mx-auto px-8 py-2 bg-green-600 hover:bg-opacity-90 p-2 rounded text-white font-semibold ">
              Back
            </button>
          </Link>
        </div>
        {/* Attendance Summary */}
        {attendanceData.length > 0 && (
          <div className="mb-4 p-4 bg-blue-50 rounded">
            <h3 className="font-semibold">
              Summary from {from} to {to} {place && `(${place})`}
            </h3>
            <p>Total Present : {attendanceData.length}</p>
          </div>
        )}

        {/* Attendance Table */}
        {attendanceData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Badge ID</th>
                  <th className="border p-2 text-left">Name</th>
                  <th className="border p-2 text-left">Dept</th>
                  <th className="border p-2 text-left">Place</th>
                  <th className="border p-2 text-left">Contact</th>
                  <th className="border p-2 text-left">Date</th>
                  <th className="border p-2 text-left">In Time</th>
                  <th className="border p-2 text-left">Out Time</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(
                  attendanceData.reduce((acc, record) => {
                    const key = `${record.qr_id}-${record.date}`;
                    if (!acc[key]) {
                      acc[key] = {
                        qr_id: record.qr_id,
                        date: record.date,
                        member: record.members,
                        times: [],
                      };
                    }
                    if (record.time) acc[key].times.push(record.time);
                    return acc;
                  }, {})
                ).map((group, index) => {
                  const sortedTimes = group.times.sort();
                  const inTime = sortedTimes.length > 0 ? sortedTimes[0] : null;
                  const outTime =
                    sortedTimes.length > 1
                      ? sortedTimes[sortedTimes.length - 1]
                      : null;

                  const formatTime = (timeStr) => {
                    if (!timeStr) return "N/A";
                    try {
                      return new Date(
                        `1970-01-01T${timeStr}`
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      });
                    } catch {
                      return timeStr;
                    }
                  };

                  return (
                    <tr key={index}>
                      <td className="border p-2">
                        {group.member?.badge_id || "N/A"}
                      </td>
                      <td className="border p-2">
                        {group.member?.name || "N/A"}
                      </td>
                      <td className="border p-2">
                        {group.member?.dept || "N/A"}
                      </td>
                      <td className="border p-2">
                        {group.member?.place || "N/A"}
                      </td>
                      <td className="border p-2">
                        {group.member?.contact || "N/A"}
                      </td>
                      <td className="border p-2">{group.date || "N/A"}</td>
                      <td className="border p-2">{formatTime(inTime)}</td>
                      <td className="border p-2">{formatTime(outTime)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          from &&
          !loading && (
            <p className="text-gray-500 text-center py-8">
              No attendance records found from {from} to {to}
              {place && ` for ${place}`}
            </p>
          )
        )}
      </div>
      <Footer />
    </>
  );
}

// const fetchAttendanceByDate = async (date) => {
//   setLoading(true);
//   const { data, error } = await supabase
//     .from("attendance")
//     .select(
//       `
//       *,
//       members (badge_id, name, dept,place,contact)
//     `
//     )
//     .eq("date", date)
//     .order("time", { ascending: false });

//   if (error) {
//     alert("Error fetching attendance: " + error.message);
//   } else {
//     setAttendanceData(data || []);
//   }
//   setLoading(false);
// };

// const downloadCSV = () => {
//   if (attendanceData.length === 0) {
//     alert("No data to download!");
//     return;
//   }

//   const csvHeaders = [
//     "Badge ID",
//     "Name",
//     "Dept",
//     "Place",
//     "Phone",
//     "Date",
//     "Time",
//   ];

//   const csvRows = attendanceData.map((record) => [
//     record.members?.badge_id || "N/A",
//     record.members?.name || "N/A",
//     record.members?.dept || "N/A",
//     record.members?.place || "N/A",
//     record.members?.contact || "N/A",
//     record.date || "N/A",
//     record.time
//       ? new Date(`1970-01-01T${record.time}`).toLocaleTimeString([], {
//           hour: "2-digit",
//           minute: "2-digit",
//           hour12: true,
//         })
//       : "N/A",
//   ]);

//   const csvContent = [csvHeaders, ...csvRows]
//     .map((row) => row.map((field) => `"${field}"`).join(","))
//     .join("\n");

//   const blob = new Blob([csvContent], { type: "text/csv" });
//   const url = window.URL.createObjectURL(blob);
//   const link = document.createElement("a");
//   link.href = url;
//   link.download = `attendance-${selectedDate}.csv`;
//   link.click();
//   window.URL.revokeObjectURL(url);
// };

// const fetchAttendanceByDate = async (from, to) => {
//   setLoading(true);
//   const { data, error } = await supabase
//     .from("attendance")
//     .select(
//       `
//     *,
//     members (badge_id, name, dept, place, contact)
//   `
//     )
//     // .ilike("members.place", "pune")
//     .gte("date", from)
//     .lte("date", to)
//     .order("date", { ascending: true })
//     .order("time", { ascending: true });

//   if (error) {
//     alert("Error fetching attendance: " + error.message);
//   } else {
//     setAttendanceData(data || []);
//   }
//   setLoading(false);
// };
