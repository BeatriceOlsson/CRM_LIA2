import { useState } from "react";
import CommunicateBackend from "../communicateBackend";
import { ButtonComponent } from "../smallComponents/buttonComponent";
import { InputFieldComponent } from "../smallComponents/inputFieldComponent";
import { ErrorHandler } from "../smallComponents/errorHandler";
import { PopUpp } from "../smallComponents/popUpp";

function RegisterCompany({ isOpen, onClose }) {
  const [errorMessage, setErrorMessage] = useState("");

  const saveCompany = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await CommunicateBackend({
        url: "/company/save",
        crud: "POST",
        body: data,
      });

      if (response instanceof Error) {
        return setErrorMessage(response.message || "Fel uppstog");
      }

      if (onClose) {
        onClose();
        e.currentTarget.reset();
        setErrorMessage("");
      }

      setErrorMessage("");
      e.currentTarget.reset();
    } catch (error) {
      setErrorMessage(error || "Fel uppstog");
    }
  };

  return (
    <div>
      <PopUpp
        isOpen={isOpen}
        content={
          <div className="relative">
            <form
              onSubmit={saveCompany}
              className="flex flex-col items-center gap-3"
            >
              <div>
                <InputFieldComponent
                  type={"text"}
                  name={"companyName"}
                  placeholder={"Företags namn"}
                />
                <InputFieldComponent
                  type={"text"}
                  name={"orgNr"}
                  placeholder={"Organisationsnummer"}
                />
                <InputFieldComponent
                  type={"text"}
                  name={"adress"}
                  placeholder={"Adress"}
                />
              </div>
              <div className="flex flex-row gap-3">
                <ButtonComponent type="submit" buttonText={"Skapa företag"} />
                <ButtonComponent
                  type="button"
                  buttonText={"Stäng fönster"}
                  buttonClick={onClose}
                />
              </div>
            </form>
            <div className="absolute top-40">
              {errorMessage && <ErrorHandler error={errorMessage} />}
            </div>
          </div>
        }
      />
    </div>
  );
}

export default RegisterCompany;
