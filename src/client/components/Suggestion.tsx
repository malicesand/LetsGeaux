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
// import {
//   AddToQueueRounded,
//   ArrowForwardIos,
// }  from '@mui/icons-material';
import ThumbsUpDownRoundedIcon from '@mui/icons-material/ThumbsUpDown';
import ThumbDownAltRoundedIcon from '@mui/icons-material/ThumbDownAltRounded';
import ThumbUpAltRoundedIcon from '@mui/icons-material/ThumbUpAltRounded';
import { user } from '../../../types/models.ts';

interface SuggestionProps {
  user: user;
  getAllSuggestions: Function;
  setSuggestionEditMode: Function;
  getAllWishlistSuggestions: Function;
  wishMode: Boolean;
  idDb: Boolean;

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


  /* ---------Parts of the currentSuggestion
  title, description, phoneNum, latitude, longitude, address
  */

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
    const { address, description, latitude, longitude, phoneNum, title } = currentSuggestion;

    const details = {
      data: {
        address,
        description,
        latitude,
        longitude,
        phoneNum,
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
    const details = {
      data: {
        address: currentSuggestion.address,
        description: currentSuggestion.description,
        phone: currentSuggestion.phoneNum,
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

  const handleVoteClick = (polarity: string) => {
    const { id } = user;
    console.log('id fer user')
    const { id: suggestionId } = currentSuggestion;
    console.log('got suggestionstuff')
    const pol = polarity === 'up' ? 1 : 0
    const vote = {
      // details: {
      data: {
        user: { connect: { id: +user.id } },
        suggestion: { connect: { id: suggestionId } },
        polarity: pol,
      }
      // }
    }
    console.log('user.id', id);
    console.log('defined vote details')
    let voteDirection;
    axios.post('api/vote', vote).then(() => {
      console.log('into the post')
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

    /**
     * set an axios request to vote with our existing userId and the current suggestion's
     * id(maybe both in params?)
     * At some point set a set of statements that would just check the polarity for
     * the same vote and change it if need be instead of letting them vote ...
     * maybe disable the vote button visibly on things they've already voted on..
     */
  }


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
  const { title, description, phoneNum, latitude, longitude, address, hours, image } = currentSuggestion;
  return (
    <Container>
      <Grid item size={6}>
        <Card>
          {/* <Typography variant="h3">Featured Foray:</Typography> */}
          {/* <Button variant="filled">Next attraction</Button> */}
          <Button variant="filled" onClick={handleAddToActivities}>add to activities!</Button>
          {wishMode
            ?
            <Button onClick={handleRemoveFromWishlist}>Remove from wishlist</Button>
            :
            <Button onClick={addToWishlist} variant="filled">add to wishlist!</Button>
          }
          <ImageList>
            <ImageListItem key="ItemText" cols={4}>
              <ListItemText >
                <Typography variant="h2">
                  {title}
                </Typography>
              </ListItemText>
              <img width="50" height="50" src="https://static.vecteezy.com/system/resources/previews/002/187/723/original/coming-soon-neon-signs-style-text-free-vector.jpg"></img>
              <Typography>{description}</Typography>
              <Typography><b>Contact number:</b> {phoneNum}</Typography>
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
              <Button onClick={() => handleVoteClick('up')}><ThumbUpAltRoundedIcon /></Button>
              <Button onClick={() => handleVoteClick('down')}><ThumbDownAltRoundedIcon /></Button>
                </Grid>
              ) : (null)}






              <Accordion
                expanded={expanded}
                onChange={handleExpansion}
                slots={{ transition: Fade as AccordionSlots['transition'] }}
              //     sx={[
              //       expanded
              //  ? {
              //         [`& .${AccordionClasses.region}`]: {
              //           height: 'auto',
              //         },
              //         [`& .${accordionDetailsClasses.root}`]: {
              //           display: 'block',
              //         },
              //       }
              //       : {
              //         [`& .${accordionClasses.region}`]: {
              //           height: 0,
              //         },
              //         [`& .${accordionDetailsClasses.root}`]: {
              //           display: 'none',
              //         },
              //       }
              //     ]}
              >
                <Typography></Typography>
              </Accordion>
            </ImageListItem>
          </ImageList>
        </Card>

      </Grid>


    </Container >

  )
}
export default Suggestion;
