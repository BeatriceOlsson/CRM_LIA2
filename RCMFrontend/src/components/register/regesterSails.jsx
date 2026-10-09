import { useEffect, useState } from "react";
import { PopUpp } from "../smallComponents/popUpp";
import { InputFieldComponent } from "../smallComponents/inputFieldComponent";
import CommunicateBackend from "../communicateBackend";
import { SelectedOptionLoop } from "../smallComponents/selectedOptionLoop";
import { ErrorHandler } from "../smallComponents/errorHandler";
import { ButtonComponent } from "../smallComponents/buttonComponent";

function RegisterSails({ isOpen, onClose }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [companyList, setCompanyList] = useState([]);
  const [contactList, setContactList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [selectedData, setSelectedData] = useState({
    salesStatus: "",
    companyID: "",
    contactPersonID: "",
    userID: "",
  });

  const regesterSales = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const data = {
      ...Object.fromEntries(formData.entries()),
      salesStatus: selectedData.salesStatus,
      companyID: selectedData.companyID,
      contactPersonID: selectedData.contactPersonID,
      userID: selectedData.userID,
    };

    try {
      const response = await CommunicateBackend({
        url: "/sales/registerSales",
        crud: "POST",
        body: data,
      });

      if (response instanceof Error) {
        setErrorMessage(response.message || "Fel uppstog.");
        return;
      } else {
        setErrorMessage("");
        onClose?.();
      }
    } catch (error) {
      setErrorMessage(error || "Fel uppstog");
    }
  };

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const response = await CommunicateBackend({
          url: "/company/allCompanyInfo",
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

  useEffect(() => {
    const loadContact = async () => {
      try {
        const response = await CommunicateBackend({
          url: "/contactPerson/contactPerson",
          crud: "GET",
        });

        if (response instanceof Error) {
          return setErrorMessage(response.message || "Fel uppstog");
        }

        setContactList(response);
      } catch (error) {
        setErrorMessage(error || "Fel uppstog");
      }
    };

    loadContact();
  }, []);

  useEffect(() => {
    const loadSales = async () => {
      try {
        const response = await CommunicateBackend({
          url: "/users/userPersonList",
          crud: "GET",
        });

        if (response instanceof Error) {
          return setErrorMessage(response.message || "Fel uppstog");
        }

        setUserList(response);
      } catch (error) {
        setErrorMessage(error || "Fel uppstog");
      }
    };

    loadSales();
  }, []);

  const handelChange = (e) => {
    const { name, value } = e.target;

    setSelectedData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <PopUpp
        isOpen={isOpen}
        content={
          <div className="relative">
            <form
              onSubmit={regesterSales}
              className="flex flex-col items-center gap-1 mb-10"
            >
              <InputFieldComponent
                type={"number"}
                name={"salesValue"}
                placeholder={"Summa (SKR)"}
              />
              <InputFieldComponent
                type={"number"}
                name={"purcheseValue"}
                placeholder={"Inköps pris"}
              />
              <InputFieldComponent
                type={"text"}
                name={"title"}
                placeholder={"Försäljnings titel"}
              />
              <select
                name="salesStatus"
                value={selectedData.salesStatus}
                onChange={handelChange}
                className="w-46 border-2 rounded-lg border-teal-400 mb-1"
              >
                <option value="">Välj status...</option>
                <option value={"Draft"}>Utkast</option>
                <option value={"Sent"}>Skickat</option>
              </select>
              <SelectedOptionLoop
                className={"mb-1"}
                name="companyID"
                text="Välj företag..."
                value={selectedData.companyID}
                onChange={handelChange}
                arrayList={companyList.map((c) => ({
                  value: c.companyID,
                  label: c.companyName,
                }))}
              />
              <SelectedOptionLoop
                className={"mb-1"}
                name="contactPersonID"
                text="Välj motagare..."
                value={selectedData.contactPersonID}
                onChange={handelChange}
                arrayList={contactList.map((c) => ({
                  value: c.contactPersonID,
                  label: `${c.firstName} ${c.lastName}`,
                }))}
              />
              <SelectedOptionLoop
                className={"mb-1"}
                name="userID"
                text="Välj ägare..."
                value={selectedData.userID}
                onChange={handelChange}
                arrayList={userList.map((s) => ({
                  value: s.userID,
                  label: `${s.firstName} ${s.lastName}`,
                }))}
              />
              <div className="flex flex-row gap-3">
                <ButtonComponent
                  type="submit"
                  buttonText={"Skicka försäljning"}
                />
                <ButtonComponent
                  buttonText={"Stäng fönstret"}
                  buttonClick={onClose}
                />
              </div>
            </form>
            <div className="absolute top-70">
              {errorMessage && <ErrorHandler error={errorMessage} />}
            </div>
          </div>
        }
      />
    </div>
  );
}

export default RegisterSails;
