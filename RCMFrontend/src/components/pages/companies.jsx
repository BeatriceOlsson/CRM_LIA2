import { useEffect, useState } from "react";
import CommunicateBackend from "../communicateBackend";
import { TablesComponent } from "../listComponent/tablesComponent";
import { LoadingHandling } from "../smallComponents/loadingHandeler";
import { ErrorHandler } from "../smallComponents/errorHandler";
import { ButtonComponent } from "../smallComponents/buttonComponent";
import RegisterCompany from "../register/registerCompany";
import { PriviesNextButton } from "../smallComponents/priviesNextButton";
import { FilterComponent } from "../listComponent/filterComponent";

function Companies() {
  const [companiesList, setCompaniesList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [regesterPopUpp, setRegesterPopUpp] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState({
    salesStatus: [],
    companyID: "",
    contactPersonID: "",
    userID: "",
  });

  useEffect(() => {
    const getAllCompanies = async () => {
      try {
        let responsData = [];

        const filterData = selectedFilter.companyID !== "";

        if (filterData) {
          responsData = await CommunicateBackend({
            url: "/filter/filterCompany",
            crud: "POST",
            body: selectedFilter,
          });
        } else {
          responsData = await CommunicateBackend({
            url: "/company/allCompanyInfo",
            crud: "GET",
          });
        }

        if (responsData instanceof Error) {
          setErrorMessage(Error);
        }

        setCompaniesList(responsData);
      } catch (error) {
        setErrorMessage(error);
      }
    };

    getAllCompanies();
  }, [selectedFilter]);

  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCompany = companiesList.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const havePrevius = currentPage > 1;
  const hasNext = startIndex + itemsPerPage < companiesList.length;

  const registerCompanyOpen = () => {
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
            filterType={"CL"}
            filterTitel={"Företag filter"}
            filterOn={setSelectedFilter}
          />
        </div>
      </div>
      <div>
        <div className="flex justify-end">
          <ButtonComponent
            buttonText={"Läg till företag"}
            onMouseDown={registerCompanyOpen}
            className="mx-4"
          />
          <RegisterCompany
            isOpen={regesterPopUpp}
            onClose={() => setRegesterPopUpp(false)}
          />
        </div>
        <div className="mr-20 my-5">
          {companiesList && companiesList.length > 0 ? (
            <div>
              <TablesComponent dataType={"CL"} dataArray={currentCompany} />
              <PriviesNextButton
                previus={handelPrevius}
                next={handelNext}
                hasPrevius={havePrevius}
                hasNext={hasNext}
              />
            </div>
          ) : (
            <LoadingHandling />
          )}
          {errorMessage && <ErrorHandler error={errorMessage} />}
        </div>
      </div>
    </div>
  );
}

export default Companies;
