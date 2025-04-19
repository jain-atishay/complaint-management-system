import { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

type Complaint = {
  id: number;
  name: string;
  email: string;
  complaint: string;
  status: string;
  created_at: string;
};

function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [complaint, setComplaint] = useState('');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; complaint?: string }>({});
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Resolved'>('All');

  const fetchComplaints = async () => {
    try {
      const res = await axios.get('/complaints');
      if (Array.isArray(res.data)) {
        setComplaints(res.data);
      } else {
        console.error("Expected array, got:", res.data);
        setComplaints([]);
      }
    } catch (err) {
      console.error("Error fetching complaints:", err);
      setError("Failed to fetch complaints.");
      setComplaints([]);
    }
  };

  const submitComplaint = async () => {
    const newErrors: typeof errors = {};

    if (!name.trim()) newErrors.name = "Name is required.";
    if (!email.trim()) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email format.";
    if (!complaint.trim()) newErrors.complaint = "Complaint is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setMessage('');
      return;
    }

    try {
      await axios.post('/complaints', { name, email, complaint });
      setName(''); setEmail(''); setComplaint('');
      setMessage("Complaint submitted!");
      setErrors({});
      fetchComplaints();
    } catch (err) {
      console.error("Submission failed:", err);
      setMessage('');
      setErrors({ complaint: "Submission failed. Please try again." });
    }
  };

  const toggleStatus = async (id: number) => {
    try {
      await axios.patch(`/complaints/${id}`);
      fetchComplaints();
    } catch (err) {
      console.error("Failed to toggle status:", err);
      setError("Could not update complaint status.");
    }
  };

  const deleteComplaint = async (id: number) => {
    try {
      await axios.delete(`/complaints/${id}`);
      fetchComplaints();
    } catch (err) {
      console.error("Delete failed:", err);
      setError("Could not delete complaint.");
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-start px-4 py-10 text-center">
      <h1 className="text-4xl font-bold mb-8">Complaint Submission</h1>

      <div className="bg-white text-black rounded shadow p-6 space-y-3 w-full max-w-md mb-12">
        <input
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setErrors((prev) => ({ ...prev, name: undefined }));
          }}
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

        <input
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((prev) => ({ ...prev, email: undefined }));
          }}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

        <textarea
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Your Complaint"
          value={complaint}
          onChange={(e) => {
            setComplaint(e.target.value);
            setErrors((prev) => ({ ...prev, complaint: undefined }));
          }}
        />
        {errors.complaint && <p className="text-red-500 text-sm">{errors.complaint}</p>}

        <button
          onClick={submitComplaint}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded transition"
        >
          Submit
        </button>

        {message && <p className="text-green-500">{message}</p>}
        {error && <p className="text-red-500">{error}</p>}
      </div>

      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

      <div className="flex gap-2 mb-6 flex-wrap justify-center">
        {['All', 'Pending', 'Resolved'].map((status) => (
          <button
            key={status}
            className={`px-4 py-1 rounded font-medium transition ${
              filter === status
                ? 'bg-blue-500 text-white'
                : 'bg-gray-300 text-black hover:bg-gray-400'
            }`}
            onClick={() => setFilter(status as any)}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="w-full max-w-4xl overflow-x-auto bg-white rounded shadow text-black">
        <table className="w-full text-sm border-collapse text-center">
          <thead className="bg-gray-100 text-center">
            <tr>
              <th className="p-3 border text-center">Name</th>
              <th className="p-3 border text-center">Email</th>
              <th className="p-3 border text-center">Complaint</th>
              <th className="p-3 border text-center">Status</th>
              <th className="p-3 border text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {complaints
              .filter((c) => filter === 'All' || c.status === filter)
              .map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="p-3 border text-center">{c.name}</td>
                  <td className="p-3 border text-center">{c.email}</td>
                  <td className="p-3 border text-center">{c.complaint}</td>
                  <td className="p-3 border text-center">
                    <span
                      className={`px-2 py-1 rounded text-white ${
                        c.status === 'Pending' ? 'bg-yellow-500' : 'bg-green-600'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="p-3 border text-center space-x-2">
                    <button
                      onClick={() => toggleStatus(c.id)}
                      className="bg-gray-700 hover:bg-gray-800 text-white px-3 py-1 rounded"
                    >
                      Toggle
                    </button>
                    <button
                      onClick={() => deleteComplaint(c.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {complaints.length === 0 && (
          <p className="p-4 text-center text-gray-600">No complaints to show.</p>
        )}
      </div>
    </div>
  );
}

export default App;