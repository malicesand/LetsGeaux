// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import Typography from '@mui/material/Typography'
// import Button from '@mui/material/Button'
// import IconButton from '@mui/material/IconButton'
// import SendIcon from '@mui/icons-material/SendRounded'
// import Input from '@mui/material/Input'
// import TextField from '@mui/material/TextField'
// import TextareaAutosize from '@mui/material/TextareaAutosize'
// import FormGroup from '@mui/material/FormGroup'
// import Container from '@mui/material/Container'
// import Stack from '@mui/material/Stack'
// import Box from '@mui/material/Box'
// import { styled } from '@mui/material/styles';

// import ChatHistory from './ChatHistory'
// import { user } from '../../../../types/models.ts';

// interface ChatMessage {
//   text: string;
//   user: boolean;
// }

// interface ChatProps {
//   user: user;
// }

// const ChatBot: React.FC <ChatProps> = ({user}) => {
//   const [userMessage, setUserMessage] = useState<string>('');
//   const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
//   const chatLogRef = useRef<HTMLDivElement>(null);
//   const [sessionId, setSessionId] = useState(null); // ? Local Storage 

//   useEffect(() => {
//     // check local storage for session ID
//     console.log(sessionId)
//     const storedSessionId = localStorage.getItem('sessionId');
//     if (storedSessionId) {
//       setSessionId(storedSessionId);
//     } else {
//       // Create new session ID
//       fetch('/api/chats/new-session', { method: 'POST' })
//         .then((response) => response.json())
//         .then((data) => {
//           localStorage.setItem('sessionId', data.sessionId);
//           setSessionId(data.sessionId);
//         });
//         // TODO have chat greet user on mount
//     }


//     if (chatLogRef.current) {
//       chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
//   }

//   }, [chatLog]);
 
//   // const handleSubmit = async () => {
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!userMessage.trim()) return;
//     setChatLog([...chatLog, { text: userMessage, user: true }]);
//     setUserMessage('');
//     try {
//       const response = await axios.post('/api/chats', { userMessage, userId: user.id, sessionId });
//       setChatLog(prev => [...prev, { text: response.data, user: false }]);
//     } catch (error: any) { // ? Type the error
//         console.error("Error sending message:", error);
//         setChatLog(prev => [...prev, {text: "Error: Could not get response.", user: false }]);
//     };
//   };

//   // return (
//   //   <div style={{ display: 'flex', height: '100vh'}}>
//   //     <Box
//   //       className='Chat-Bot'
//   //       sx={{ 
//   //         flex: 3, 
//   //         maxWidth: '800px', 
//   //         mt: 5,
//   //         margin: '0 auto', 
//   //         // padding: '60px'
//   //        }}
//   //     >
//   //       <Typography sx={{m: '40px', mt:'10px', p: 'auto'}} variant='h1' >Gata Bot</Typography >
//   //       <Typography sx={{m: '10px', pb: '20px'}} variant='h3'>Welcome {user.username}!</Typography>
//   //       <Stack spacing={4} sx={{ height: '100%' }}>
//   //         <Box
//   //           alignItems='flex-start'
//   //           gap={2}
//   //           sx={{
//   //             display: 'flex',
//   //             flexDirection: 'column',
//   //             height: '75%',
//   //             border: '4px solid black',
//   //             borderRadius: 8,
//   //             bgColor: '#C2A4F8',
//   //             // padding: '10px',
//   //             // overflowY: 'auto',
//   //             overflow: 'hidden',
//   //             mt: '20px',
//   //             p: '2'
//   //           }}
//   //         > {/* Chat */}
//   //           <Box
//   //           className='chat-list'
//   //           ref={chatLogRef}
//   //           sx={{
//   //             flexGrow: 1,
//   //             // height: '100%',
//   //             overflowY: 'auto',
//   //             // m: '20px',
//   //             // p: '20px',
//   //             // b: '20px',
//   //             mb: 1
              
