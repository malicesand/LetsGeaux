import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Box,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Button,
  Card,
  CardMedia,
  Stack,
  Fade,
  Accordion,
  AccordionClasses,
  AccordionSummary,
  Typography,
  AccordionDetails,
  accordionDetailsClasses,
  Dialog,
  Grid,
  Avatar,
  ImageList,
  ImageListItem,
  ListItemText,
} from '@mui/material';
import { AddToQueueRounded, ArrowForwardIos } from '@mui/icons-material'

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
const Suggestion = ({currentSuggestion, getAllSuggestions, setSuggestionEditMode,/* setEditableSuggestion}*/}) => {
  const [expanded, toggleExpanded] = useState(false);


  /* ---------Parts of the currentSuggestion
  title, description, phoneNum, latitude, longitude, address
  */

  /**
   * Activity Suggestion match points
   */

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
          <Button variant="filled">add to activities</Button>
          <ImageList>
            <ImageListItem key="ItemText" cols={4}>
              <ListItemText >
                <Typography variant="h2">
                  {title}
                </Typography>
              </ListItemText>
              <img width="100" height="100" src="https://media-cdn.tripadvisor.com/media/photo-o/0b/92/b7/85/20160608-102742-largejpg.jpg"></img>
              <Typography>{description}</Typography>
              <Typography><b>Contact number:</b> {phoneNum}</Typography>
              <Typography><b>address:</b> {address}</Typography>
              {hours
              ? (
                <Typography><b>Hours of operation:</b></Typography>

              ): (
                <Typography><em>Operation hours unavailable</em></Typography>
              )}
              <Box></Box>
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
