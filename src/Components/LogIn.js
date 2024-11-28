import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import flower1 from "./Images/flower1.jpg";
import { useGoogleLogin } from '@react-oauth/google';


import { UserContext } from "../App";

export default function LogIn() {
  const navigate = useNavigate();

  const {state , dispatch} = useContext(UserContext);


  const [user, setUser] = useState({
    email: "",
    password: "",
  });

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
           window.alert("Successfully Logged In");
            console.log("Google Log-In successful:", data);
            navigate("/"); // Redirect to home page after successful login
        } else {
            console.error("Google Log-In failed:", data.message || "Unknown error");
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


  const handleInputs = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
    console.log({ ...user, [name]: value });
  };

  const postData = async (e) => {
    e.preventDefault();
    const { email, password } = user;

    try {
      const res = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorResponse = await res.text();
        console.log("Error:", errorResponse);
        window.alert("Failed to Log In");
        return;
      }

      const data = await res.json();
      if (res.status === 400 || !data) {
        window.alert("Invalid Login");
        console.log("Invalid Login");
      } else {
        dispatch({type:"USER" , payload:true})
        window.alert("Successfully Logged In");
        console.log("Successful Login");
        navigate("/");
      }
    } catch (error) {
      console.log("Error in PostData:", error);
    }
  };

  return (
    <>
      <div className="container-fluid" id="signup_container">
        <div className="row">
          <div className="col-md-6 vh-100 ">
            <img
              src={flower1}
              alt="flowerimg"
              style={{ height: "100%", width: "100%" }}
            />
          </div>
          <div className="col-md-6 d-flex justify-content-center flex-column align-items-center">
            <div className="border border-4 rounded-3 p-4">
              <form
                className="d-flex flex-column p-0"
                style={{ width: "100%", maxWidth: "400px" }}
                onSubmit={postData}
                method="POST"
              >
                <h4 className="mb-3 p-1 text-center">Log in</h4>
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
                  <label className="d-flex align-items-start">Your password:</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={user.password}
                    onChange={handleInputs}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-dark text-white border rounded-pill"
                >
                  Log in
                </button>
                <div className="or-divider my-4">
                  <span>OR</span>
                </div>
                <button type="button" className="btn btn-white border rounded-pill" onClick={googleLogin}>
                Continue with Google
                </button>
                <div className="mt-4">
                  <NavLink to="/ForgetPass" className="p-1 text-center">Forget your password?</NavLink>
                </div>
              </form>
            </div>
            <div className="mt-4 border border-3 px-5 py-2 rounded-3">
              <h6 className="p-1 text-center">
                Don't have an account?
                <u className="bold">
                  <NavLink to="/SignUp">Sign up</NavLink>
                </u>
              </h6>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