//   //           }}
//   //           > 
//   //             {chatLog.map((msg, index) => (
//   //               <Typography
//   //                 key={index}
//   //                 style={{
//   //                   textAlign: msg.user ? 'right' : 'left',
//   //                   color: msg.user ? 'black' : 'black',
//   //                   margin: '10px',
//   //                   padding: '5px'
//   //                 }}
//   //               >
//   //                 <strong>{msg.user ? 'You:' : 'Gata:'}</strong> {msg.text}
//   //               </Typography>
//   //             ))}
//   //           </Box>
//   //            {/* Input + Send */}
//   //           <Box 
//   //             component='form'
//   //             onSubmit={handleSubmit}
//   //             sx={{
//   //               width: '95%', 
//   //               display: 'flex',
//   //               alignItems: 'flex-end',
//   //               // alignItems: 'center',
//   //               // gap: 1
//   //               // backgroundColor: '#C2A4F8',
//   //               // px: 1,
//   //               // pt: 1,
//   //               // pb: 2,
//   //               // borderRadius: '0 0 16px 16px'
//   //               borderTop: '4px solid black',
//   //               gap: 1,
//   //             }}>
//   //               {/* <StyledTextarea
//   //                 // minRows={3}
//   //                 // maxRows={6}
//   //                 value={userMessage}
//   //                 onChange={e => setUserMessage(e.target.value)}
//   //                 placeholder='Type your message...'
//   //                 onKeyDown={(e) => {
//   //                   if (e.key === 'Enter' && !e.shiftKey) {
//   //                     e.preventDefault();
//   //                     // handleSubmit(); 
//   //                     handleSubmit(e as any); 
//   //                   }
//   //                 }}
//   //                 // style={{ 
//   //                 //   flexGrow: 1,
//   //                 //   resize: 'none',
//   //                 //   padding: '12px',
//   //                 //   fontSize: '1rem',
//   //                 //   border: 'none',
//   //                 //   // borderTop: '4px solid black',
//   //                 //   fontFamily: 'inherit',
//   //                 //   backgroundColor: 'transparent',
//   //                 //   color: 'black',
//   //                 //   outline: 'none',
//   //                 //   minHeight: '64px',
//   //                 // }}
//   //               /> */}
//   //               <TextField
//   //                 multiline
//   //                 minRows={3}
//   //                 maxRows={6}
//   //                 value={userMessage}
//   //                 onChange={(e) => setUserMessage(e.target.value)}
//   //                 onKeyDown={(e) => {
//   //                   if (e.key === 'Enter' && !e.shiftKey) {
//   //                     e.preventDefault();
//   //                     handleSubmit(e);
//   //                   }
//   //                 }}
//   //                 placeholder="Type your message..."
//   //                 fullWidth
//   //                 variant="standard"
//   //                 sx={{
//   //                   border:'none',
//   //                   fontSize: '1rem',
//   //                   backgroundColor: 'transparent',
//   //                   color: 'black'
//   //                 }}
//   //                 slotProps={{
//   //                   root: {
//   //                     sx: {
//   //                       '& .MuiInput-root::before': {
//   //                         borderBottom: 'none'
//   //                       },
//   //                       '& .MuiInput-root::after': {
//   //                         borderBottom: 'none' 
//   //                       },
//   //                       '& .MuiInput-root:hover:not(.Mui-disabled)::before': {
//   //                         borderBottom: 'none'
//   //                       }
//   //                     }
//   //                   }
//   //                 }}
//   //               />

//   //             <IconButton 
//   //               // type='submit' 
//   //               onClick={handleSubmit}
//   //               // onClick={(e) => handleSubmit(e as any)}
//   //               sx={{ 
//   //                 ml: 1, 
//   //                 color: '#bbf451',
//   //                 '& svg': {
//   //                   fontSize: '2.5rem',
//   //                   transform: 'translateY(-8px)'
//   //                 }
//   //               }}>
//   //               <SendIcon/>
//   //             </IconButton>
//   //           </Box>
//   //         </Box>
//   //       </Stack>
//   //     </Box>
//   //     {/* Chat History */}
//   //     <Box style={{  width: '100%', maxWidth:'500px', borderLeft: '4px solid', overflowY: 'auto'}}>
//   //       <ChatHistory user={user} />
//   //     </Box>
//   //   </div>
        
