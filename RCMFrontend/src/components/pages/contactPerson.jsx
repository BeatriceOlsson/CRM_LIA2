import { useEffect, useState } from "react";
import CommunicateBackend from "../communicateBackend";
import { LoadingHandling } from "../smallComponents/loadingHandeler";
import { ErrorHandler } from "../smallComponents/errorHandler";
import { TablesComponent } from "../listComponent/tablesComponent";
import { ButtonComponent } from "../smallComponents/buttonComponent";
import RegisterUser from "../register/register";

function ContactPerson() {
  const [contactPerson, setContactPerson] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [regesterPopUpp, setRegesterPopUpp] = useState(false);

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const responsData = await CommunicateBackend({
          url: "/contactPerson/contactPerson",
          crud: "GET",
        });

        if (responsData instanceof Error) {
          setErrorMessage(Error);
        }

        setContactPerson(responsData);
      } catch (error) {
        setErrorMessage(error);
      }
    };

    getAllUsers();
  }, []);

  const registerUserOpen = () => {
    setRegesterPopUpp(!regesterPopUpp);
  };

  return (
    <div className="">
      <div className="flex justify-end">
        <ButtonComponent
          buttonText={"Registrera användare"}
          onMouseDown={registerUserOpen}
          className="text-sm/tight mx-4"
        />
        <RegisterUser
          isOpen={regesterPopUpp}
          onClose={() => setRegesterPopUpp(false)}
        />
      </div>
      <div className="mx-20 my-5">
        {contactPerson && contactPerson.length > 0 ? (
          <TablesComponent dataType={"CP"} dataArray={contactPerson} />
        ) : (
          <LoadingHandling />
        )}
        {errorMessage && <ErrorHandler error={errorMessage} />}
      </div>
    </div>
  );
}

export default ContactPerson;
