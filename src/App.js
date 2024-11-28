
// import './App.css';
// import Navbar from './Components/Navbar';
// import Home from './Components/Home';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import SignUp from './Components/SignUp';
// import LogIn from './Components/LogIn';
// import VerificationPage from './Components/VerificationPage';
// import UpdatePasswordPage from './Components/UpdatePasswordPage'
// import LogOut from './Components/LogOut';
// import ForgetPass from './Components/ForgetPass'
// import { createContext , useReducer} from 'react';
// import {initialState , reducer} from "../src/reducer/UseReducer";
// import { GoogleOAuthProvider } from '@react-oauth/google';


// //usecontext
// //usereducer

// export const UserContext = createContext() ;
// function App() {
//   const [state , dispatch] = useReducer(reducer , initialState );
//   const GoogleOAuthProvider = ()=> {
//     return <GoogleOAuthProvider client_id='734738672783-j6hmidum59lp1f7lrepkj8lkfasv2j7g.apps.googleusercontent.com'>
//         <SignUp></SignUp>
//     </GoogleOAuthProvider>
//   }

// //1: we have to use CONTEXTAPI for toggle the buttons
//   return (
//     <div className="App">
    

//     <UserContext.Provider value={{state , dispatch}}>
//       <Navbar />
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/SignUp" element={<GoogleOAuthProvider />} />
//         <Route path="/LogIn" element={<LogIn />} />
//         <Route path="/LogOut" element={<LogOut />} />
//         <Route path="/VerificationPage" element = {<VerificationPage/>} />
//         <Route path="/UpdatePasswordPage" element = {<UpdatePasswordPage/>} />
//         <Route path="/ForgetPass" element = {<ForgetPass/>} />
//         <Route path="*" element={<Navigate to="/" />} />
//       </Routes>
//       </UserContext.Provider>
//     </div>
//   );
// }

// export default App;



import './App.css';
import Navbar from './Components/Navbar';
import Home from './Components/Home';
import { Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './Components/SignUp';
import LogIn from './Components/LogIn';
import VerificationPage from './Components/VerificationPage';
import UpdatePasswordPage from './Components/UpdatePasswordPage';
import LogOut from './Components/LogOut';
import ForgetPass from './Components/ForgetPass';
import { createContext, useReducer } from 'react';
import { initialState, reducer } from "../src/reducer/UseReducer";
import { GoogleOAuthProvider } from '@react-oauth/google';

// UseContext and UseReducer
export const UserContext = createContext();

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div className="App">
      {/* Wrap the entire app with GoogleOAuthProvider */}
      <GoogleOAuthProvider clientId='734738672783-j6hmidum59lp1f7lrepkj8lkfasv2j7g.apps.googleusercontent.com'>
        <UserContext.Provider value={{ state, dispatch }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/SignUp" element={<SignUp />} />
            <Route path="/LogIn" element={<LogIn />} />
            <Route path="/LogOut" element={<LogOut />} />
            <Route path="/VerificationPage" element={<VerificationPage />} />
            <Route path="/UpdatePasswordPage" element={<UpdatePasswordPage />} />
            <Route path="/ForgetPass" element={<ForgetPass />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </UserContext.Provider>
      </GoogleOAuthProvider>
    </div>
  );
}

export default App;
