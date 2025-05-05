import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Modal from "react-modal";
import { createStore } from "redux";
import { allReducers } from "./reducers";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

const store = createStore(allReducers);
Modal.setAppElement("#root");
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
