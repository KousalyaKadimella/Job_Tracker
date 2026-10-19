import { useState, useEffect } from "react";

function App() {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("Applied");
  const [notes, setNotes] = useState("");
  const [applications, setApplications] = useState([]);
  const [editStatuses, setEditStatuses] = useState({});
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const fetchApplications = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/applications");
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      setMessage("Failed to load applications.");
      setMessageType("error");
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const applicationData = {
      company: company,
      role: role,
      status: status,
      notes: notes,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(applicationData),
      });

      if (!response.ok) {
        throw new Error("Failed to add application");
      }

      setCompany("");
      setRole("");
      setStatus("Applied");
      setNotes("");

      setMessage("Application added successfully.");
      setMessageType("success");

      fetchApplications();
    } catch (error) {
      setMessage("Failed to add application.");
      setMessageType("error");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/applications/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete application");
      }

      setMessage("Application deleted successfully.");
      setMessageType("success");

      fetchApplications();
    } catch (error) {
      setMessage("Failed to delete application.");
      setMessageType("error");
    }
  };

  const handleStatusChange = (id, value) => {
    setEditStatuses({
      ...editStatuses,
      [id]: value,
    });
  };

  const handleUpdateStatus = async (app) => {
    const updatedApplication = {
      company: app.company,
      role: app.role,
      status: editStatuses[app.id] || app.status,
      notes: app.notes,
    };

    try {
      const response = await fetch(`http://127.0.0.1:8000/applications/${app.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedApplication),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      setMessage("Status updated successfully.");
      setMessageType("success");

      fetchApplications();
    } catch (error) {
      setMessage("Failed to update status.");
      setMessageType("error");
    }
  };

  const pageStyle = {
    minHeight: "100vh",
    backgroundColor: "#f4f7fb",
    padding: "30px",
    fontFamily: "Arial, sans-serif",
  };

  const containerStyle = {
    maxWidth: "900px",
    margin: "0 auto",
  };

  const cardStyle = {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    marginBottom: "24px",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    marginTop: "6px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px",
    boxSizing: "border-box",
  };

  const buttonStyle = {
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    marginTop: "10px",
  };

  const deleteButtonStyle = {
    backgroundColor: "#dc2626",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    marginTop: "10px",
  };

  const secondaryButtonStyle = {
    backgroundColor: "#059669",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    marginLeft: "10px",
  };

  const appItemStyle = {
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "16px",
    marginBottom: "16px",
    backgroundColor: "#fafafa",
  };

  const messageStyle = {
    padding: "12px 16px",
    borderRadius: "8px",
    marginBottom: "20px",
    fontWeight: "bold",
    backgroundColor: messageType === "success" ? "#dcfce7" : "#fee2e2",
    color: messageType === "success" ? "#166534" : "#991b1b",
    border: messageType === "success" ? "1px solid #86efac" : "1px solid #fca5a5",
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h1 style={{ marginBottom: "8px", color: "#1f2937" }}>
            Job Application Tracker
          </h1>
          <p style={{ color: "#4b5563" }}>
            Add and manage your job applications in one place.
          </p>
        </div>

        {message && <div style={messageStyle}>{message}</div>}

        <div style={cardStyle}>
          <h2 style={{ marginBottom: "20px", color: "#1f2937" }}>
            Add New Application
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "16px" }}>
              <label>Company</label>
              <input
                style={inputStyle}
                type="text"
                placeholder="Enter company name"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label>Role</label>
              <input
                style={inputStyle}
                type="text"
                placeholder="Enter role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label>Status</label>
              <select
                style={inputStyle}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label>Notes</label>
              <textarea
                style={{ ...inputStyle, minHeight: "100px" }}
                placeholder="Enter notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              ></textarea>
            </div>

            <button type="submit" style={buttonStyle}>
              Add Application
            </button>
          </form>
        </div>

        <div style={cardStyle}>
          <h2 style={{ marginBottom: "20px", color: "#1f2937" }}>
            Saved Applications
          </h2>

          {applications.length === 0 ? (
            <p style={{ color: "#6b7280" }}>No applications added yet.</p>
          ) : (
            <div>
              {applications.map((app) => (
                <div key={app.id} style={appItemStyle}>
                  <h3 style={{ margin: "0 0 8px 0", color: "#111827" }}>
                    {app.company}
                  </h3>
                  <p style={{ margin: "4px 0" }}>
                    <strong>Role:</strong> {app.role}
                  </p>
                  <p style={{ margin: "4px 0" }}>
                    <strong>Status:</strong> {app.status}
                  </p>
                  <p style={{ margin: "4px 0 12px 0" }}>
                    <strong>Notes:</strong> {app.notes}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      flexWrap: "wrap",
                    }}
                  >
                    <select
                      style={{ ...inputStyle, maxWidth: "200px", marginTop: "0" }}
                      value={editStatuses[app.id] || app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                    >
                      <option value="Applied">Applied</option>
                      <option value="Interview">Interview</option>
                      <option value="Offer">Offer</option>
                      <option value="Rejected">Rejected</option>
                    </select>

                    <button
                      type="button"
                      style={secondaryButtonStyle}
                      onClick={() => handleUpdateStatus(app)}
                    >
                      Update Status
                    </button>

                    <button
                      type="button"
                      style={deleteButtonStyle}
                      onClick={() => handleDelete(app.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
