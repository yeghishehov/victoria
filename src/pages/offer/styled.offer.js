import styled from 'styled-components';
import Card from '../../../components/styled/card';
import StyledText from '../../../components/styled/text';
import { ReactComponent as Delete } from '../../../assets/icons/delete.svg';

export const Container = styled.div`
  width: 90%;
`;

export const Row = styled.div`
  display: flex;
  justify-content: space-evenly;
  width: 100%;
`;

export const Text = styled(StyledText)`
  color: #4b51c3;
`;

export const Button = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: ${({ long }) => (long ? '200px' : '100px')};
  height: 43px;
  background: ${({ disabled }) => (disabled ? '#A3B3CE' : '#5277F7')};
  box-shadow: 0px 14px 10px rgba(82, 119, 247, 0.06);
  border-radius: 10px;
  border: 0;
  cursor: pointer;
  :focus {
    outline: none;
  }
  :active {
    background: #0931c3;
  }
  font-weight: bold;
  font-size: 14px;
  color: #FFFFFF;
`;

export const DeleteIcon = styled(Delete)`
  width: 30px;
  height: 30px;
  cursor: pointer;
  :active {
    fill: #494949;
  }
`;

export const StyledCard = styled(Card)`
  min-width: ${({ width }) => (width ? `${width}px` : '600px')};
  min-height: ${({ height }) => (height ? `${height}px` : '400px')};
  background: #fff;
`;

export const customStyles = {
  header: {
    style: {
      fontSize: '50px',
      color: '#3E4177',
    },
  },
  subHeader: {
    style: {
      backgroundColor: '#E3F2FD',
      padding: '0 10px',
    },
  },
  rows: {
    style: {
      fontSize: '20px',
      color: '#4b51c3',
      cursor: 'pointer',
    },
  },
  headCells: {
    style: {
      fontSize: '22px',
      fontWeight: 'bold',
      color: '#4b51c3',
    },
  },
};
