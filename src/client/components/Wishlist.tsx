import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Card } from '@mui/material';
import { user } from '../../../types/models.ts';

interface WishlistProps {
  user: user;
}

const Wishlist: React.FC<WishlistProps> = ({user}) => {
  const[wishListSuggs, setWishListSuggs] = useState([]);


  const getAllWishlistSuggestions = () => {
    console.log('getting');
    axios.get(`/api/wishlist/${user.id}`).then((list) => {
      console.log('postGet:', list);
    }).catch((err) => console.error('unable to retrieve wishlist', err));
  }
  useEffect(() => getAllWishlistSuggestions(), []);
  return (
    <Container>12345</Container>
  )
}

export default Wishlist;