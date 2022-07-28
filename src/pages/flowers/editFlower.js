import { useState } from 'react';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import { ChromePicker } from 'react-color';
import closeIcon from '../../../assets/icons/close.svg';
import {
  Row,
  ImageLabel,
} from './styled.flowers';

export default function EditFlower({
  image,
  inputs,
  form,
  colors,
  heights,
  setOpenEdit,
  handleChangeImage,
  handleChangeForm,
  handleAddColor,
  handleChangeColorValue,
  handleChangeColorPrice,
  handleChangeColorName,
  handleRemoveColor,
  handleAddHeight,
  handleChangeHeightValue,
  handleChangeHeightPrice,
  handleRemoveHeight,
  handleEditFlower,
}) {
  const [popover, setPopover] = useState({anchorEl: null, _id: null});
  const handlePopoverOpen = (e, _id) => setPopover({ anchorEl: e.currentTarget, _id });
  const handlePopoverClose = () => setPopover({anchorEl: null, _id: null});

  return (
    <>
      <Typography color="secondary" variant="h5">Изменить цветок</Typography>
      <ImageLabel>
        {image ? `Выбрано:  ${image.name.slice(0, 15)}` : 'Выбрать картину'}
        <input
          type="file"
          accept=".jpg, .jpeg, .png, .webp"
          onChange={handleChangeImage}
          hidden
        />
      </ImageLabel>
      {inputs.map((input) => (
        <TextField
          key={input.name}
          name={input.name}
          type={input.type}
          InputProps={{ inputProps: { min: 0 } }}
          value={form[input.name]}
          onChange={handleChangeForm}
          label={input.placeholder}
          variant="outlined"
          style={{ margin: 5, width: '60%' }}
          size="small"
        />
      ))}
      {/* <Row right>
        <Button
          color="secondary"
          variant="outlined"
          onClick={handleAddColor}
          style={{ marginTop: 10 }}
        >
          Добавить цвет
        </Button>
      </Row> */}
      <Row multi>
        {/* {colors.slice(0).reverse().map((item) => (
          <Row key={item._id}>
            <Button
              style={{ backgroundColor: item.value, margin: 3 }}
              onClick={e => handlePopoverOpen(e, item._id)}
              variant="outlined"
            >
              <p style={{
                  color: item.value,
                  WebkitFilter: 'invert(100%)',
                  filter: 'invert(100%)',
                }}
              >
                Цвет
              </p>
            </Button>
            <TextField
              label="Имя цвета"
              variant="outlined"
              size="small"
              style={{ margin: 3 }}
              onChange={(e) => handleChangeColorName(e.target.value, item._id)}
              value={item.name}
            />
            <TextField
              label="Цена цвета"
              variant="outlined"
              size="small"
              type="number"
              InputProps={{ inputProps: { min: 0 } }}
              style={{ margin: 3 }}
              onChange={(e) => handleChangeColorPrice(e.target.value, item._id)}
              value={item.price}
            />
            <IconButton onClick={() => handleRemoveColor(item._id)}>
              <img src={closeIcon} alt="" style={{ width: 15 }} />
            </IconButton>
            <Popover
              open={Boolean(popover.anchorEl) && popover._id === item._id}
              onClose={handlePopoverClose}
              anchorEl={popover.anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            >
              <ChromePicker
                disableAlpha
                onChange={(color) => handleChangeColorValue(color, item._id)}
                color={item.value}
              />
            </Popover>
          </Row>
        ))} */}
      </Row>

      <Row right>
        <Button
          color="primary"
          variant="outlined"
          onClick={handleAddHeight}
          style={{ marginTop: 10 }}
        >
          Добавить Высоту
        </Button>
      </Row>
      <Row multi>
        {heights.slice(0).reverse().map((item) => (
          <Row key={item._id}>
            <TextField
              label="Высота"
              variant="outlined"
              size="small"
              type="number"
              InputProps={{ inputProps: { min: 0 } }}
              style={{ margin: 3 }}
              onChange={(e) => handleChangeHeightValue(e.target.value, item._id)}
              value={item.value}
            />
            <TextField
              label="Цена Высоты"
              variant="outlined"
              size="small"
              type="number"
              InputProps={{ inputProps: { min: 0 } }}
              style={{ margin: 3 }}
              onChange={(e) => handleChangeHeightPrice(e.target.value, item._id)}
              value={item.price}
            />
            <IconButton onClick={() => handleRemoveHeight(item._id)}>
              <img src={closeIcon} alt="" style={{ width: 15 }} />
            </IconButton>
          </Row>
        ))}
      </Row>

      <Row style={{ marginTop: 20 }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setOpenEdit(false)}
        >
          Отмена
        </Button>
        <Button
          onClick={handleEditFlower}
          variant="contained"
          color="primary"
          disabled={!form.name.length}
        >
          Изменить
        </Button>
      </Row>
    </>
  )
}