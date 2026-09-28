import { useEffect, useState } from "react";
import { ButtonComponent } from "../smallComponents/buttonComponent";
import { InputFieldComponent } from "../smallComponents/inputFieldComponent";
import { ErrorHandler } from "../smallComponents/errorHandler";
import CommunicateBackend from "../communicateBackend";
import RegisterCompany from "../companyFuntionsCompnnents/registerCompany";

function RegisterUser() {
  const [errorMessage, setErrorMessage] = useState("");
  const [companyList, setCompanyList] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [isCompanyPopupOpen, setIsCompanyPopupOpen] = useState(false);

  const registerUserForm = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = {
      ...Object.fromEntries(formData.entries()),
      companyName: selectedCompany,
    };
    console.log(data);
    try {
      const response = CommunicateBackend({
        url: "/user/register",
        crud: "POST",
        body: data,
      });

      if (response instanceof Error) {
        setErrorMessage(response.message || "Fel uppstog.");
      }
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
      <form onSubmit={registerUserForm}>
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
          className="overflow-y-auto"
        >
          <option value="">Välj företag</option>
          <option value="addCompany">Läg till företag</option>
          {companyList.map((company, index) => (
            <option key={index} value={company.companyName}>
              {company.companyName}
            </option>
          ))}
        </select>
        <ButtonComponent
          type="submit"
          buttonText={"Registrera användare"}
          className="text-sm/tight"
        />
      </form>
      {errorMessage && <ErrorHandler error={errorMessage} />}
      <RegisterCompany
        isOpen={isCompanyPopupOpen}
        onClose={() => setIsCompanyPopupOpen(false)}
      />
    </div>
  );
}

export default RegisterUser;
