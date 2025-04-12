import React, {useState} from 'react';
import { user } from '../../../../types/models.ts'
import ReplyForm from './ReplyForm'
 
interface MessageProps {
  user: user;

  // content: string;
}
interface ChatMessage {
  text: string;
  user: boolean;
}
const Message:React.FC<MessageProps>=({ user }) => {
  const [userMessage, setUserMessage] = useState<string>('');
  const msg:string = 'hi'
  // setContent(msg)
  return (
    <div className="message">
      {/* <div className="message-author">{user.username}</div> */}
      <div className="message-content">{msg}</div>
    </div>
  );
}

export default Message;
