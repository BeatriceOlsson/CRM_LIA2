import { useCallback, useEffect, useState } from "react";
import { UserInfoContext } from "./userInfoContext";
import CommunicateBackend from "../communicateBackend";

export function UserInfoProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userInformation, setUserInformation] = useState({
    firstName: "",
    lastName: "",
    company: "",
    contactPersonID: "",
    userID: "",
  });

  const statusLoggedOut = useCallback(async () => {
    setIsLoggedIn(false);
    setUserInformation({
      firstName: "",
      lastName: "",
      company: "",
      contactPersonID: "",
      userID: "",
    });

    try {
      await CommunicateBackend({
        url: "/contactPerson/logOut",
        crud: "POST",
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const statusLoggedIn = () => {
    setIsLoggedIn(true);
  };

  const placeUserInfo = (user) => {
    setUserInformation({
      firstName: user.firstName,
      lastName: user.lastName,
      company: user.company,
      contactPersonID: user.contactPersonID,
      userID: user.userID,
    });
    statusLoggedIn();
  };

  const verifyToken = async () => {
    setLoading(true);
    try {
      const token = await CommunicateBackend({
        url: "/contactPerson/validate",
        crud: "GET",
      });

      if (token instanceof Error) {
        setIsLoggedIn(false);
        return;
      }

      if (token && token.user) {
        placeUserInfo(token.user);
      } else {
        await statusLoggedOut();
      }
    } catch (error) {
      console.log(error);
      await statusLoggedOut();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(userInformation);
  }, [userInformation]);

  useEffect(() => {
    verifyToken();
  }, []);

  useEffect(() => {
    const handelExpier = () => {
      statusLoggedOut();
    };

    window.addEventListener("session-expired", handelExpier);
    return () => window.removeEventListener("session-expired", handelExpier);
  }, [statusLoggedOut]);

  const data = {
    placeUserInfo,
    statusLoggedOut,
    statusLoggedIn,
    verifyToken,
    isLoggedIn,
    userInformation,
    loading,
  };

  return (
    <UserInfoContext.Provider value={data}>{children}</UserInfoContext.Provider>
  );
}
