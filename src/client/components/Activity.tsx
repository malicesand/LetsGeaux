import React, { useState } from 'react';
import axios from 'axios';
import { Container, Card, Box, Button, Typography } from '@mui/material';

const Activity = (props) => {
  return (
    <Container>
      <div className="activity-title">{act.name}</div>
      <p className="activity-description">{act.description}</p>
      <div className="activity-time">{act.time}</div>
      <div className="activity-date">{act.date}</div>
      <div className="activity-location">{act.location}</div>
      <img className="activity-image" src={act.image}/>
      <div className="activity-contact">{act.phone}</div>
      <div className="activity-address">{act.address}</div>
    </Container>
  )
}

export default Activity;