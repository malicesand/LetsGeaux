import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const Profile: React.FC = () => {
  const location = useLocation();
  const [interests, setInterests] = useState([]);
  const { user } = location.state; 

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const response = await axios.get(`/api/interests/${user.id}`);
        setInterests(response.data);
      } catch (error) {
        console.error('Error fetching interests:', error);
      }
    };

    fetchInterests();
  }, []); 

  return (
    <div>
      <h1>Profile Page</h1>
      <div>{user.username}</div>
      <div>{user.email}</div>
      <img src={user.profilePic} alt="Profile" />

      <h3>Interests:</h3>
      {console.log(interests)}
     {interests.map((interest)=>{
      return <div>{interest.name} </div>
     })}
    </div>
  );
};

export default Profile;