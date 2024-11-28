// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const UpdatePasswordPage = () => {
//     const navigate = useNavigate();
//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [error, setError] = useState('');

//     const handlePasswordChange = (e) => {
//         setPassword(e.target.value);
//     };

//     const handleConfirmPasswordChange = (e) => {
//         setConfirmPassword(e.target.value);
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         setError('');

//         // Basic validation
//         if (password !== confirmPassword) {
//             setError("Passwords do not match");
//             return;
//         }

//         // Here, you can handle the submission logic or alert the user
//         alert('Password updated successfully'); // For demonstration purposes
//         navigate('/login'); // Redirect to login after successful update
//     };

//     return (
//         <div style={{ maxWidth: '400px', margin: 'auto', textAlign: 'center' }}>
//             <h2 style={{padding: "5px"}}>Update Your Password</h2>
//             <form onSubmit={handleSubmit}>
//                 <div style={{ marginBottom: '15px' }}>
//                     <input
//                         type="password"
//                         placeholder="New Password"
//                         value={password}
//                         onChange={handlePasswordChange}
//                         required
//                         style={{
//                             padding: '10px',
//                             width: '100%',
//                             fontSize: '16px',
//                             marginBottom: '10px',
//                             border: '1px solid #ddd',
//                             borderRadius: '5px',
//                         }}
//                     />
//                     <input
//                         type="password"
//                         placeholder="Confirm Password"
//                         value={confirmPassword}
//                         onChange={handleConfirmPasswordChange}
//                         required
//                         style={{
//                             padding: '10px',
//                             width: '100%',
//                             fontSize: '16px',
//                             border: '1px solid #ddd',
//                             borderRadius: '5px',
//                         }}
//                     />
//                 </div>
//                 {error && <p style={{ color: 'red' }}>{error}</p>}
//                 <button
//                     type="submit"
//                     style={{
//                         width: '100%',
//                         padding: '12px 0',
//                         fontSize: '16px',
//                         fontWeight: '600',
//                         backgroundColor: '#007bff',
//                         color: '#fff',
//                         border: 'none',
//                         borderRadius: '5px',
//                         cursor: 'pointer',
//                         transition: 'background-color 0.3s',
//                     }}
//                     onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
//                     onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
//                 >
//                     Update Password
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default UpdatePasswordPage;





import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const UpdatePasswordPage = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Correctly use useLocation
    const email = location.state?.email; // Retrieve email from state
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Basic validation
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const res = await fetch('/updatepassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email , password }),
                
            });

            if (res.status === 200) {
                alert('Password updated successfully');
                navigate('/login'); // Redirect to login after successful update
            } else {
                const errorResponse = await res.text();
                alert('Error updating password: ' + errorResponse);
            }
        } catch (error) {
            console.log('Error updating password:', error);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: 'auto', textAlign: 'center' }}>
            <h2 style={{padding:"6px"}}>Update Your Password</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <input
                        type="password"
                        placeholder="New Password"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                        style={{
                            padding: '10px',
                            width: '100%',
                            fontSize: '16px',
                            marginBottom: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                        }}
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        required
                        style={{
                            padding: '10px',
                            width: '100%',
                            fontSize: '16px',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                        }}
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
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
                    Update Password
                </button>
            </form>
        </div>
    );
};

export default UpdatePasswordPage;
