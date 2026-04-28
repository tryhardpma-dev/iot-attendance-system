import React from "react";
import PropTypes from "prop-types";

const StudentSettings = ({ student, onClose, onDelete, onTogglePresence }) => {
    
    if (!student) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
            }}
        >
            <div
                style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    padding: "24px",
                    maxWidth: "500px",
                    width: "100%",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    position: "relative",
                }}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: "16px",
                        right: "16px",
                        background: "none",
                        border: "none",
                        fontSize: "16px",
                        cursor: "pointer",
                    }}
                >
                    ✕
                </button>

                <h2>Nastavenia pre: {student.name}</h2>
                <p>
                    <strong>ISIC čislo:</strong> {student.isic}
                </p>

                
                <div style={{ marginTop: "24px" }}>
                    <label style={{ marginBottom: "8px", display: "block", fontWeight: "bold" }}>
                        Status:
                    </label>
                    <select
                        value={student.present ? "present" : "absent"}
                        onChange={(e) =>
                            onTogglePresence(student.id, e.target.value === "present")
                        }
                        style={{
                            padding: "8px",
                            borderRadius: "4px",
                            border: "1px solid #ddd",
                            width: "100%",
                            cursor: "pointer",
                        }}
                    >
                        <option value="present">V triede</option>
                        <option value="absent">Chýba</option>
                    </select>
                </div>

                <div style={{marginTop: "24px", textAlign: "right"}}>
                    <button
                        onClick={() => {
                            onDelete(student.id);
                            onClose(); 
                        }}
                        style={{
                            padding: "8px 16px",
                            backgroundColor: "#f44336",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                        }}
                    >
                        Odstrániť zo zoznamu
                    </button>

                </div>
            </div>
        </div>
    );
};

StudentSettings.propTypes = {
    student: PropTypes.shape({
        id: PropTypes.number.isRequired,
        isic: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        present: PropTypes.bool.isRequired,
    }).isRequired,
    onClose: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onTogglePresence: PropTypes.func.isRequired,
};

export default StudentSettings;
