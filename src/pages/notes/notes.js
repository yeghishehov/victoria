import { useState } from 'react';
// import { collection, query, orderBy } from 'firebase/firestore';
// import { useCollectionData } from 'react-firebase-hooks/firestore';
// import { format } from 'date-fns';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
// import { db } from 'utils/firebase';

export default function Notes() {
  // const querySupply = collection(db, 'supply');
  // const queryOrderedSupply = query(querySupply, orderBy('date', 'desc'));
  // const [dates, loading, error] = useCollectionData(queryOrderedSupply);
  const [notes] = useState([]);
  const [newNote, setNewNote] = useState('');

  return (
    <Box sx={{ height: '90%' }}>
      <Box display='flex' alignItems='center' justifyContent='start' mb={1}>
        <LocalShippingIcon sx={{ mr: 1 }} color='action' />
        <Typography variant='h5' color='InactiveCaptionText' mr={2}>
          Заметки
        </Typography>
      </Box>
      <Box sx={{ width: '100%', height: '93%', overflow: 'hidden' }}>
        <TextField
          fullWidth
          multiline
          label='Новая заментка'
          sx={{ mt: 1 }}
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
        />
        <Button
          color='secondary'
          endIcon={<AddCircleOutlineIcon />}
          sx={{ textTransform: 'capitalize' }}
          // onClick={toggleOpenAddDialog}
        >
          Добавить
        </Button>
        {
          /*loading ? (
          <div>Загрузка...</div>
        ) : error ? (
          <div>Ошибка: перезагрузите страницу</div>
        ) : dates?.length === 0 ? (
          <div>Поставки отсутствуют</div>
        ) :*/

          notes.map((note) => note)
        }
      </Box>
    </Box>
  );
}
