import React, {useEffect , useState} from 'react'
import { useNavigate } from "react-router-dom";


export default function Home() {
  const navigate = useNavigate();
  
  const [Name, setName] = useState({});


// we have to show this page only ehen the user is logged in other no
//so we use USEEFFECT bcz using this when the page s refreshed firstly the useeffect fn is call then other ..
//it is array dependency function it means it only run once at a time
  // const callHomePage = async (req , res) => {
  //   try{
  //       const res = await fetch('/home' , {
  //         method : "GET",
  //         headers : {
  //             Accept : "application/json",
  //             "Content-Type" : "application/json"
  //         },
  //         credentials:"include"  //taaki jo cookies hai wo hamare backend tak pohchjaaye proper
  //       });

  //       const data = await res.json();
  //       console.log(data);

  //       if(!res.status === 200){
  //           const error = new Error(res.error);
  //           throw error ;
  //       }
        
  //   }catch(err){
  //     console.log(err) ;
  //     navigate("/LogIn");
    
  //   }
  // };
  const callHomePage = async () => {
    try {
        const res = await fetch('/home', {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            
            credentials: "include" 
        });

        if (res.status === 401) {
            throw new Error("Unauthorized");
        }

        
        const data = await res.json();
        console.log("Fetched data:", data);
        setName(data);


        if (res.status !== 200) {
            throw new Error(data.error || "Error fetching data");
        }

    } catch (err) {
        console.log(err);
        navigate("/LogIn");
    }
};

  useEffect(() => {
      callHomePage();
  },[]);
  return (
    <div>
      <div className='d-flex justify-content-center align-items-center vh-100'>
          <div method='GET'>
              <h1>Hyy !! {Name.firstname + " " + Name.lastname}</h1>
              <h3>I'm Full Stack Web Developer</h3>
          </div>
      </div>
    </div>
  )
}
