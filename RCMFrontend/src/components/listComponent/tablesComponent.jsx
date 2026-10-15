import { useState } from "react";
import { Link } from "react-router-dom";
import { ErrorHandler } from "../smallComponents/errorHandler";
import { useDelete } from "../hooks/useDelete";

export function TablesComponent({
  dataType,
  dataArray,
  onDelete,
  onSort,
  sortConfig = {},
}) {
  const { deleteHandler } = useDelete();
  const [errorMessage, setErrorMessage] = useState("");

  let headers = [];
  let formData = [];

  switch (dataType) {
    case "CP":
      headers = [
        { label: "", sortKey: null },
        { label: "Person", sortKey: "firstName" },
        { label: "Email", sortKey: "email" },
        { label: "Företag", sortKey: "companyName" },
        { label: "Radera", sortKey: null },
      ];
      formData = dataArray.map((person) => ({
        id: person.contactPersonID,
        cells: [
          `${person.firstName} ${person.lastName}`,
          person.email,
          person.companyName,
        ],
      }));
      break;
    case "CL":
      headers = [
        { label: "", sortKey: null },
        { label: "Företag", sortKey: "companyName" },
        { label: "Orgenisationsnummer", sortKey: "orgNr" },
        { label: "Adress", sortKey: "adress" },
        { label: "Total värde (SKR)", sortKey: "totalValue" },
        { label: "Radera", sortKey: null },
      ];
      formData = dataArray.map((company) => ({
        id: company.companyID,
        cells: [
          company.companyName,
          company.orgNr,
          company.adress,
          company.totalValue,
        ],
      }));
      break;
    case "sales":
      headers = [
        { label: "", sortKey: null },
        { label: "Motagare", sortKey: "CPFirstName" },
        { label: "Titel", sortKey: "title" },
        { label: "Inteckt", sortKey: "salesValue" },
        { label: "Kosnad", sortKey: "purcheseValue" },
        { label: "Skillnaden", sortKey: "differenceValue" },
        { label: "Prosent", sortKey: "percentageDifferense" },
        { label: "Status", sortKey: "salesStatus" },
        { label: "Företag", sortKey: "companyName" },
        { label: "Ägare", sortKey: "salesFirstName" },
        { label: "Radera", sortKey: null },
      ];
      formData = dataArray.map((sales) => ({
        id: sales.salesID,
        cells: [
          `${sales.CPFirstName ?? sales.firstName} ${sales.CPLastName ?? sales.lastName}`,
          sales.title ?? null,
          sales.salesValue ?? sales.totalSales,
          sales.purcheseValue ?? sales.totalPurchese,
          sales.differenceValue ?? sales.totalDiferense,
          sales.percentageDifferense ?? sales.totalPersentage,
          sales.salesStatus ?? null,
          sales.companyName ?? null,
          `${sales.salesFirstName ?? ""} ${sales.salesLastName ?? ""}`,
        ],
      }));
      break;
  }

  const colors = [
    "#E6F9FF",
    "#70DEFF",
    "#E6F9FF",
    "#9170FF",
    "#E6F9FF",
    "#FF9170",
    "#E6F9FF",
    "#DEFF70",
  ];

  const handelDelete = async (id) => {
    setErrorMessage("");
    const result = await deleteHandler(dataType, id);
    if (result.status === "failed") {
      return setErrorMessage(result.message);
    }
    onDelete(id);
    setErrorMessage(result.message);
    return;
  };

  let headerList = [];
  const cellsList = [];

  if (dataType === "sales" && formData.length > 0) {
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i];
      const cellsIndex = i - 1;

      const hasData = formData.some((row) => {
        const val = row.cells[cellsIndex];
        return val !== null && val !== " ";
      });

      if (hasData) {
        headerList.push(header);
        cellsList.push(cellsIndex);
      }
    }
    headers = headerList;

    formData = formData.map((row) => ({
      ...row,
      cells: row.cells.filter((_, index) => cellsList.includes(index)),
    }));
  }

  return (
    <div className="w-full">
      <table className="min-w-full my-2">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="border-r-2 border-r-cyan-400 border-b-2 border-b-cyan-400 py-1 px-2 text-left "
              >
                <div className="flex flex-row">
                  {header.label}{" "}
                  {header.sortKey && (
                    <div>
                      <button
                        type="button"
                        className="px-1 cursor-pointer"
                        onClick={() => onSort && onSort(header.sortKey)}
                      >
                        {sortConfig?.direction === "asc" ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M8.25 6.75 12 3m0 0 3.75 3.75M12 3v18"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-5 "
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.75 17.25 12 21m0 0-3.75-3.75M12 21V3"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {formData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td
                style={{
                  backgroundColor: colors[rowIndex % colors.length],
                }}
              >
                <Link to={`/update/${dataType}/${row.id}`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6 m-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                    />
                  </svg>
                </Link>
              </td>
              {row.cells.map((cellsData, cellsIndex) => (
                <td
                  key={cellsIndex}
                  className="border-x-2 border-x-cyan-400 px-2 py-1 transition-colors"
                  style={{
                    backgroundColor: colors[rowIndex % colors.length],
                  }}
                >
                  {cellsData}
                </td>
              ))}
              <td
                style={{
                  backgroundColor: colors[rowIndex % colors.length],
                }}
              >
                <button onClick={() => handelDelete(row.id)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6 m-2 flex "
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {errorMessage && <ErrorHandler error={errorMessage} />}
    </div>
  );
}
