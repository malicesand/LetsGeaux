import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios'

const Profile: React.FC = () =>{
  const location = useLocation();
  const [interests, useInterests]= useState([]);
  const { user } = location.state || {}
  const getInterests = async () => {
    try {
     const userId = user.id
      const response = await axios.get(`/api/interests/${userId}`);
  
      useInterests(response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error fetching interests:', error);
    }
  };
return (

  <div>
<h1>Profile Page</h1>
    <div>{user.username}</div>
    <div>{user.email}</div>
  <img src={`${user.profilePic}`}></img>
{console.log(interests)}
   <button onClick={getInterests}>View Interests</button>
{interests.map((interest)=>{
  return <div>{interest.name}</div>
})}

  </div>

)
}

export default Profile