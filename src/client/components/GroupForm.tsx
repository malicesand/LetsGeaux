import React, { useState, useEffect, } from 'react';
import axios from 'axios';
import { ViewCozyRounded } from '@mui/icons-material';
import e from 'cors';
import { useRadiusExtremumGetter } from '@mui/x-charts/internals';
import { is } from 'date-fns/locale';




const GroupForm = () => { 
const [itinerary, setItineraryId] = useState('')
const [userIds, setUerIds] =useState('')
const [viewCode, setViewCode] = useState(null)

const handleSubmit = async(e: { preventDefault: () => void; }) => {
  e.preventDefault();
  const userIdsArray = userIds.split(',').map((id: string) =>parseInt(id.trim()))
  try{
        const response =  await axios.post('/api/groups/create', {
          itineraryId: itinerary,
        userIds: userIdsArray,
        })
    
      }catch(error){
    console.error('Error creating group:', error)
      }
    }
    
    
    
return(
<div>
  <h1>Create New Group</h1>
  <form onSubmit={handleSubmit}>
    <div>
      <label htmlFor="itineraryId">Itinerary ID:</label>
      <input
      type="text"
      id="itineraryId"
      value={itinerary}
      onChange={(e)=> setItineraryId(e.target.value)}
      required
      />
    </div>
    <div>
      <label htmlFor=" userIds">User IDs( comma-separted):</label> 
      <input type= "text"
      id="userIds"
      value={userIds}
      onChange={(e)=> setUerIds(e.target.value) }
      required
      />
      <button type="submit">Create Group</button>
      {viewCode &&(
      <div>
        <h2>Group Created!</h2>
        <p>Share code: <strong>{viewCode}</strong></p>
      </div>
      )}
    </div>
  </form>
</div>
)
 }
export default GroupForm;
// const createGroup = async() =>{
//   try{
//     const response =  await axios.post('/api', {

//     })

//   }catch(error){
// console.error('Error creating group:', error)
//   }
// }
// }

// const addUsers  = async () =>{
//   try{

//   }catch(error){
    
//   }