//   // );
//   return (
//       <Box sx={{ display: 'flex', width: '100%', height: '100%' }}>
//         {/* Main Chat Column */}
//         <Box
//           sx={{
//             width: '100%',
//             maxWidth: isMobile ? '100%' : '55%',
//             height: isMobile ? '90vh' : '85vh',
//             mx: 'auto',
//             display: 'flex',
//             flexDirection: 'column',
//             border: '2px solid black',
//             boxShadow: '4px 4px 0px black',
//             borderRadius: '20px',
//             overflow: 'hidden',
//             backgroundColor: '#a684ff',
//             position: 'relative'
//           }}
//         >
//           {/* Header */}
//           <Box
//             sx={{
//               px: 3,
//               py: 2,
//               backgroundColor: '#bbf451',
//               borderBottom: '4px solid black',
//               display: 'flex',
//               justifyContent: 'space-between',
//               alignItems: 'center'
//             }}
//           >
//             <Typography
//               variant='h4'
//               sx={{ fontFamily: 'Lexend Mega', color: 'black' }}
//             >
//               Gata Bot
//             </Typography>
//             {isMobile && (
//               <IconButton
//                 onClick={() => setIsHistoryOpen(true)}
//                 sx={{ color: 'black' }}
//               >
//                 ☰
//               </IconButton>
//             )}
//           </Box>
      
//           {/* Chat Content Wrapper */}
//           <Box 
//             sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, height: '100%' }}>
//             {/* Message Area */}
//             <Box
//               sx={{
//                 flexGrow: 1,
//                 overflowY: 'auto',
//                 px: 2,
//                 pt: 2,
//                 display: 'flex',
//                 flexDirection: 'column'
//               }}
//             >
//               {chatLog.map((msg, idx) => (
//                 <Typography
//                   key={idx}
//                   sx={{
//                     maxWidth: '75%',
//                     px: 2,
//                     py: 1,
//                     borderRadius: 2,
//                     backgroundColor: msg.user ? '#fff' : '#e6e6e6', // TODO change
//                     alignSelf: msg.user ? 'flex-end' : 'flex-start',
//                     mb: 1,
//                     fontSize: '1rem',
//                     color: 'black',
//                     boxShadow: '2px 2px 0px black'
//                   }}
//                 >
//                   {msg.text}
//                 </Typography>
//               ))}
//             </Box>
      
//             {/* Input */}
//             <Box
//               sx={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 px: 2,
//                 pb: 2,
//                 pt: 1,
//                 backgroundColor: '#a684ff'
//               }}
//             >
//               <TextField
//                 fullWidth
//                 multiline
//                 minRows={2}
//                 maxRows={4}
//                 variant='standard'
//                 value={userMessage}
//                 onChange={e => setUserMessage(e.target.value)}
//                 placeholder='Type your message...'
//                 InputProps={{
//                   disableUnderline: true,
//                   sx: {
//                     backgroundColor: '#fff',
//                     borderRadius: '24px',
//                     px: 2,
//                     py: 1,
//                     fontFamily: 'inherit', // TODO change text
//                     fontSize: '1rem',
//                     boxShadow: '2px 2px 0px black',
//                     color: 'black'
//                   }
//                 }}
//                 onKeyDown={e => {
//                   if (e.key === 'Enter' && !e.shiftKey) {
//                     e.preventDefault();
//                     handleSubmit();
//                   }
//                 }}
//               />
//               <IconButton onClick={handleSubmit} sx={{ ml: 1, color: '#bbf451' }}>
//                 <SendIcon sx={{ fontSize: '2rem', transform: 'translateY(-4px)' }} />
//               </IconButton>
//             </Box>
//           </Box>
      
//           {/* Drawer for Mobile */}
//           {isMobile && (
//             <Drawer
//               anchor='right'
//               open={isHistoryOpen}
//               onClose={() => setIsHistoryOpen(false)}
//               slots={{ transition: Slide }}
//               slotProps={{
//                 transition: {
//                   direction: 'left',
//                   // timeout: 500 // slow it down a bit to make it obvious
//                 },
//                 paper: {
//                   sx: {
//                     width: '85%',
//                     height: '77%',
//                     mt: '10.5vh',
//                     borderLeft: '4px solid black',
//                     boxShadow: '4px 4px 0px black',
//                     p: 2,
//                     mr: 2.5,
//                     backgroundColor: '#fff085',
//                     borderTopLeftRadius: 16,
//                     borderBottomLeftRadius: 16,
//                     overflowY: 'auto'
//                   }
//                 }
//               }}
//             >
//               <Typography
//                 variant='h6'
//                 gutterBottom
//                 sx={{ fontFamily: 'Lexend Mega' }}
//               >
//                 Chat History
//               </Typography>
//               <ChatHistory user={user} isMobile={isMobile}/>
//             </Drawer>
//           )}
//         </Box>
      
