import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Box,
  // SpeedDial,
  // SpeedDialAction,
  // SpeedDialIcon,
  Button,
  Card,
  // CardMedia,
  // Stack,
  Fade,
  Accordion,
  // AccordionClasses,
  // AccordionSummary,
  Typography,
  // AccordionDetails,
  // accordionDetailsClasses,
  // Dialog,
  Grid,
  // Avatar,
  ImageList,
  ImageListItem,
  ListItemText,
} from '@mui/material';
import { PiShootingStarFill } from "react-icons/pi";
import { PiStarHalfThin } from "react-icons/pi";

// import {
//   AddToQueueRounded,
//   ArrowForwardIos,
// }  from '@mui/icons-material';
import ThumbsUpDownRoundedIcon from '@mui/icons-material/ThumbsUpDown';
import { PiThumbsDownFill } from "react-icons/pi";
import { PiThumbsUpFill } from "react-icons/pi";
import { user } from '../../../types/models.ts';
import SuggestionToActivityForm from './SuggestionToActivityForm.tsx';

interface SuggestionProps {
  user: user;
  getAllSuggestions: Function;
  setSuggestionEditMode: Function;
  getAllWishlistSuggestions: Function;
  wishMode: Boolean;
  idDb: Boolean;
  currentSuggestion: {
    id: Number
    title: String
    upVotes: Number
    downVotes: Number
    timeAvailable: String
    cost: Number
    address: String
    description: String
    image: String
    link: String
    userId: Number
    latitude: String
    longitude: String

  }

}

/**
 * When the "add to itinerary" speed dial  button is pressed, the associated function will:
 * Save the suggestion info to the database
 * Take the necessary info for the activity form as props
 * Move those props to the activity form component
 * autofill that info into the form
 * STRETCH: highlight the other fields that need to be filled in
 *
 * Future: need to set up conditionals for voting icons in speed dial. Don't show if suggestion isn't saved. Disable if unauthorized to vote

Faded translucent accordion to be set by lunch tomorrow.  [https://mui.com/material-ui/react-accordion/]

*/


