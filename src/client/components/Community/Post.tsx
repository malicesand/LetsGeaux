import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  List,
  Card,
  Paper,
  Grid,
  Button,
} from '@mui/material';
// import * as dayjs from 'dayjs';
import Comments from './Comments.tsx';
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

}

const Post: React.FC<PostProps> = ({user, currentPost, getAllPosts, setEditablePost, setPostEditMode}) => {
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
      <Card sx={{boxShadow: 10 }}>
        <Button  sx={{ borderWidth: 4, color: 'white' }} onClick={deletePost}>Delete this post 💣</Button>
      <Typography> {body}</Typography>
      <Typography>By: {postName}</Typography>
      <Typography color="white">Likes: {currentPost.likes}</Typography>
      {!hasLiked
       ? (
         <Button sx={{ borderWidth: 4, color: 'white' }} onClick={handleVoteClick} >Like 🚀</Button>
      ) : (
        <Button sx={{ borderWidth: 4, color: 'white' }}  onClick={handleVoteDeleteClick}>Unlike</Button>
        // null
      )}
      <Button sx={{ borderWidth: 4, color: 'white' }}  onClick={startComments}>see comments</Button>
      {isCommenting ? (
        <Paper>
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
          <Button sx={{ borderWidth: 4, color: 'white' }}  onClick={endComments}>Close window</Button>
        </Paper>
      )
      : (
        null
      )}
      <Button  sx={{ borderWidth: 4, color: 'white' }}  onClick={handleEditClick}>Edit this post</Button>
      </Card>
    </Container>
  )
}

export default Post;