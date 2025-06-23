"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supebase";
import QRCode from "qrcode";

export default function MemberManagement() {
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState({
    member_id: "",
    name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert("Error fetching members: " + error.message);
    } else {
      setMembers(data);
    }
  };

  const addMember = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase
      .from("members")
      .insert([newMember])
      .select();

    if (error) {
      alert("Error adding member: " + error.message);
    } else {
      setNewMember({ member_id: "", name: "", email: "", phone: "" });
      fetchMembers();
      alert("Member added successfully!");
    }
    setLoading(false);
  };

  const generateQRCode = async (memberId) => {
    try {
      const qrData = JSON.stringify({
        member_id: memberId,
        type: "attendance",
      });
      const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
      setQrCodeUrl(qrCodeDataUrl);
      setSelectedMember(memberId);
    } catch (error) {
      alert("Error generating QR code: " + error.message);
    }
  };

  const downloadQRCode = () => {
    const link = document.createElement("a");
    link.download = `qr-code-${selectedMember}.png`;
    link.href = qrCodeUrl;
    link.click();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Member Management</h2>

      {/* Add Member Form */}
      <form onSubmit={addMember} className="mb-8 p-4 border rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Add New Member</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Member ID"
            value={newMember.member_id}
            onChange={(e) =>
              setNewMember({ ...newMember, member_id: e.target.value })
            }
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Name"
            value={newMember.name}
            onChange={(e) =>
              setNewMember({ ...newMember, name: e.target.value })
            }
            required
            className="border p-2 rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={newMember.email}
            onChange={(e) =>
              setNewMember({ ...newMember, email: e.target.value })
            }
            className="border p-2 rounded"
          />
          <input
            type="tel"
            placeholder="Phone"
            value={newMember.phone}
            onChange={(e) =>
              setNewMember({ ...newMember, phone: e.target.value })
            }
            className="border p-2 rounded"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Member"}
        </button>
      </form>

      {/* Members List */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Member ID</th>
              <th className="border p-2 text-left">Name</th>
              <th className="border p-2 text-left">Email</th>
              <th className="border p-2 text-left">Phone</th>
              <th className="border p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id}>
                <td className="border p-2">{member.member_id}</td>
                <td className="border p-2">{member.name}</td>
                <td className="border p-2">{member.email}</td>
                <td className="border p-2">{member.phone}</td>
                <td className="border p-2">
                  <button
                    onClick={() => generateQRCode(member.member_id)}
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                  >
                    Generate QR
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* QR Code Modal */}
      {qrCodeUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              QR Code for {selectedMember}
            </h3>
            <div className="text-center">
              <img src={qrCodeUrl} alt="QR Code" className="mx-auto mb-4" />
              <div className="flex gap-2">
                <button
                  onClick={downloadQRCode}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Download
                </button>
                <button
                  onClick={() => setQrCodeUrl("")}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
