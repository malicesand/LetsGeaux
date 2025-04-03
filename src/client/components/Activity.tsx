import React, { FC, useState } from 'react';
import axios from 'axios';
import { Container, Card, Box, Button, Typography } from '@mui/material';

type ActivityProps = {
  act: any;
  getAllActivities: Function;
  setEditMode: Function;
  setEditableActivity: Function;
  setActivitySet: Function;
}

const Activity = ({act, getAllActivities, setEditMode, setEditableActivity, setActivitySet}) => {

  const deleteAct = () => {
    axios
      .delete(`/api/activity/${act.id}`)
      .then(() => {
        getAllActivities();
      })
      .catch(err => console.error(err));
  };

const setAct = () => {
  console.log('the act', act)
  setEditMode(true);
  setEditableActivity(act);
}


  return (
    <Container>
      <div className="activity-title">{act.name}</div>
      <p className="activity-description">{act.description}</p>
      <div className="activity-time">{act.time}</div>
      <div className="activity-date">{act.date}</div>
      <div className="activity-location">{act.location}</div>
      <img className="activity-image" src={act.image} width="200" height="200"/>
      <div className="activity-contact">{act.phone}</div>
      <div className="activity-address">{act.address}</div>
      <Button onClick={deleteAct}>Destroy</Button>
      <Button onClick={setAct}>Edit Activity</Button>
    </Container>
  );
};

export default Activity;
