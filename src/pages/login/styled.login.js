import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 450px;
  box-sizing: border-box;
`;

export const Title = styled.h1`
  font-size: 50px;
  color: #3E4177;
`;

export const ErrorText = styled.p`
  color: #954545;
`;

export const Button = styled.option`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 80%;
  max-width: 393px;
  min-height: 43px;
  background: #5277F7;
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
  margin: 15px 0;
`;
