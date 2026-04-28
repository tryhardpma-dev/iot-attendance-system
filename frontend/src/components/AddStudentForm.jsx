import React, { useState } from "react";

const AddStudentForm = ({ onClose, onSubmit }) => {
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [isic, setIsic] = useState("");
    const [errors, setErrors] = useState({ name: false, surname: false, isic: false });

    const inputStyle = {
        width: "100%",
        padding: "8px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxSizing: "border-box", 
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {
            name: !name.trim(),
            surname: !surname.trim(),
            isic: !isic.trim(),
        };

        if (Object.values(newErrors).some((error) => error)) {
            setErrors(newErrors);
            alert("Nie je možne pridať prazdne polia");
            return;
        }

        onSubmit({ name, surname, isic });
        onClose();
    };

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
                    borderRadius: "12px",
                    padding: "36px",
                    width: "400px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",

                }}
            >
                <h2 style={{ marginBottom: "16px", textAlign: "center", fontWeight: "bold" }}>
                    Pridať študenta
                </h2>
                <form
                    onSubmit={handleSubmit}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                        margin: "0 auto",
                    }}
                >
                    <div>
                        <label
                            style={{
                                display: "block",
                                marginBottom: "8px",
                                fontWeight: "lighter",
                                opacity: "0.6",
                            }}
                        >
                            Meno:
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{
                                ...inputStyle,
                                borderColor: errors.name ? "red" : "#ccc", 
                            }}
                            placeholder="Zadajte meno"
                        />
                    </div>
                    <div>
                        <label
                            style={{
                                display: "block",
                                marginBottom: "8px",
                                fontWeight: "lighter",
                                opacity: "0.6",
                            }}
                        >
                            Priezvisko:
                        </label>
                        <input
                            type="text"
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                            style={{
                                ...inputStyle,
                                borderColor: errors.surname ? "red" : "#ccc", 
                            }}
                            placeholder="Zadajte priezvisko"
                        />
                    </div>
                    <div>
                        <label
                            style={{
                                display: "block",
                                marginBottom: "8px",
                                fontWeight: "lighter",
                                opacity: "0.6",
                            }}
                        >
                            Osobne čislo/ISIC:
                        </label>
                        <input
                            type="text"
                            value={isic}
                            onChange={(e) => setIsic(e.target.value)}
                            style={{
                                ...inputStyle,
                                borderColor: errors.isic ? "red" : "#ccc", 
                            }}
                            placeholder="Zadajte ISIC"
                        />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "16px" }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                padding: "8px 16px",
                                backgroundColor: "#f44336",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                transition: "background-color 0.3s ease",
                            }}
                        >
                            Zrušiť
                        </button>
                        <button
                            type="submit"
                            style={{
                                padding: "8px 16px",
                                backgroundColor: "#4caf50",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                transition: "background-color 0.3s ease",
                            }}
                        >
                            Pridať
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddStudentForm;
