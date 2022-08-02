import { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
// import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import IconButton from '@mui/material/IconButton';
import { db } from 'utils/firebase';
import { SubTableCellSC } from './styled.sales';

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

export default function TableProductItem({ path, date, columns }) {
  const queryProducts = collection(
    db,
    `${path}/${date}/products`
  ).withConverter(productConverter);
  const queryOrderedProducts = query(queryProducts, orderBy('name'));
  const [products, loading, error] = useCollectionData(queryOrderedProducts);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDeleteDialod, setOpenDeleteDialod] = useState(false);
  const deleteId = useRef(null);

  const toggleOpenDeleteDialod = (productId) => {
    deleteId.current = productId;
    setOpenDeleteDialod((state) => !state);
  };

  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };

  // const handleEdit = () => {};

  const handleDelete = () => {
    deleteDocument(`${path}/${date}/products/${deleteId.current}`);
  };

  useEffect(() => {
    if (products?.length === 0) {
      deleteDocument(`${path}/${date}`);
    }
  }, [products]);

  return (
    <Box
      sx={{
        width: '100%',
        height: '93%',
        overflow: 'hidden',
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
          <TableContainer sx={{ maxHeight: '90%' }}>
            <Table stickyHeader size='small'>
              <TableHead>
                <TableRow>
                  {columns.slice(1).map((column) => (
                    <SubTableCellSC key={column.name} align='left'>
                      {column.label}
                    </SubTableCellSC>
                  ))}
                  <SubTableCellSC />
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
                        key={product.id}
                      >
                        {columns.slice(1).map((column) => (
                          <SubTableCellSC key={column.name} align='left'>
                            {column.formatData
                              ? column.formatData(product[column.name])
                              : product[column.name]}
                          </SubTableCellSC>
                        ))}
                        <SubTableCellSC>
                          {/* <IconButton
                            color='secondary'
                            sx={{ mr: 1 }}
                            onClick={handleEdit}
                          >
                            <EditIcon fontSize='small' />
                          </IconButton> */}
                          <IconButton
                            color='error'
                            onClick={() => toggleOpenDeleteDialod(product.id)}
                          >
                            <DeleteForeverIcon fontSize='small' />
                          </IconButton>
                        </SubTableCellSC>
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
      <Dialog
        open={openDeleteDialod}
        onClose={() => toggleOpenDeleteDialod(null)}
      >
        <DialogTitle>Вы уверены?</DialogTitle>
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
}