// const Grid = Grid2;
const Suggestion: React.FC<SuggestionProps> = ({
  user,
  currentSuggestion,
  getAllSuggestions,
  wishMode,
  isDb,
  getAllWishlistSuggestions,
  /*listSuggestion, setEditableSuggestion}*/
}) => {
  const [expanded, toggleExpanded] = useState(false);
  const [isTesting, setIsTesting] = useState(false);




  /**
   * Activity Suggestion match points
   */

  /**
   * How to handle separate posts..
   * I can add a quality to the post function on this side to either add it to the wishlist get
   * or let it just stay in the db. (maybe searchable with a "show all saved suggestions" button)
   * maybe call it a wishlist id, but use a userId, so whenever a user with that Id shows up there,
   * it'll only show up if it matches... Patch requests can add the id  to and take it away from the wishlist
   * also via a button
   *
   * maybe also an "inWishlist"
   */

  // This is what occurs when the add to wishlist button is pressed. Calling a post request with wish markers to post the Suggestion
  const addToWishlist = () => {
    // gather the needed values and put them into an axios post request in a similar way to activities
    const { address, description, latitude, longitude, link, title } = currentSuggestion;

    const details = {
      data: {
        address,
        description,
        latitude,
        longitude,
        link,
        image,
        title,
        upVotes: 0,
        downVotes: 0,
      }
    }
    axios.post(`/api/suggestions/${user.id}`, details)
      .then(() => { })
      .catch(err => console.error('unable to save suggestion', err))
  }

  const handleAddToActivities = () => {
    /**
     * What needs to be sent out in the body:
     * [* = get from supplementary user form filling (possibly repurpose old activityForm.tsx)]
     * PARTY ID NEEDED TO ADD ANY ACTIVITIES-- Must query for userParty where userId = our user.id
     * 
     * More specifically, for all itinerary ids where IN userParty, the partyId is connected with this userId
     * 
     * I believe I can create the form to hold the suggestion values as its dialog values and populate the form with those values, 
     * giving the user the ability to edit before submission [repurpose ActivityForm.tsx]
     * 
     * 
     * check email model for cascade rules
     * 
     * 
     * 1. itineraryId *
     * 2. name
     * 3. description (?)
     * 4. Activity Date *
     * 5. Activity Time *
     * 6. location (required: just address.)
     * 7. image (coming soon. Add to sugg.ts function)
     * 8. phone (use link, but get real link)
     * 9. Address...
     * 10. UserId (use this to get an itinerary id to enter into the form)
     * 
     * So making the suggestion an activity should trigger a get request for all itineraries that user has access to
     * perhaps in a drop-down menu on the form.. The user Id is placed automatically and the itinerary comes in from the form choice
     * The user will have to jot in date and time, and maaaybe should have the choice of changing the image?
     * 
     * Also search up: Snackbar, Dialogues, Modals, Toast notifications
     * 
     */

    const details = {
      data: {
        address: currentSuggestion.address,
        description: currentSuggestion.description,
        phone: currentSuggestion.link,
        name: currentSuggestion.title,
      }
    }
    axios.post('/api/activity', details.data).then(() => {
      if (wishMode) {
        handleRemoveFromWishlist()
      }
    }).then(() => {
      if (wishMode) {
        getAllWishlistSuggestions();
      }
    }).catch((err) => {
      console.error('unable to change suggestion', err);
    })
  }


const openTestForm = () => {
  setIsTesting(true);
}

const closeTestForm = () => {
  setIsTesting(false);
}


  const handleVoteClick = (polarity: string) => {
    const { id } = user;
    const userId = id
    const { id: suggestionId } = currentSuggestion;
    const pol = polarity === 'up' ? 1 : 0
    const vote = {
        data: {
          user: { connect: { id: +user.id } },
          suggestion: { connect: { id: suggestionId } },
          polarity: pol,
        }
      }
      let voteDirection;
      axios.post(`api/vote/${userId}/${suggestionId}/suggestion`, vote).then(() => {
        if (polarity === 'up') {
          voteDirection = 'upVotes';
        } else {
          voteDirection = 'downVotes';
        }
        axios.patch(`api/suggestions/${suggestionId}`, [voteDirection])
        console.log('into the patch(post details)')
      })
      .then(() => alert("YOU VOTED!"))
      .catch((err) => console.error('there is an issue with your vote', err));
    // } else {
      // alert('YOU ALREADY VOTED!!')
    // }
      
        /**
         * set an axios request to vote with our existing userId and the current suggestion's
         * id(maybe both in params?)
         * At some point set a set of statements that would just check the polarity for
         * the same vote and change it if need be instead of letting them vote ...
         * maybe disable the vote button visibly on things they've already voted on..
        */
      }
      
//       const positiveForPastVotes = async () => {
//         const voteStatus = await axios.get(`api/vote/${user.id}/${currentSuggestion.id}/suggestion`)
//         console.log('this is what comes of voteStatusess')
//         if (voteStatus.data) {
//          const logging = await console.log('data true')
//           return true;
//         } else {
//           const logging = await console.log('no data, but what', voteStatus)
//           console.log('no data, but what?')
//           return false;
//         }
// }


  const handleRemoveFromWishlist = () => {
    axios.patch(`/api/wishlist/${currentSuggestion.id}/${user.id}`)
      .then(() => {
        getAllWishlistSuggestions();
      })
      .catch((err) => console.error('sorry, tex', err));
  }

  const handleExpansion = () => {
    toggleExpanded((prevExpanded) => !prevExpanded)



  }
  const { title, description, link, upVotes, downVotes, latitude, longitude, address, hours, image } = currentSuggestion;
  return (
    <Container>
      <Grid item size={6}>
        {/* <Card> */}
          {/* <Typography variant="h3">Featured Foray:</Typography> */}
          {/* <Button variant="filled">Next attraction</Button> */}
          <Button
          variant="filled"
          onClick={handleAddToActivities}
          sx={{ marginRight: "4px" }}
          >add to activities!</Button>
          {wishMode
            ?
            <Button title="remove from wishlist" sx={{ borderWidth: 4, color:"black" }}  onClick={handleRemoveFromWishlist}> <PiStarHalfThin /> </Button>
            :
            <Button title="add to wishlist" sx={{ borderWidth: 4, color:"black" }}  onClick={addToWishlist} variant="filled"> <PiShootingStarFill /> </Button>
          }
          <ImageList>
            <ImageListItem key="ItemText" cols={4}>
              <ListItemText >
                <Typography variant="h2">
                  {title}
                </Typography>
              </ListItemText>
              {image ? (
                <img style={{ width: "100px", marginTop: "10px" }}src={`${image}`}></img>

              ) : (
                <img style={{ width: "100px", marginTop: "10px" }} src="https://static.vecteezy.com/system/resources/previews/002/187/723/original/coming-soon-neon-signs-style-text-free-vector.jpg"></img>
// set typography to "body"
              )}
              <Typography>{description}</Typography>
              <Typography><b>Contact website:</b> {link}</Typography>
              <Typography><b>address:</b> {address}</Typography>
              {hours
                ? (
                  <Box>
                    <Typography><b>Hours of operation:</b></Typography>
                  </Box>

                ) : (
                  <Typography><em>Operation hours unavailable</em></Typography>
                )}
              {isDb ? (
                <Grid>
                  <Typography>Vote on this suggestion<ThumbsUpDownRoundedIcon /></Typography>
                  <Typography> {upVotes}</Typography>
              <Button title="vote suggestion up" sx={{ borderWidth: 4, color: "black" }}  onClick={() => handleVoteClick('up')}><PiThumbsUpFill /></Button>
                  <Typography> {downVotes}</Typography>
              <Button title="vote suggestion down" sx={{ borderWidth: 4, color: "black" }}  onClick={() => handleVoteClick('down')}><PiThumbsDownFill /></Button>
                </Grid>
              ) : (null)}
            </ImageListItem>
          </ImageList>
        {/* </Card> */}

      </Grid>
      {isTesting ? (
        <SuggestionToActivityForm currentSuggestion={currentSuggestion} user={user}/>
      ) : (
        null
      )}
      {isTesting ? (
        <Button onClick={closeTestForm} >Close Form</Button>
      ) : (
        
        <Button onClick={openTestForm} >Open Form</Button>
      )}
    </Container >

  )
}
export default Suggestion;
