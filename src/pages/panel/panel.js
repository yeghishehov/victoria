import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import DrawerAppBar from 'components/drawerAppBar';
import Stock from 'pages/stock';
import Supply from 'pages/supply';
import Sales from 'pages/sales';
// import {  } from './styled.panel';

const pages = {
  stock: <Stock />,
  supply: <Supply />,
  sales: <Sales />,
  orders: <div>Заказы</div>,
  notes: <div>Заметки</div>,
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
