import { useContext } from "react";
import { UserInfoContext } from "../context/userInfoContext";

export function useUserInfo() {
  const context = useContext(UserInfoContext);

  if (!context) {
    throw new Error("useUserInfo must be used inside UserInfoProvider");
  }

  return context;
}
