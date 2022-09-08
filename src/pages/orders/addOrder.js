import { useState, useEffect, useMemo, memo } from 'react';
import {
  setDoc,
  Timestamp,
  collection,
  doc,
  orderBy,
  query,
  // getDoc,
  getDocs,
} from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ruLocale from 'date-fns/locale/ru';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import InputAdornment from '@mui/material/InputAdornment';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { SubTableCellSC } from './styled.orders';
import { db } from 'utils/firebase';

const headerColumns = ['Продукт', 'На складе', 'Количество', 'Цена', 'Сумма'];

export default memo(function addOrder({ ordersId }) {
  const queryProducts = collection(db, 'products');
  const queryOrdered = query(queryProducts, orderBy('name'));
  const [products, isLoadingProducts] = useCollectionData(queryOrdered);
  const [isLoading, setIsLoading] = useState(false);
  const [client, setClient] = useState('');
  const [date, setDate] = useState(new Date());
  const [productsData, setProductsData] = useState({});
  const [newProductsData, setNewProductsData] = useState([]);
  const [productsStock, setProductsStock] = useState([]);
  const [isLoadingStock, setIsLoadingStock] = useState(false);

  const totalAmount = useMemo(() => {
    const total = Object.keys(productsData).reduce(
      (acc, key) => +productsData[key].count * +productsData[key].price + acc,
      0
    );
    const totalNew = newProductsData.reduce(
      (acc, product) => +product.count * +product.price + acc,
      0
    );
    return total + totalNew;
  }, [productsData, newProductsData]);

  useEffect(() => {
    if (!ordersId || !products) {
      return;
    }
    setIsLoadingStock(true);
    const getData = async () => {
      try {
        const orderProducts = await Promise.all(
          ordersId.map(async (id) => {
            const queryOrderProducts = query(
              collection(db, `orders/${id}/products`)
            );
            const orderProductsSnap = await getDocs(queryOrderProducts);
            let orderProductsData = {};
            orderProductsSnap.forEach((orderProductDoc) => {
              const productItem = orderProductDoc.data();
              orderProductsData[productItem.name] = productItem.count;
            });

            return orderProductsData;
          })
        );

        const productsStockData = products.map(({ name, count }) => {
          const orderCount = orderProducts.reduce(
            (acc, item) => acc + +(item[name] ?? 0),
            0
          );
          return { name, count: +count - +orderCount };
        });

        setIsLoadingStock(false);
        setProductsStock(productsStockData);
      } catch (error) {
        setIsLoadingStock(false);
      }
    };
    const timerId = setTimeout(() => getData(), 500);
    return () => clearTimeout(timerId);
  }, [ordersId, products]);

  useEffect(() => {
    if (!products) {
      return;
    }
    const data = products.reduce(
      (acc, { name }) => ({
        ...acc,
        [name]: {
          name,
          count: 0,
          price: 0,
        },
      }),
      {}
    );
    setProductsData(data);
  }, [products]);

  const handleChangeProduct = (e, productName) => {
    setProductsData((state) => ({
      ...state,
      [productName]: {
        ...state[productName],
        [e.target.name]: +e.target.value,
      },
    }));
  };

  const handleSubmit = async () => {
    const allowData = Object.keys(productsData).some(
      (key) => +productsData[key].count > 0
    );
    const allowNewData = newProductsData.some((d) => +d.count > 0);
    if (!allowData && !allowNewData) {
      return;
    }
    try {
      setIsLoading(true);
      const orderRef = doc(collection(db, 'orders'));
      const docData = { client, date: Timestamp.fromDate(date), totalAmount };
      await setDoc(orderRef, docData);

      const allProductsData = {
        ...productsData,
        ...newProductsData.reduce(
          (acc, item) => ({
            ...acc,
            [item.name]: {
              name: item.name,
              count: +item.count,
              price: +item.price,
            },
          }),
          {}
        ),
      };

      await Promise.all(
        Object.keys(allProductsData).map(async (key) => {
          if (+allProductsData[key].count > 0) {
            await setDoc(doc(orderRef, 'products', key), {
              ...allProductsData[key],
            });
          }
        })
      );
    } catch (error) {
      console.log(error);
    }

    const data = products?.reduce(
      (acc, { name }) => ({
        ...acc,
        [name]: {
          name,
          count: 0,
          price: 0,
        },
      }),
      {}
    );
    setProductsData(data ?? {});
    setNewProductsData([]);
    setClient('');
    setDate(new Date());
    setIsLoading(false);
  };

  const handleAddRow = () => {
    setNewProductsData((state) => [...state, { name: '', count: 0, price: 0 }]);
  };

  const handleChangeNewData = (e, index) => {
    const stateCopy = JSON.parse(JSON.stringify(newProductsData));
    stateCopy[index] = { ...stateCopy[index], [e.target.name]: e.target.value };
    setNewProductsData(stateCopy);
  };

  return (
    <Box
      component='div'
      sx={{
        p: 1,
        mt: 3,
        boxShadow:
          'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px',
        borderRadius: 2,
      }}
    >
      <Typography variant='h6' color='#404040' mr={2}>
        Новый заказ
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 1 }}>
        <TextField
          label='Данные клиента'
          value={client}
          onChange={(e) => setClient(e.target.value)}
          onFocus={(e) => e.target.select()}
          variant='standard'
          color='secondary'
          required
          error={!client}
          sx={{ mr: 4, width: 250, minWidth: 150 }}
        />
        <LocalizationProvider
          dateAdapter={AdapterDateFns}
          adapterLocale={ruLocale}
        >
          <Stack spacing={3}>
            <DatePicker
              label='Дата заказа'
              inputFormat='dd.MM.yyyy'
              value={date}
              onChange={(d) => setDate(d)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='standard'
                  color='secondary'
                  sx={{ width: 130, minWidth: 130 }}
                />
              )}
            />
          </Stack>
        </LocalizationProvider>
      </Box>
      {(isLoadingProducts || isLoadingStock) && <div>Загрузка...</div>}
      <TableContainer sx={{ maxHeight: '90%' }}>
        <Table stickyHeader>
          <caption>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <AddCircleOutlineIcon
                color='secondary'
                onClick={handleAddRow}
                sx={{ cursor: 'pointer', position: 'sticky', left: 16 }}
              />
              <Box sx={{ position: 'sticky', right: 16, color: '#000000de' }}>
                <b>Итого сумма: {totalAmount} руб</b>
              </Box>
            </Box>
          </caption>
          <TableHead>
            <TableRow>
              {headerColumns.map((column, index) => (
                <SubTableCellSC
                  key={index}
                  align={index === headerColumns.length - 1 ? 'right' : 'left'}
                >
                  {column}
                </SubTableCellSC>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {productsStock?.map((product) => {
              return (
                <TableRow
                  hover
                  role='checkbox'
                  tabIndex={-1}
                  key={product.name}
                >
                  <SubTableCellSC align='left'>{product.name}</SubTableCellSC>
                  <SubTableCellSC align='left'>{product.count}</SubTableCellSC>
                  <SubTableCellSC align='left'>
                    {productsData[product.name] ? (
                      <TextField
                        value={productsData[product.name].count}
                        name='count'
                        type='number'
                        onChange={(e) => handleChangeProduct(e, product.name)}
                        onFocus={(e) => e.target.select()}
                        variant='outlined'
                        color='secondary'
                        size='small'
                        sx={{ minWidth: 150 }}
                      />
                    ) : null}
                  </SubTableCellSC>
                  <SubTableCellSC align='left'>
                    {productsData[product.name] ? (
                      <TextField
                        value={productsData[product.name].price}
                        name='price'
                        type='number'
                        onChange={(e) => handleChangeProduct(e, product.name)}
                        onFocus={(e) => e.target.select()}
                        variant='outlined'
                        color='secondary'
                        size='small'
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>₽</InputAdornment>
                          ),
                        }}
                        sx={{ minWidth: 150 }}
                      />
                    ) : null}
                  </SubTableCellSC>
                  <SubTableCellSC align='right'>
                    {productsData[product.name]
                      ? (
                          productsData[product.name].count *
                          productsData[product.name].price
                        ).toString()
                      : null}{' '}
                    руб
                  </SubTableCellSC>
                </TableRow>
              );
            })}
            {newProductsData.map((item, index) => (
              <TableRow hover role='checkbox' tabIndex={-1} key={index}>
                <SubTableCellSC align='left'>
                  <TextField
                    value={item.name}
                    name='name'
                    onChange={(e) => handleChangeNewData(e, index)}
                    onFocus={(e) => e.target.select()}
                    variant='outlined'
                    color='secondary'
                    size='small'
                    sx={{ minWidth: 150 }}
                  />
                </SubTableCellSC>
                <SubTableCellSC align='left'>—</SubTableCellSC>
                <SubTableCellSC align='left'>
                  <TextField
                    value={item.count}
                    type='number'
                    name='count'
                    onChange={(e) => handleChangeNewData(e, index)}
                    onFocus={(e) => e.target.select()}
                    variant='outlined'
                    color='secondary'
                    size='small'
                    sx={{ minWidth: 150 }}
                  />
                </SubTableCellSC>
                <SubTableCellSC align='left'>
                  <TextField
                    value={item.price}
                    type='number'
                    name='price'
                    onChange={(e) => handleChangeNewData(e, index)}
                    onFocus={(e) => e.target.select()}
                    variant='outlined'
                    color='secondary'
                    size='small'
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>₽</InputAdornment>
                      ),
                    }}
                    sx={{ minWidth: 150 }}
                  />
                </SubTableCellSC>
                <SubTableCellSC align='right'>
                  {(+item.count * +item.price).toString()} руб
                </SubTableCellSC>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          onClick={handleSubmit}
          color='secondary'
          disabled={isLoading || !client}
          variant='contained'
          sx={{ m: 1, textTransform: 'capitalize' }}
        >
          Оформить заказ
        </Button>
      </Box>
    </Box>
  );
});
