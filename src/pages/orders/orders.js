import { useState, useRef } from 'react';
import {
  collection,
  query,
  orderBy,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  increment,
  setDoc,
  addDoc,
} from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { format } from 'date-fns';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DoneIcon from '@mui/icons-material/Done';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { db } from 'utils/firebase';
import AddOrdersDialog from './addOrdersDialog';
import { TableCellSC } from './styled.orders';

const columns = [
  {
    name: 'name',
    label: 'Название',
    type: 'text',
    getColumnDefValue: () => '',
  },
  {
    name: 'count',
    label: 'Количество',
    type: 'number',
    getColumnDefValue: () => 1,
  },
  {
    name: 'price',
    label: 'Цена',
    type: 'number',
    getColumnDefValue: () => 0,
  },
  {
    name: 'customer',
    label: 'Заказчик',
    getColumnDefValue: () => '',
  },
  {
    name: 'date',
    label: 'Дата заказа',
    getColumnDefValue: () => new Date(),
    formatData: (value) => format(value.toDate?.(), 'dd.MM.yyyy'),
  },
];

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
  const queryProducts = collection(db, 'orders').withConverter(orderConverter);
  const queryOrderedProducts = query(queryProducts, orderBy('date'));
  const [orders, loading, error] = useCollectionData(queryOrderedProducts);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openDeleteDialod, setOpenDeleteDialod] = useState(false);
  const [openDoneDialod, setOpenDoneDialog] = useState(false);
  const doneItem = useRef(null);
  const deleteId = useRef(null);

  const toggleOpenDeleteDialod = (orderId) => {
    deleteId.current = orderId;
    setOpenDeleteDialod((state) => !state);
  };

  const toggleOpenDoneDialod = (order) => {
    doneItem.current = order;
    setOpenDoneDialog((state) => !state);
  };

  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };

  const toggleOpenAddDialog = () => {
    setOpenAddDialog((state) => !state);
  };

  const handleDelete = async () => {
    try {
      const orderDoc = doc(db, `orders/${deleteId.current}`);
      await deleteDoc(orderDoc);
    } catch (error) {
      console.log(error);
    }
    toggleOpenDeleteDialod(null);
  };

  const handleDone = async () => {
    console.log('----', doneItem);
    try {
      const orderDoc = doc(db, `orders/${doneItem.current.id}`);
      await deleteDoc(orderDoc);

      const docRefProduct = doc(db, `products/${doneItem.current.name}`);
      const docSnapProduct = await getDoc(docRefProduct);
      if (docSnapProduct.exists()) {
        await updateDoc(docRefProduct, {
          count: increment(-doneItem.current.count),
        });
      }

      const pathSales = `sales/${format(
        doneItem.current.date.toDate(),
        'dd.MM.yyyy'
      )}`;
      const docSales = { date: doneItem.current.date };
      const docSalesProduct = {
        ...doneItem.current,
        count: +doneItem.current.count,
      };
      await setDoc(doc(db, pathSales), docSales, { merge: true });
      await addDoc(collection(db, `${pathSales}/products`), docSalesProduct);
    } catch (error) {
      console.log(error);
    }
    toggleOpenDoneDialod(null);
  };

  return (
    <Box sx={{ height: '90%' }}>
      <Box display='flex' alignItems='center' mb={1}>
        <ShoppingCartCheckoutIcon sx={{ mr: 1 }} color='action' />
        <Typography variant='h5' color='InactiveCaptionText'>
          Заказы
        </Typography>
        <Button
          color='secondary'
          endIcon={<AddCircleOutlineIcon />}
          sx={{ textTransform: 'capitalize' }}
          onClick={toggleOpenAddDialog}
        >
          Добавить
        </Button>
      </Box>
      <Box sx={{ width: '100%', height: '93%', overflow: 'hidden' }}>
        {loading ? (
          <div>Загрузка...</div>
        ) : error ? (
          <div>Ошибка: перезагрузите страницу</div>
        ) : (
          <>
            <TableContainer sx={{ maxHeight: '90%' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCellSC key={column.name} align='left'>
                        {column.label}
                      </TableCellSC>
                    ))}
                    <TableCellSC />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders
                    ?.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                    .map((order) => {
                      return (
                        <TableRow
                          hover
                          role='checkbox'
                          tabIndex={-1}
                          key={order.id}
                        >
                          {columns.map((column) => (
                            <TableCellSC key={column.name} align='left'>
                              {column.formatData
                                ? column.formatData(order[column.name])
                                : order[column.name]}
                            </TableCellSC>
                          ))}
                          <TableCellSC>
                            <IconButton
                              color='success'
                              onClick={() => toggleOpenDoneDialod(order)}
                              sx={{ mr: 1 }}
                            >
                              <DoneIcon fontSize='small' />
                            </IconButton>
                            <IconButton
                              color='error'
                              onClick={() => toggleOpenDeleteDialod(order.id)}
                            >
                              <DeleteForeverIcon fontSize='small' />
                            </IconButton>
                          </TableCellSC>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            {orders?.length > 10 && (
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component='div'
                count={orders?.length ?? 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage='Строк'
              />
            )}
          </>
        )}
      </Box>
      <AddOrdersDialog
        inputs={columns}
        open={openAddDialog}
        onClose={toggleOpenAddDialog}
      />
      <Dialog
        open={openDeleteDialod}
        onClose={() => toggleOpenDeleteDialod(null)}
      >
        <DialogTitle align='center'>Вы уверены?</DialogTitle>
        <DialogActions>
          <Button onClick={() => toggleOpenDeleteDialod(null)} color='inherit'>
            Отмена
          </Button>
          <Button onClick={handleDelete} color='error'>
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
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
