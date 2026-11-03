import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { RfqCreatePage } from "../pages/RfqCreatePage";
import { RfqDetailPage } from "../pages/RfqDetailPage";
import { RfqListPage } from "../pages/RfqListPage";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate
            to="/rfqs"
            replace
          />
        }
      />

      <Route
        path="/rfqs"
        element={
          <RfqListPage />
        }
      />

      <Route
        path="/rfqs/new"
        element={
          <RfqCreatePage />
        }
      />

      <Route
        path="/rfqs/:rfqId"
        element={
          <RfqDetailPage />
        }
      />
    </Routes>
  );
}

export default App;