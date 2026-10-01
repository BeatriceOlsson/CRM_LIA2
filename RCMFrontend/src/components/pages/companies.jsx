import { useEffect, useState } from "react";
import CommunicateBackend from "../communicateBackend";
import { TablesComponent } from "../listComponent/tablesComponent";
import { LoadingHandling } from "../smallComponents/loadingHandeler";
import { ErrorHandler } from "../smallComponents/errorHandler";
import { ButtonComponent } from "../smallComponents/buttonComponent";
import RegisterCompany from "../register/registerCompany";

function Companies() {
  const [companiesList, setCompaniesList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [regesterPopUpp, setRegesterPopUpp] = useState(false);

  useEffect(() => {
    const getAllCompanies = async () => {
      try {
        const responsData = await CommunicateBackend({
          url: "/company/allCompanyInfo",
          crud: "GET",
        });

        if (responsData instanceof Error) {
          setErrorMessage(Error);
        }

        setCompaniesList(responsData);
      } catch (error) {
        setErrorMessage(error);
      }
    };

    getAllCompanies();
  }, []);

  const registerCompanyOpen = () => {
    setRegesterPopUpp(!regesterPopUpp);
  };
  return (
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
      <div className="mx-20 my-5">
        {companiesList && companiesList.length > 0 ? (
          <TablesComponent dataType={"CL"} dataArray={companiesList} />
        ) : (
          <LoadingHandling />
        )}
        {errorMessage && <ErrorHandler error={errorMessage} />}
      </div>
    </div>
  );
}

export default Companies;
