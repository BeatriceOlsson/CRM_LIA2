import { useEffect, useState } from "react";
import { SelectedOptionLoop } from "../smallComponents/selectedOptionLoop";
import CommunicateBackend from "../communicateBackend";
import { SeartchFuntion } from "../smallComponents/seartchFuntion";
import { ButtonComponent } from "../smallComponents/buttonComponent";
import { ErrorHandler } from "../smallComponents/errorHandler";
import { NumberFilterComponent } from "./numberFilterComponent";

export function FilterComponent({ filterType, filterTitel, filterOn }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [filterSelected, setFilterSelected] = useState({
    salesStatus: [],
    companyID: "",
    contactPersonID: "",
    userID: "",
    calculation: "",
    smallestNumber: "",
    highestNumber: "",
    filterType: "",
  });
  const [companyList, setCompanyList] = useState([]);
  const [contactList, setContactList] = useState([]);
  const [userList, setUserList] = useState([]);

  let fiterCheckbox = [];
  let companyName = false;
  let contactPersonName = false;
  let userName = false;
  let companyAdress = false;

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const response = await CommunicateBackend({
          url: "/company/allCompanyInfo",
          crud: "GET",
        });

        if (response instanceof Error) {
          return setErrorMessage(response);
        }
        setCompanyList(response);
      } catch (error) {
        return setErrorMessage(error);
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
          return setErrorMessage(response);
        }

        setContactList(response);
      } catch (error) {
        return setErrorMessage(error);
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
          return setErrorMessage(response);
        }

        setUserList(response);
      } catch (error) {
        return setErrorMessage(error);
      }
    };

    loadSales();
  }, []);

  switch (filterType) {
    case "CP":
      companyName = true;
      contactPersonName = true;
      break;
    case "CL":
      companyName = true;
      companyAdress = true;
      break;
    case "sales":
      fiterCheckbox = [
        { salesStatus: "Draft", label: "Utkast" },
        { salesStatus: "Sent", label: "Skickat" },
      ];
      companyName = true;
      contactPersonName = true;
      userName = true;
      break;
  }

  const handelChange = (value) => {
    if (filterSelected.salesStatus.includes(value)) {
      setFilterSelected((prev) => ({
        ...prev,
        salesStatus: prev.salesStatus.filter((item) => item !== value),
      }));
    } else {
      setFilterSelected((prev) => ({
        ...prev,
        salesStatus: [...prev.salesStatus, value],
      }));
    }
  };

  const handelDropDown = (name, value) => {
    setFilterSelected((prev) => ({ ...prev, [name]: value }));
  };

  const handelNumberChange = (name, value, filterType) => {
    setFilterSelected((prev) => ({
      ...prev,
      [name]: value,
      filterType: filterType,
    }));
  };

  const SendFilter = () => {
    filterOn?.(filterSelected);
  };

  return (
    <div>
      <h2 className="text-xl mt-13">{filterTitel}</h2>
      <div>
        {fiterCheckbox.length > 0 &&
          fiterCheckbox.map((label, index) => (
            <div key={index}>
              <label>
                <input
                  type="checkbox"
                  checked={filterSelected.salesStatus.includes(
                    label.salesStatus,
                  )}
                  onChange={() => handelChange(label.salesStatus)}
                  className="mx-3 mb-1"
                />
                <span>{label.label}</span>
              </label>
            </div>
          ))}
        {companyName === true && (
          <SelectedOptionLoop
            className={"ml-2.5 my-2"}
            name="companyID"
            text="Välj företag..."
            value={filterSelected.companyID}
            onChange={(e) => handelDropDown("companyID", e.target.value)}
            arrayList={companyList.map((c) => ({
              value: c.companyID,
              label: c.companyName,
            }))}
          />
        )}
        {companyAdress === true && (
          <SeartchFuntion
            className={"m-2"}
            titel={"adress"}
            arrayList={companyList}
            seartchFiled={"adress"}
            onSelect={(companyID) =>
              setFilterSelected((prev) => ({ ...prev, companyID }))
            }
          />
        )}
        {contactPersonName === true && (
          <SeartchFuntion
            className={"m-2"}
            titel={"motagare"}
            arrayList={contactList}
            onSelect={(contactPersonID) =>
              setFilterSelected((prev) => ({ ...prev, contactPersonID }))
            }
          />
        )}
        {userName === true && (
          <SeartchFuntion
            className={"m-2"}
            titel={"säljare"}
            arrayList={userList}
            onSelect={(userID) =>
              setFilterSelected((prev) => ({ ...prev, userID }))
            }
          />
        )}
        {filterType === "CL" && (
          <details className="cursor-pointer mb-2 ml-2">
            <summary>Total värde:</summary>
            <NumberFilterComponent
              filterType={"totalValue"}
              onChange={handelNumberChange}
            />
          </details>
        )}
        {filterType === "sales" && (
          <div>
            <details className="cursor-pointer mb-2 ml-2">
              <summary>Inteckt</summary>
              <NumberFilterComponent
                filterType={"salesValue"}
                onChange={handelNumberChange}
              />
            </details>
            <details className="cursor-pointer mb-2 ml-2">
              <summary>Kosnad</summary>
              <NumberFilterComponent
                filterType={"purcheseValue"}
                onChange={handelNumberChange}
              />
            </details>
            <details className="cursor-pointer mb-2 ml-2">
              <summary>Skilnaden</summary>
              <NumberFilterComponent
                filterType={"differenceValue"}
                onChange={handelNumberChange}
              />
            </details>
            <details className="cursor-pointer mb-2 ml-2">
              <summary>Prosent</summary>
              <NumberFilterComponent
                filterType={"percentageDifferense"}
                onChange={handelNumberChange}
              />
            </details>
          </div>
        )}
      </div>
      <ButtonComponent
        buttonText={"Filtrera"}
        className={"mx-2"}
        buttonClick={SendFilter}
      />
      {errorMessage && <ErrorHandler error={errorMessage} />}
    </div>
  );
}
