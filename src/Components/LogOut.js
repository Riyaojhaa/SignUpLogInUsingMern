import React, { useEffect , useContext} from 'react'
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";


export default function LogOut() {
    const navigate = useNavigate();
    const {state , dispatch} = useContext(UserContext);


    //promises

    useEffect(() => {
        fetch('/LogOut', {
            method: 'GET',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            credentials: "include",
        })
        .then((res) => {

            if (res.status === 200) {
                dispatch({type:"USER" , payload:false});
                navigate("/LogIn", { replace: true });
            } else {
                throw new Error('Failed to log out');
            }
        })
        .catch((err) => {
            console.error('Logout error:', err);
        });
    }, []);
    
  return (
    <div>
      
    </div>
  )
}
