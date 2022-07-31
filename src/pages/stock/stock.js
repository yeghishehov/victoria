import { useState } from 'react';
import { collection } from 'firebase/firestore';
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
import StoreIcon from '@mui/icons-material/Store';
import { db } from 'utils/firebase';
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
    type: 'number',
  },
  { name: 'priceSale', label: 'Цена для продажи', defValue: 0, type: 'number' },
  {
    name: 'date',
    label: 'Дата обновления',
    formatData: (value) => format(value.toDate?.(), 'dd.MM.yyyy'),
    defValue: new Date(),
  },
];

export default function Stock() {
  const query = collection(db, 'products');
  const [products, loading, error] = useCollectionData(query);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Box sx={{ height: '90%' }}>
      <Box display='flex' alignItems='center' mb={1}>
        <StoreIcon sx={{ mr: 1 }} color='action' />
        <Typography variant='h5' color='InactiveCaptionText'>
          На складе
        </Typography>
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
