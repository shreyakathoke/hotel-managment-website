import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/userprofiles.css"; // You can update/add more styles in this CSS

export default function UserProfilePage() {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    name: localStorage.getItem("user_name") || "",
    email: localStorage.getItem("user_email") || "",
    phone: "",
    address: "",
    idType: "",
    idNumber: "",
    photoUrl: "",
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setMsg("");
    setErrMsg("");
  };

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;
    if (!selectedFile.type?.startsWith("image/")) {
      alert("Only image allowed");
      return;
    }
    if (selectedFile.size > 2 * 1024 * 1024) {
      alert("Max size 2MB");
      return;
    }

    if (preview) URL.revokeObjectURL(preview);
    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setPreview(url);
    setForm((p) => ({ ...p, photoUrl: url }));
  };

  const onBrowse = () => fileRef.current?.click();

  const removeFile = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview("");
    setForm((p) => ({ ...p, photoUrl: "" }));
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setMsg("");
    setErrMsg("");

    const token = localStorage.getItem("token");
    if (!token) return setErrMsg("Please login first");

    if (!form.phone || !form.address || !form.idType || !form.idNumber) {
      return setErrMsg("Please fill all fields");
    }

    if (!form.photoUrl) {
      return setErrMsg("Please upload your photo");
    }

    setSubmitting(true);

    try {
      const profile = {
        ...form,
        idProof: `${form.idType}-${form.idNumber}`,
      };
      localStorage.setItem("user_profile", JSON.stringify(profile));

      setMsg("Profile saved successfully ✅");
      setTimeout(() => navigate("/rooms"), 1500);
    } catch (err) {
      setErrMsg("Failed to save profile");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="profile-wrap py-5" style={{ backgroundColor: "#f5f6fa", minHeight: "100vh" }}>
      <div className="container">
        <div className="card shadow-sm border-0 p-4 p-md-5 mx-auto" style={{ maxWidth: 600 }}>
          <h3 className="mb-4 text-center">Profile Details</h3>

          {msg && <div className="alert alert-success">{msg}</div>}
          {errMsg && <div className="alert alert-danger">{errMsg}</div>}

          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                value={form.name}
                disabled
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                value={form.email}
                disabled
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Phone</label>
              <input
                name="phone"
                placeholder="Enter phone number"
                value={form.phone}
                onChange={onChange}
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Address</label>
              <input
                name="address"
                placeholder="Enter address"
                value={form.address}
                onChange={onChange}
                className="form-control"
              />
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">ID Type</label>
                <select
                  name="idType"
                  value={form.idType}
                  onChange={onChange}
                  className="form-select"
                >
                  <option value="">Select ID Type</option>
                  <option value="aadhaar">Aadhaar</option>
                  <option value="pan">PAN</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">ID Number</label>
                <input
                  name="idNumber"
                  placeholder="Enter ID number"
                  value={form.idNumber}
                  onChange={onChange}
                  className="form-control"
                />
              </div>
            </div>

            <div
              className={`mb-3 p-3 border rounded text-center ${dragOver ? "border-primary" : "border-secondary"}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
            >
              <p className="mb-2">Upload your photo</p>
              <button type="button" className="btn btn-outline-primary btn-sm mb-2" onClick={onBrowse}>
                Browse File
              </button>
              <input
                ref={fileRef}
                type="file"
                hidden
                onChange={(e) => handleFile(e.target.files[0])}
              />
              {preview && (
                <div className="mt-3">
                  <img src={preview} alt="Preview" style={{ width: 120, borderRadius: "8px" }} />
                  <div>
                    <button type="button" className="btn btn-sm btn-danger mt-2" onClick={removeFile}>
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button className="btn btn-primary w-100 mt-3">
              {submitting ? "Saving..." : "Save Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}