"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supebase";

export default function AttendanceReports() {
  const [selectedDate, setSelectedDate] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Set today's date as default
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
  }, []);

  const fetchAttendanceByDate = async (date) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("attendance")
      .select(
        `
        *,
        members (badge_id, name, dept,place,contact)
      `
      )
      .eq("date", date)
      .order("time", { ascending: false });

    if (error) {
      alert("Error fetching attendance: " + error.message);
    } else {
      setAttendanceData(data || []);
    }
    setLoading(false);
  };

  const downloadCSV = () => {
    if (attendanceData.length === 0) {
      alert("No data to download!");
      return;
    }

    const csvHeaders = [
      "Badge ID",
      "Name",
      "Dept",
      "Place",
      "Phone",
      "Date",
      "Time",
    ];

    const csvRows = attendanceData.map((record) => [
      record.members?.badge_id || "N/A",
      record.members?.name || "N/A",
      record.members?.dept || "N/A",
      record.members?.place || "N/A",
      record.members?.contact || "N/A",
      record.date || "N/A",
      record.time
        ? new Date(`1970-01-01T${record.time}`).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
        : "N/A",
    ]);

    const csvContent = [csvHeaders, ...csvRows]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `attendance-${selectedDate}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#FFFAF0] p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Attendance Reports</h2>

      {/* Date Selection */}
      <div className="mb-6  flex flex-col md:flex-row gap-4 items-center">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={() => fetchAttendanceByDate(selectedDate)}
          disabled={loading || !selectedDate}
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

      {/* Attendance Summary */}
      {attendanceData.length > 0 && (
        <div className="mb-4 p-4 bg-blue-50 rounded">
          <h3 className="font-semibold">Summary for {selectedDate}</h3>
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
                <th className="border p-2 text-left">Time</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((record) => (
                <tr key={record.id}>
                  <td className="border p-2">
                    {record.members?.badge_id || "N/A"}
                  </td>
                  <td className="border p-2">
                    {record.members?.name || "N/A"}
                  </td>
                  <td className="border p-2">
                    {record.members?.dept || "N/A"}
                  </td>
                  <td className="border p-2">
                    {record.members?.place || "N/A"}
                  </td>
                  <td className="border p-2">
                    {record.members?.contact || "N/A"}
                  </td>
                  <td className="border p-2">{record.date || "N/A"}</td>
                  <td className="border p-2">
                    {record.time
                      ? new Date(
                          `1970-01-01T${record.time}`
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        selectedDate &&
        !loading && (
          <p className="text-gray-500 text-center py-8">
            No attendance records found for {selectedDate}
          </p>
        )
      )}
    </div>
  );
}
