import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { GlobalContextProvider } from "./contexts";
import {
  makeCreateUserPageFactory,
  makeLoginPageFactory,
  makeDeleteUserPageFactory,
} from "./factories";

const Router = () => {
  return (
    <GlobalContextProvider>
      <Routes>
        <Route path="/signup" Component={makeCreateUserPageFactory} />
        <Route path="/login" Component={makeLoginPageFactory} />
        <Route path="/home" Component={makeDeleteUserPageFactory} />
      </Routes>
    </GlobalContextProvider>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
