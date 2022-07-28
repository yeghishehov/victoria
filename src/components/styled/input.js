import styled from 'styled-components';

export default styled.input`
  background: #F7E7FF;
  box-sizing: border-box;
  width: 393px;
  min-height: 44px;
  border-radius: 10px;
  border: 1px solid #4A294A;
  padding-left: 30px;
  padding-right: 45px;
  margin: 15px 0;
  font-weight: 500;
  font-size: 14px;
  :focus {
    outline: none;
  }
  ::placeholder {
    color: rgba(54, 54, 54, 0.3);
  }
  :-ms-input-placeholder {
    color: rgba(54, 54, 54, 0.3);
  }
  ::-ms-input-placeholder {
    color: rgba(54, 54, 54, 0.3);
  }
  @media (max-width: 508px) {
    width: 80%;
  }
`;
