import { ButtonComponent } from "../smallComponents/buttonComponent";
import { UsernameShowing } from "../smallComponents/userNameShowing";
import { useUserInfo } from "../hooks/useUserInfo";
import { Link } from "react-router-dom";

function Menu() {
  const { statusLoggedOut } = useUserInfo();
  return (
    <header className="mt-4">
      <div className="flex justify-end items-center font-semibold gap-4">
        <UsernameShowing />
        <ButtonComponent
          buttonClick={statusLoggedOut}
          buttonText={"Loga ut"}
          className="mr-4"
        />
      </div>
      <div className="flex justify-center mt-9">
        <div className="flex flex-row gap-4 items-center border-2 px-9 font-semibold bg-teal-100 border-teal-500 rounded-md text-lg ">
          <Link
            to={"/"}
            className="hover:underline hover:text-amber-600 active:text-red-700 p-2"
          >
            Hem
          </Link>
          <Link
            to={"/companies"}
            className="hover:underline hover:text-amber-600 active:text-red-700 p-2"
          >
            Företag
          </Link>
          <Link
            to={"/contactPerson"}
            className="hover:underline hover:text-amber-600 active:text-red-700 p-2"
          >
            Personer
          </Link>
          <Link
            to={"/sales"}
            className="hover:underline hover:text-amber-600 active:text-red-700 p-2"
          >
            Försäljningar
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Menu;
