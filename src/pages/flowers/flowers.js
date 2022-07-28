/* eslint-disable object-curly-newline */
/* eslint-disable no-underscore-dangle */
import { useState, useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DataTable from 'react-data-table-component';
import { v4 as uuidv4 } from 'uuid';
import { useAuthContext } from '../../../hooks/auth/auth.provider';
import { getFlowers, addFlower, deleteFlower, editFlower } from '../../../store/modules/flowers';
import Modal from '../../../components/styled/modal';
import { baseURL } from '../../../utils/axiosConfig';
import AddFlower from './addFlower';
import EditFlower from './editFlower';
import {
  Container, Button, Text, StyledCard, Row, DeleteIcon, customStyles,
} from './styled.flowers';

const columnOptionData = ['name', 'price', 'image'];

const inputs = [
  {name: 'name', type: 'text', placeholder: 'Имя Цветка'},
  {name: 'price', type: 'number', placeholder: 'Цена Цветка'},
];

export default function Flowers() {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.flowers);
  const { logout } = useAuthContext();
  const [openDelete, setOpenDelete] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editId, setEditId] = useState('');
  const [deleteItems, setDeleteItems] = useState([]);
  const [image, setImage] = useState(null);
  const [form, setForm] = useState({ name: '', price: 0 });
  const [heights, setHeights] = useState([]);
  // const [colors, setColors] = useState([]);
  
  useEffect(() => {
    dispatch(getFlowers());
  }, []);

  const handleChangeForm = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // const handleAddColor = () => {
  //   setColors([ ...colors, { _id: uuidv4(),  value: '#FFFF', price: 0, name: 'Белый' } ]);
  // };
  // const handleChangeColorValue = (selectedColor, colorId) => setColors(
  //   colors.map(item => item._id === colorId
  //     ? { ...item, value: selectedColor.hex } 
  //     : item
  //   )
  // );
  // const handleChangeColorPrice = (colorPrice, colorId) => setColors(
  //   colors.map(item => item._id === colorId
  //     ? { ...item, price: colorPrice } 
  //     : item
  //   )
  // );
  // const handleChangeColorName = (colorName, colorId) => setColors(
  //   colors.map(item => item._id === colorId
  //     ? { ...item, name: colorName } 
  //     : item
  //   )
  // );
  // const handleRemoveColor = (colorId) => setColors(
  //   colors.filter(item => item._id !== colorId)
  // );

  const handleAddHeight = () => {
    setHeights([ ...heights, { _id: uuidv4(),  value: 0, price: 0 } ]);
  }
  const handleChangeHeightValue = (value, heightId) => setHeights(
    heights.map(item => item._id === heightId 
      ? { ...item, value } 
      : item
    )
  );
  const handleChangeHeightPrice = (price, heightId) => setHeights(
    heights.map(item => item._id === heightId 
      ? { ...item, price } 
      : item
    )
  );
  const handleRemoveHeight = (heightId) => setHeights(
    heights.filter(height => height._id !== heightId)
  )
  
  const handleChangeImage = (e) => {
    const extension = e.target.files[0].name.split('.').pop();
    if (['jpg', 'jpeg', 'png', 'webp'].some(item => item === extension)) {
      setImage(e.target.files[0]);
    } else {
      e.target.value = '';
    }
  };

  const handleAddFlower = () => {
    const formData = new FormData();
    formData.append('image', image);
    Object.keys(form).map((key) => formData.append(key, form[key]));
    // formData.append('colors', JSON.stringify(colors.map(({ _id, ...rest}) => rest)));
    formData.append('heights', JSON.stringify(heights.map(({ _id, ...rest}) => rest)));
    dispatch(addFlower({ formData, logout }));
    setForm({ name: '', price: 0 });
    setHeights([]);
    // setColors([]);
    setImage(null);
    setOpenAdd(false);
  };

  const handleDelete = () => {
    if (deleteItems.length) {
      dispatch(deleteFlower({ deleteItems, logout }));
      setDeleteItems([]);
      setOpenDelete(false);
    }
  };

  const handleOpenEdit = ({ _id: id, name, price, colors: allColors, heights: allHeights }) => {
    setEditId(id);
    setForm({ name, price });
    // setColors(allColors);
    setHeights(allHeights);
    setOpenEdit(true);
  };

  const handleEditFlower = () => {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('id', editId);
    Object.keys(form).map((key) => formData.append(key, form[key]));
    // formData.append('colors', JSON.stringify(colors.map(({ _id, ...rest}) => rest)));
    formData.append('heights', JSON.stringify(heights.map(({ _id, ...rest}) => rest)));

    dispatch(editFlower({ formData, logout }));
    setForm({ name: '', price: 0 });
    setHeights([]);
    // setColors([]);
    setImage(null);
    setOpenEdit(false);
  };

  const columns = useMemo(() => columnOptionData.map((columnOptionItem) => ({
    name: columnOptionItem,
    selector: columnOptionItem,
    sortable: columnOptionItem !== 'image',
    wrap: true,
    cell: (dataItem) => (
      columnOptionItem === 'image'
        ? <img src={`${baseURL}/../..${dataItem.image}`} style={{ width: 50 }} alt="" />
        : dataItem[columnOptionItem]
    ),
  })));

  const updateDeleteItems = useCallback(({ selectedRows }) => {
    setDeleteItems( selectedRows.map((el) => el._id) );
  });

  const updateRowSelected = useCallback((row) => (
    deleteItems.some(item => item === row._id)
  ), [deleteItems])

  return (
    <Container>
      <Button long onClick={() => setOpenAdd(true)}>
        Добавить
      </Button>
      <DataTable
        keyField="_id"
        title="Цветы"
        columns={columns}
        data={data}
        onSelectedRowsChange={updateDeleteItems}
        selectableRowSelected={updateRowSelected}
        selectableRows
        highlightOnHover
        subHeader={deleteItems.length > 0}
        subHeaderComponent={
          <DeleteIcon onClick={() => setOpenDelete(true)} />
        }
        subHeaderAlign="left"
        customStyles={customStyles}
        onRowClicked={handleOpenEdit}
        pagination
        progressPending={loading}
        noDataComponent={<Text type="title">{error || 'Нет добавленных цветов'}</Text>}
      />

      <Modal
        show={openDelete}
        onMouseDown={() => setOpenDelete(false)}
        onMouseOut={(event) => event.stopPropagation()}
      >
        <StyledCard height={200} onMouseDown={(event) => event.stopPropagation()}>
          <Text type="title2">{`Выбрано ${deleteItems.length}: точно хотите удалить?`}</Text>
          <Row>
            <Button onClick={() => setOpenDelete(false)}>
              Отмена
            </Button>
            <Button onClick={handleDelete}>
              Удалить
            </Button>
          </Row>
        </StyledCard>
      </Modal>

      <Modal
        show={openAdd}
        onMouseDown={() => setOpenAdd(false)}
        onMouseOut={(event) => event.stopPropagation()}
      >
        <StyledCard height={200} onMouseDown={(event) => event.stopPropagation()}>
          <AddFlower
            image={image}
            inputs={inputs}
            form={form}
            // colors={colors}
            heights={heights}
            setOpenAdd={setOpenAdd}
            handleChangeImage={handleChangeImage}
            handleChangeForm={handleChangeForm}
            // handleAddColor={handleAddColor}
            // handleChangeColorValue={handleChangeColorValue}
            // handleChangeColorPrice={handleChangeColorPrice}
            // handleChangeColorName={handleChangeColorName}
            // handleRemoveColor={handleRemoveColor}
            handleAddHeight={handleAddHeight}
            handleChangeHeightValue={handleChangeHeightValue}
            handleChangeHeightPrice={handleChangeHeightPrice}
            handleRemoveHeight={handleRemoveHeight}
            handleAddFlower={handleAddFlower}
          />
        </StyledCard>
      </Modal>

      <Modal
        show={openEdit}
        onMouseDown={() => setOpenEdit(false)}
        onMouseOut={(event) => event.stopPropagation()}
      >
        <StyledCard height={200} onMouseDown={(event) => event.stopPropagation()}>
          <EditFlower
            image={image}
            inputs={inputs}
            form={form}
            // colors={colors}
            heights={heights}
            setOpenEdit={setOpenEdit}
            handleChangeImage={handleChangeImage}
            handleChangeForm={handleChangeForm}
            // handleAddColor={handleAddColor}
            // handleChangeColorValue={handleChangeColorValue}
            // handleChangeColorPrice={handleChangeColorPrice}
            // handleChangeColorName={handleChangeColorName}
            // handleRemoveColor={handleRemoveColor}
            handleAddHeight={handleAddHeight}
            handleChangeHeightValue={handleChangeHeightValue}
            handleChangeHeightPrice={handleChangeHeightPrice}
            handleRemoveHeight={handleRemoveHeight}
            handleEditFlower={handleEditFlower}
          />
        </StyledCard>
      </Modal>

    </Container>
  );
}
