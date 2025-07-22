import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';

function UploadPage() {
  const [file, setFile] = useState(null);
  const [docType, setDocType] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
    setMessage('');
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleUpload = async () => {
    if (!file || !docType) {
      setMessage("❗ Please select a file and document type.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('document_type', docType);

    try {
      setUploading(true);
      await axios.post("http://127.0.0.1:8000/api/upload/", formData, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percent);
        }
      });
      setMessage("✅ File uploaded successfully.");
      setUploading(false);
      navigate('/dashboard');
    } catch (err) {
      setMessage("❌ Upload failed. Make sure the backend is running.");
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>📤 Upload Document</h2>

      <label>Select Document Type:</label><br />
      <select value={docType} onChange={(e) => setDocType(e.target.value)}>
        <option value="">-- Select --</option>
        <option value="aadhaar">Aadhaar</option>
        <option value="passport">Passport</option>
      </select><br /><br />

      <div {...getRootProps()} style={{
        border: '2px dashed #ccc',
        padding: '20px',
        textAlign: 'center',
        background: '#f9f9f9'
      }}>
        <input {...getInputProps()} />
        <p>{file ? `📎 Selected: ${file.name}` : "Drag & drop or click to select a document"}</p>
      </div>

      <br />
      <button type="button" onClick={handleUpload} disabled={uploading}>Upload</button>
      {uploading && <p>Uploading... {progress}%</p>}
      {message && <p>{message}</p>}
    </div>
  );
}

export default UploadPage;
