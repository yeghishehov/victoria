import { useState } from 'react';
import { doc, setDoc, Timestamp, collection } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import { db } from 'utils/firebase';
import { TableCellSC } from './styled.stock';

const columns = [
  {
    key: 'date',
    label: 'Дата',
    formatData: (value) => value.toDate?.()?.toLocaleDateString(),
  },
  { key: 'name', label: 'Название' },
  { key: 'count', label: 'Количество' },
  { key: 'price', label: 'Цена' },
];

export default function Stock() {
  const query = collection(db, 'products');
  const [products, loading, error] = useCollectionData(query);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [addData, setAddData] = useState({
    date: new Date(),
    name: '',
    count: 0,
    price: 0,
  });

  console.log(products, loading, error);

  const toggleOpenAddDialog = () => {
    setOpenAddDialog((state) => !state);
  };

  const handleChangeAddData = (event) => {
    const { name, value } = event.target;
    setAddData((state) => ({ ...state, [name]: value }));
  };

  const handleSubmit = async () => {
    const docRef = doc(db, 'products', addData.name);
    const docData = { ...addData, date: Timestamp.fromDate(addData.date) };
    const docOption = { merge: true };
    await setDoc(docRef, docData, docOption);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  return (
    <Box sx={{ height: '90%' }}>
      <Box display='flex' alignItems='center' justifyContent='space-between'>
        <Typography variant='h5' color='InactiveCaptionText' mb={1}>
          На складе
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
        <TableContainer sx={{ maxHeight: '90%' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCellSC key={column.key} align='left'>
                    {column.label}
                  </TableCellSC>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {products
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((product) => {
                  return (
                    <TableRow
                      hover
                      role='checkbox'
                      tabIndex={-1}
                      key={product.name}
                    >
                      {columns.map((column) => (
                        <TableCellSC key={column.key} align='left'>
                          {column.formatData
                            ? column.formatData(product[column.key])
                            : product[column.key]}
                        </TableCellSC>
                      ))}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
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
      </Box>
      <Dialog onClose={toggleOpenAddDialog} open={openAddDialog}>
        <DialogTitle>Добавить в склад</DialogTitle>
        <TextField
          label='Имя'
          value={addData.name}
          name='name'
          onChange={handleChangeAddData}
          sx={{ mb: 2 }}
        />
        <TextField
          label='Количество'
          value={addData.count}
          name='count'
          type='number'
          onChange={handleChangeAddData}
          sx={{ mb: 2 }}
        />
        <TextField
          label='Цена'
          value={addData.price}
          name='price'
          type='number'
          onChange={handleChangeAddData}
          sx={{ mb: 2 }}
        />
        <Button onClick={handleSubmit}>Добавить</Button>
      </Dialog>
    </Box>
  );
}
