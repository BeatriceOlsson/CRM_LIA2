import { useUserInfo } from "../hooks/useUserInfo";

export function UsernameShowing({ className }) {
  const { userInformation } = useUserInfo();
  return (
    <div className={className}>
      <h2>
        {userInformation.firstName} {userInformation.lastName}
      </h2>
    </div>
  );
}
