import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';

const hoverOrActiveLink = css`
  color: grey;
  &:before,
  &:after {
    width: 50%;
    opacity: 1;
  }
`;

// Components

const HeaderContainer = styled.div`
  height: 70px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;

  &.scrolled {
    position: sticky;
    top: 0;
    opacity: 0.96;
    background-color: white;
    z-index: 1;
    transition: .75s ease-in-out;
  }
`;

const LogoContainer = styled(Link)`
  height: 100%;
  width: 70px;
  padding: 18px 25px;
`;

const OptionsContainer = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const isActive = props => {
  if(props.to && (props.to === props.active.location.pathname)) {
    return hoverOrActiveLink;
  } else {
    return '';
  }
};

const OptionLink = styled(Link)`
  padding: 10px 15px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s ease-in-out;
  position: relative;

  &:before,
  &:after {
    content: "";
    position: absolute;
    bottom: -2px;
    width: 0px;
    height: 2px;
    margin: 2px 0 0;
    transition: all 0.5s ease-in-out;
    opacity: 0;
    background-color: black;
  }
  &:before {
    left: 50%;
  }
  &:after {
    right: 50%;
  }

  ${isActive}

  &:hover {
    ${hoverOrActiveLink}
  }
`;

export {
  HeaderContainer,
  LogoContainer,
  OptionsContainer,
  OptionLink
}
