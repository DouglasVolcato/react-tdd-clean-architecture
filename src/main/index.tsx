import "./styles/index.scss";
import React from "react";
import ReactDOM from "react-dom/client";
import {
  makeCreateUserPageFactory,
  makeLoginPageFactory,
  makeDeleteUserPageFactory,
} from "./factories";
import { BrowserRouter, Route, Routes } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/signup" Component={makeCreateUserPageFactory} />
        <Route path="/login" Component={makeLoginPageFactory} />
        <Route path="/delete" Component={makeDeleteUserPageFactory} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
