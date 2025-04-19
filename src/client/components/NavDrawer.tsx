import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer,
  Divider
} from '@mui/material';
import { PiListBold } from "react-icons/pi";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { PiArrowSquareRightBold } from "react-icons/pi";
import { PiMapTrifoldBold } from "react-icons/pi";
import { PiLightbulbBold } from "react-icons/pi";
import { PiChatsBold } from "react-icons/pi";
import { PiCalendarPlusBold } from "react-icons/pi";
import PinDropOutlinedIcon from '@mui/icons-material/PinDropOutlined';
import { PiListHeartBold } from "react-icons/pi";
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import { PiReceiptBold } from "react-icons/pi";
import InterestForm from './InterestForm';
import { PiUsersThreeBold } from "react-icons/pi";

const drawerWidth = 240;

type Anchor = 'left';


const NavDrawer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [Auth, setAuth] = useState<boolean>(true)

  const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end'
  }));

  const theme = useTheme();

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleLogout = async () => {
    try {
      await axios.post('/logout')
      setOpen(false);
      setAuth(false);
      navigate('/logout');
    } catch (error) {
      console.error('Error logging out at client', error);
    };
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <IconButton
        color='inherit'
        aria-label='open drawer'
        onClick={handleDrawerOpen}
        edge='start'
        sx={[
          {
            mr: 2
          },
          open && { display: 'none' }
        ]}
      >
        <PiListBold />
      </IconButton>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#fff085'
          }
        }}
        variant='persistent'
        anchor='left'
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {/* suggestions */}
          <ListItem key={'suggestions'} disablePadding>
            <ListItemButton component={Link} to='/suggestions' onClick={handleDrawerClose}>
              <ListItemIcon>
                <PiLightbulbBold size={30} style={{ color: 'black' }} />
              </ListItemIcon>
              <ListItemText primary={'Suggestions'} />
            </ListItemButton>
          </ListItem>
          {/* maps */}
          <ListItem key={'maps'} disablePadding>
            <ListItemButton component={Link} to='/maps' onClick={handleDrawerClose}>
              <ListItemIcon>
                <PiMapTrifoldBold size={30} style={{ color: 'black' }} />
              </ListItemIcon>
              <ListItemText primary={'Maps'} />
            </ListItemButton>
          </ListItem>
          {/* maps */}
          <ListItem key={'community'} disablePadding>
            <ListItemButton component={Link} to='/community' onClick={handleDrawerClose}>
              <ListItemIcon>
                <PiUsersThreeBold size={30} style={{ color: 'black' }} />
              </ListItemIcon>
              <ListItemText primary={'Community'} />
            </ListItemButton>
          </ListItem>
          {/*wishlist */}
          <ListItem key={'wishlist'} disablePadding>
            <ListItemButton component={Link} to='/wishlist' onClick={handleDrawerClose}>
              <ListItemIcon>
                <PiListHeartBold size={30} style={{ color: 'black' }} />
              </ListItemIcon>
              <ListItemText primary={'Wishlist'} />
            </ListItemButton>
          </ListItem>
          {/* <ListItem key={'calendar'} disablePadding>
            <ListItemButton component={Link} to='/calendar' onClick={handleDrawerClose}>
              <ListItemIcon>
                <TravelExploreIcon />
              </ListItemIcon>
              <ListItemText primary={'Calendar'} />
            </ListItemButton>
          </ListItem> */}

          {/* itinerary*/}
          <ListItem key={'itinerary'} disablePadding>
            <ListItemButton component={Link} to='/itinerary' onClick={handleDrawerClose}>
              <ListItemIcon>
                <PiCalendarPlusBold size={30} style={{ color: 'black' }} />
              </ListItemIcon>
              <ListItemText primary={'Itinerary'} />
            </ListItemButton>
          </ListItem>
          {/* chat */}
          <ListItem key={'chat'} disablePadding>
            <ListItemButton component={Link} to='/chatbot' onClick={handleDrawerClose}>
              <ListItemIcon>
                <PiChatsBold size={30} style={{ color: 'black' }} />
              </ListItemIcon>
              <ListItemText primary={`Gata AI Chat`} />
            </ListItemButton>
          </ListItem>
          {/* Budget Buddy */}
          <ListItem key={'BudgetBuddy'} disablePadding>
            <ListItemButton component={Link} to="/budgetbuddy" onClick={handleDrawerClose}>
              <ListItemIcon><PiReceiptBold size={30} style={{ color: 'black' }} /></ListItemIcon>
              <ListItemText primary="Budget Buddy" />
            </ListItemButton>
          </ListItem>
          {/* Route Choices  */}
          {/* <ListItem key={'InterestForm'} disablePadding>
            <ListItemButton component={Link} to="/interestform" onClick={handleDrawerClose}>
              <ListItemIcon><PinDropOutlinedIcon sx={{ color: 'black' }} /></ListItemIcon>
              <ListItemText primary="Interest Form" />
            </ListItemButton>
          </ListItem> */}
          {/* Activites */}
          {/* <ListItem key={'viewform'} disablePadding>
            <ListItemButton component={Link} to='/viewform' onClick={handleDrawerClose}>
              <ListItemIcon>
                <PiArrowSquareRightBold />
              </ListItemIcon>
              <ListItemText primary={'ViewForm'} />
            </ListItemButton>
          </ListItem> */}
          {/* logout */}
          <ListItem key={'logout'} disablePadding>
            <ListItemButton component={Link} to='/logout' onClick={handleLogout}>
              <ListItemIcon>
                <PiArrowSquareRightBold size={30} style={{ color: 'black' }} />
              </ListItemIcon>
              <ListItemText primary={'Logout'} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
};

export default NavDrawer;

