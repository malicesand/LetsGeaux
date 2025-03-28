// import React, { useState, useEffect, useRef } from 'react';
// import { GoogleGenAI } from '@google/genai';

// const apiKey = 'AIzaSyDAkfUub2mqtJj1LRhGqa0sympePj7Ckag';

// const genAI = new GoogleGenAI({apiKey});

// const Tests: React.FC = () => {
  
//   const [responseText, setResponseText] = useState<string>('');
//   const prompt = 'hi'
  
//   useEffect(() => {
//     async function main() {
//       try {
//         // const ai = new GoogleGenAI({ apiKey: process.env.REACT_APP_GEMINI_API_KEY || "" });
//         const countTokensResponse = await genAI.models.countTokens({
//           model: 'gemini-2.0-flash',
//           contents: prompt
//         });
//         console.log(countTokensResponse.totalTokens);
        
//         // const response = await genAI.models.generateContent({
//         //     model: 'gemini-2.0-flash-001', // or 'gemini-pro', ensure it's a valid model name
//         //     contents: 'Why is the sky blue?',
//         // });
//         const response = await genAI.models.generateContent({
//           model: "gemini-2.0-flash",
//           contents: prompt
//         })

//         setResponseText(response.text || 'No response text received.'); // Handle potential empty response
//         console.log(response.usageMetadata);

//     } catch (error: any) {
//         console.error("Error generating content:", error);
//         setResponseText(`Error: ${error.message}`);
//     }
// }

// main();
// }, []); // Empty dependency array means this effect runs only once

// return (
// {/* <div className="App" style={{ textAlign: 'center', padding: '20px' }}>
//     <h1>GenAI Test</h1>
//     <p>{responseText}</p>
// </div> */}
// {/**
//     <div className="App" style={{maxWidth: '800px', margin: '0 auto', padding: '20px'}}>
//             <h1>New Orleans Travel Chatbot</h1>
//             <div className="chat-log" style={{border: '1px solid #ccc', padding: '10px', height: '400px', overflowY: 'scroll'}} ref={chatLogRef}>
//                 {chatLog.map((msg, index) => (
//                     <div key={index} style={{textAlign: msg.user ? 'right' : 'left', marginBottom: '5px'}}>
//                         <strong>{msg.user ? 'You:' : 'Bot:'}</strong> {msg.text}
//                     </div>
//                 ))}
//             </div>
//             <form onSubmit={handleSubmit} style={{marginTop: '10px'}}>
//                 <input
//                     type="text"
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     placeholder="Type your message..."
//                     style={{width: '70%', padding: '8px', marginRight: '10px'}}
//                 />
//                 <button type="submit" style={{padding: '8px 15px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer'}}>Send</button>
//             </form>
//         </div> */}
// );



// };

// export default Tests;