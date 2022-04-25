import * as React from "react";
import { render, RenderOptions } from "@testing-library/react";
import { ChakraProvider, theme } from "@chakra-ui/react";
import { Provider } from "react-redux";
import store from "./store/store";

const AllProviders = ({ children }: { children?: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </Provider>
  );
};

const customRender = (ui: React.ReactElement, options?: RenderOptions) => {
  render(ui, { wrapper: AllProviders, ...options });
};

export { customRender as render };
