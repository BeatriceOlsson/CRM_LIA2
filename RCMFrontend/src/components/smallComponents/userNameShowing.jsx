import { useUserInfo } from "../hooks/useUserInfo";

export function UsernameShowing() {
  const { userInformation } = useUserInfo();
  return (
    <div>
      <h2>
        {userInformation.firstName} {userInformation.lastName}
      </h2>
    </div>
  );
}
