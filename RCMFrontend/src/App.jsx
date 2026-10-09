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
      <DeleteProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/Login" element={<Login />} />
            <Route element={<ProtectedRoutes />}>
              <Route path="/" element={<Page />} />
              <Route path="/companies" element={<Companies />} />
              <Route path="/contactPerson" element={<ContactPerson />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/update/:category/:id" element={<Update />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </DeleteProvider>
    </UserInfoProvider>
  );
}

export default App;
