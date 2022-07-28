import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Row } from './styled.users';

const inputs = [
  {name: 'name', type: 'text', label: 'Имя'},
  {name: 'login', type: 'text', label: 'Логин'},
  {name: 'password', type: 'text', label: 'Пароль'},
  {name: 'confirm', type: 'text', label: 'Пдтвердите пароль'},
  {name: 'email', type: 'email;', label: 'Эл. почта'},
  {name: 'phone', type: 'tel', label: 'Телефон'},
  {name: 'shop', type: 'text', label: 'Назаавание магазина'},
  {name: 'address', type: 'text', label: 'Адрес'},
];

export default function RegistrationUser({
  header,
  form,
  setOpen,
  handleChangeForm,
  handleChangeRole,
  handleRequest,
}) {

  return (
    <>
      <Typography color="secondary" variant="h5">{header}</Typography>
      {inputs.map((input) => (
        <TextField
          key={input.name}
          name={input.name}
          type={input.type}
          InputProps={{ inputProps: { min: 0 } }}
          value={form[input.name]}
          onChange={handleChangeForm}
          label={input.label}
          variant="outlined"
          style={{ margin: 5, width: '60%' }}
          size="small"
        />
      ))}

      <Row>
        <RadioGroup name="role" value={form.role} onChange={handleChangeRole}>
          <FormControlLabel value="user" control={<Radio />} label="Клиент" />
          <FormControlLabel value="admin" control={<Radio />} label="Администратор" />
        </RadioGroup>
      </Row>

      <Row style={{ marginTop: 20 }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setOpen(false)}
        >
          Отмена
        </Button>
        <Button
          onClick={handleRequest}
          variant="contained"
          color="primary"
        >
          Добавить
        </Button>
      </Row>
    </>
  )
}