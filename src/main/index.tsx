import React from "react";
import ReactDOM from "react-dom/client";
import { makeCreateUserPageFactory } from "./factories/pages/create-user-page-factory";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>{makeCreateUserPageFactory()}</React.StrictMode>
);
