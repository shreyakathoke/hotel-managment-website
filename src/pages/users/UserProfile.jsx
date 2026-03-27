import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/userprofiles.css";

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
    if (!token) return setErrMsg("Login first");

    if (!form.phone || !form.address || !form.idType || !form.idNumber) {
      return setErrMsg("Fill all fields");
    }

    if (!form.photoUrl) {
      return setErrMsg("Upload image");
    }

    setSubmitting(true);

    try {
      const profile = {
        ...form,
        idProof: `${form.idType}-${form.idNumber}`,
      };

      localStorage.setItem("user_profile", JSON.stringify(profile));

      setMsg("Profile saved successfully ✅");

      setTimeout(() => {
        navigate("/rooms");
      }, 1000);
    } catch (err) {
      setErrMsg("Failed to save profile");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="profile-wrap">
      <div className="container py-4">
        <div className="card p-4">
          <h3>Profile Details</h3>

          {msg && <div className="alert alert-success">{msg}</div>}
          {errMsg && <div className="alert alert-danger">{errMsg}</div>}

          <form onSubmit={onSubmit}>
            <input value={form.name} disabled className="form-control mb-2" />
            <input value={form.email} disabled className="form-control mb-2" />

            <input
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={onChange}
              className="form-control mb-2"
            />

            <input
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={onChange}
              className="form-control mb-2"
            />

            <select
              name="idType"
              value={form.idType}
              onChange={onChange}
              className="form-control mb-2"
            >
              <option value="">Select ID</option>
              <option value="aadhaar">Aadhaar</option>
              <option value="pan">PAN</option>
            </select>

            <input
              name="idNumber"
              placeholder="ID Number"
              value={form.idNumber}
              onChange={onChange}
              className="form-control mb-2"
            />

            <input
              ref={fileRef}
              type="file"
              className="form-control mb-2"
              onChange={(e) => handleFile(e.target.files[0])}
            />

            {preview && <img src={preview} width="100" />}

            <button className="btn btn-primary mt-3">
              {submitting ? "Saving..." : "Save Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}