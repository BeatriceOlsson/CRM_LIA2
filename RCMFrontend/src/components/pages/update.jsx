import { useParams } from "react-router-dom";
import CommunicateBackend from "../communicateBackend";
import { useEffect, useState } from "react";
import { InputFieldComponent } from "../smallComponents/inputFieldComponent";
import { SelectedOptionLoop } from "../smallComponents/selectedOptionLoop";
import { ButtonComponent } from "../smallComponents/buttonComponent";
import { ErrorHandler } from "../smallComponents/errorHandler";
import { LoadingHandling } from "../smallComponents/loadingHandeler";
import { useDelete } from "../hooks/useDelete";

function Update() {
  const { category, id } = useParams();
  const { deleteHandler } = useDelete();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sailsList, setSailsList] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [contactList, setContactList] = useState([]);
  const [dataHollder, setDataHollder] = useState({
    salesID: "",
    salesValue: "",
    salesStatus: "",
    title: "",
    purcheseValue: "",
    companyID: "",
    companyName: "",
    firstName: "",
    lastName: "",
    orgNr: "",
    adress: "",
    contactPersonID: "",
    email: "",
    userID: "",
  });

  useEffect(() => {
    const loadSales = async () => {
      setIsLoading(true);
      try {
        const responseUser = await CommunicateBackend({
          url: "/users/userPersonList",
          crud: "GET",
        });

        const responseCompany = await CommunicateBackend({
          url: "/company/allCompanyInfo",
          crud: "GET",
        });

        const responseContact = await CommunicateBackend({
          url: "/contactPerson/contactPerson",
          crud: "GET",
        });

        if (
          responseUser instanceof Error ||
          responseCompany instanceof Error ||
          responseContact instanceof Error
        ) {
          return setErrorMessage("Kunde inte hämta data.");
        }

        setSailsList(responseUser || []);
        setCompanyList(responseCompany || []);
        setContactList(responseContact || []);

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setErrorMessage(error || "Fel uppstog");
      }
    };
    loadSales();
  }, []);

  const updateData = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const data = {
      ...Object.fromEntries(formData.entries()),
      salesStatus: dataHollder.salesStatus,
      companyID: dataHollder.companyID,
      contactPersonID: dataHollder.contactPersonID,
      userID: dataHollder.userID,
      salesID: dataHollder.salesID,
    };

    let url;

    switch (category) {
      case "CP":
        url = "/contactPerson/update";
        break;
      case "CL":
        url = "/company/update";
        break;
      case "sales":
        url = "/sales/update";
        break;
      default:
        return;
    }

    try {
      const response = await CommunicateBackend({
        url,
        crud: "PUT",
        body: data,
      });

      if (response instanceof Error) {
        setErrorMessage(response);
      }

      setErrorMessage(response);
    } catch (error) {
      setErrorMessage(error);
    }
  };

  useEffect(() => {
    let url;

    switch (category) {
      case "CP":
        url = "/contactPerson/contactOnID";
        break;
      case "CL":
        url = "/company/companyIdData";
        break;
      case "sales":
        url = "/sales/salesID";
        break;
      default:
        return;
    }

    let isCurrent = true;

    const loadIdData = async () => {
      setIsLoading(true);

      try {
        const response = await CommunicateBackend({
          url,
          crud: "POST",
          body: { id },
        });

        if (response instanceof Error) {
          return setErrorMessage(response);
        }

        if (isCurrent) {
          setDataHollder(response[0]);
        }
        setIsLoading(false);
      } catch (error) {
        setErrorMessage(error);
      }
    };

    loadIdData();

    return () => {
      isCurrent = false;
    };
  }, [category, id, setIsLoading]);

  let salesValueInput = false;
  let salesStatusInput = false;
  let titleInput = false;
  let purcheseValueInput = false;

  let companyNameInput = false;
  let companyName = false;
  let orgNrInput = false;
  let adressInput = false;

  let showcontact = false;
  let firstName = false;
  let lastName = false;
  let emailInput = false;

  let sailsSelect = false;

  switch (category) {
    case "CP":
      firstName = true;
      lastName = true;
      emailInput = true;
      companyNameInput = true;
      break;

    case "CL":
      companyName = true;
      orgNrInput = true;
      adressInput = true;
      break;

    case "sales":
      salesValueInput = true;
      salesStatusInput = true;
      titleInput = true;
      purcheseValueInput = true;
      companyNameInput = true;
      showcontact = true;
      sailsSelect = true;
      break;
  }

  const handelChange = (e) => {
    const { name, value } = e.target;

    setDataHollder((prev) => ({ ...prev, [name]: value }));
  };

  const handelDelete = async () => {
    setErrorMessage("");
    const result = await deleteHandler(category, id);
    setErrorMessage(result.message);
  };

  return (
    <div>
      <div className="flex justify-center items-center my-5 flex-col">
        {category === "CL" && (
          <div className="flex flex-row items-center m-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-13"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
              />
            </svg>
            <h2 className="font-semibold text-lg">Företag</h2>
          </div>
        )}
        {category === "CP" && (
          <div className="flex flex-row justify-center items-center gap-2 m-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-13"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
            <h2 className="font-semibold text-lg m">Personer</h2>
          </div>
        )}
        {category === "sales" && (
          <div className="flex flex-row items-center gap-2 m-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-13"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm2.498-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5v2.25h-7.5V6ZM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0 0 12 2.25Z"
              />
            </svg>
            <h2 className="font-semibold text-lg m">Försäljning</h2>
          </div>
        )}

        {isLoading === false ? (
          <form onSubmit={updateData}>
            <div className="flex flex-col items-center gap-1">
              {showcontact === true && (
                <div>
                  <SelectedOptionLoop
                    labelText={"Välj motagare..."}
                    className={"mb-1"}
                    name="contactPersonID"
                    text="Välj motagare..."
                    value={dataHollder.contactPersonID}
                    onChange={handelChange}
                    arrayList={contactList.map((s) => ({
                      value: s.contactPersonID,
                      label: `${s.firstName} ${s.lastName}`,
                    }))}
                  />
                </div>
              )}

              {firstName === true && (
                <InputFieldComponent
                  labelText={"Förnamn..."}
                  type={"text"}
                  name="firstName"
                  onChange={handelChange}
                  placeholder={"Förnamn..."}
                  value={dataHollder.firstName}
                />
              )}

              {lastName === true && (
                <InputFieldComponent
                  labelText={"Efternamn..."}
                  type={"text"}
                  name="lastName"
                  onChange={handelChange}
                  placeholder={"Efternamn..."}
                  value={dataHollder.lastName}
                />
              )}

              {companyNameInput === true && (
                <div>
                  <SelectedOptionLoop
                    labelText={"Välj företag..."}
                    className={"mb-1"}
                    name="companyID"
                    text="Välj företag..."
                    value={dataHollder.companyID}
                    onChange={handelChange}
                    arrayList={companyList.map((s) => ({
                      value: s.companyID,
                      label: `${s.companyName}`,
                    }))}
                  />
                </div>
              )}

              {companyName === true && (
                <InputFieldComponent
                  labelText={"Företagsnamn..."}
                  type={"text"}
                  name="companyName"
                  onChange={handelChange}
                  placeholder={"Företagsnamn..."}
                  value={dataHollder.companyName}
                />
              )}

              {emailInput === true && (
                <div>
                  <InputFieldComponent
                    labelText={"Email..."}
                    type={"email"}
                    name="email"
                    onChange={handelChange}
                    placeholder={"Email..."}
                    value={dataHollder.email || ""}
                  />
                </div>
              )}

              {orgNrInput === true && (
                <div>
                  <InputFieldComponent
                    labelText={"Orgenisationsnumer..."}
                    type={"text"}
                    name="orgNr"
                    onChange={handelChange}
                    placeholder={"Orgenisationsnumer..."}
                    value={dataHollder.orgNr || ""}
                  />
                </div>
              )}

              {adressInput === true && (
                <div>
                  <InputFieldComponent
                    labelText={"Adress..."}
                    type={"text"}
                    name="adress"
                    onChange={handelChange}
                    placeholder={"Adress..."}
                    value={dataHollder.adress || ""}
                  />
                </div>
              )}

              {salesStatusInput === true && (
                <div>
                  <div>
                    <label className="text-lg">Välj status...</label>
                  </div>
                  <select
                    name="salesStatus"
                    onChange={handelChange}
                    value={dataHollder.salesStatus}
                    className="w-46 border-2 rounded-lg border-teal-400 mb-1"
                  >
                    <option value="">Välj status...</option>
                    <option value={"Draft"}>Utkast</option>
                    <option value={"Sent"}>Skickat</option>
                  </select>
                </div>
              )}

              {titleInput === true && (
                <div>
                  <InputFieldComponent
                    labelText={"Försäljnings titel..."}
                    type={"text"}
                    name="title"
                    onChange={handelChange}
                    placeholder={"Försäljnings titel..."}
                    value={dataHollder.title}
                  />
                </div>
              )}

              {salesValueInput === true && (
                <div>
                  <InputFieldComponent
                    labelText={"Summa (SKR)..."}
                    type={"number"}
                    name="salesValue"
                    onChange={handelChange}
                    placeholder={"Summa (SKR)..."}
                    value={dataHollder.salesValue || ""}
                  />
                </div>
              )}

              {purcheseValueInput === true && (
                <div>
                  <InputFieldComponent
                    labelText={"Inköps pris..."}
                    type={"number"}
                    name="purcheseValue"
                    onChange={handelChange}
                    placeholder={"Inköps pris..."}
                    value={dataHollder.purcheseValue || ""}
                  />
                </div>
              )}

              {sailsSelect === true && (
                <div>
                  <SelectedOptionLoop
                    labelText={"Välj ägare..."}
                    className={"mb-1"}
                    name="userID"
                    text="Välj ägare..."
                    value={dataHollder.userID}
                    onChange={handelChange}
                    arrayList={sailsList.map((s) => ({
                      value: s.userID,
                      label: `${s.firstName} ${s.lastName}`,
                    }))}
                  />
                </div>
              )}
              <div className="flex justify-center m-2 gap-2">
                <ButtonComponent
                  buttonText={
                    <div className="flex flex-row justify-center items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                        />
                      </svg>
                      <p>Uppdatera</p>{" "}
                    </div>
                  }
                  type="submit"
                />
                <ButtonComponent
                  onMouseDown={handelDelete}
                  buttonText={
                    <div className="flex flex-row justify-center items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                      </svg>
                      <p>Radera</p>
                    </div>
                  }
                />
              </div>
            </div>
            <div className="flex justify-center">
              {errorMessage && <ErrorHandler error={errorMessage} />}
            </div>
          </form>
        ) : (
          <LoadingHandling />
        )}
      </div>
    </div>
  );
}

export default Update;
