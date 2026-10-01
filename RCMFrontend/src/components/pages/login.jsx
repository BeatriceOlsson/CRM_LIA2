import { InputFieldComponent } from "../smallComponents/inputFieldComponent";
import { ButtonComponent } from "../smallComponents/buttonComponent";
import CommunicateBackend from "../communicateBackend";
import { ErrorHandler } from "../smallComponents/errorHandler";
import { useUserInfo } from "../hooks/useUserInfo";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Login() {
  const [errorMessage, setErrorMessage] = useState("");
  const { placeUserInfo } = useUserInfo();
  const navigate = useNavigate();

  const logInuser = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await CommunicateBackend({
        url: "/contactPerson/login",
        crud: "POST",
        body: data,
      });

      if (response instanceof Error) {
        setErrorMessage(response.message || "Fel uppstog");
      }

      navigate("/", { replace: true });
      placeUserInfo(response.user);
    } catch (error) {
      setErrorMessage(error || "Fel uppstog");
    }
  };

  return (
    <div className="relative bg-[url(/public/ian-dooley-DJ7bWa-Gwks-unsplash.jpg)] bg-cover bg-center bg-no-repeat ">
      <div className="flex justify-center items-center h-screen bg-gardient-to-rl from-whit from-50% to-gray-200 to-50% ">
        <div className="flex flex-col items-center bg-cyan-50 border-2 py-12 px-5 border-teal-400 rounded-md relative">
          <form
            onSubmit={logInuser}
            className="flex flex-col items-center gap-1"
          >
            <InputFieldComponent
              type={"email"}
              name={"email"}
              placeholder={"E-mail"}
            />
            <InputFieldComponent
              type={"password"}
              name={"password"}
              placeholder={"Lösenord"}
            />
            <ButtonComponent type="submit" buttonText={"Loga in"} />
          </form>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center text-center">
            {errorMessage && <ErrorHandler error={errorMessage} />}
          </div>
        </div>
      </div>
    </div>
  );
}
