import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

export const TableCellSC = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#dbc7df',
    padding: 8,
    fontSize: 16,
    width: -15,
  },
  [`&.${tableCellClasses.body}`]: {
    padding: 8,
    width: -15,
  },
}));

export const SubTableCellSC = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#ccc',
    padding: 8,
    fontSize: 16,
    '&:first-of-type': {
      left: 0,
      position: 'sticky',
      zIndex: theme.zIndex.appBar - 1,
      backgroundColor: '#c5b1c9',
    },
  },
  [`&.${tableCellClasses.body}`]: {
    padding: 8,
    '&:first-of-type': {
      minWidth: '50px',
      left: 0,
      position: 'sticky',
      zIndex: theme.zIndex.appBar - 2,
      backgroundColor: '#ebebeb',
    },
  },
}));
