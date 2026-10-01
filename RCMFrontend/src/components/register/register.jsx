import { useEffect, useState } from "react";
import { ButtonComponent } from "../smallComponents/buttonComponent";
import { InputFieldComponent } from "../smallComponents/inputFieldComponent";
import { ErrorHandler } from "../smallComponents/errorHandler";
import CommunicateBackend from "../communicateBackend";
import RegisterCompany from "../register/registerCompany";
import { PopUpp } from "../smallComponents/popUpp";

function RegisterUser({ isOpen, onClose }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [companyList, setCompanyList] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [isCompanyPopupOpen, setIsCompanyPopupOpen] = useState(false);

  const registerUserForm = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = {
      ...Object.fromEntries(formData.entries()),
      companyName: selectedCompany,
    };

    try {
      const response = await CommunicateBackend({
        url: "/contactPerson/register",
        crud: "POST",
        body: data,
      });

      if (response instanceof Error) {
        setErrorMessage(response.message || "Fel uppstog.");
        return;
      }

      onClose?.();
    } catch (error) {
      setErrorMessage(error || "Fel uppstog");
    }
  };

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const response = await CommunicateBackend({
          url: "/company/companyList",
          crud: "GET",
        });

        if (response instanceof Error) {
          return setErrorMessage(response.message || "Fel uppstog");
        }

        setCompanyList(response);
      } catch (error) {
        setErrorMessage(error || "Fel uppstog");
      }
    };

    loadCompanies();
  }, []);

  return (
    <div>
      <PopUpp
        isOpen={isOpen}
        content={
          <div className="relative">
            <form
              onSubmit={registerUserForm}
              className="flex flex-col items-center gap-3 mb-5"
            >
              <InputFieldComponent
                type={"text"}
                name={"firstName"}
                placeholder={"Förnamn"}
              />
              <InputFieldComponent
                type={"text"}
                name={"lastName"}
                placeholder={"Efternamn"}
              />
              <InputFieldComponent
                type={"email"}
                name={"email"}
                placeholder={"Email"}
              />
              <InputFieldComponent
                type={"password"}
                name={"password"}
                placeholder={"Lösenord"}
              />
              <select
                value={selectedCompany}
                onChange={(e) => {
                  const value = e.target.value;

                  if (value === "addCompany") {
                    setSelectedCompany("");
                    setIsCompanyPopupOpen(true);
                    return;
                  }

                  setSelectedCompany(value);
                }}
                className="w-46 border-2 rounded-lg border-teal-400 mb-3"
              >
                <option value="">Välj företag</option>
                <option value="addCompany">Läg till företag</option>
                {companyList.map((company, index) => (
                  <option key={index} value={company.companyName}>
                    {company.companyName}
                  </option>
                ))}
              </select>
              <div className=" flex flex-row gap-3">
                <ButtonComponent
                  type="submit"
                  buttonText={"Registrera användare"}
                  className="text-sm/tight"
                />
                <ButtonComponent
                  buttonText={"Stäng fönster"}
                  buttonClick={onClose}
                />
              </div>
            </form>
            <div className="absolute top-79">
              {errorMessage && <ErrorHandler error={errorMessage} />}
            </div>
            <RegisterCompany
              isOpen={isCompanyPopupOpen}
              onClose={() => setIsCompanyPopupOpen(false)}
            />
          </div>
        }
      />
    </div>
  );
}

export default RegisterUser;
