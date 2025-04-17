import React, { useEffect} from 'react';
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
  setCommentEditMode: Function;
  editableComment: any;
  commentEditMode: boolean;
}

const CommentForm: React.FC<CommentFormProps> = ({user, postId, commentEditMode, setCommentEditMode, editableComment, getAllComments}) => {
  const form = useForm();
  const { register, handleSubmit, reset, setValue, setError, formState: { isSubmitting, errors } } = useForm<FormFields>({
    defaultValues: {
      body: '',
    }
  })

useEffect(() => {
  if (commentEditMode) {
    setValue("body", editableComment.body);
  }
}, [editableComment]);


  const submitComment: SubmitHandler<FormFields> = (data: any) => {
    if (!commentEditMode) {

      const commentBody = {
        data: {
          userId: +user.id,
          postId: +postId,
          body: data.body,
          postName: user.username

        }
      }

      axios.post(`/api/comments`, commentBody)
      .then(() => {
        reset();
        getAllComments();
      })
      .catch((err) => console.error('unable to post comment', err))
    } else {
      const { id } = editableComment;
      const commsFix = {
        body: data.body,
      }
      axios.patch(`api/comments/${id}`, commsFix)
      .then(() => {
        reset();
        getAllComments();
        setCommentEditMode(false);
      })
      .catch((err) => console.error('could not change comment', err));
    }
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
          {commentEditMode ? (
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "changing.." : "edit comment"}</Button>
          ) : (
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Sending.." : "post comment"}</Button>
          )
          }
        </form>
      </Grid>
    </Container>
  )
}

export default CommentForm;