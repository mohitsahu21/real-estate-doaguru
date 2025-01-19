import React from 'react';
import styled, { keyframes } from 'styled-components';
const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;


const Spinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #3498db;
  width: 40px;
  height: 40px;
  animation: ${spin} 1s linear infinite;
`;

const SpinnerWrapper = () => (
  <div className="flex justify-center items-center h-screen">
    <Spinner />
  </div>
);

export default SpinnerWrapper;
