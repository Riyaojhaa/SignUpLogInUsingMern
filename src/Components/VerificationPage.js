import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useLocation} from "react-router-dom";

const VerificationPage = ({email}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [otp, setOtp] = useState("");

    const handleInputChange = (e) => {
        setOtp(e.target.value);
    };

    const postOtp = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("/verify-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ otp }),
            });

            const data = await res.json();
            if (res.status === 200) {
                alert("OTP Verified successfully");
                if (location.state?.redirectToUpdate) {
                    // navigate("/UpdatePasswordPage" , { state: { email } }); // Change to your actual update password route
                    navigate("/UpdatePasswordPage", { state: { email: location.state.email } }); // Pass email here
                } else {
                    navigate("/login"); // Default behavior for sign up verification
                }
            } else {
                alert("Invalid OTP");
            }
        } catch (error) {
            console.log("Error in verifying OTP:", error);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: 'auto', textAlign: 'center' }}>
            <h2>OTP Verification</h2>
            <p>Please enter the OTP sent to your email to verify your account.</p>
            <form onSubmit={postOtp}>
                <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={handleInputChange}
                    required
                    style={{
                        padding: '10px',
                        width: '100%',
                        fontSize: '16px',
                        marginBottom: '15px',
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                    }}
                />
                <button
                    type="submit"
                    style={{
                        width: '100%',
                            padding: '12px 0',
                            fontSize: '16px',
                            fontWeight: '600',
                            backgroundColor: '#007bff',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s',
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default VerificationPage;
