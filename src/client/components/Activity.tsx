import React, { FC, useState } from 'react';
import axios from 'axios';
import { Container, Card, Box, Button, Typography } from '@mui/material';

<<<<<<< Updated upstream
import { activity } from '../../../types/models.ts';

type ActivityProps = {
  act: activity;
  getAllActivities: () => void;
};

const Activity: FC<ActivityProps> = ({ act, getAllActivities }) => {
=======
type ActivityProps = {
  act: any;
  getAllActivities: Function;
  setEditMode: Function;
}

const Activity = ({act, getAllActivities, setEditMode, setActivitySet}) => {

>>>>>>> Stashed changes
  const deleteAct = () => {
    axios
      .delete(`/api/activity/${act.id}`)
      .then(() => {
        getAllActivities();
      })
      .catch(err => console.error(err));
  };

const setAct = () => {
  setEditMode(true);
  setActivitySet(act);
}


  return (
    <Container>
<<<<<<< Updated upstream
      <div className='activity-title'>{act.id}</div>
      <p className='activity-description'>{act.description}</p>
      <div className='activity-time'>{act.time}</div>
      <div className='activity-date'>{act.date}</div>
      <div className='activity-location'>{act.location}</div>
      <img
        className='activity-image'
        src={act.image}
        width='200'
        height='200'
      />
      <div className='activity-contact'>{act.phone}</div>
      <div className='activity-address'>{act.address}</div>
=======
      <div className="activity-title">{act.name}</div>
      <p className="activity-description">{act.description}</p>
      <div className="activity-time">{act.time}</div>
      <div className="activity-date">{act.date}</div>
      <div className="activity-location">{act.location}</div>
      <img className="activity-image" src={act.image} width="200" height="200"/>
      <div className="activity-contact">{act.phone}</div>
      <div className="activity-address">{act.address}</div>
>>>>>>> Stashed changes
      <Button onClick={deleteAct}>Destroy</Button>
      <Button onClick={setAct}>Edit Activity</Button>
    </Container>
  );
};

export default Activity;
