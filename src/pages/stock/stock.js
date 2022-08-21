import { useState, useEffect } from 'react';
import { collection, query, orderBy, doc, deleteDoc } from 'firebase/firestore';
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
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import StoreIcon from '@mui/icons-material/Store';
import Button from '@mui/material/Button';
import { db } from 'utils/firebase';
import AddProducts from './addProducts';
import { TableCellSC } from './styled.stock';

const columns = [
  {
    name: 'name',
    label: 'Название',
    defValue: '',
    type: 'text',
  },
  { name: 'count', label: 'Количество', defValue: 0, type: 'number' },
  {
    name: 'pricePurchase',
    label: 'Цена приобретения',
    defValue: 0,
    formatData: (value) => `${value} руб.`,
    type: 'number',
  },
  {
    name: 'priceSale',
    label: 'Цена для продажи',
    defValue: 0,
    formatData: (value) => `${value} руб.`,
    type: 'number',
  },
  {
    name: 'date',
    label: 'Дата обновления',
    formatData: (value) => format(value.toDate?.(), 'dd.MM.yyyy'),
    defValue: new Date(),
  },
];

const deleteDocument = async (path) => {
  try {
    const document = doc(db, path);
    await deleteDoc(document);
  } catch (error) {
    console.log(error);
  }
};

export default function Stock() {
  const queryProducts = collection(db, 'products');
  const queryOrderedProducts = query(queryProducts, orderBy('name'));
  const [products, loading, error] = useCollectionData(queryOrderedProducts);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openAdd, setOpenAdd] = useState(false);

  const toggleOpenAdd = () => {
    setOpenAdd((state) => !state);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    products?.forEach((product) => {
      if (product.count < 1) {
        deleteDocument(`products/${product.name}`);
      }
    });
  }, [products]);

  return (
    <Box>
      <Box display='flex' alignItems='center' mb={1}>
        <StoreIcon sx={{ mr: 1 }} color='action' />
        <Typography variant='h5' color='InactiveCaptionText'>
          На складе
        </Typography>
        <Button
          color='secondary'
          endIcon={<AddCircleOutlineIcon />}
          sx={{ textTransform: 'capitalize' }}
          onClick={toggleOpenAdd}
        >
          Добавить
        </Button>
      </Box>
      <Box sx={{ width: '100%', pb: 13 }}>
        {openAdd && (
          <Box component='div' mb={5}>
            <AddProducts products={products} toggleOpenAdd={toggleOpenAdd} />
          </Box>
        )}
        {loading ? (
          <div>Загрузка...</div>
        ) : error ? (
          <div>Ошибка: перезагрузите страницу</div>
        ) : products?.length === 0 ? (
          <div>Склад пустой</div>
        ) : (
          <>
            <TableContainer>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCellSC key={column.name} align='left'>
                        {column.label}
                      </TableCellSC>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products
                    ?.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                    .map((product) => {
                      return (
                        <TableRow
                          hover
                          role='checkbox'
                          tabIndex={-1}
                          key={product.name}
                        >
                          {columns.map((column) => (
                            <TableCellSC key={column.name} align='left'>
                              {column.formatData
                                ? column.formatData(product[column.name])
                                : product[column.name]}
                            </TableCellSC>
                          ))}
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            {products?.length > 10 && (
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component='div'
                count={products?.length ?? 0}
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
    </Box>
  );
}
