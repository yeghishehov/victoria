import { useState, Fragment } from 'react';
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
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
// import IconButton from '@mui/material/IconButton';
import AddDialog from 'components/addSupplyDialog';
import { db } from 'utils/firebase';
import SupplyProductItem from './supplyProductItem';
import { TableCellSC } from './styled.supply';

const columns = [
  {
    name: 'date',
    label: 'Дата поступления',
    formatData: (value) => value && format(value.toDate?.(), 'dd.MM.yyyy'),
    defValue: new Date(),
  },
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
];

export default function Supply() {
  const queryDates = collection(db, 'supply');
  const [dates, loading, error] = useCollectionData(queryDates);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openRowId, setOpenRowId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const toggleOpenAddDialog = () => {
    setOpenAddDialog((state) => !state);
  };

  return (
    <Box sx={{ height: '90%' }}>
      <Box display='flex' alignItems='center' justifyContent='start' m={1}>
        <LocalShippingIcon sx={{ mr: 1 }} color='action' />
        <Typography variant='h5' color='InactiveCaptionText' mr={2}>
          Поставки
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
                    <TableCellSC />
                    <TableCellSC align='left'>Дата поступления</TableCellSC>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dates
                    ?.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                    .map((dateItem, index) => {
                      return (
                        <Fragment key={dateItem.date}>
                          <TableRow
                            hover
                            role='checkbox'
                            tabIndex={-1}
                            sx={{
                              '& > *': { borderBottom: 'unset' },
                              cursor: 'pointer',
                              background:
                                openRowId === index
                                  ? '#4917c31c'
                                  : 'transpatenr',
                            }}
                            onClick={() =>
                              setOpenRowId((state) =>
                                state === index ? '' : index
                              )
                            }
                          >
                            <TableCellSC>
                              {openRowId === index ? (
                                <KeyboardArrowUpIcon />
                              ) : (
                                <KeyboardArrowDownIcon />
                              )}
                            </TableCellSC>
                            <TableCellSC align='left'>
                              {format(dateItem.date.toDate?.(), 'dd.MM.yyyy')}
                            </TableCellSC>
                          </TableRow>
                          <TableRow
                            role='checkbox'
                            tabIndex={-1}
                            sx={{
                              background:
                                openRowId === index
                                  ? '#4917c31c'
                                  : 'transpatenr',
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
                                <Box sx={{ margin: 1 }}>
                                  <SupplyProductItem
                                    date={format(
                                      dateItem.date.toDate?.(),
                                      'dd.MM.yyyy'
                                    )}
                                    columns={columns}
                                  />
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
            {dates?.length > 10 && (
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component='div'
                count={dates?.length ?? 0}
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
      <AddDialog
        queryPath={'supply'}
        inputs={columns}
        open={openAddDialog}
        onClose={toggleOpenAddDialog}
      />
    </Box>
  );
}
