import React, { useState } from 'react';
import axios from 'axios';
import { Link as routerLink, useNavigate } from 'react-router-dom'
import {
  Container,
  Box,
  // SpeedDial,
  // SpeedDialAction,
  // SpeedDialIcon,
  Button,
  Card,
  // CardMedia,

  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Link,
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
    hours: string
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
  to: string
  children: React.ReactNode;


}


const Suggestion: React.FC<SuggestionProps> = ({
  user,
  currentSuggestion,
  to,
  children,
  wishMode,
  isDb,
  getAllWishlistSuggestions,
}) => {
  const [expanded, toggleExpanded] = useState(false);
  const [open, setOpen] = useState(false);
  const [navigateUrl, setNavigateUrl] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

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

const handleDialogClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
  event.preventDefault();
  setNavigateUrl(to);
  setDialogOpen(true);
}

const handleLeaveSite = () => {
  window.location.href = navigateUrl
}

  // This is what occurs when the add to wishlist button is pressed. Calling a post request with wish markers to post the Suggestion
  const addToWishlist = () => {
    // gather the needed values and put them into an axios post request in a similar way to activities
    const { address, description, latitude, longitude, link, title, image } = currentSuggestion;

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


  const handleRemoveFromWishlist = () => {
    axios.patch(`/api/wishlist/${currentSuggestion.id}/${user.id}`)
      .then(() => {
        getAllWishlistSuggestions();
      })
      .catch((err) => console.error('sorry, tex', err));
  }

  // when I want to add a link to another page, just import Link, then<Link to="/wherever"> The word to link</Link>
  const { fsq_id, title, description, link, upVotes, downVotes, hours, address, image } = currentSuggestion;
  return (
    <Container sx={{ mb: 4 }}>
      <Grid item size={6}>
        {/* <Card> */}
        {/* <Typography variant="h3">Featured Foray:</Typography> */}
        {/* <Button variant="filled">Next attraction</Button> */}
        <Box display="flex" alignItems="flex-start" gap={1}>

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
        </Box>
        <ImageList>
          <ImageListItem key="ItemText" cols={4}>
            <ListItemText >
              <Typography variant="h2">
                {title}
              </Typography>
            </ListItemText>
            {image ? (
              <img style={{ width: "200px", marginTop: "10px" }} src={`${image}`}></img>

            ) : (
              <img style={{ width: "100px", marginTop: "10px" }} src="https://static.vecteezy.com/system/resources/previews/002/187/723/original/coming-soon-neon-signs-style-text-free-vector.jpg"></img>
              // set typography to "body"
            )}
            <Typography>{description}</Typography>
            <Typography><b>Contact website:</b> <Link color='inherit' href={link} style={{ cursor: 'pointer' }}>
            Go to {title}
            {children}
            </Link>
            </Typography>

            {/* <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
              <DialogTitle>Before you Geaux</DialogTitle>
              <DialogContent>
                <Typography>
                You're leaving the site. Would you like to add this suggestion to your wishlist before you leave?
                </Typography>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button onClick={addToWishlist}>Add to Wishlist and geaux</Button>
                  <Button onClick={handleLeaveSite}>Just geaux</Button>
                </DialogActions>
            </Dialog> */}


            <Typography><b>address:</b> {address}</Typography>
            {hours
              ? (
                <Box>
                  <Typography><b>Hours of operation:</b></Typography>
                  {hours.split(';').map((day, i) => (
                    <Typography key={`${fsq_id}${i}`}>{day}</Typography>
                  ))}
                </Box>

              ) : (
                <Typography><em>Operation hours unavailable</em></Typography>
              )}
            {isDb ? (
              <Grid>
                <Typography>Vote on this suggestion</Typography>
                <Button
                title="vote suggestion up"
                sx={{
                  borderWidth: 4,
                  color: 'black',
                p: '6px',
                marginRight: "4px"
                }}
                onClick={() => handleVoteClick('up')}>
                  {upVotes}<PiThumbsUpFill />
                  </Button>
                <Button
                title="vote suggestion down"sx={{
                  borderWidth: 4,
                  color: 'black',
                  p: '6px',
                  marginRight: "4px"
                  }}
                  onClick={() => handleVoteClick('down')}>
                    {downVotes}<PiThumbsDownFill />
                    </Button>
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
