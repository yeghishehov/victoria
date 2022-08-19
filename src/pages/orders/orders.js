import { useState, Fragment, useRef } from 'react';
import {
  collection,
  query,
  orderBy,
  doc,
  deleteDoc,
  getDocs,
  getDoc,
  increment,
  updateDoc,
  setDoc,
} from 'firebase/firestore';
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
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import DoneIcon from '@mui/icons-material/Done';
import IconButton from '@mui/material/IconButton';
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
  const [openDoneDialod, setOpenDoneDialog] = useState(false);
  const doneItem = useRef(null);

  const toggleOpenDoneDialod = (order) => {
    doneItem.current = order;
    setOpenDoneDialog((state) => !state);
  };

  const handleDone = async () => {
    try {
      const { id, client, date, totalAmount } = doneItem.current;

      // get order products
      const queryOrderProducts = query(collection(db, `orders/${id}/products`));
      const orderProductsSnap = await getDocs(queryOrderProducts);
      let orderProducts = [];
      orderProductsSnap.forEach((orderProductDoc) => {
        orderProducts.push(orderProductDoc.data());
      });

      // delete current order
      const orderDoc = doc(db, `orders/${doneItem.current.id}`);
      await deleteDoc(orderDoc);

      // create sales new collection
      const salesRef = doc(collection(db, 'sales'));
      await setDoc(salesRef, { client, date, totalAmount });

      await Promise.all(
        orderProducts.map(async (orderProduct) => {
          // incrementing stock products
          const productDocRef = doc(db, `products/${orderProduct.name}`);
          const productDocSnap = await getDoc(productDocRef);
          if (productDocSnap.exists()) {
            await updateDoc(productDocRef, {
              count: increment(-orderProduct.count),
            });
          }
          // add new sales products
          await setDoc(
            doc(salesRef, 'products', orderProduct.name),
            orderProduct
          );
        })
      );
    } catch (error) {
      console.log(error);
    }
    toggleOpenDoneDialod(null);
  };

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
                      <Fragment key={order.id}>
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
                          <TableCellSC>
                            <IconButton
                              color='success'
                              onClick={() => toggleOpenDoneDialod(order)}
                              sx={{ mr: 1 }}
                            >
                              <DoneIcon fontSize='small' />
                            </IconButton>{' '}
                          </TableCellSC>
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
      <Dialog open={openDoneDialod} onClose={() => toggleOpenDoneDialod(null)}>
        <DialogTitle align='center'>Вы уверены?</DialogTitle>
        <DialogActions>
          <Button onClick={() => toggleOpenDoneDialod(null)} color='inherit'>
            Отмена
          </Button>
          <Button onClick={handleDone} color='success'>
            Завершить заказ
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
