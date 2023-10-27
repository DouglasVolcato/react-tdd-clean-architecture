import "./styles/index.scss";
import React from "react";
import ReactDOM from "react-dom/client";
import { makeCreateUserPageFactory } from "./factories/pages/create-user-page-factory";

const apiUrl = 'http://localhost:3000';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>{makeCreateUserPageFactory(apiUrl)}</React.StrictMode>
);
