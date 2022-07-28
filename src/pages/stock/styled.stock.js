import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

export const TableCellSC = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#dbc7df',
    padding: 8,
    fontSize: 16,
  },
  [`&.${tableCellClasses.body}`]: {
    padding: 8,
  },
}));
