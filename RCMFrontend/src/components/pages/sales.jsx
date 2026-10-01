import { useEffect, useState } from "react";
import RegisterSails from "../register/regesterSails";
import { ButtonComponent } from "../smallComponents/buttonComponent";
import CommunicateBackend from "../communicateBackend";
import { TablesComponent } from "../listComponent/tablesComponent";
import { LoadingHandling } from "../smallComponents/loadingHandeler";
import { ErrorHandler } from "../smallComponents/errorHandler";

function Sales() {
  const [regesterPopUpp, setRegesterPopUpp] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [salesList, setSails] = useState([]);

  useEffect(() => {
    const getAllSales = async () => {
      try {
        const responsData = await CommunicateBackend({
          url: "/sales/sales",
          crud: "GET",
        });

        if (responsData instanceof Error) {
          setErrorMessage(Error);
        }
        setErrorMessage("");
        setSails(responsData);
      } catch (error) {
        setErrorMessage(error);
      }
    };

    getAllSales();
  }, []);

  const regesterSalesOpen = () => {
    setRegesterPopUpp(!regesterPopUpp);
  };
  return (
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
      <div className="mx-20 my-5">
        {salesList && salesList.length > 0 ? (
          <TablesComponent dataType={"sales"} dataArray={salesList} />
        ) : (
          <LoadingHandling />
        )}
        {errorMessage && <ErrorHandler error={errorMessage} />}
      </div>
    </div>
  );
}

export default Sales;
