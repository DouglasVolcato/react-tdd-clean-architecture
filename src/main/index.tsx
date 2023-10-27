import "./styles/index.scss";
import React from "react";
import ReactDOM from "react-dom/client";
import { makeCreateUserPageFactory } from "./factories";
import { makeLoginPageFactory } from "./factories/pages/login-page-factory";
import { BrowserRouter, Route, Routes } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/signup" Component={makeCreateUserPageFactory} />
        <Route path="/login" Component={makeLoginPageFactory} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
