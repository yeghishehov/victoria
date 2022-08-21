import { useState, memo } from 'react';
import {
  doc,
  addDoc,
  setDoc,
  Timestamp,
  collection,
  updateDoc,
  increment,
  getDoc,
} from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { format } from 'date-fns';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ruLocale from 'date-fns/locale/ru';
import { db } from 'utils/firebase';

const filter = createFilterOptions();

const getDefValues = (inputs) =>
  inputs.reduce(
    (acc, input) => ({
      ...acc,
      [input.name]: input?.getColumnDefValue(),
    }),
    {}
  );

const getAutocompleteOptionLabel = (option) => {
  if (typeof option === 'string') {
    return option;
  }
  if (option.label) {
    return option.label;
  }
  return option;
};

const getAutocompleteFilterOptions = (options, params) => {
  const filtered = filter(options, params);
  const { inputValue } = params;
  const isExisting = options.some((option) => inputValue === option);
  if (inputValue !== '' && !isExisting) {
    filtered.push({
      label: `Добавить "${inputValue}"`,
      inputValue,
    });
  }
  return filtered;
};

const getAutocompleteRenderInput = (params) => (
  <TextField
    {...params}
    label='Название'
    variant='standard'
    color='secondary'
  />
);

export default memo(function addSupplyDialog({ inputs, open, onClose }) {
  const query = collection(db, 'products');
  const [products] = useCollectionData(query);
  const [data, setData] = useState(getDefValues(inputs));
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setData((state) => ({ ...state, [name]: value < 0 ? 0 : value }));
  };

  const handleChangeDate = (newValue) => {
    setData((state) => ({ ...state, date: newValue }));
  };

  const handleChangeName = (е, newValue) => {
    if (newValue && newValue.inputValue) {
      setData((state) => ({ ...state, name: newValue.inputValue }));
    } else {
      setData((state) => ({ ...state, name: newValue }));
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const pathSupply = `supply/${format(data.date, 'dd.MM.yyyy')}`;
    const pathProduct = `products/${data.name}`;

    try {
      const docDataSupply = { date: Timestamp.fromDate(data.date) };
      const docDataSupplyProduct = {
        ...data,
        count: +data.count,
        ...(data.date ? { date: Timestamp.fromDate(data.date) } : {}),
      };
      const docDataProduct = {
        ...data,
        count: +data.count,
        date: Timestamp.fromDate(new Date()),
      };

      const docOption = { merge: true };

      await setDoc(doc(db, pathSupply), docDataSupply, docOption);
      await addDoc(
        collection(db, `${pathSupply}/products`),
        docDataSupplyProduct
      );

      const docRefProduct = doc(db, pathProduct);
      const docSnapProduct = await getDoc(docRefProduct);
      if (docSnapProduct.exists()) {
        await updateDoc(docRefProduct, { count: increment(+data.count) });
      } else {
        await setDoc(docRefProduct, docDataProduct, docOption);
      }
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
    // onClose();
    setData(getDefValues(inputs));
  };

  return (
    <Dialog onClose={onClose} open={open} fullWidth>
      <DialogTitle sx={{ textAlign: 'center' }}>Добавить в склад</DialogTitle>
      <DialogContent>
        <Box display='flex' flexDirection='column'>
          {inputs.map((input) => {
            if (input.name === 'date') {
              return (
                <LocalizationProvider
                  key={input.name}
                  dateAdapter={AdapterDateFns}
                  adapterLocale={ruLocale}
                >
                  <Stack spacing={3}>
                    <DatePicker
                      label={input.label}
                      inputFormat='dd.MM.yyyy'
                      value={data[input.name]}
                      name={input.name}
                      onChange={handleChangeDate}
                      okLabel={<span style={{ color: '#304257' }}>888</span>}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant='standard'
                          color='secondary'
                        />
                      )}
                    />
                  </Stack>
                </LocalizationProvider>
              );
            } else if (input.name === 'name') {
              return (
                <Stack spacing={3} key={input.name}>
                  <Autocomplete
                    freeSolo
                    selectOnFocus
                    blurOnSelect
                    name={input.name}
                    options={products?.map((p) => p.name) ?? []}
                    value={data[input.name]}
                    onChange={handleChangeName}
                    getOptionLabel={getAutocompleteOptionLabel}
                    filterOptions={getAutocompleteFilterOptions}
                    renderInput={getAutocompleteRenderInput}
                  />
                </Stack>
              );
            } else {
              return (
                <TextField
                  key={input.name}
                  name={input.name}
                  label={input.label}
                  type={input.type ?? 'text'}
                  value={data[input.name]}
                  onChange={handleChange}
                  variant='standard'
                  color='secondary'
                  sx={{ mb: 2 }}
                />
              );
            }
          })}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: '#000' }} disabled={isLoading}>
          Закрыть
        </Button>
        <Button
          onClick={handleSubmit}
          color='secondary'
          disabled={isLoading || !data.name}
        >
          Добавить
        </Button>
      </DialogActions>
    </Dialog>
  );
});
