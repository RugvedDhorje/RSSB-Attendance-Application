"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supebase";
// import QRCode from "qrcode";

export default function MemberManagement() {
  // const [members, setMembers] = useState([]);
  const [formData, setFormData] = useState({
    photo_id: "",
    title:"",
    name: "",
    dept: "",
    place:"",
    badge_id:"",
    validity:"",
    qr_id:"",
    remark:"",
    adhar_no:"",
    contact:"",
    emergency_contact:"",
    address:"",
    date_of_birth:"",
    date_of_incorporation:""
  });
  const [loading, setLoading] = useState(false);
  // const [qrCodeUrl, setQrCodeUrl] = useState("");
  // const [selectedMember, setSelectedMember] = useState(null);

  // useEffect(() => {
  //   fetchMembers();
  // }, []);

  // const fetchMembers = async () => {
  //   const { data, error } = await supabase
  //     .from("members")
  //     .select("*")
  //     .order("created_at", { ascending: false });

  //   if (error) {
  //     alert("Error fetching members: " + error.message);
  //   } else {
  //     setMembers(data);
  //   }
  // };
const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  const addMember = async (e) => {
    e.preventDefault();
    setLoading(true);
console.log(formData);
    const { data, error } = await supabase
      .from("members")
      .insert([formData])
      .select();

    if (error) {
      alert("Error adding member: " + error.message);
    } else {
      setFormData({photo_id: "",
    title:"",
    name: "",
    dept: "",
    place:"",
    badge_id:"",
    validity:"",
    qr_id:"",
    remark:"",
    adhar_no:"",
    contact:"",
    emergency_contact:"",
    address:"",
    date_of_birth:"",
    date_of_incorporation:""});
      // fetchMembers();
      alert("Member added successfully!");
    }
    setLoading(false);
  };

  // const generateQRCode = async (memberId) => {
  //   try {
  //     const qrData = JSON.stringify({
  //       member_id: memberId,
  //       type: "attendance",
  //     });
  //     const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
  //       width: 300,
  //       margin: 2,
  //       color: {
  //         dark: "#000000",
  //         light: "#FFFFFF",
  //       },
  //     });
  //     setQrCodeUrl(qrCodeDataUrl);
  //     setSelectedMember(memberId);
  //   } catch (error) {
  //     alert("Error generating QR code: " + error.message);
  //   }
  // };

  // const downloadQRCode = () => {
  //   const link = document.createElement("a");
  //   link.download = `qr-code-${selectedMember}.png`;
  //   link.href = qrCodeUrl;
  //   link.click();
  // };

  return (
    <div className="bg-[#FFFAF0] p-6 rounded-lg shadow-md border ">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Add New Member</h2>

      {/* Add Member Form */}
      {/* <form onSubmit={addMember} className="mb-8 p-4 border rounded-lg"> */}
          <form onSubmit={addMember} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Required Fields */}
        <input name="photo_id" value={formData.photo_id} onChange={handleChange} placeholder="Photo ID" className="p-2 rounded bg-white border border-gray-600 focus:ring-1 focus:ring-[#8A1912] focus:outline-none" required />
        
        <select name="title" value={formData.title} onChange={handleChange} className="p-2 rounded bg-white border border-gray-600 focus:ring-1 focus:ring-[#8A1912] focus:outline-none" required>
          <option value="">Select Title</option>
          <option value="Mr">Mr</option>
          <option value="Mrs">Mrs</option>
          <option value="Ms">Ms</option>
          <option value="Dr">Dr</option>
        </select>

        <input name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className="p-2 rounded bg-white border border-gray-600 focus:ring-1 focus:ring-[#8A1912] focus:outline-none" required />
        <input name="dept" value={formData.dept} onChange={handleChange} placeholder="Department" className="p-2 rounded bg-white border border-gray-600 focus:ring-1 focus:ring-[#8A1912] focus:outline-none" />

        <input name="place" value={formData.place} onChange={handleChange} placeholder="Place" className="p-2 rounded bg-white border border-gray-600 focus:ring-1 focus:ring-[#8A1912] focus:outline-none" />
        <input name="badge_id" value={formData.badge_id} onChange={handleChange} placeholder="Badge ID" className="p-2 rounded bg-white border border-gray-600 focus:ring-1 focus:ring-[#8A1912] focus:outline-none" required />

        <input name="validity" value={formData.validity} onChange={handleChange} placeholder="Validity" className="p-2 rounded bg-white border border-gray-600 focus:ring-1 focus:ring-[#8A1912] focus:outline-none" />
        <input name="qr_id" value={formData.qr_id} onChange={handleChange} placeholder="QR ID" className="p-2 rounded bg-white border border-gray-600 focus:ring-1 focus:ring-[#8A1912] focus:outline-none" required />

        <textarea name="remark" value={formData.remark} onChange={handleChange} placeholder="Remark" className="p-2 rounded bg-white border border-gray-600 md:col-span-2 focus:ring-1 focus:ring-[#8A1912] focus:outline-none" />

        <input name="adhar_no" value={formData.adhar_no} onChange={handleChange} placeholder="Aadhar Number" type="number" className="p-2 rounded bg-white border border-gray-600 focus:ring-1 focus:ring-[#8A1912] focus:outline-none" />
        <input name="contact" value={formData.contact} onChange={handleChange} placeholder="Contact Number" className="p-2 rounded bg-white border border-gray-600 focus:ring-1 focus:ring-[#8A1912] focus:outline-none" />
        <input name="emergency_contact" value={formData.emergency_contact} onChange={handleChange} placeholder="Emergency Contact" className="p-2 rounded bg-white border border-gray-600 focus:ring-1 focus:ring-[#8A1912] focus:outline-none" />

        <textarea name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="p-2 rounded bg-white border border-gray-600 md:col-span-2 focus:ring-1 focus:ring-[#8A1912] focus:outline-none" />

        <label className="text-gray-900 text-sm md:text-lg md:text-center">Date of Birth</label>
        <input name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} type="date" className="p-2 rounded bg-white border border-gray-600 focus:ring-1 focus:ring-[#8A1912] focus:outline-none" />

        <label className="text-gray-900 text-sm md:text-lg md:text-center">Date of Incorporation</label>
        <input name="date_of_incorporation" value={formData.date_of_incorporation} onChange={handleChange} type="date" className="p-2 rounded bg-white border border-gray-600 focus:ring-1 focus:ring-[#8A1912] focus:outline-none" />

        <button type="submit" disabled={loading} className="md:col-span-2 md:w-1/2 w-9/12 mx-auto bg-[#8A1912] hover:bg-opacity-90 p-2 rounded text-white font-semibold">
          {loading ? "Adding..." : "Add Member"}
        </button>
      </form>
          {/* <input
            type="text"
            placeholder="Photo ID"
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
          /> */}
        {/* <button
          type="submit"
          disabled={loading}
          className="mt-4 bg-[#8A1912] text-white px-4 py-2 rounded hover:bg-opacity-90 disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Member"}
        </button> */}
      {/* </form> */}

      {/* Members List */}
      {/* <div className="overflow-x-auto">
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
      </div> */}

      {/* QR Code Modal */}
      {/* {qrCodeUrl && (
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
      )} */}
    </div>
  );
}
