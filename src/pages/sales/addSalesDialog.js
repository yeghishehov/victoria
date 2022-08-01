import { useState } from 'react';
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

export default function addSupplyDialog({ inputs, open, onClose }) {
  const query = collection(db, 'products');
  const [products] = useCollectionData(query);
  const [data, setData] = useState(getDefValues(inputs));
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    let correctedValue = value;
    if (name === 'count' && selectedProduct) {
      correctedValue =
        value > selectedProduct.count ? selectedProduct.count : value;
      setData((state) => ({
        ...state,
        [name]: correctedValue < 0 ? 0 : correctedValue,
      }));
    }
    setData((state) => ({
      ...state,
      [name]: correctedValue < 0 ? 0 : correctedValue,
    }));
  };

  const handleChangeDate = (newValue) => {
    setData((state) => ({ ...state, date: newValue }));
  };

  const handleChangeName = (е, newValue) => {
    if (newValue && newValue.inputValue) {
      setData((state) => ({ ...state, name: newValue.inputValue }));
      setSelectedProduct(null);
    } else {
      setData((state) => ({ ...state, name: newValue }));
      const product = products.find(
        (productItem) => productItem.name === newValue
      );
      if (product !== undefined) setSelectedProduct(product);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const pathSales = `sales/${format(data.date, 'dd.MM.yyyy')}`;
    const pathProduct = `products/${data.name}`;

    try {
      const docDataSales = { date: Timestamp.fromDate(data.date) };
      const docDataSalesProduct = {
        ...data,
        ...(data.date ? { date: Timestamp.fromDate(data.date) } : {}),
      };

      const docOption = { merge: true };

      await setDoc(doc(db, pathSales), docDataSales, docOption);
      await addDoc(
        collection(db, `${pathSales}/products`),
        docDataSalesProduct
      );

      const docRefProduct = doc(db, pathProduct);
      const docSnapProduct = await getDoc(docRefProduct);
      if (docSnapProduct.exists()) {
        await updateDoc(docRefProduct, { count: increment(-data.count) });
      }
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
    setSelectedProduct(null);
    // onClose();
    setData(getDefValues(inputs));
  };

  const getLabel = (label) => {
    if (selectedProduct) {
      if (label === 'Количество') {
        return `${label} (на складе: ${selectedProduct.count})`;
      }
      if (label === 'Ценa') {
        return (
          label +
          ' ' +
          (selectedProduct.pricePurchase
            ? '(приобретена: ' + selectedProduct.pricePurchase + ')'
            : '') +
          ' ' +
          (selectedProduct.priceSale
            ? '(план.: ' + selectedProduct.priceSale + ')'
            : '')
        );
      }
    }
    return label;
  };

  return (
    <Dialog onClose={onClose} open={open} fullWidth>
      <DialogTitle sx={{ textAlign: 'center' }}>Добавить продажу</DialogTitle>
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
                  label={getLabel(input.label)}
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
}
