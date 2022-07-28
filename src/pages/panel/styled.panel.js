import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  width: 100vw;
  box-sizing: border-box;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 80%;
  height: 100px;
`;

export const Title = styled.h1`
  font-size: 50px;
  color: #3e4177;
`;

export const Row = styled.div`
  display: flex;
  justify-content: space-evenly;
  width: 100%;
`;

export const Text = styled.div`
  color: #4b51c3;
`;

export const LearnerContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-top: 50px;
`;

export const Button = styled.option`
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
  color: #ffffff;
`;

export const Col = styled.div`
  display: flex;
  align-items: center;
`;
