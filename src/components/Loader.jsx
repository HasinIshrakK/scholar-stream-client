import React from 'react';
import styled from 'styled-components';

const Loader = ({ fullScreen = true }) => {
    return (
        <StyledWrapper>
            <div className={`flex flex-col items-center justify-center ${fullScreen ? 'min-h-screen' : 'py-10'}`}>
                <div className="loader">
                    <div className="square" id="sq1" />
                    <div className="square" id="sq2" />
                    <div className="square" id="sq3" />
                    <div className="square" id="sq4" />
                    <div className="square" id="sq5" />
                    <div className="square" id="sq6" />
                    <div className="square" id="sq7" />
                    <div className="square" id="sq8" />
                    <div className="square" id="sq9" />
                </div>
            </div>
        </StyledWrapper>
    );
};

const StyledWrapper = styled.div`
  @keyframes loader_5191 {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  /* This is the actual fix: .square children are absolutely positioned
     against .loader, so .loader needs to BE a positioned element with a
     real size. Without this, the squares position against the nearest
     positioned ancestor up the tree — often the page itself — which is
     why placement looked different depending on where the Loader was
     mounted (full page vs. inside a modal vs. inside a card). */
  .loader {
    position: relative;
    width: 60px;
    height: 60px;
  }

  .square {
    background: #0f1b3c;
    width: 10px;
    height: 10px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -5px;
    margin-left: -5px;
  }

  #sq1 {
    margin-top: -25px;
    margin-left: -25px;
    animation: loader_5191 675ms ease-in-out 0s infinite alternate;
  }

  #sq2 {
    margin-top: -25px;
    animation: loader_5191 675ms ease-in-out 75ms infinite alternate;
  }

  #sq3 {
    margin-top: -25px;
    margin-left: 15px;
    animation: loader_5191 675ms ease-in-out 150ms infinite;
  }

  #sq4 {
    margin-left: -25px;
    animation: loader_5191 675ms ease-in-out 225ms infinite;
  }

  #sq5 {
    background: #c9a227;
    animation: loader_5191 675ms ease-in-out 300ms infinite;
  }

  #sq6 {
    margin-left: 15px;
    animation: loader_5191 675ms ease-in-out 375ms infinite;
  }

  #sq7 {
    margin-top: 15px;
    margin-left: -25px;
    animation: loader_5191 675ms ease-in-out 450ms infinite;
  }

  #sq8 {
    margin-top: 15px;
    animation: loader_5191 675ms ease-in-out 525ms infinite;
  }

  #sq9 {
    margin-top: 15px;
    margin-left: 15px;
    animation: loader_5191 675ms ease-in-out 600ms infinite;
  }
`;

export default Loader;