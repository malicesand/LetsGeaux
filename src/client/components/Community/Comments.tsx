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
  editableComment: any;
  setEditableComment: Function,
  setCommentEditMode: Function,
  commentEditMode: boolean,
}

const Comments: React.FC<CommentsProps> = ({ user, commentSet, getAllComments, commentEditMode, endComments, postId, setEditableComment, setCommentEditMode }) => {
  return (
    <Container>
      {commentSet.map((currentComment: any) => (
        <Card key={currentComment.id}>
      <Comment
      currentComment={currentComment}
      user={user}
      getAllComments={getAllComments}
      setEditableComment={setEditableComment}
      setCommentEditMode={setCommentEditMode}
      commentEditMode={commentEditMode}
      />
      </Card>
      ))}
      <Button onClick={endComments}>back to posts</Button>

    </Container>


  )
}

export default Comments;