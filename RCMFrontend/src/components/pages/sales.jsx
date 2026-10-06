import { useEffect, useState } from "react";
import RegisterSails from "../register/regesterSails";
import { ButtonComponent } from "../smallComponents/buttonComponent";
import CommunicateBackend from "../communicateBackend";
import { TablesComponent } from "../listComponent/tablesComponent";
import { LoadingHandling } from "../smallComponents/loadingHandeler";
import { ErrorHandler } from "../smallComponents/errorHandler";
import { PriviesNextButton } from "../smallComponents/priviesNextButton";
import { FilterComponent } from "../listComponent/filterComponent";

function Sales() {
  const [regesterPopUpp, setRegesterPopUpp] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [salesList, setSails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState({
    salesStatus: [],
    companyID: "",
    contactPersonID: "",
    usersID: "",
  });

  useEffect(() => {
    const getAllSales = async () => {
      setIsLoading(true);
      setErrorMessage("");
      try {
        let responsData = [];

        const filterData =
          (selectedFilter.salesStatus &&
            selectedFilter.salesStatus.length > 0) ||
          selectedFilter.companyID !== "" ||
          selectedFilter.contactPersonID !== "" ||
          selectedFilter.usersID !== "";

        if (filterData) {
          responsData = await CommunicateBackend({
            url: "/filter/filterSales",
            crud: "POST",
            body: selectedFilter,
          });
        } else {
          responsData = await CommunicateBackend({
            url: "/sales/sales",
            crud: "GET",
          });
        }

        if (responsData instanceof Error) {
          setErrorMessage(Error);
        }

        if (!Array.isArray(responsData)) {
          throw new Error("Kunde inte hämta försäljningar.");
        }
        setSails(responsData);
      } catch (error) {
        setErrorMessage(error);
      } finally {
        setIsLoading(false);
      }
    };

    getAllSales();
  }, [selectedFilter]);

  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSails = salesList.slice(startIndex, startIndex + itemsPerPage);

  const havePrevius = currentPage > 1;
  const hasNext = startIndex + itemsPerPage < salesList.length;

  const regesterSalesOpen = () => {
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
        <div className=" m-3">
          <FilterComponent
            filterType={"sales"}
            filterTitel={"Försäljnings filter"}
            filterOn={setSelectedFilter}
          />
        </div>
      </div>
      <div>
        <div className="flex justify-end">
          <ButtonComponent
            buttonText={"Skicka försäljning"}
            onMouseDown={regesterSalesOpen}
            className="mx-4"
          />
          <RegisterSails
            isOpen={regesterPopUpp}
            onClose={() => setRegesterPopUpp(false)}
          />
        </div>
        <div className="mr-20 my-5">
          {isLoading ? (
            <LoadingHandling />
          ) : errorMessage ? (
            <ErrorHandler error={errorMessage} />
          ) : salesList.length > 0 ? (
            <div>
              <TablesComponent dataType={"sales"} dataArray={currentSails} />
              <PriviesNextButton
                previus={handelPrevius}
                next={handelNext}
                hasPrevius={havePrevius}
                hasNext={hasNext}
              />
            </div>
          ) : (
            <p>Inga försäljningar hittades med de valda filtren.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sales;
