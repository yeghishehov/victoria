import { useState, useRef } from 'react';
import {
  collection,
  query,
  orderBy,
  addDoc,
  Timestamp,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { format } from 'date-fns';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { db } from 'utils/firebase';

const notesConverter = {
  toFirestore(notes) {
    return notes;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      ...data,
      id: snapshot.id,
    };
  },
};

export default function Notes() {
  const queryNotes = collection(db, 'notes').withConverter(notesConverter);
  const queryNotesOrdered = query(queryNotes, orderBy('date', 'desc'));
  const [notes, loading, error] = useCollectionData(queryNotesOrdered);
  const [newNote, setNewNote] = useState('');
  const [openDeleteDialod, setOpenDeleteDialod] = useState(false);
  const deleteId = useRef(null);

  const toggleOpenDeleteDialod = (orderId) => {
    deleteId.current = orderId;
    setOpenDeleteDialod((state) => !state);
  };

  const handleAdd = async () => {
    if (newNote.length) {
      const docData = {
        text: newNote,
        date: Timestamp.fromDate(new Date()),
      };
      await addDoc(collection(db, 'notes'), docData);
      setNewNote('');
    }
  };

  const handleDelete = async () => {
    try {
      const noteDoc = doc(db, `notes/${deleteId.current}`);
      await deleteDoc(noteDoc);
    } catch (error) {
      console.log(error);
    }
    toggleOpenDeleteDialod(null);
  };

  return (
    <Box sx={{ height: '90%' }}>
      <Box display='flex' alignItems='center' justifyContent='start' mb={1}>
        <MenuBookIcon sx={{ mr: 1 }} color='action' />
        <Typography variant='h5' color='InactiveCaptionText' mr={2}>
          Заметки
        </Typography>
      </Box>
      <Box sx={{ width: '100%', height: '93%', overflow: 'hidden' }}>
        <TextField
          fullWidth
          multiline
          label='Новая заментка'
          sx={{ mt: 1, mb: 2 }}
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton color='secondary' onClick={handleAdd}>
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {loading ? (
          <div>Загрузка...</div>
        ) : error ? (
          <div>Ошибка: перезагрузите страницу</div>
        ) : notes?.length === 0 ? (
          <div>Заментки отсутствуют</div>
        ) : (
          notes.map((note) => (
            <Box
              key={note.id}
              border='1px solid #a0a1a5'
              mt={2}
              p={2}
              position='relative'
            >
              <Typography color='GrayText' sx={{ whiteSpace: 'pre-line' }}>
                {format(note.date.toDate(), "dd.MM.yyyy' 'HH:mm:ss")}
              </Typography>
              <Typography sx={{ whiteSpace: 'pre-line' }}>
                {note.text}
              </Typography>
              <IconButton
                color='error'
                sx={{ position: 'absolute', right: 0, bottom: 0 }}
                onClick={() => toggleOpenDeleteDialod(note.id)}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))
        )}
      </Box>
      <Dialog
        open={openDeleteDialod}
        onClose={() => toggleOpenDeleteDialod(null)}
      >
        <DialogTitle align='center'>Вы уверены?</DialogTitle>
        <DialogActions>
          <Button onClick={() => toggleOpenDeleteDialod(null)} color='inherit'>
            Отмена
          </Button>
          <Button onClick={handleDelete} color='error'>
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
