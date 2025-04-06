import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Card, Button } from '@mui/material';
import { user } from '../../../types/models.ts';
import Suggestion from './Suggestion.tsx';

interface WishlistProps {
  user: user;
}

const Wishlist: React.FC<WishlistProps> = ({ user }) => {
  const [wishlistSuggs, setWishlistSuggs] = useState([]);
  const [wishMode, setWishMode] = useState(true)


  const getAllWishlistSuggestions = () => {
    console.log('getting');
    axios.get(`/api/wishlist/${user.id}`).then(({ data }) => {
      setWishlistSuggs(data);
    }).catch((err) => console.error('unable to retrieve wishlist', err));
  }
  useEffect(() => getAllWishlistSuggestions(), []);
  return (
    <Container>
      {wishlistSuggs.map((currentSuggestion) => (
        <Card key={currentSuggestion.id}>
          <Suggestion
            wishMode={wishMode}
            currentSuggestion={currentSuggestion}
            getAllWishlistSuggestions={getAllWishlistSuggestions}
          />
        </Card>

      ))}
      <Button>Delete entire wishlist</Button>
    </Container>
  )
}

export default Wishlist;