import { fireEvent, screen, act } from "@testing-library/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, { ReactElement } from "react";

export const DomTestHelpers = {
  getInputElementById(inputId: string): HTMLInputElement {
    return screen.getByTestId(inputId);
  },

  getButtonElementById(buttonId: string): HTMLButtonElement {
    return screen.getByTestId(buttonId);
  },

  getElementById(elementId: string): HTMLElement | null {
    return screen.queryByTestId(elementId);
  },

  async changeInputValue(inputId: string, value: string): Promise<void> {
    await act(async () => {
      fireEvent.change(this.getInputElementById(inputId), {
        target: { value },
      });
    });
  },

  async clickButton(buttonId: string): Promise<void> {
    await act(async () => {
      fireEvent.click(this.getInputElementById(buttonId));
    });
  },

  addRouter(
    components: { element: React.ReactElement; route: string }[]
  ): ReactElement {
    return (
      <BrowserRouter>
        <Routes>
          {components.map((item, key) => (
            <Route key={key} path={item.route} element={item.element} />
          ))}
        </Routes>
      </BrowserRouter>
    );
  },
};
