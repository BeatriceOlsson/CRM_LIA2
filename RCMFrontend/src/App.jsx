import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { UserInfoProvider } from "./components/context/userInfoProvider";
import Page from "./components/pages/page";
import { Login } from "./components/pages/login";
import { ProtectedRoutes } from "./components/pages/protectedRouter";
import Companies from "./components/pages/companies";
import ContactPerson from "./components/pages/contactPerson";
import Sales from "./components/pages/sales";
import Profile from "./components/pages/profile";
import Update from "./components/pages/update";
import { DeleteProvider } from "./components/context/useDeleteProvider";

function App() {
  return (
    <UserInfoProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/Login" element={<Login />} />

          <Route element={<ProtectedRoutes />}>
            <Route element={<DeleteProvider />}>
              <Route path="/" element={<Page />} />
              <Route path="/companies" element={<Companies />} />
              <Route path="/contactPerson" element={<ContactPerson />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/update/:category/:id" element={<Update />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </UserInfoProvider>
  );
}

export default App;
