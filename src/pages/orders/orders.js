/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
// eslint-disable-next-line object-curly-newline
import { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DataTable from 'react-data-table-component';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import { useAuthContext } from '../../../hooks/auth/auth.provider';
import { getAllOrders, viewedOrder, deleteOrder } from 'store/modules/orders';
import Model from '../../../components/styled/modal';
import {
  Container, Button, Text, StyledCard, Row, DeleteIcon,
  customStyles, Title, TextDetail, DetailContainer,
} from './styled.orders';

const columnOptionData = [
  {name: 'userName', header: 'Имя Пользователя'},
  {name: 'shopName', header: 'Имя Магазина'},
  {name: 'price', header: 'Цена'},
  {name: 'created', header: 'Дата'},
]

export default function Orders() {
  const dispatch = useDispatch();
  const { data, loading, errorMessage: error } = useSelector((state) => state.orders);
  const { logout } = useAuthContext();
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteItems, setDeleteItems] = useState([]);
  const [openDetails, setOpenDetails] = useState(false);
  const [orderDetails, setOrderDetails] = useState({});

  const currentData = data?.map((item) => {
    const date = new Date(item.created);
    const created = date.toLocaleString();
    return { ...item, created };
  });

  useEffect(() => {
    dispatch(getAllOrders(logout));
  }, []);

  const updateState = useCallback(({ selectedRows }) => {
    const ids = selectedRows.map((el) => el._id);
    setDeleteItems(ids);
  });

  const handleOpenDelete = () => {
    setOpenDelete(true);
  };

  const handleDelete = () => {
    if (deleteItems.length > 0) {
      dispatch(deleteOrder({ deleteItems, logout }));
      setOpenDelete(false);
      setDeleteItems([]);
    }
  };

  const handleOpenDetails = (details) => {
    if (!details.viewed) {
      dispatch(viewedOrder({ id: details._id, logout }));
    }
    setOpenDetails(true);
    setOrderDetails(details);
  };

  const columns = useMemo(() => (
    columnOptionData.map((columnOptionItem) => ({
      name: columnOptionItem.header,
      // selector: columnOptionItem.selector,
      // sortable: true,
      // wrap: true,
      cell: (dataItem) => {
        switch (columnOptionItem.name) {
          case 'userName': return (
            dataItem.viewed ? dataItem.user.name : (
              <div style={{ fontWeight: 'bold', color: '#303481' }}>
                {dataItem.user.name}
              </div>
            )
          );
          case 'shopName': return (
            dataItem.viewed ? dataItem.user.shop : (
              <div style={{ fontWeight: 'bold', color: '#303481' }}>
                {dataItem.user.shop}
              </div>
            )
          );
          case 'price': return (
            dataItem.viewed ? `${dataItem.price} ₽`: (
              <div style={{ fontWeight: 'bold', color: '#303481' }}>
                {dataItem.price} ₽
              </div>
            )
          );
          case 'created': return (
            dataItem.viewed ? dataItem.created : (
              <div style={{ fontWeight: 'bold', color: '#303481' }}>
                {dataItem.created}
              </div>
            )
          );
          default: return;
        }
      }
    }))
  ))
  
  const updateDeleteItems = useCallback(({ selectedRows }) => {
    setDeleteItems( selectedRows.map((el) => el._id) );
  });

  const updateRowSelected = useCallback((row) => (
    deleteItems.some(item => item === row._id)
  ), [deleteItems])

  return (
    <Container>
      <DataTable
        keyField="_id"
        title="Заказы"
        columns={columns}
        data={currentData}
        onSelectedRowsChange={updateDeleteItems}
        selectableRowSelected={updateRowSelected}
        selectableRows
        highlightOnHover
        subHeader={deleteItems.length > 0}
        subHeaderComponent={<DeleteIcon onClick={handleOpenDelete} />}
        subHeaderAlign="left"
        customStyles={customStyles}
        onRowClicked={handleOpenDetails}
        pagination
        progressPending={loading}
        noDataComponent={<Text type="title">{error || 'Нет записей для отображения'}</Text>}
      />

      <Model
        show={openDelete}
        onClick={() => setOpenDelete(false)}
        onMouseOut={(event) => event.stopPropagation()}
      >
        <StyledCard height={200} onClick={(event) => event.stopPropagation()}>
          <Text type="title2">{`Are you sure you want to delete ${deleteItems.length} items?`}</Text>
          <Row>
            <Button onClick={() => setOpenDelete(false)}>
              Cancel
            </Button>
            <Button onClick={handleDelete}>
              Yes
            </Button>
          </Row>
        </StyledCard>
      </Model>

      <Model
        show={openDetails}
        onMouseDown={() => setOpenDetails(false)}
        onMouseOut={(event) => event.stopPropagation()}
      >
        <StyledCard onMouseDown={(event) => event.stopPropagation()}>
          <DetailContainer>
            <TableContainer>
              <Table size="small" aria-label="a dense table">
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row"><Title>Дата заказа:</Title></TableCell>
                    <TableCell><TextDetail>{orderDetails.created}</TextDetail></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row"><Title>Имя заказчика:</Title></TableCell>
                    <TableCell><TextDetail>{orderDetails.user?.name}</TextDetail></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row"><Title>Имя Магазина:</Title></TableCell>
                    <TableCell><TextDetail>{orderDetails.user?.shop}</TextDetail></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row"><Title>Адрес:</Title></TableCell>
                    <TableCell><TextDetail>{orderDetails.user?.address}</TextDetail></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row"><Title>Почта:</Title></TableCell>
                    <TableCell><TextDetail>{orderDetails.user?.Email}</TextDetail></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row"><Title>Тельефон:</Title></TableCell>
                    <TableCell><TextDetail>{orderDetails.user?.phone}</TextDetail></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row"><Title>Цена:</Title></TableCell>
                    <TableCell><TextDetail>{orderDetails.price}</TextDetail></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <Toolbar />
            <TableContainer>
              <Table size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell>Имя цветка</TableCell>
                    <TableCell align="right">Высота</TableCell>
                    <TableCell align="right">Количество</TableCell>
                    <TableCell align="right">Цена</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orderDetails.flowers?.map((flower) => (
                    <TableRow key={flower._id}>
                      <TableCell component="th" scope="row"><TextDetail>{flower.flower_name}</TextDetail></TableCell>
                      <TableCell align="right"><TextDetail>{flower.flower_order_details?.height}</TextDetail></TableCell>
                      <TableCell align="right"><TextDetail>{flower.flower_order_details?.quantity}</TextDetail></TableCell>
                      <TableCell align="right"><TextDetail>{flower.flower_order_details?.price} ₽</TextDetail></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DetailContainer>
        </StyledCard>
      </Model>
    </Container>
  );
}
