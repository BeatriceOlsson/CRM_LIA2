import { useEffect, useState } from "react";
import { UserInfoContext } from "./userInfoContext";
import CommunicateBackend from "../communicateBackend";

export function UserInfoProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userInformation, setUserInformation] = useState({
    firstName: "",
    lastName: "",
    company: "",
  });

  const statusLoggedOut = async () => {
    setIsLoggedIn(false);
    setUserInformation({ firstName: "", lastName: "", company: "" });

    try {
      await CommunicateBackend({
        url: "/user/logOut",
        crud: "POST",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const statusLoggedIn = () => {
    setIsLoggedIn(true);
  };

  const placeUserInfo = (user) => {
    setUserInformation({
      firstName: user.firstName,
      lastName: user.lastName,
      company: user.company,
    });
    statusLoggedIn();
  };

  const verifyToken = async () => {
    setLoading(true);
    try {
      const token = await CommunicateBackend({
        url: "/user/validate",
        crud: "GET",
      });
      console.log("token", token.user, token.length);
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

  /*useEffect(() => {
    console.log(userInformation);
  }, [userInformation]);*/

  useEffect(() => {
    verifyToken();
  }, []);

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
