import { useState, memo } from 'react';
import { collection, query, orderBy } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { db } from 'utils/firebase';
import { SubTableCellSC } from './styled.supply';

export default memo(function SupplyProductItem({ date, columns }) {
  const queryProducts = collection(db, `supply/${date}/products`);
  const queryOrderedProducts = query(queryProducts, orderBy('name'));
  const [products, loading, error] = useCollectionData(queryOrderedProducts);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };

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
                        key={product.name + product.date.seconds}
                      >
                        {columns.slice(1).map((column) => (
                          <SubTableCellSC key={column.name} align='left'>
                            {column.formatData
                              ? column.formatData(product[column.name])
                              : product[column.name]}
                          </SubTableCellSC>
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
  );
});
