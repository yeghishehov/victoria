import { useState, useEffect, useRef, useMemo, memo } from 'react';
import {
  collection,
  query,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import IconButton from '@mui/material/IconButton';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { db } from 'utils/firebase';
import { SubTableCellSC } from './styled.orders';

const productConverter = {
  toFirestore(product) {
    return product;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      ...data,
      id: snapshot.id,
    };
  },
};

const deleteDocument = async (path) => {
  try {
    const document = doc(db, path);
    await deleteDoc(document);
  } catch (error) {
    console.log(error);
  }
};

const updateDocument = async (path, fildes) => {
  try {
    const document = doc(db, path);
    await updateDoc(document, { ...fildes });
  } catch (error) {
    console.log(error);
  }
};

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
    formatData: (value) => `${value} руб`,
  },
];

export default memo(function TableProductItem({ id }) {
  const queryProducts = collection(db, `orders/${id}/products`).withConverter(
    productConverter
  );
  const queryOrderedProducts = query(queryProducts, orderBy('name'));
  const [products, loading, error] = useCollectionData(queryOrderedProducts);
  const [openDeleteDialod, setOpenDeleteDialod] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [count, setCount] = useState(0);
  const [price, setPrice] = useState(0);
  const deleteId = useRef(null);
  const editId = useRef(null);
  const isMounted = useRef(false);

  const totalAmount = useMemo(
    () =>
      products?.reduce((acc, item) => acc + +item.count * +item.price, 0) ?? 0,
    [products]
  );

  const toggleOpenDeleteDialod = (productId) => {
    deleteId.current = productId;
    setOpenDeleteDialod((state) => !state);
  };

  const toggleEdit = (productId) => {
    editId.current = productId;
    const product = productId && products.find(({ id }) => id === productId);
    setCount(product?.count ?? 0);
    setPrice(product?.price ?? 0);
    setIsEdit((state) => !state);
  };

  const handleDelete = () => {
    if (products.length < 2) {
      deleteDocument(`orders/${id}`);
    }
    deleteDocument(`orders/${id}/products/${deleteId.current}`);
    toggleOpenDeleteDialod(null);
  };

  const handleEdit = () => {
    updateDocument(`orders/${id}/products/${editId.current}`, { count, price });
    toggleEdit(null);
  };

  useEffect(() => {
    if (isMounted) {
      updateDocument(`orders/${id}`, { totalAmount });
    } else {
      isMounted.current = true;
    }
  }, [totalAmount]);

  return (
    <Box
      sx={{
        width: '100%',
        background: '#fff',
      }}
    >
      {loading ? (
        <Box sx={{ background: '#4917c31c' }}>Загрузка...</Box>
      ) : error ? (
        <Box sx={{ background: '#4917c31c' }}>
          Ошибка: перезагрузите страницу
        </Box>
      ) : (
        <>
          <TableContainer>
            <Table stickyHeader size='small'>
              <caption>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <AddCircleOutlineIcon
                    color='secondary'
                    // onClick={handleAddRow}
                    sx={{ cursor: 'pointer', position: 'sticky', left: 16 }}
                  />
                  <Box
                    sx={{ position: 'sticky', right: 16, color: '#000000de' }}
                  >
                    <b>Итого сумма: {totalAmount} руб</b>
                  </Box>
                </Box>
              </caption>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <SubTableCellSC key={column.name} align='left'>
                      {column.label}
                    </SubTableCellSC>
                  ))}
                  <SubTableCellSC align='right'>Сумма</SubTableCellSC>
                  <SubTableCellSC />
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => {
                  return (
                    <TableRow
                      hover
                      role='checkbox'
                      tabIndex={-1}
                      key={product.id}
                    >
                      <SubTableCellSC align='left'>
                        {product.name}
                      </SubTableCellSC>
                      <SubTableCellSC align='left'>
                        {isEdit && editId.current === product.id ? (
                          <TextField
                            value={count}
                            type='number'
                            onChange={(e) => setCount(e.target.value)}
                            onFocus={(e) => e.target.select()}
                            variant='outlined'
                            color='secondary'
                            size='small'
                            sx={{ minWidth: 100 }}
                          />
                        ) : (
                          product.count
                        )}
                      </SubTableCellSC>
                      <SubTableCellSC align='left'>
                        {isEdit && editId.current === product.id ? (
                          <TextField
                            value={price}
                            type='number'
                            onChange={(e) => setPrice(e.target.value)}
                            onFocus={(e) => e.target.select()}
                            variant='outlined'
                            color='secondary'
                            size='small'
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position='end'>
                                  ₽
                                </InputAdornment>
                              ),
                            }}
                            sx={{ minWidth: 100 }}
                          />
                        ) : (
                          product.price + ' руб'
                        )}
                      </SubTableCellSC>
                      <SubTableCellSC align='right'>
                        {+product.count * +product.price} руб
                      </SubTableCellSC>
                      <SubTableCellSC align='right'>
                        {isEdit && editId.current === product.id ? (
                          <IconButton
                            color='success'
                            sx={{ mr: 6 }}
                            onClick={handleEdit}
                          >
                            <DoneIcon fontSize='small' />
                          </IconButton>
                        ) : (
                          <>
                            <IconButton
                              color='secondary'
                              sx={{ mr: 1 }}
                              onClick={() => toggleEdit(product.id)}
                            >
                              <EditIcon fontSize='small' />
                            </IconButton>
                            <IconButton
                              color='error'
                              onClick={() => toggleOpenDeleteDialod(product.id)}
                            >
                              <DeleteForeverIcon fontSize='small' />
                            </IconButton>
                          </>
                        )}
                      </SubTableCellSC>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
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
    </Box>
  );
});
