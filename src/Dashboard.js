import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = () => {
    axios.get("http://127.0.0.1:8000/api/documents/")
      .then((res) => setDocuments(res.data))
      .catch(() => alert("⚠️ Failed to fetch documents."));
  };

  const handleDownload = (id) => {
    window.open(`http://127.0.0.1:8000/api/documents/${id}/download/`, "_blank");
  };

  const handleDelete = (id) => {
    axios.delete(`http://127.0.0.1:8000/api/documents/${id}/delete/`)
      .then(() => {
        alert("🗑️ Document deleted.");
        fetchDocuments(); // refresh list
      })
      .catch(() => alert("⚠️ Failed to delete document."));
  };

  const statusColor = (status) => {
    switch (status) {
      case "Verified": return "green";
      case "Pending": return "orange";
      case "Failed": return "red";
      default: return "gray";
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>📊 Uploaded Documents</h2>
      <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead style={{ background: "#f0f0f0" }}>
          <tr>
            <th>📄 File Name</th>
            <th>⏱ Upload Time</th>
            <th>✅ Status</th>
            <th>🔍 Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.length === 0 ? (
            <tr><td colSpan="4">No documents uploaded yet.</td></tr>
          ) : (
            documents.map((doc) => (
              <tr key={doc.id}>
                <td>
                  <a
                    href={`http://127.0.0.1:8000${doc.file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {doc.file.split('/').pop()}
                  </a>
                </td>
                <td>{new Date(doc.uploaded_at).toLocaleString()}</td>
                <td style={{ color: statusColor(doc.verification_status), fontWeight: 'bold' }}>
                  {doc.verification_status}
                </td>
                <td>
                  <button onClick={() => handleDownload(doc.id)}>⬇️</button>{' '}
                  <button onClick={() => handleDelete(doc.id)}>🗑️</button>{' '}
                  <button onClick={() => setSelectedDoc(doc)}>🔍 View</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <br />
      <button onClick={() => navigate('/')}>← Back to Upload</button>

      {/* View Result Modal */}
      {selectedDoc && (
        <div style={{
          marginTop: "30px",
          padding: "20px",
          border: "1px solid #ccc",
          background: "#f9f9f9"
        }}>
          <h3>🔍 Extracted Data</h3>
          <p><strong>Name:</strong> {selectedDoc.name || '❌ Not Found'}</p>
          <p><strong>DOB:</strong> {selectedDoc.dob || '❌ Not Found'}</p>
          <p><strong>Document No:</strong> {selectedDoc.passport_no || '❌ Not Found'}</p>
          <p><strong>Status:</strong> {selectedDoc.verification_status}</p>
          <p><strong>OCR Text:</strong></p>
          <pre style={{
            background: '#eee',
            padding: '10px',
            whiteSpace: 'pre-wrap',
            maxHeight: '300px',
            overflowY: 'auto'
          }}>{selectedDoc.extracted_text}</pre>
          <button onClick={() => setSelectedDoc(null)}>❌ Close</button>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
