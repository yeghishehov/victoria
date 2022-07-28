/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
// eslint-disable-next-line object-curly-newline
import { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DataTable from 'react-data-table-component';
import { useAuthContext } from '../../../hooks/auth/auth.provider';
import { getAllLearners, viewedLearner, deleteLearner } from '../../../store/modules/orders';
import Model from '../../../components/styled/modal';
import {
  Container, Button, Text, StyledCard, Row, DeleteIcon, customStyles,
} from './styled.offer';

const columnOptionData = [
  { name: 'First name', selector: 'firstName' },
  { name: 'Last name', selector: 'lastName' },
  { name: 'Email', selector: 'email' },
  { name: 'Phone', selector: 'phone' },
  { name: 'Course', selector: 'course' },
  { name: 'Created', selector: 'created' },
];

export default function Learners() {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.learner);
  const { logout } = useAuthContext();
  const [openDelete, setOpenDelete] = useState(false);
  // const [openMessage, setOpenMessage] = useState(false);
  const [deleteItems, setDeleteItems] = useState([]);

  const currentData = data.map((item) => {
    const date = new Date(item.created);
    const created = date.toLocaleString();
    return { ...item, created };
  });

  useEffect(() => {
    dispatch(getAllLearners(logout));
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
      dispatch(deleteLearner({ deleteItems, logout }));
      setOpenDelete(false);
      setDeleteItems([]);
    }
  };

  const handleViewed = ({ _id: id, viewed }) => {
    if (!viewed) {
      dispatch(viewedLearner({ id, logout }));
    }
  };

  const columns = useMemo(() => ([
    ...columnOptionData.map((columnOptionItem) => ({
      name: columnOptionItem.name,
      selector: columnOptionItem.selector,
      sortable: true,
      wrap: true,
      cell: (dataItem) => (dataItem.viewed
        ? dataItem[columnOptionItem.selector]
        : (
          <div style={{ fontWeight: 'bold', color: '#303481' }}>
            {dataItem[columnOptionItem.selector]}
          </div>
        )
      ),
    })),
    {
      selector: 'viewed',
      sortable: true,
      cell: (row) => <p style={{ fontWeight: 'bold', color: '#c72a2a' }}>{row.viewed ? '' : 'New'}</p>,
    },
  ]));

  return (
    <Container>
      <DataTable
        keyField="_id"
        title="Learners"
        columns={columns}
        data={currentData}
        onSelectedRowsChange={updateState}
        selectableRows
        highlightOnHover
        subHeader={deleteItems.length > 0}
        subHeaderComponent={<DeleteIcon onClick={handleOpenDelete} />}
        subHeaderAlign="left"
        customStyles={customStyles}
        onRowClicked={handleViewed}
        pagination
        progressPending={loading}
        noDataComponent={<Text type="title">{error || 'There are no records to display'}</Text>}
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

      {/* <Model
        show={openMessage}
        onClick={() => {
          setOpenMessage(false);
          setMessage('');
        }}
        onMouseOut={(event) => event.stopPropagation()}
      >
        <StyledCard height={200} onClick={(event) => event.stopPropagation()}>
          <Text type="title">Feedback</Text>
          <br />
          <Text type="title2">{message}</Text>
          <br />
        </StyledCard>
      </Model> */}
    </Container>
  );
}
