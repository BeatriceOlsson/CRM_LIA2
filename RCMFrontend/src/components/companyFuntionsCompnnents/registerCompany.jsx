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
      }

      setErrorMessage("Företaget har adderats till systemet.");
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
          <div>
            <form onSubmit={saveCompany}>
              <InputFieldComponent
                type={"text"}
                name={"companyName"}
                placeholder={"Företags namn"}
              />
              <ButtonComponent type="submit" buttonText={"Skapa företag"} />
              <ButtonComponent
                type="button"
                buttonText={"Stäng fönster"}
                onMouseDown={onClose}
              />
            </form>
            {errorMessage && <ErrorHandler error={errorMessage} />}
          </div>
        }
      />
    </div>
  );
}

export default RegisterCompany;
