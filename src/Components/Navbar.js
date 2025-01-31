 import React , {useContext} from "react";
 import {NavLink} from "react-router-dom"
 import { UserContext } from "../App";

 export default function Navbar() {
   const {state , dispatch} = useContext(UserContext);

   return (
     <div>
       <nav className="navbar navbar-expand-lg navbar-dark bg-secondary">
         <div className="container-fluid">
           <NavLink className="navbar-brand" to="/">
             Hello!
           </NavLink>
           <button
             className="navbar-toggler"
             type="button"
             data-bs-toggle="collapse"
             data-bs-target="#navbarSupportedContent"
             aria-controls="navbarSupportedContent"
             aria-expanded="false"
             aria-label="Toggle navigation"
           >
             <span className="navbar-toggler-icon"></span>
           </button>
           <div className="collapse navbar-collapse" id="navbarSupportedContent">
             <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
             {state ? 
             (<>
               <li className="nav-item">
                 <NavLink className="nav-link" aria-current="page" to="/">
                   Home
                 </NavLink>
               </li>
               <li className="nav-item">
                 <NavLink className="nav-link" to="/LogOut">
                   LogOut
                 </NavLink>
               </li>
                 </>)
               : (
                 <>
               <li className="nav-item">
                 <NavLink className="nav-link" to="/SignUp">
                   SignUp
                 </NavLink>
               </li>
               <li className="nav-item">
                 <NavLink className="nav-link" to="/LogIn">
                   LogIn
                 </NavLink>
               </li>
               </>)}
              

               {/* <li className="nav-item">
                 <NavLink className="nav-link" to="/SignUp">
                   SignUp
                 </NavLink>
               </li>
               <li className="nav-item">
                 <NavLink className="nav-link" to="/LogIn">
                   LogIn
                 </NavLink>
               </li> */}
               {/* <li className="nav-item">
                 <NavLink className="nav-link" to="/LogOut">
                   LogOut
                 </NavLink>
               </li> */}
             </ul>
           </div>
         </div>
       </nav>
     </div>
   );
 }

// import React, { useContext } from "react";
// import { NavLink } from "react-router-dom";
// import { UserContext } from "../App";

// export default function Navbar() {
//   const { state, dispatch } = useContext(UserContext);

//   return (
//     <div>
//       <nav className="navbar navbar-expand-lg navbar-dark bg-secondary">
//         <div className="container-fluid">
//           <NavLink className="navbar-brand" to="/">
//             Hello!
//           </NavLink>
//           <button
//             className="navbar-toggler"
//             type="button"
//             data-bs-toggle="collapse"
//             data-bs-target="#navbarSupportedContent"
//             aria-controls="navbarSupportedContent"
//             aria-expanded="false"
//             aria-label="Toggle navigation"
//           >
//             <span className="navbar-toggler-icon"></span>
//           </button>
//           <div className="collapse navbar-collapse" id="navbarSupportedContent">
//             <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
//               {state ? (
//                 <>
//                   <li className="nav-item">
//                     <NavLink className="nav-link" aria-current="page" to="/">
//                       Home
//                     </NavLink>
//                   </li>
//                   <li className="nav-item">
//                     <NavLink className="nav-link" to="/LogOut">
//                       LogOut
//                     </NavLink>
//                   </li>
//                 </>
//               ) : (
//                 <>
//                   <li className="nav-item">
//                     <NavLink className="nav-link" to="/SignUp">
//                       SignUp
//                     </NavLink>
//                   </li>
//                   <li className="nav-item">
//                     <NavLink className="nav-link" to="/LogIn">
//                       LogIn
//                     </NavLink>
//                   </li>
//                 </>
//               )}
//             </ul>
//           </div>
//         </div>
//       </nav>
//     </div>
//   );
// }
