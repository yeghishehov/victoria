import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useMediaQuery from '@mui/material/useMediaQuery';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import StoreIcon from '@mui/icons-material/Store';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';

import { useAuthContext } from 'hooks/auth/auth.provider';
import { changePage } from 'store/modules/app';

const drawerWidth = 220;
const navItems = [
  { page: 'stock', name: 'На складе', icon: <StoreIcon /> },
  { page: 'supply', name: 'Поставки', icon: <LocalShippingIcon /> },
  { page: 'sales', name: 'Продажи', icon: <PriceCheckIcon /> },
  { page: 'orders', name: 'Заказы', icon: <ShoppingCartCheckoutIcon /> },
  { page: 'notes', name: 'Заметки', icon: <MenuBookIcon /> },
];

function DrawerAppBar() {
  const isMobile = useMediaQuery('(max-width:900px)');
  const dispatch = useDispatch();
  const { selectedPage } = useSelector((store) => store.app);
  const { logout } = useAuthContext();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleChangePage = (e, page) => {
    dispatch(changePage(page));
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        component='nav'
        sx={{
          background: '#fff',
          boxShadow: 'none',
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color='inherit'
              aria-label='open drawer'
              edge='start'
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon sx={{ color: '#1b3a57' }} />
            </IconButton>
          )}
          {!isMobile && (
            <Box
              sx={{
                display: {
                  sm: 'none',
                  xs: 'none',
                  md: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                },
              }}
            >
              <Tabs
                value={selectedPage}
                onChange={handleChangePage}
                textColor='secondary'
                indicatorColor='secondary'
              >
                {navItems.map((item) => (
                  <Tab
                    key={item.page}
                    value={item.page}
                    label={item.name}
                    icon={item.icon}
                    iconPosition='start'
                  />
                ))}
              </Tabs>
              <Button onClick={() => logout()} startIcon={<LogoutIcon />}>
                Выход
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Box component='nav'>
        {isMobile && (
          <Drawer
            variant='temporary'
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { sm: 'block', md: 'none' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
              },
            }}
          >
            <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
              <Tabs
                value={selectedPage}
                onChange={handleChangePage}
                textColor='secondary'
                indicatorColor='secondary'
                orientation='vertical'
              >
                {navItems.map((item) => (
                  <Tab
                    key={item.page}
                    value={item.page}
                    label={item.name}
                    icon={item.icon}
                    iconPosition='start'
                  />
                ))}
              </Tabs>
              <Button
                sx={{
                  position: 'absolute',
                  bottom: 30,
                  transform: 'translateX(-50%)',
                  width: '90%',
                }}
                onClick={() => logout()}
                startIcon={<LogoutIcon />}
              >
                Выход
              </Button>
            </Box>
          </Drawer>
        )}
      </Box>
    </Box>
  );
}

export default DrawerAppBar;
