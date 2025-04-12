import React, {useState, useEffect} from 'react';
import axios from 'axios';
// import SuggestionForm from './SuggestionForm';
import {
  Container,
  Card,
  // Typography,
  // Dialog,
  // Grid,
  // Avatar,
  // Input,
  // InputLabel,
  // Button,
  // SpeedDial,
  // CircularProgress
} from '@mui/material'
import Suggestion from './Suggestion';
import { user } from '../../../types/models.ts';

interface SuggestionsProps {
  user: user;
}
const Suggestions: React.FC<SuggestionsProps>= ({ user }) => {

  const [editableSuggestion, setEditableSuggestion] = useState({});
  const [suggestionSet, setSuggestionSet] = useState([]);
  const [suggestionEditMode, setSuggestionEditMode] = useState(false);
  const [dbSuggestionSet, setDbSuggestionSet] = useState([]);
  const [sortedSuggestionSet, setSortedSuggestionSet] = useState([]);


// TECH-DEBT: Gotta make a way to  filter out duplicates between the database suggestions and API suggestions.
// Also- upsert so that no one gets to have more than one vote.


const getDbSuggestions = () => {
  axios.get('/api/suggestions').then(({data}) => {
    sortSuggestionSet(data);
    setDbSuggestionSet(data);
    console.log('db suggestions', data)
  })
}
  const getAllSuggestions = () => {
    const setUpSuggestions = async () => {
      const suggs = await getDbSuggestions()
        const apis = await getApiSuggestions();
    }
    setUpSuggestions();
  }
  // taking the API suggestions and filtering out the ones we already have in the database
  const sortSuggestionSet = (array: []) => {
    // create A clone.. may be superfluous..
    const fakeSet = dbSuggestionSet;
    // remove all values in that set that share the value of its title
    console.log('values', (fakeSet))
    const sortSet = array.filter((sugg: any) => !Object.values(dbSuggestionSet).includes(sugg.title));
    // place the sorted set in state
    setSortedSuggestionSet(sortSet);




  }

  const getApiSuggestions = () => {
      axios.get(`/api/suggestions/search/${user.id}`).then(({data: searchData}) => {
        console.log(searchData);
          setSuggestionSet(searchData);
      })

    .catch((err) => console.error('there was an issue', err));
  }

  useEffect(() => {
    getAllSuggestions();
  }, []);

  return (
    <Container>
      <h1>Suggested Excursions</h1>
      <h2>user picks</h2>
      <h2></h2>
      {dbSuggestionSet.map((currentSuggestion: any) => (
        <Card key={currentSuggestion.id}>
          <Suggestion
          user={user}
          isDb={true}
          currentSuggestion={currentSuggestion}
          getAllSuggestions={getAllSuggestions}
          setSuggestionEditMode={setSuggestionEditMode}
          setEditableSuggestion={setEditableSuggestion}
          />
        </Card>
      ))}
      <h2>You may enjoy:</h2>
      {sortedSuggestionSet.map((currentSuggestion) => (
        <Card key={currentSuggestion.title}>
          <Suggestion
          user={user}
          currentSuggestion={currentSuggestion}
          isDb={false}
          getAllSuggestions={getAllSuggestions}
          setSuggestionEditMode={setSuggestionEditMode}
          setSuggestionSet={setSuggestionSet}
          setEditableSuggestion={setEditableSuggestion}
          />
        </Card>
      ))}
      {/* <SuggestionForm
suggestionSet={suggestionSet}
suggestionEditMode={suggestionEditMode}
setSuggestionEditMode={setSuggestionEditMode}
getAllSuggestions={getAllSuggestions}
editableSuggestion={editableSuggestion}
/> */}
    </Container>
  )
}

export default Suggestions;
