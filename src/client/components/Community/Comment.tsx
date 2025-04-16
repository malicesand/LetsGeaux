import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Container, Typography, List, Card, Paper, Grid, Button, } from '@mui/material';
import { user } from '../../../../types/models.ts';

interface CommentProps {
  user: user,
  getAllComments: Function
  currentComment: any
}


const Comment: React.FC<CommentProps> = ({user, getAllComments, currentComment}) => {
  const { body, postName, id } = currentComment;

  const [hasLiked, setHasLiked] = useState(false);

  const handleVoteDeleteClick = () => {
    const { id: userId } = user;
    const { id: commentId } = currentComment;
    axios.delete(`api/vote/${userId}/${commentId}/comment`)
    .then(() => {
      setHasLiked(false);
      getAllComments();
    }).catch((err) => console.error('unable to delete', err))
  
  }
  
useEffect(() => {
  checkVoteStatus();
  getAllComments();
}, []);

const userId = user.id


  const deleteComment = () => {
    console.log(currentComment, user)
    axios.delete(`/api/comments/${id}/${userId}`).then(() => {
      getAllComments();
    }).catch((err) => console.error('unable to delete', err))
  }

  const checkVoteStatus = async () => {
    try {
   
      const ballotChecker = await axios.get(`/api/vote/${userId}/${currentComment.id}/comment`)
      
        if (ballotChecker.data !== "no match") {
          setHasLiked(true);
         } else {
           setHasLiked(false);
         }
     } catch (err) {
       console.error('failed to check votes', err)
     }
     }
   



  const handleVoteClick = () => {
    const { id } = user;
    const userId = id;
    const { id: commentId } = currentComment;
    const vote = {
      data:
      {
        userId: id,
        commentId,
        polarity: 1,
      }
    }
    axios.post(`api/vote/${userId}/${commentId}/comment`, vote)
    .then(() => {
      setHasLiked(true);
      getAllComments();
    })
    .catch((err) => console.error('failed to place vote', err))
  }




  return (
    <Container>
        <Typography>{body}</Typography>
        <Typography>By: {postName}</Typography>
        {hasLiked ? (
          <Button onClick={handleVoteDeleteClick}>Unlike</Button>
        ) : (
          <Button onClick={handleVoteClick} >Like 🚀</Button>

        )}
        <Button onClick={deleteComment} >Delete 💣</Button>
    </Container>
  )
}

export default Comment;