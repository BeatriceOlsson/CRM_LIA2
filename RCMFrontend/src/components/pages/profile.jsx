import { useUserInfo } from "../hooks/useUserInfo";
import { UsernameShowing } from "../smallComponents/userNameShowing";
import { UserFilterTabel } from "../listComponent/userFilterdTabel";

function Profile() {
  const { userInformation } = useUserInfo();

  return (
    <div>
      <div className="grid grid-cols-4">
        <div className="grid col-1 ">
          <div className="flex justify-end">
            <img src="/public/user.png" className="w-40 h-auto m-3" />
          </div>
        </div>
        <div className="text-3xl font-bold ml-4 grid col-start-2 col-span-2">
          <div className="flex flex-col justify-center gap-3">
            <UsernameShowing />
            <h2>Företag: {userInformation.company}</h2>
          </div>
        </div>
      </div>
      <div>
        <UserFilterTabel />
      </div>
    </div>
  );
}

export default Profile;