//         {/* Desktop Sidebar */}
//         {!isMobile && (
//           <Box
//             sx={{
//               width: '500px',
//               height: '85vh',
//               mt: 'auto', 
//               mb: 'auto',
//               ml: 2,
//               backgroundColor: '#fff085',
//               border: '2px solid black',
//               borderRadius: 4,
//               boxShadow: '4px 4px 0px black',
//               px: 1.5,
//               pt: 1,
//               overflowY: 'auto'
//             }}
//           >
//             <Typography
//               variant='h6'
//               gutterBottom
//               sx={{ fontFamily: 'Lexend Mega' }}
//             >
//               Chat History 
//             </Typography>
//             <ChatHistory user={user} isMobile={isMobile}/>
//           </Box>
//         )}
//       </Box>
//     );
// };

// export default ChatBot;

// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import {
//   Box,
//   IconButton,
//   TextField,
//   Typography,
//   Drawer,
//   useTheme,
//   Slide
// } from '@mui/material';
// import { SendRounded } from '@mui/icons-material';

// import ChatHistory from './ChatHistory.tsx';
// import { user } from '../../../../types/models.ts';
// import { useMedia } from '../MediaQueryProvider.tsx';

// interface ChatMessage {
//   text: string;
//   user: boolean;
// }

// interface ChatProps {
//   user: user;
// }
// const ChatBot: React.FC<ChatProps> = ({ user }) => {
//   const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
//   const chatLogRef = useRef<HTMLDivElement>(null);
//   const [userMessage, setUserMessage] = useState('');
//   const [isHistoryOpen, setIsHistoryOpen] = useState(false);
//   const [sessionId, setSessionId] = useState(null); // ? Local Storage 

//   const theme = useTheme();
//   // const isMobile = true;
//   const { isMobile } = useMedia();

//   // const handleSubmit = () => {
//   //   if (!userMessage.trim()) return;
//   //   setChatLog(prev => [...prev, { text: userMessage, user: true }]);
//   //   setUserMessage('');
//   // };

//   useEffect(() => {
//       // check local storage for session ID
//       console.log(sessionId)
//       const storedSessionId = localStorage.getItem('sessionId');
//       if (storedSessionId) {
//         setSessionId(storedSessionId);
//       } else {
//         // Create new session ID
//         fetch('/api/chats/new-session', { method: 'POST' })
//           .then((response) => response.json())
//           .then((data) => {
//             localStorage.setItem('sessionId', data.sessionId);
//             setSessionId(data.sessionId);
//           });
//           // TODO have chat greet user on mount
//       }
  
  
//       if (chatLogRef.current) {
//         chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
//     }
  
//     }, [chatLog]);
   
//     // const handleSubmit = async () => {
//     const handleSubmit = async () => {
//       // e.preventDefault();
//       if (!userMessage.trim()) return;
//       setChatLog([...chatLog, { text: userMessage, user: true }]);
//       setUserMessage('');
//       try {
//         const response = await axios.post('/api/chats', { userMessage, userId: user.id, sessionId });
//         setChatLog(prev => [...prev, { text: response.data, user: false }]);
//       } catch (error: any) { // ? Type the error
//           console.error("Error sending message:", error);
//           setChatLog(prev => [...prev, {text: "Error: Could not get response.", user: false }]);
//       };
//     };
  
//   return (
//     <Box sx={{ display: 'flex', width: '100%', height: '100%' }}>
//       {/* Main Chat Column */}
//       <Box
//         sx={{
//           width: '100%',
//           maxWidth: isMobile ? '100%' : '55%',
//           height: isMobile ? '90vh' : '85vh',
//           mx: 'auto',
//           display: 'flex',
//           flexDirection: 'column',
//           border: '2px solid black',
//           boxShadow: '4px 4px 0px black',
//           borderRadius: '20px',
//           overflow: 'hidden',
//           backgroundColor: '#a684ff',
//           position: 'relative'
//         }}
//       >
//         {/* Header */}
//         <Box
//           sx={{
//             px: 3,
//             py: 2,
//             backgroundColor: '#bbf451',
//             borderBottom: '4px solid black',
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center'
//           }}
//         >
//           <Typography
//             variant='h4'
//             sx={{ fontFamily: 'Lexend Mega', color: 'black' }}
//           >
//             Gata Bot
//           </Typography>
//           {isMobile && (
//             <IconButton
//               onClick={() => setIsHistoryOpen(true)}
//               sx={{ color: 'black' }}
//             >
//               ☰
//             </IconButton>
//           )}
//         </Box>
    
