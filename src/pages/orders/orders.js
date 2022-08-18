import { useState, Fragment } from 'react';
import { collection, query, orderBy } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { format } from 'date-fns';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Collapse from '@mui/material/Collapse';
import { db } from 'utils/firebase';
import TtablePoductItem from './tableProductItem';
import AddOrder from './addOrder';
import { TableCellSC } from './styled.orders';

const orderConverter = {
  toFirestore(order) {
    return order;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      ...data,
      id: snapshot.id,
    };
  },
};

export default function Orders() {
  const queryOrders = collection(db, 'orders').withConverter(orderConverter);
  const queryOrderedOrders = query(queryOrders, orderBy('date'));
  const [orders, loading, error] = useCollectionData(queryOrderedOrders);
  const [openRowId, setOpenRowId] = useState(null);

  return (
    <Box>
      <Box display='flex' alignItems='center' mb={1}>
        <ShoppingCartCheckoutIcon sx={{ mr: 1 }} color='action' />
        <Typography variant='h5' color='InactiveCaptionText' mr={2}>
          Заказы
        </Typography>
      </Box>
      <Box sx={{ width: '100%', pb: 40 }}>
        <Box component='div' mb={5}>
          <AddOrder ordersId={orders?.map(({ id }) => id)} />
        </Box>
        {loading ? (
          <div>Загрузка...</div>
        ) : error ? (
          <div>Ошибка: перезагрузите страницу</div>
        ) : orders?.length === 0 ? (
          <div>Заказы отсутствуют</div>
        ) : (
          <Box
            component='div'
            sx={{
              p: 1,
              pb: 5,
              borderRadius: 2,
              boxShadow:
                'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px',
            }}
          >
            <Typography variant='h6' color='#404040' mr={2} mb={2}>
              Все заказы
            </Typography>
            <TableContainer>
              <Table>
                <TableBody>
                  {orders.map((order, index) => {
                    return (
                      <Fragment key={order.date}>
                        <TableRow
                          hover
                          role='checkbox'
                          tabIndex={-1}
                          sx={{
                            '& > *': { borderBottom: 'unset' },
                            cursor: 'pointer',
                            background:
                              openRowId === index ? '#4917c31c' : 'transpatenr',
                          }}
                          onClick={() =>
                            setOpenRowId((state) =>
                              state === index ? '' : index
                            )
                          }
                        >
                          <TableCellSC sx={{ width: 300 }}>
                            <Box
                              component='span'
                              sx={{ display: 'flex', alignItems: 'center' }}
                            >
                              {openRowId === index ? (
                                <KeyboardArrowUpIcon fontSize='small' />
                              ) : (
                                <KeyboardArrowDownIcon fontSize='small' />
                              )}
                              <Box component='span' sx={{ mr: 2 }} />
                              {order.client}
                              <Box component='span' sx={{ mr: 4 }} />
                            </Box>
                          </TableCellSC>
                          <TableCellSC>
                            {format(order.date.toDate?.(), 'dd.MM.yyyy')}
                          </TableCellSC>
                          <TableCellSC>{order.totalAmount} руб</TableCellSC>
                        </TableRow>
                        <TableRow
                          role='checkbox'
                          tabIndex={-1}
                          sx={{
                            background:
                              openRowId === index ? '#4917c31c' : 'transpatenr',
                          }}
                        >
                          <TableCellSC
                            style={{ paddingBottom: 0, paddingTop: 0 }}
                            colSpan={6}
                          >
                            <Collapse
                              in={openRowId === index}
                              timeout='auto'
                              unmountOnExit
                            >
                              <Box sx={{ mb: 1 }}>
                                <TtablePoductItem id={order.id} />
                              </Box>
                            </Collapse>
                          </TableCellSC>
                        </TableRow>
                      </Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Box>
    </Box>
  );
}
