import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';

import {
  Container,
  Box,
  Button,
  Card,
  Typography,
  FormControl,
  Grid,
  Input,

} from '@mui/material';

const ActivityForm = (props) => {
  const [formValues, setFormValues] = useState({
    title: '',
    description: '',
    time: null,
    date: null,
    location: '',
    image: '',
    phoneNum: '',
    address: '',

  })
  const [inputValues, setInputValues] = useState([
    {
      label: 'Title',
      value: '',
      collection: 'title',
      helperText: 'event name',
    },
    {
      label: 'Description',
      value:  '',
      collection: 'description',
      helperText: 'describe the activity',
    },
    {
      label: 'Time',
      value: '',
      collection: 'time',
      helperText: 'When we should be there',
    },
    {
      label: 'Date',
      value: '',
      collection: 'date',
      helperText: 'what day',
    },
    {
      label: 'Location',
      value: '',
      collection: 'location',
      helperText: 'where',
    },
    {
      label: 'Phone/contact',
      value: '',
      collection: 'phone',
      helperText: 'how do we contact the venue',
    },
    {
      label: 'Address',
      value: '',
      collection: 'address',
      helperText: 'street address',
    },
  ])
  return (
    <Container>
      <FormControl>
        <Grid container spacing={4}>
          {inputValues.map((value, i) => (
            <Input
            key={`${value.label}`}
            value={input}
            index={index}
            formValues={formValues}
            setFormValues={setFormValues}
            />
          ))}
        </Grid>
      </FormControl>
    </Container>
  )
}