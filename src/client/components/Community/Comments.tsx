import React from 'react';
// import axios from 'axios';
import Suggestion from '../Suggestion.tsx';
import { Container, Typography, List, Card, Paper, Grid, Button} from '@mui/material';
import Comment from './Comment.tsx'
import CommentForm from './CommentForm.tsx';
import { user } from '../../../../types/models.ts';

interface CommentsProps {
  user: user,
  commentSet: any,
  getAllComments: Function,
  endComments: Function,
  isCommenting: boolean,
  postId: string,
}

const Comments: React.FC<CommentsProps> = ({ user, commentSet, getAllComments, endComments, postId }) => {
  return (
    <Container>
      {/* <CommentForm postId={postId} user={user} getAllComments={getAllComments} postId={postId} /> */}
      {commentSet.map((currentComment: any) => (
        <Card key={currentComment.id}>
      <Comment currentComment={currentComment} user={user} getAllComments={getAllComments} />
      </Card>
      ))}
      <Button onClick={endComments}>back to posts</Button>

    </Container>


  )
}

export default Comments;