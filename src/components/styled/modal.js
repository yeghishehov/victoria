import styled from 'styled-components';

export default styled.div`
  z-index: 100;
  display: flex;
  visibility: ${({ show }) => (show ? 'visible' : 'hidden')};
  opacity: ${({ show }) => (show ? 1 : 0)};
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width:100vw;
  background: rgba(0,0,0,0.5);
  transition: all 0.5s;
`;
