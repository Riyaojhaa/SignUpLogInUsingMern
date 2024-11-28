


import React, {useContext , useState } from "react";
import flower1 from "./Images/flower2.jpg";
import { NavLink, useNavigate } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';
import { UserContext } from "../App";




export default function SignUp() {

  const {state , dispatch} = useContext(UserContext);

  const navigate = useNavigate();
  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    checkbox: false,
  });

  // Google Sign-In Handler
  // const responseGoogle = async (authResult) => {
  //   try {
  //     console.log(authResult); // You’ll receive an authorization code here
  //     // Send auth code to your backend
  //     const res = await fetch('/google', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ code: authResult.code }),
  //     });

  //     const data = await res.json();
  //     if (res.ok) {
  //       // Save user data (if necessary) and navigate
  //       console.log("Google Sign-In successful:", data);
  //       navigate("/"); // Redirect to home or another page after login
  //     } else {
  //       console.error("Google Sign-In failed:", data.message);
  //     }
  //   } catch (error) {
  //     console.log(error, "error in requesting google code [googleLogin]");
  //   }
  // };
  const responseGoogle = async (authResult) => {
    try {
        console.log("Auth Result:", authResult); // Log to confirm content

        // Ensure the authorization code is present
        if (!authResult.code) {
            console.error("Authorization code not found in the response");
            return;
        }

        // Send authorization code to backend
        const res = await fetch('/google', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code: authResult.code }), // Send only the `code`
        });

        const data = await res.json();
        if (res.ok) {
           dispatch({type:"USER" , payload:true})
           window.alert("Successfully Regsistered");
            console.log("Google Sign-Up successful:", data);
            navigate("/"); // Redirect to home page after successful login
        } else {
            console.error("Google Sign-Up failed:", data.message || "Unknown error");
        }
    } catch (error) {
        console.error("Error in requesting Google code [googleLogin]:", error);
    }
};


  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: (error) => console.log("Google Sign-In error:", error),
    flow: 'auth-code',
  });

  // Input handling for form fields
  const handleInputs = (e) => {
    const name = e.target.name;
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const PostData = async (e) => {
    e.preventDefault();
    const { firstname, lastname, email, password, checkbox } = user;

    try {
      const res = await fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstname, lastname, email, password, checkbox }),
      });

      if (!res.ok) {
        const errorResponse = await res.text();
        console.log("Error:", errorResponse);
        window.alert("Failed to SignUp");
        return;
      }

      const data = await res.json();
      if (res.status === 400 || !data) {
        window.alert("Invalid registration");
        console.log("Invalid registration");
      } else {
        window.alert("Verify Your Email");
        console.log("Verify Your Email");
        navigate("/VerificationPage");
      }
    } catch (error) {
      console.log("Error in PostData:", error);
    }
  };

  return (
    <div className="container-fluid" id="signup_container">
      <div className="row">
        <div className="col-md-6 vh-100">
          <img src={flower1} alt="flowerimg" style={{ height: "100%", width: "100%" }} />
        </div>
        <div className="col-md-6 d-flex justify-content-center flex-column align-items-center">
          <div className="border border-4 rounded-3 p-4">
            <form
              className="d-flex flex-column p-0"
              method="POST"
              style={{ width: "100%", maxWidth: "400px" }}
              onSubmit={PostData}
            >
              <h4 className="mb-3 p-1 text-center">Create an account</h4>
              <div className="mb-3">
                <label className="d-flex align-items-start">First name:</label>
                <input
                  type="text"
                  className="form-control"
                  name="firstname"
                  value={user.firstname}
                  onChange={handleInputs}
                />
              </div>
              <div className="mb-3">
                <label className="d-flex align-items-start">Last name:</label>
                <input
                  type="text"
                  className="form-control"
                  name="lastname"
                  value={user.lastname}
                  onChange={handleInputs}
                />
              </div>
              <div className="mb-3">
                <label className="d-flex align-items-start">Email:</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={user.email}
                  onChange={handleInputs}
                />
                <div id="emailHelp" className="form-text">
                  We'll never share your email with anyone else.
                </div>
              </div>
              <div className="mb-3">
                <label className="d-flex align-items-start">Password:</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={user.password}
                  onChange={handleInputs}
                />
              </div>
              <div className="mb-3 d-flex">
                <input
                  className="form-check-input m-2"
                  type="checkbox"
                  id="defaultCheck1"
                  name="checkbox"
                  checked={user.checkbox}
                  onChange={handleInputs}
                />
                <label className="form-check-label" htmlFor="defaultCheck1">
                  By creating an account, I agree to the Terms of Use and Privacy Policy
                </label>
              </div>
              <button type="submit" className="btn btn-dark border rounded-pill" >
                Create an account
              </button>
              <span>
                Already have an account?
                <NavLink to="/LogIn"> Login </NavLink>
              </span>
              <div className="or-divider my-4">
                <span>OR</span>
              </div>
              <button type="button" className="btn btn-white border rounded-pill" onClick={googleLogin}>
                Continue with Google
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
