import React, { useState } from 'react';
import axios from 'axios'
type Interest = {
  id: number;
  name: string;
};

const InterestForm: React.FC = () => {
  // Define the list of available interests
  const interests: Interest[] = [
    { id: 1, name: 'Hotel' },
    { id: 2, name: 'Restaurant ' },
    { id: 3, name: 'Attraction' },
    {id: 4, name: 'Geos'}
  ];

  const [selectedInterests, setSelectedInterests] = useState<number[]>([]);

  // Handle checkbox change
  const handleCheckboxChange = (id: number) => {
    setSelectedInterests((prevSelected) => {
      if (prevSelected.includes(id)) {
        // If the interest is already selected, uncheck it
        return prevSelected.filter((interestId) => interestId !== id);
      } else {
        // If the interest is not selected, add it to the selected list
        return [...prevSelected, id];
      }
    });
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Map the selected IDs to their names
    const selectedNames = selectedInterests
      .map((id) => interests.find((interest) => interest.id === id)?.name)
      .filter((name) => name); 

    
    const interestsData = selectedNames.map((name) => ({
      name,
    }));

    // Send the interests to the backend via a POST request using Axios
    try {
      const response = await axios.post('/api/interests', interestsData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        console.log('Interests saved successfully!');
      } else {
        console.error('Failed to save interests.');
      }
    } catch (error) {
      console.error('Error sending interests to the backend:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Select your interests</h3>
      <div>
        {interests.map((interest) => (
          <div key={interest.id}>
            <label>
              <input
                type="checkbox"
                checked={selectedInterests.includes(interest.id)}
                onChange={() => handleCheckboxChange(interest.id)}
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