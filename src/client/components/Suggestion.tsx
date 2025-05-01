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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  // Avatar,
  ImageList,
  ImageListItem,
  ListItemText,
} from '@mui/material';
import { PiShootingStarFill } from "react-icons/pi";
import { PiStarHalfThin } from "react-icons/pi";
import { PiThumbsDownFill } from "react-icons/pi";
import { PiThumbsUpFill } from "react-icons/pi";
import { user } from '../../../types/models.ts';
import SuggestionToActivityForm from './SuggestionToActivityForm.tsx';
import { SnackBarProvider, VariantType, useSnackbar } from 'notistack';

interface SuggestionProps {
  user: user;
  getAllSuggestions: Function;
  setSuggestionEditMode: Function;
  getAllWishlistSuggestions: Function;
  setSuggestionSet: Function;
  wishMode: Boolean;
  isDb: Boolean;
  currentSuggestion: {
    fsq_id: string
    id: Number
    title: string
    upVotes: Number
    downVotes: Number
    timeAvailable: string
    // cost: Number
    location: string
    address: string
    description: string
    image: string
    link: string
    userId: Number
    latitude: string
    longitude: string

  }

}


const Suggestion: React.FC<SuggestionProps> = ({
  user,
  currentSuggestion,
  getAllSuggestions,
  wishMode,
  isDb,
  getAllWishlistSuggestions,
}) => {
  const [expanded, toggleExpanded] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [open, setOpen] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const displaySuccessSnack = (variant: VariantType) => {
    enqueueSnackbar('Activity added successfully!', { variant })
  }

  const handleOpenClick = () => {
    setOpen(true);
  }

  const handleCloseClick = () => {
    setOpen(false);
  }



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
    setOpen(true);

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


  const { title, description, link, upVotes, downVotes, latitude, longitude, address, image } = currentSuggestion;
  return (
    <Container>
      <Grid item size={6}>
        {/* <Card> */}
        {/* <Typography variant="h3">Featured Foray:</Typography> */}
        {/* <Button variant="filled">Next attraction</Button> */}
        <Button
          variant="filled"
          onClick={handleOpenClick}
          sx={{ marginRight: "4px" }}
        >add to activities!</Button>
        {wishMode
          ?
          <Button title="remove from wishlist" sx={{ borderWidth: 4, color: "black" }} onClick={handleRemoveFromWishlist}> <PiStarHalfThin /> </Button>
          :
          <Button title="add to wishlist" sx={{ borderWidth: 4, color: "black" }} onClick={addToWishlist} variant="filled"> <PiShootingStarFill /> </Button>
        }
        <ImageList>
          <ImageListItem key="ItemText" cols={4}>
            <ListItemText >
              <Typography variant="h2">
                {title}
              </Typography>
            </ListItemText>
            {image ? (
              <img style={{ width: "100px", marginTop: "10px" }} src={`${image}`}></img>

            ) : (
              <img style={{ width: "100px", marginTop: "10px" }} src="https://static.vecteezy.com/system/resources/previews/002/187/723/original/coming-soon-neon-signs-style-text-free-vector.jpg"></img>
              // set typography to "body"
            )}
            <Typography>{description}</Typography>
            <Typography><b>Contact website:</b> {link}</Typography>
            <Typography><b>address:</b> {address}</Typography>
            {/* {hours
              ? (
                <Box>
                  <Typography><b>Hours of operation:</b></Typography>
                </Box>

              ) : (
                <Typography><em>Operation hours unavailable</em></Typography>
              )} */}
            {isDb ? (
              <Grid>
                <Typography>Vote on this suggestion</Typography>
                <Typography> {upVotes}</Typography>
                <Button title="vote suggestion up" sx={{ borderWidth: 4, color: "black" }} onClick={() => handleVoteClick('up')}><PiThumbsUpFill /></Button>
                <Typography> {downVotes}</Typography>
                <Button title="vote suggestion down" sx={{ borderWidth: 4, color: "black" }} onClick={() => handleVoteClick('down')}><PiThumbsDownFill /></Button>
              </Grid>
            ) : (null)}
          </ImageListItem>
        </ImageList>
        {/* </Card> */}

      </Grid>
      {open ? (
        <Dialog
        open={open}
        onClose={handleCloseClick}
        >
          <DialogTitle>
            <Typography>
              Make an Activity
              </Typography>
              </DialogTitle>
              <DialogContent sx={{ width: "100%" }}>
              <DialogContentText>
                Add to suggestion information and add it to an itinerary
              </DialogContentText>
          <SuggestionToActivityForm
          currentSuggestion={currentSuggestion}
          user={user}
          handleCloseClick={handleCloseClick}
          displaySuccessSnack={displaySuccessSnack}
          />
          </DialogContent>
        </Dialog>

      ) : (
        null
      )}
    </Container >

  )
}
export default Suggestion;
