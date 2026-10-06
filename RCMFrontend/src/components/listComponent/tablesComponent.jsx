export function TablesComponent({ dataType, dataArray }) {
  let headers = [];
  let formData = [];

  switch (dataType) {
    case "CP":
      headers = ["Person", "Email", "Företag"];
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
      headers = ["Företag", "Orgenisationsnummer", "Adress"];
      formData = dataArray.map((company) => ({
        id: company.comanyID,
        cells: [company.companyName, company.orgNr, company.adress],
      }));
      break;
    case "sales":
      headers = [
        "Titel",
        "Inteckt",
        "Kosnad",
        "Skillnaden",
        "Prosent",
        "Status",
        "Företag",
        "Motagare",
        "Ägare",
      ];
      formData = dataArray.map((sales) => ({
        id: sales.salesID,
        cells: [
          sales.title,
          sales.salesValue,
          sales.purcheseValue,
          sales.differenceValue,
          sales.percentageDifferense,
          sales.salesStatus,
          sales.companyName,
          `${sales.CPFirstName} ${sales.CPLastName}`,
          `${sales.salesFirstName} ${sales.salesLastName}`,
        ],
      }));
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

  return (
    <div className="w-full">
      <table className="min-w-full my-2">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="border-x-2 border-x-cyan-400 border-b-2 border-b-cyan-400 py-1 px-2 text-left"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {formData.map((row, rowIndex) => (
            <tr key={rowIndex}>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
