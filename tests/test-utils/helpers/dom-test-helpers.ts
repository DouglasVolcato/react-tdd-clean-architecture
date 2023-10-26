import { fireEvent, screen, act } from "@testing-library/react";

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
};
