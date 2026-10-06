import { useEffect, useState } from "react";
import { InputFieldComponent } from "./inputFieldComponent";

export function SeartchFuntion({ titel, arrayList = [], onSelect, className }) {
  const [seartchData, setSeartchData] = useState("");
  const [flrerdResults, setFlrerdResults] = useState([]);

  const seartchValue = (e) => {
    setSeartchData(e.target.value);
  };

  useEffect(() => {
    if (!seartchData.trim()) {
      return;
    }

    const timeOut = setTimeout(() => {
      const lowerSeartch = seartchData.toLowerCase();

      const matches = arrayList.filter((item) => {
        const textToSeartch = (item.firstName || item.lastName).toLowerCase();
        return textToSeartch.includes(lowerSeartch);
      });

      setFlrerdResults(matches);
    }, 600);

    return () => clearTimeout(timeOut);
  }, [arrayList, seartchData]);

  const handelClick = (item) => {
    const selected = item.contactPersonID || item.userID;
    if (onSelect) {
      onSelect(selected);
    }
    setSeartchData(`${item.firstName} ${item.lastName}`);
  };
  return (
    <div className={className}>
      <InputFieldComponent
        type="text"
        placeholder={`Sök ${titel}...`}
        value={seartchData}
        onChange={seartchValue}
        className="relative mb-3"
      />
      {seartchData.trim() && flrerdResults.length > 0 && (
        <ul className="absolute border-2 border-cyan-400 bg-white rounded-lg z-100 w-45">
          {flrerdResults.map((item) => (
            <li
              key={item.contactPersonID || item.userID}
              className="flex flex-row justify-between w-80 p-1 cursor-pointer"
            >
              <button type="button" onClick={() => handelClick(item)}>
                {`${item.firstName} ${item.lastName}`.trim()}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
