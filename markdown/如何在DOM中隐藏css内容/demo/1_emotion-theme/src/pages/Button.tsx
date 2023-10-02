/* eslint-disable @emotion/jsx-import */
/* eslint-disable react/no-unknown-property */
import { useTheme, withTheme } from '@emotion/react';
import styled from '@emotion/styled';
import * as React from 'react';

const SomeText = styled.div`
  color: ${(props) => props.theme.colors.primary};
`;

const Button = () => {
  const theme = useTheme();
  return <div css={{ color: theme.colors.primary }}>Button useTheme</div>;
};

const TellMeTheColor = (props) => {
  return (
    <div css={{ color: props.theme.colors.primary }}>
      The color is {props.theme.colors.primary}.
    </div>
  );
};
const TellMeTheColorWithTheme = withTheme(TellMeTheColor);

const Component = () => {
  return (
    <>
      <div>Page1</div>
      <h3>1. css props function</h3>
      <div css={(theme) => ({ color: theme.colors.primary })}>
        some other text
      </div>

      <h3>2. styled function</h3>
      <SomeText>some text</SomeText>

      <h3>3. useTheme</h3>
      <Button></Button>

      <h3>4. withTheme</h3>
      <TellMeTheColorWithTheme></TellMeTheColorWithTheme>
    </>
  );
};

export default Component;
