import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Card } from '@mui/material';
import Suggestion from './Suggestion.tsx';

const Wishlist = () => {
  const [listing, setListing] = useState(true);
  const [listSet, setListSet] = useState([]);
  const getAllWishlistSuggestions = () => {
    axios.get('/api/suggestions').then(({data}) => {
      setListSet(data);
    }).catch((err) => console.error('did not grab wishes', err))
    console.log('still gotta get em');
  }
  useEffect(() => {
    getAllWishlistSuggestions();
  }, [])

  return (
    <Container>
      {listSet.map((listSuggestion) => (

        <Card>
          <Suggestion listSuggestion={listSuggestion} listing={listing} setListing={setListing} />
        </Card>
      ))}
    </Container>
  )
}

export default Wishlist;