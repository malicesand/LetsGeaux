import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';


const Profile: React.FC = () =>{
  const location = useLocation();
  const { user } = location.state || {}
return (
  <div>
<h1>Profile Page</h1>
    <div>{user.username}</div>
    <div>{user.email}</div>
  <img src={`${user.profilePic}`}></img>

   {console.log(user)}


  </div>

)
}

export default Profile