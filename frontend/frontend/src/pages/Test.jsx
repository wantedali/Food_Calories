import React from "react";

function RegisterForm() {
    const handleRegister = async () => {
        const data = {
            name: "John Doe",
            email: "john@example.com",
            password: "securePassword123!",
            gender: 0,
            activityLevel: 2.5,
            age: 30,
            weight: 70,
            height: 175,
            goal: 0,
            howFast: 0,
            bodyFat: 15,
        };

        try {
            const response = await fetch("http://localhost:5062/api/users/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const err = await response.json();
                console.error("❌ Error:", err);
            } else {
                console.log("✅ Registered successfully!");
            }
        } catch (err) {
            console.error("❗ Fetch error:", err);
        }
    };

    return (
        <div>
            <h2>Test Registration</h2>
            <button onClick={handleRegister}>Send Register Request</button>
        </div>
    );
}

export default RegisterForm;
