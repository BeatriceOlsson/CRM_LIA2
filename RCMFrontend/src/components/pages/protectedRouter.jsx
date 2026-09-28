import { Navigate, Outlet } from "react-router-dom";
import { useUserInfo } from "../hooks/useUserInfo";
import { LoadingHandling } from "../smallComponents/loadingHandeler";
import Menu from "./meny";

export function ProtectedRoutes() {
  const { isLoggedIn, loading } = useUserInfo();

  if (loading) {
    return (
      <div>
        <LoadingHandling />
      </div>
    );
  }

  return isLoggedIn ? (
    <div>
      <Menu />
      <Outlet />
    </div>
  ) : (
    <Navigate to="Login" replace />
  );
}
