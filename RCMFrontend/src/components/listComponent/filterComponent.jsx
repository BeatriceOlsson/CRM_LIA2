import { useEffect, useState } from "react";
import { SelectedOptionLoop } from "../smallComponents/selectedOptionLoop";
import CommunicateBackend from "../communicateBackend";
import { SeartchFuntion } from "../smallComponents/seartchFuntion";
import { ButtonComponent } from "../smallComponents/buttonComponent";

export function FilterComponent({ filterType, filterTitel, filterOn }) {
  const [filterSelected, setFilterSelected] = useState({
    salesStatus: [],
    companyID: "",
    contactPersonID: "",
    usersID: "",
  });
  const [companyList, setCompanyList] = useState([]);
  const [contactList, setContactList] = useState([]);
  const [userList, setUserList] = useState([]);

  let fiterCheckbox = [];
  let companyName = false;
  let contactPersonName = false;
  let userName = false;

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const response = await CommunicateBackend({
          url: "/company/allCompanyInfo",
          crud: "GET",
        });

        if (response instanceof Error) {
          return console.log(Error);
        }

        setCompanyList(response);
      } catch (error) {
        return console.log(error);
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
          return console.log(Error);
        }

        setContactList(response);
      } catch (error) {
        return console.log(error);
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
          return console.log(Error);
        }

        setUserList(response);
      } catch (error) {
        return console.log(error);
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

  const handelDropDown = (e) => {
    const { name, value } = e.target;

    setFilterSelected((prev) => ({ ...prev, [name]: value }));
  };

  const SendFilter = () => {
    filterOn?.(filterSelected);
  };

  useEffect(() => {
    console.log();
  }, [filterSelected]);

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
            onChange={(e) => handelDropDown(e)}
            arrayList={companyList.map((c) => ({
              value: c.companyID,
              label: c.companyName,
            }))}
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
            onSelect={(usersID) =>
              setFilterSelected((prev) => ({ ...prev, usersID }))
            }
          />
        )}
      </div>
      <ButtonComponent
        buttonText={"Filtrera"}
        className={"mx-2"}
        buttonClick={SendFilter}
      />
    </div>
  );
}
