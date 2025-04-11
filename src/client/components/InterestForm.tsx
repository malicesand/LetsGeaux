import React, { useState } from 'react';
import axios from 'axios';
import { user } from '../../../types/models.ts';

type Interest = {
  id: number;
  name: string;
};
interface InterestProps {
  user: user;
}

const InterestForm: React.FC<InterestProps> = ({user}) => {
  const interests: Interest[] = [
    { id: 1, name: 'Hotels' },
    { id: 2, name: 'Restaurants' },
    { id: 3, name: 'Attractions' },
    { id: 4, name: 'Geos' },
  ];

  const [selectedInterest, setSelectedInterest] = useState<number | null>(null);

  const handleRadioChange = (id: number) => {
    setSelectedInterest(id);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (selectedInterest === null) {return};

    const selectedName = interests.find((interest) => interest.id === selectedInterest)?.name;
    let userId = user.id
    const interestsData = { name: selectedName};

    try {
      const response = await axios.post(`/api/interests/${userId}`, interestsData);

      if (response.status === 200 || response.status === 201) {
        console.log('Interest saved successfully!');
      } 
    } catch (error) {
      console.error('Error sending interest to the backend:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Select your interest</h3>
      <div>
       
        {interests.map((interest) => (
          <div key={interest.id}>
            <label>
              <input
                type="radio"
                name="interest"
                value={interest.id}
                checked={selectedInterest === interest.id}
                onChange={() => handleRadioChange(interest.id)}
              />
              {interest.name}
            </label>
          </div>
        ))}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default InterestForm;