import React, { useState } from 'react';
import axios from 'axios';

type Interest = {
  id: number;
  name: string;
};

const InterestForm: React.FC = () => {
  const interests: Interest[] = [
    { id: 1, name: 'Hotel' },
    { id: 2, name: 'Restaurant' },
    { id: 3, name: 'Attraction' },
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

    const interestsData = [{ name: selectedName }];

    try {
      const response = await axios.post('/api/interests', interestsData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        console.log('Interest saved successfully!');
      } else {
        console.error('Failed to save interest.');
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