//         {/* Chat Content Wrapper */}
//         <Box 
//           sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, height: '100%' }}>
//           {/* Message Area */}
//           <Box
//             sx={{
//               flexGrow: 1,
//               overflowY: 'auto',
//               px: 2,
//               pt: 2,
//               display: 'flex',
//               flexDirection: 'column'
//             }}
//           >
//             {chatLog.map((msg, idx) => (
//               <Typography
//                 key={idx}
//                 sx={{
//                   maxWidth: '75%',
//                   px: 2,
//                   py: 1,
//                   borderRadius: 2,
//                   backgroundColor: msg.user ? '#fff' : '#e6e6e6', // TODO change
//                   alignSelf: msg.user ? 'flex-end' : 'flex-start',
//                   mb: 1,
//                   fontSize: '1rem',
//                   color: 'black',
//                   boxShadow: '2px 2px 0px black'
//                 }}
//               >
//                 {msg.text}
//               </Typography>
//             ))}
//           </Box>
    
//           {/* Input */}
//           <Box
//             sx={{
//               display: 'flex',
//               alignItems: 'center',
//               px: 2,
//               pb: 2,
//               pt: 1,
//               backgroundColor: '#a684ff'
//             }}
//           >
//             <TextField
//               fullWidth
//               multiline
//               minRows={2}
//               maxRows={4}
//               variant='standard'
//               value={userMessage}
//               onChange={e => setUserMessage(e.target.value)}
//               placeholder='Type your message...'
//               InputProps={{
//                 disableUnderline: true,
//                 sx: {
//                   backgroundColor: '#fff',
//                   borderRadius: '24px',
//                   px: 2,
//                   py: 1,
//                   fontFamily: 'inherit', // TODO change text
//                   fontSize: '1rem',
//                   boxShadow: '2px 2px 0px black',
//                   color: 'black'
//                 }
//               }}
//               onKeyDown={e => {
//                 if (e.key === 'Enter' && !e.shiftKey) {
//                   e.preventDefault();
//                   handleSubmit();
//                 }
//               }}
//             />
//             <IconButton onClick={handleSubmit} sx={{ ml: 1, color: '#bbf451' }}>
//               <SendRounded sx={{ fontSize: '2rem', transform: 'translateY(-4px)' }} />
//             </IconButton>
//           </Box>
//         </Box>
    
//         {/* Drawer for Mobile */}
//         {isMobile && (
//           <Drawer
//             anchor='right'
//             open={isHistoryOpen}
//             onClose={() => setIsHistoryOpen(false)}
//             slots={{ transition: Slide }}
//             slotProps={{
//               transition: {
//                 direction: 'left',
//                 // timeout: 500 // slow it down a bit to make it obvious
//               },
//               paper: {
//                 sx: {
//                   width: '85%',
//                   height: '77%',
//                   mt: '10.5vh',
//                   borderLeft: '4px solid black',
//                   boxShadow: '4px 4px 0px black',
//                   p: 2,
//                   mr: 2.5,
//                   backgroundColor: '#fff085',
//                   borderTopLeftRadius: 16,
//                   borderBottomLeftRadius: 16,
//                   overflowY: 'auto'
//                 }
//               }
//             }}
//           >
//             <Typography
//               variant='h6'
//               gutterBottom
//               sx={{ fontFamily: 'Lexend Mega' }}
//             >
//               Chat History
//             </Typography>
//             <ChatHistory user={user} isMobile={isMobile}/>
//           </Drawer>
//         )}
//       </Box>
    
//       {/* Desktop Sidebar */}
//       {!isMobile && (
//         <Box
//           sx={{
//             width: '500px',
//             height: '85vh',
//             mt: 'auto', 
//             mb: 'auto',
//             ml: 2,
//             backgroundColor: '#fff085',
//             border: '2px solid black',
//             borderRadius: 4,
//             boxShadow: '4px 4px 0px black',
//             px: 1.5,
//             pt: 1,
//             overflowY: 'auto'
//           }}
//         >
//           <Typography
//             variant='h6'
//             gutterBottom
//             sx={{ fontFamily: 'Lexend Mega' }}
//           >
//             Chat History 
//           </Typography>
//           <ChatHistory user={user} isMobile={isMobile}/>
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default ChatBot;
