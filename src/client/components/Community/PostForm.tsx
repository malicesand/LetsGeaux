import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  List,
  Card,
  Paper,
  Grid,
  Input,
  Button,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { user } from '../../../../types/models.ts';


interface PostFormProps {
  user: user,
  getAllPosts: Function
  editablePost: any
  postEditMode: boolean
  setPostEditMode: Function
}

type FormFields = {
  body: String,
}


const PostForm: React.FC<PostFormProps>= ({ user, getAllPosts, editablePost, postEditMode, setPostEditMode }) => {
  const form = useForm();
  const { register, handleSubmit, reset, setValue, setError, formState: { isSubmitting, errors } } = useForm<FormFields>({
    defaultValues: {
      body: ''
    }
  })

useEffect(() => {
  if (postEditMode) {
    setValue("body", editablePost.body)
  }
}, []);


  const submitForm: SubmitHandler<FormFields> = (data:any) => {
    const { id, username } = user;
    const postBody = {

        data: {
          userId: +id,
          body: data.body,
          postName: username
        }
      }

    axios.post('/api/posts', postBody)
    .then(() => {
      reset();
      getAllPosts();
    })
    .catch((err) => console.error("couldn't make post", err));
  }

  const patchForm: SubmitHandler<FormFields> = (data: any) => {
    console.log(data);
    const { id } = editablePost;
    const patchwork = {
        body: data.body
    }
    axios.patch(`/api/posts/${id}`).then(() => {
      reset();
      getAllPosts();
    }).catch((err) => {
      console.error('could not patch form', err);
    })
  }



  return (
    <Container>
      <Grid container spacing={3}>
        <Typography>Write a post!</Typography>
        <form onSubmit={handleSubmit(submitForm)} >
      <textarea
      rows="10"
      cols="100"
      {...register("body", {
        required: "You haven't written anything yet!",
        minLength: 1,
        message: "You haven't written anything yet!",
      })}
      name="body"
      type="textarea"
      placeholder="let geaux!"
      />
      {errors.body && <div>{errors.body.message}</div>}
        {postEditMode ? (
          <Button type="button" onClick="wee" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Edit Post"}</Button>

        ) : (
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Send Post"}</Button>

        ) }
        </form>
      </Grid>
    </Container>
  )
}

export default PostForm;