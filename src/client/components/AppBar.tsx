import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import NavDrawer from './NavDrawer';
import { useUser } from './UserContext';
import { useBudgetNotifications } from './BudgetBuddy/BudgetNotificationContext';
import newLogo from '../theme/cropedLogo.png';
import MenuItem from '@mui/material/MenuItem';
import { user } from '../../../types/models.ts';
interface MainAppBarProps {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean | null>>;
  user: user;
}

const MainAppBar: React.FC<MainAppBarProps> = ({ setIsAuthenticated, user }) => {
  const { localUser } = useUser();
  const navigate = useNavigate();

  //grab notifications and markAsSeen from context
  const { notifications, markAsSeen } = useBudgetNotifications();

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorElNotifications, setAnchorElNotifications] = useState<null | HTMLElement>(null);
  const [animateBell, setAnimateBell] = useState(false);

  //when new unseen notifications arrive, trigger animation
  useEffect(() => {
    if (notifications.some(n => !n.seen)) {
      setAnimateBell(true);
      const timeout = setTimeout(() => setAnimateBell(false), 2000); //longer motion
      return () => clearTimeout(timeout);
    }
  }, [notifications]);

  const handleOpenUserMenu = (e: React.MouseEvent<HTMLElement>) => setAnchorElUser(e.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleOpenNotifications = (e: React.MouseEvent<HTMLElement>) => setAnchorElNotifications(e.currentTarget);
  const handleCloseNotifications = () => setAnchorElNotifications(null);

  //mark single notification as seen
  const handleMarkAsRead = (id: string) => {
    markAsSeen(id);
  };

  //mark all notifications as seen
  const handleClearAll = () => {
    notifications.forEach(n => { if (!n.seen) markAsSeen(n.id); });
    handleCloseNotifications();
  };

  const goToProfile = () => navigate('/profile', { state: { from: '/', user } });

  //count only unseen notifications
  const unreadCount = notifications.filter(n => !n.seen).length;

  return (
    <AppBar position="static" sx={{ border: '4px solid black', borderRadius: 4, mb: 2 }}>
      <Container maxWidth="xl" sx={{ px: 0 }}>
        <Toolbar disableGutters>
          <NavDrawer />

          <RouterLink to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <Box component="img" src={newLogo} alt="Logo"
              sx={{ height: 40, width: 'auto', mr: 1 }}
            />
            <Typography
              variant="h2"
              noWrap
              sx={{ display: { xs: 'none', md: 'flex' }, letterSpacing: '.3rem', color: 'black' }}
            >
              Let's Geaux
            </Typography>
          </RouterLink>

          <Box sx={{ flexGrow: 1 }} />

          {/* Notification Bell */}
          <IconButton
            size="large"
            aria-label="show notifications"
            color="inherit"
            onClick={handleOpenNotifications}
            sx={{ ml: 2, animation: animateBell ? 'bounce 4s ease' : 'none' }} //longer and higher animation below
          >
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/*define stronger, longer bounce animation */}
          <style>{`
            @keyframes bounce {
              0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
              40% { transform: translateY(-16px); }
              60% { transform: translateY(-8px); }
            }
          `}</style>

          {/* Notifications Menu */}
          <Menu
            id="notification-menu"
            anchorEl={anchorElNotifications}
            open={Boolean(anchorElNotifications)}
            onClose={handleCloseNotifications}
            PaperProps={{ sx: { width: 300, p: 1, border: '4px solid black' } }}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Typography variant="h6" sx={{ px: 2, pt: 1 }}>Notifications</Typography>
            <Divider sx={{ mb: 1 }} />

            {notifications.filter(n => !n.seen).length === 0 ? (
              <MenuItem disabled>No new notifications.</MenuItem>
            ) : (
              notifications.slice(0, 5).map(n => (
                !n.seen && (
                  <MenuItem key={n.id} onClick={() => handleMarkAsRead(n.id)}>
                    <ListItemIcon>
                      <CheckCircleOutlineIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={n.message}
                      secondary={new Date(n.timestamp).toLocaleString()}
                    />
                  </MenuItem>
                )
              ))
            )}

            {notifications.length > 0 && (
              <Box px={2} mt={1}>
                <Button fullWidth variant="outlined" color="error" onClick={handleClearAll}>
                  Clear All
                </Button>
              </Box>
            )}
          </Menu>

          {/* User Avatar */}
          <Tooltip title="Open Preferences">
            <IconButton onClick={goToProfile} sx={{ p: 0, ml: 2 }}>
              <Avatar alt="User Avatar" src={localUser?.profilePic || undefined} />
            </IconButton>
          </Tooltip>

          {/* User Menu */}
          <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {/* future profile settings go here */}
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default MainAppBar;
