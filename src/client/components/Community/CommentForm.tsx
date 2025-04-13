import React, { useState, useEffect} from 'react';
import axios from 'axios';
import { user } from '../../../../types/models.ts';
import {
  Container,
  Typography,
  List,
  Card,
  Paper,
  Grid,
  Button,
  Input,
} from '@mui/material';
import { useForm } from 'react-hook-form';

type FormFields = {
  body: String,
}

interface CommentFormProps {
  user: user;
  postId: string;
  getAllComments: Function;
}

const CommentForm: React.FC<CommentFormProps> = ({user, postId, getAllComments}) => {
  const [commentEditMode, setCommentEditMode] = useState()
  const form = useForm();
  const { register, handleSubmit, setValue, setError, formState: { isSubmitting, errors } } = useForm<FormFields>({
    defaultValues: {
      body: '',
    }
  })
  const submitComment: SubmitHandler<FormFields> = (data: any) => {
    const commentBody = {
      data: {
        userId: +user.id,
        postId: +postId,
        body: data.body,
      }
    }

    axios.post(`/api/comments`, commentBody)
    .then(() => {
      getAllComments();
    })
    .catch((err) => console.error('unable to post comment', err))
  }
  return (
    <Container>
      <Grid container spacing={3}>
        <Typography>Leave a comment</Typography>
        <form onSubmit={handleSubmit(submitComment)}>
          <textarea
          rows="5"
          cols= "50"
          {...register("body")}
          name="body"
          type="textarea"
          placeholder="Write your own comment"
          />
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Sending.." : "post comment"}</Button>
        </form>
      </Grid>
    </Container>
  )
}

export default CommentForm;