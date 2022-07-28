/* eslint-disable object-curly-newline */
/* eslint-disable no-underscore-dangle */
import { useState, useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DataTable from 'react-data-table-component';
import { useAuthContext } from '../../../hooks/auth/auth.provider';
import {
  getUsers,
  registerUser,
  deleteUsers,
  editUser,
} from '../../../store/modules/users';
import Model from '../../../components/styled/modal';
import RegistrationUser from './registrationUser';
import {
  Container,
  Button,
  Text,
  StyledCard,
  Row,
  DeleteIcon,
  customStyles,
} from './styled.users';

const columnOptionData = [
  'name',
  'login',
  'email',
  'phone',
  'shop',
  'address',
  'role',
];

export default function Courses() {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.users);
  const { logout } = useAuthContext();
  const [openDelete, setOpenDelete] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editId, setEditId] = useState('');
  const [deleteItems, setDeleteItems] = useState([]);
  const [form, setForm] = useState({
    name: '',
    login: '',
    password: '',
    confirm: '',
    email: '',
    phone: '',
    shop: '',
    address: '',
    role: 'user',
  });

  useEffect(() => {
    dispatch(getUsers());
  }, []);

  const handleChangeForm = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleChangeRole = (e) => {
    setForm({ ...form, role: e.target.value });
  };

  const handleRegister = () => {
    dispatch(registerUser({ form, logout }));
    setOpenAdd(false);
    setForm({
      name: '',
      login: '',
      password: '',
      confirm: '',
      email: '',
      phone: '',
      shop: '',
      address: '',
      role: 'user',
    });
  };

  const handleDelete = () => {
    if (deleteItems.length > 0) {
      dispatch(deleteUsers({ deleteItems, logout }));
      setDeleteItems([]);
      setOpenDelete(false);
    }
  };

  const handleOpenEdit = ({
    _id: id,
    name,
    login,
    email,
    phone,
    shop,
    address,
    role,
  }) => {
    setForm({
      name: name || '',
      login: login || '',
      password: '',
      confirm: '',
      email: email || '',
      phone: phone || '',
      shop: shop || '',
      address: address || '',
      role: role || '',
    });
    setEditId(id);
    setOpenEdit(true);
  };

  const handleEdit = () => {
    const filteredForm = Object.keys(form).reduce(
      (acc, key) => (form[key] ? { ...acc, [key]: form[key] } : acc),
      []
    );
    dispatch(editUser({ form: { ...filteredForm, id: editId }, logout }));
    setForm({
      name: '',
      login: '',
      password: '',
      confirm: '',
      email: '',
      phone: '',
      shop: '',
      address: '',
      role: 'user',
    });
    setEditId('');
    setOpenEdit(false);
  };

  const columns = useMemo(() =>
    columnOptionData.map((columnOptionItem) => ({
      name: columnOptionItem,
      selector: columnOptionItem,
      wrap: true,
      cell: (dataItem) => dataItem[columnOptionItem],
    }))
  );

  const updateDeleteItems = useCallback(({ selectedRows }) => {
    setDeleteItems(selectedRows.map((el) => el._id));
  });

  const updateRowSelected = useCallback(
    (row) => deleteItems.some((item) => item === row._id),
    [deleteItems]
  );

  return (
    <Container>
      <Button long onClick={() => setOpenAdd(true)}>
        Зарегистрировать
      </Button>
      <DataTable
        keyField='_id'
        title='Пользователи'
        columns={columns}
        data={data}
        onSelectedRowsChange={updateDeleteItems}
        selectableRowSelected={updateRowSelected}
        selectableRows
        highlightOnHover
        subHeader={deleteItems.length > 0}
        subHeaderComponent={<DeleteIcon onClick={() => setOpenDelete(true)} />}
        subHeaderAlign='left'
        customStyles={customStyles}
        onRowClicked={handleOpenEdit}
        pagination
        progressPending={loading}
        noDataComponent={
          <Text type='title'>{error || 'Нет записей для отображения'}</Text>
        }
      />

      <Model
        show={openDelete}
        onMouseDown={() => setOpenDelete(false)}
        onMouseOut={(event) => event.stopPropagation()}
      >
        <StyledCard
          height={200}
          onMouseDown={(event) => event.stopPropagation()}
        >
          <Text type='title2'>{`Выбрано ${deleteItems.length},  точно хотите удалить?`}</Text>
          <Row>
            <Button onClick={() => setOpenDelete(false)}>Отмена</Button>
            <Button onClick={handleDelete}>Удалить</Button>
          </Row>
        </StyledCard>
      </Model>

      <Model
        show={openAdd}
        onMouseDown={() => setOpenAdd(false)}
        onMouseOut={(event) => event.stopPropagation()}
      >
        <StyledCard
          height={200}
          onMouseDown={(event) => event.stopPropagation()}
        >
          <RegistrationUser
            header='Добавление нового пользователя'
            form={form}
            setOpen={setOpenAdd}
            handleChangeForm={handleChangeForm}
            handleChangeRole={handleChangeRole}
            handleRequest={handleRegister}
          />
        </StyledCard>
      </Model>

      <Model
        show={openEdit}
        onMouseDown={() => setOpenEdit(false)}
        onMouseOut={(event) => event.stopPropagation()}
      >
        <StyledCard
          height={200}
          onMouseDown={(event) => event.stopPropagation()}
        >
          <RegistrationUser
            header='Изменить данные пользователя'
            form={form}
            setOpen={setOpenEdit}
            handleChangeForm={handleChangeForm}
            handleChangeRole={handleChangeRole}
            handleRequest={handleEdit}
          />
        </StyledCard>
      </Model>
    </Container>
  );
}
