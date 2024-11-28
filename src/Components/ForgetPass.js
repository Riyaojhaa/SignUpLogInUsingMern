import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const ForgetPass = ({setEmail}) => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ email: "" });

    const postSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/forgetpass', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: user.email }),
            });
            
            if (!res.ok) {
                const errorResponse = await res.text();
                console.log("Error:", errorResponse);
                window.alert("Email not registered");
                return;
              }
            if (res.status === 200) {
                // navigate("/VerificationPage", { state: { redirectToUpdate: true } });
                window.alert("OTP SEND SUCCESSFULLY");
                navigate("/VerificationPage", { state: { email: user.email, redirectToUpdate: true } }); // Pass email here
                setEmail(user.email)
                console.log("Verify Your Email");    
                
            } else {
                window.alert("Email not registered");
                console.log("Not Registered Email");
               
            }
        } catch (error) {
            console.log("Error resetting password:", error);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '50px 20px' }}>
            <div style={{ 
                maxWidth: '400px', 
                width: '100%', 
                padding: '30px', 
                borderRadius: '8px', 
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
                backgroundColor: '#fff',
                textAlign: 'center' 
            }}>
                <h2 style={{ color: '#333', marginBottom: '20px' }}>Forgot Password</h2>
                <p style={{ color: '#555', fontSize: '15px' }}>Enter your registered email address to receive an OTP for password reset.</p>
                <form onSubmit={postSubmit} method="POST">
                    <div style={{ textAlign: 'left', marginBottom: '15px' }}>
                        <label style={{ display: 'block', color: '#333', fontWeight: '600' }}>Email:</label>
                        <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={user.email}
                             onChange={(e) => setUser({ ...user, email: e.target.value })}
                            placeholder="Enter your registered email"
                            required
                            style={{
                                width: '100%',
                                padding: '10px',
                                fontSize: '16px',
                                borderRadius: '4px',
                                border: '1px solid #ddd',
                                outline: 'none',
                                transition: 'border-color 0.3s',
                            }}
                          
                        />
                    </div>
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
                        Send OTP
                    </button>
                    
                </form>
            </div>
        </div>
    );
};

export default ForgetPass;
