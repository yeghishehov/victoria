import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import DrawerAppBar from 'components/drawerAppBar';
import Stock from 'pages/stock';
import Supply from 'pages/supply';
import Sales from 'pages/sales';
import Orders from 'pages/orders';
import Notes from 'pages/notes';
// import {  } from './styled.panel';

const pages = {
  orders: <Orders />,
  stock: <Stock />,
  supply: <Supply />,
  sales: <Sales />,
  notes: <Notes />,
};

export default function Panel() {
  const { selectedPage } = useSelector((state) => state.app);

  return (
    <Box
      height='100vh'
      display='flex'
      flexDirection='column'
      boxSizing='border-box'
    >
      <DrawerAppBar />
      <Box
        component='main'
        sx={{ p: 2, boxSizing: 'border-box', height: '100%' }}
      >
        <Toolbar />
        {pages[selectedPage]}
      </Box>
    </Box>
  );
}
