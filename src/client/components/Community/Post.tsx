import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  List,
  Card,
  Paper,
  TextField,
  Grid,
  Button,
  Box,
} from '@mui/material';
// import * as dayjs from 'dayjs';
import Comments from './Comments.tsx';
import { PiHandHeartFill } from "react-icons/pi";
import { PiHandPalmFill } from "react-icons/pi";
import { PiBombFill } from "react-icons/pi";
import { PiNotePencilFill } from "react-icons/pi";

import CommentForm from './CommentForm.tsx';
import { user } from '../../../../types/models.ts';

// dayjs().format()

interface PostProps {
  user: user,
  currentPost: any
  getAllPosts: Function
  setPostEditMode: Function
  editablePost: any
  setEditablePost: Function
  postEditMode: boolean


}

const Post: React.FC<PostProps> = ({user, currentPost, getAllPosts, setEditablePost, postEditMode, setPostEditMode}) => {
  const { body, id, postName } = currentPost
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentSet, setCommentSet] =useState([]);
  const [hasLiked, setHasLiked] = useState(false);
  const [commentEditMode, setCommentEditMode] = useState(false);
  const [editableComment, setEditableComment] = useState(null);

const getAllComments = () => {
  axios.get(`/api/comments/${+id}`).then(({data}) => {
    setCommentSet(data)
  }).catch((err) => console.error('unable to gather comments', err));
}

const checkVoteStatus = async () => {
 try {

   const ballotChecker = await axios.get(`/api/vote/${userId}/${currentPost.id}/post`)
     if (ballotChecker.data !== "no match") {
       setHasLiked(true);
      } else {
        setHasLiked(false);
      }
  } catch (err) {
    console.error('failed to check votes', err)
  }
  }




useEffect(() => {
  checkVoteStatus();
  getAllComments();
}, []);

const startComments = () => {
  setIsCommenting(true);
}
const endComments = () => {
  setIsCommenting(false);
}

const handleEditClick = () => {
  setEditablePost(currentPost);
  setPostEditMode(true);
}




const handleVoteClick = () => {
  const { id: userId } = user;
  const { id: postId } = currentPost;

  const vote =  {
    data: {
      userId,
      postId,
      polarity: 1
    }
  }
    axios.post(`api/vote/${userId}/${+postId}/post`, vote)
    .then(() => {
      const ballot = {
        data: {
          direction: "up",
        },
      }
      axios.patch(`api/posts/likes/${currentPost.id}`, ballot);
    })
    .then(() => {
      getAllPosts();
      setHasLiked(true);
    }).catch((err) => console.error('failed to cast vote', err));
}

const handleVoteDeleteClick = () => {
  const { id: userId } = user;
  const { id: postId } = currentPost;
  axios.delete(`api/vote/${userId}/${postId}/post`)
  .then(() => {
    const ballot = {
      data: {
        direction: "down",
      },
    }
    axios.patch(`api/posts/likes/${currentPost.id}`, ballot);
  })
  .then(() => {
    setHasLiked(false);
    getAllPosts();
  }).catch((err) => console.error('unable to delete', err))

}

// const postId = currentPost.id;
const userId = user.id;
const deletePost = () => {
  axios.delete(`/api/posts/${id}/${userId}`).then(() => {
    getAllPosts();
  }).catch((err) => console.error('unable to delete post', err))
}

  return (
    // MAKE SURE THE WRONG PEOPLE DON'T SEE THE EDIT BUTTON!!!
    <Container>
      <Box sx={{ border: "4px solid black", borderRadius: "4", p: 2, mb: "8px" }}>
        <Button
        title="delete post"
        sx={{ borderWidth: 4, color: 'black', p: '6px' }}
        onClick={deletePost}><PiBombFill /></Button>
        <Typography variant='h3'>{currentPost.title}</Typography>
      <Typography> {body}</Typography>
      <Typography>By: {postName}</Typography>
      <Typography>Likes: {currentPost.likes}</Typography>
      {!hasLiked
       ? (
         <Button title="Like this post" sx={{ borderWidth: 4, color: 'black', p: '6px', marginRight: "4px"}} onClick={handleVoteClick} ><PiHandHeartFill /></Button>
      ) : (
        <Button title="remove like" sx={{ borderWidth: 4, color: 'black', p: '6px', marginRight: "4px"}}  onClick={handleVoteDeleteClick}><PiHandPalmFill /></Button>
        // null
      )}
      <Button sx={{ borderWidth: 4, color: 'black' , p: '6px', marginRight: "4px"}}  onClick={startComments}>see comments</Button>
      {isCommenting ? (
        <>
          <CommentForm
          postId={id}
          user={user}
          getAllComments={getAllComments}
          setCommentEditMode={setCommentEditMode}
          editableComment={editableComment}
          commentEditMode={commentEditMode}
          />
          <Comments
          user={user}
          postId={id}
          getAllComments={getAllComments}
          commentSet={commentSet}
          isCommenting={isCommenting}
          endComments={endComments}
          setEditableComment={setEditableComment}
          setCommentEditMode={setCommentEditMode}
          commentEditMode={commentEditMode}
          />
          {/* <Button sx={{ borderWidth: 4, color: 'black' }}  onClick={endComments}>Close window</Button> */}
        </>
      )
      : (
        null
      )}
      {postEditMode ? (
        null
      ) : (
        <Button  title="Edit this post"sx={{ borderWidth: 4, color: 'black', p: '6px', marginRight: "4px"}}  onClick={handleEditClick}><PiNotePencilFill /></Button>
      )}
      </Box>
    </Container>
  )
}

export default Post;