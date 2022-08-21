import { useState, useEffect, memo } from 'react';
import {
  setDoc,
  Timestamp,
  doc,
  getDoc,
  updateDoc,
  increment,
  addDoc,
  collection,
} from 'firebase/firestore';
import { format } from 'date-fns';
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
import { SubTableCellSC } from './styled.stock';
import { db } from 'utils/firebase';

const headerColumns = [
  'Продукт',
  'Количество',
  'Цена приобретения',
  'Цена для продажи',
];

export default memo(function addProducts({ products, toggleOpenAdd }) {
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [data, setData] = useState({});
  const [newData, setNewData] = useState([]);

  useEffect(() => {
    if (!products) {
      return;
    }
    const productData = products.reduce(
      (acc, { name, pricePurchase, priceSale }) => ({
        ...acc,
        [name]: {
          name,
          count: 0,
          pricePurchase,
          priceSale,
        },
      }),
      {}
    );
    setData(productData);
  }, [products]);

  const handleChangeProduct = (e, productName) => {
    setData((state) => ({
      ...state,
      [productName]: {
        ...state[productName],
        [e.target.name]: +e.target.value,
      },
    }));
  };

  const handleSubmit = async () => {
    const allowData = Object.keys(data).some((key) => +data[key].count > 0);
    const allowNewData = newData.some((d) => +d.count > 0);
    if (!allowData && !allowNewData) {
      return;
    }
    try {
      setIsLoading(true);
      const allProductsData = {
        ...data,
        ...newData.reduce(
          (acc, item) => ({
            ...acc,
            [item.name]: {
              name: item.name,
              count: +item.count,
              pricePurchase: +item.pricePurchase ?? 0,
              priceSale: +item.priceSale ?? 0,
            },
          }),
          {}
        ),
      };

      const pathSupply = `supply/${format(date, 'dd.MM.yyyy')}`;
      await Promise.all(
        Object.keys(allProductsData).map(async (key) => {
          if (+allProductsData[key].count > 0) {
            const productPath = `products/${key}`;
            const productDocRef = doc(db, productPath);
            const productDocSnap = await getDoc(productDocRef);
            if (productDocSnap.exists()) {
              updateDoc(productDocRef, {
                ...allProductsData[key],
                count: increment(+allProductsData[key].count),
                date: Timestamp.fromDate(date),
              });
            } else {
              const productDataDoc = {
                ...allProductsData[key],
                count: +allProductsData[key].count,
                date: Timestamp.fromDate(date),
              };
              setDoc(productDocRef, productDataDoc, { merge: true });
            }
            setDoc(
              doc(db, pathSupply),
              { date: Timestamp.fromDate(date) },
              { merge: true }
            );
            addDoc(collection(db, `${pathSupply}/products`), {
              ...allProductsData[key],
              count: +allProductsData[key].count,
              date: Timestamp.fromDate(date),
            });
          }
        })
      );
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
    toggleOpenAdd();
  };

  const handleAddRow = () => {
    setNewData((state) => [
      ...state,
      { name: '', count: 0, pricePurchase: 0, priceSale: 0 },
    ]);
  };

  const handleChangeNewData = (e, index) => {
    const stateCopy = JSON.parse(JSON.stringify(newData));
    stateCopy[index] = { ...stateCopy[index], [e.target.name]: e.target.value };
    setNewData(stateCopy);
  };

  return (
    <Box
      component='div'
      sx={{
        p: 1,
        mt: 2,
        m: 1,
        boxShadow:
          'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px',
        borderRadius: 2,
      }}
    >
      <Typography variant='h6' color='#404040' mr={2}>
        Новый продукт
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 1 }}>
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
      <TableContainer sx={{ maxHeight: '90%' }}>
        <Table stickyHeader>
          <caption>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <AddCircleOutlineIcon
                color='secondary'
                onClick={handleAddRow}
                sx={{ cursor: 'pointer', position: 'sticky', left: 16 }}
              />
            </Box>
          </caption>
          <TableHead>
            <TableRow>
              {headerColumns.map((column, index) => (
                <SubTableCellSC key={index} align='left'>
                  {column}
                </SubTableCellSC>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {products?.map((product) => {
              return (
                <TableRow
                  hover
                  role='checkbox'
                  tabIndex={-1}
                  key={product.name}
                >
                  <SubTableCellSC align='left'>{product.name}</SubTableCellSC>
                  <SubTableCellSC align='left'>
                    {data[product.name] ? (
                      <TextField
                        value={data[product.name].count}
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
                    {data[product.name] ? (
                      <TextField
                        value={data[product.name].pricePurchase}
                        name='pricePurchase'
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
                  <SubTableCellSC align='left'>
                    {data[product.name] ? (
                      <TextField
                        value={data[product.name].priceSale}
                        name='priceSale'
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
                </TableRow>
              );
            })}
            {newData.map((item, index) => (
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
                    value={item.pricePurchase}
                    type='number'
                    name='pricePurchase'
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
                <SubTableCellSC align='left'>
                  <TextField
                    value={item.priceSale}
                    type='number'
                    name='priceSale'
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          onClick={handleSubmit}
          color='secondary'
          disabled={isLoading}
          variant='contained'
          sx={{ m: 1, textTransform: 'capitalize' }}
        >
          Добавить продукт
        </Button>
      </Box>
    </Box>
  );
});
