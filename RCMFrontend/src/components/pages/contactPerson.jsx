import { useEffect, useState } from "react";
import CommunicateBackend from "../communicateBackend";
import { LoadingHandling } from "../smallComponents/loadingHandeler";
import { ErrorHandler } from "../smallComponents/errorHandler";
import { TablesComponent } from "../listComponent/tablesComponent";
import { ButtonComponent } from "../smallComponents/buttonComponent";
import RegisterUser from "../register/register";
import { PriviesNextButton } from "../smallComponents/priviesNextButton";
import { FilterComponent } from "../listComponent/filterComponent";

function ContactPerson() {
  const [contactPerson, setContactPerson] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [regesterPopUpp, setRegesterPopUpp] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState({
    salesStatus: [],
    companyID: "",
    contactPersonID: "",
    usersID: "",
  });

  useEffect(() => {
    const getAllUsers = async () => {
      setIsLoading(true);
      setErrorMessage("");
      try {
        let responsData = [];

        const filterData =
          selectedFilter.companyID !== "" ||
          selectedFilter.contactPersonID !== "";

        if (filterData) {
          responsData = await CommunicateBackend({
            url: "/filter/filterPersons",
            crud: "POST",
            body: selectedFilter,
          });
        } else {
          responsData = await CommunicateBackend({
            url: "/contactPerson/contactPerson",
            crud: "GET",
          });
        }

        if (!Array.isArray(responsData)) {
          throw new Error("Kunde inte hämta personer.");
        }
        setContactPerson(responsData);
      } catch (error) {
        setErrorMessage(error);
      } finally {
        setIsLoading(false);
      }
    };

    getAllUsers();
  }, [selectedFilter]);

  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPerson = contactPerson.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const havePrevius = currentPage > 1;
  const hasNext = startIndex + itemsPerPage < contactPerson.length;

  const registerUserOpen = () => {
    setRegesterPopUpp(!regesterPopUpp);
  };

  const handelPrevius = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handelNext = () => {
    setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="grid grid-cols-[1fr_5fr]">
      <div className="grid columns-1">
        <div className="m-3">
          <FilterComponent
            filterType={"CP"}
            filterTitel={"Personer filter"}
            filterOn={setSelectedFilter}
          />
        </div>
      </div>
      <div>
        <div className="flex justify-end">
          <ButtonComponent
            buttonText={"Registrera Person"}
            onMouseDown={registerUserOpen}
            className="mx-4"
          />
          <RegisterUser
            isOpen={regesterPopUpp}
            onClose={() => setRegesterPopUpp(false)}
          />
        </div>
        <div className="mr-20 my-5">
          {isLoading ? (
            <LoadingHandling />
          ) : errorMessage ? (
            <ErrorHandler error={errorMessage} />
          ) : contactPerson.length > 0 ? (
            <div>
              <TablesComponent dataType={"CP"} dataArray={currentPerson} />
              <PriviesNextButton
                previus={handelPrevius}
                next={handelNext}
                hasPrevius={havePrevius}
                hasNext={hasNext}
              />
            </div>
          ) : (
            <p>Inga personer hittades med de valda filtren.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ContactPerson;
