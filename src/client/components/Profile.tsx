import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const ALL_INTERESTS = ['Restaurants', 'Hotels', 'Geos', 'Attractions']; 

const Profile: React.FC = () => {
  const location = useLocation();
  const { user } = location.state;

  const [interests, setInterests] = useState([]);
  const [selectedInterest, setSelectedInterest] = useState('');

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const response = await axios.get(`/api/interests/${user.id}`);
        setInterests(response.data);

        // Preselect another interest if possible
        const current = response.data[0]?.name;
        const otherOptions = ALL_INTERESTS.filter((i) => i !== current);
        setSelectedInterest(otherOptions[0]);
      } catch (error) {
        console.error('Error fetching interests:', error);
      }
    };

    fetchInterests();
  }, [user.id]);

  const handleUpdateInterest = async () => {
    try {
      const response = await axios.put(`/api/interests/${user.id}`, {
        newInterest: selectedInterest,
      });

      setInterests([response.data.interest]);
    } catch (error) {
      console.error('Error updating interest:', error);
    }
  };

  const currentInterest = interests[0]?.name;
  const interestOptions = ALL_INTERESTS.filter((i) => i !== currentInterest);

  return (
    <div>
      <h1>Profile Page</h1>
      <div>{user.username}</div>
      <div>{user.email}</div>
      <img src={user.profilePic} alt="Profile" />

      <h3>Current Interest:</h3>
      <div>{currentInterest || 'None'}</div>

      <h4>Change Interest:</h4>
      <form onSubmit={(e) => { e.preventDefault(); handleUpdateInterest(); }}>
        {interestOptions.map((interest) => (
          <div key={interest}>
            <label>
              <input
                type="radio"
                name="interest"
                value={interest}
                checked={selectedInterest === interest}
                onChange={(e) => setSelectedInterest(e.target.value)}
              />
              {interest}
            </label>
          </div>
        ))}
        <button type="submit">Update Interest</button>
      </form>
    </div>
  );
};

export default Profile;