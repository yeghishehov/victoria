import { useState, Fragment } from 'react';
import { collection, query, orderBy } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { format } from 'date-fns';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
// import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
// import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
// import IconButton from '@mui/material/IconButton';
import TtablePoductItem from './tableProductItem';
import { db } from 'utils/firebase';
// import AddSalesDialog from './addSalesDialog';
import { TableCellSC } from './styled.sales';

const salesConverter = {
  toFirestore(sale) {
    return sale;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      ...data,
      id: snapshot.id,
    };
  },
};

export default function Sales() {
  const querySales = collection(db, 'sales').withConverter(salesConverter);
  const queryOrderedSales = query(querySales, orderBy('date', 'desc'));
  const [sales, loading, error] = useCollectionData(queryOrderedSales);
  // const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openRowId, setOpenRowId] = useState(null);

  // const toggleOpenAddDialog = () => {
  //   setOpenAddDialog((state) => !state);
  // };

  return (
    <Box>
      <Box display='flex' alignItems='center' justifyContent='start' mb={1}>
        <AttachMoneyIcon sx={{ mr: 1 }} color='action' />
        <Typography variant='h5' color='InactiveCaptionText' mr={2}>
          Продажи
        </Typography>
        {/* <Button
          color='secondary'
          endIcon={<AddCircleOutlineIcon />}
          sx={{ textTransform: 'capitalize' }}
          onClick={toggleOpenAddDialog}
        >
          Добавить
        </Button> */}
      </Box>
      <Box sx={{ width: '100%' }}>
        {loading ? (
          <div>Загрузка...</div>
        ) : error ? (
          <div>Ошибка: перезагрузите страницу</div>
        ) : sales?.length === 0 ? (
          <div>Продажи отсутствуют</div>
        ) : (
          <Box
            component='div'
            sx={{
              p: 1,
              pb: 5,
              borderRadius: 2,
              boxShadow:
                'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px',
            }}
          >
            <TableContainer>
              <Table>
                <TableBody>
                  {sales.map((sale, index) => {
                    return (
                      <Fragment key={sale.id}>
                        <TableRow
                          hover
                          role='checkbox'
                          tabIndex={-1}
                          sx={{
                            '& > *': { borderBottom: 'unset' },
                            cursor: 'pointer',
                            background:
                              openRowId === index ? '#4917c31c' : 'transpatenr',
                          }}
                          onClick={() =>
                            setOpenRowId((state) =>
                              state === index ? '' : index
                            )
                          }
                        >
                          <TableCellSC sx={{ width: 300 }}>
                            <Box
                              component='span'
                              sx={{ display: 'flex', alignItems: 'center' }}
                            >
                              {openRowId === index ? (
                                <KeyboardArrowUpIcon fontSize='small' />
                              ) : (
                                <KeyboardArrowDownIcon fontSize='small' />
                              )}
                              <Box component='span' sx={{ mr: 2 }} />
                              {sale.client}
                              <Box component='span' sx={{ mr: 4 }} />
                            </Box>
                          </TableCellSC>
                          <TableCellSC>
                            {format(sale.date.toDate?.(), 'dd.MM.yyyy')}
                          </TableCellSC>
                          <TableCellSC>{sale.totalAmount} руб</TableCellSC>
                        </TableRow>
                        <TableRow
                          role='checkbox'
                          tabIndex={-1}
                          sx={{
                            background:
                              openRowId === index ? '#4917c31c' : 'transpatenr',
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
                              <Box sx={{ mb: 1 }}>
                                <TtablePoductItem id={sale.id} />
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
          </Box>
        )}
      </Box>
      {/* <AddSalesDialog
        queryPath={'supply'}
        inputs={columns}
        open={openAddDialog}
        onClose={toggleOpenAddDialog}
      /> */}
    </Box>
  );
}
