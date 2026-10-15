import { useEffect, useState } from "react";
import { InputFieldComponent } from "./inputFieldComponent";

export function SeartchFuntion({
  titel,
  arrayList = [],
  onSelect,
  className,
  seartchFiled,
  resetKey,
}) {
  const [seartchData, setSeartchData] = useState("");
  const [flrerdResults, setFlrerdResults] = useState([]);
  const [isOpen, setisOpen] = useState(false);

  const seartchValue = (e) => {
    setSeartchData(e.target.value);
    setisOpen(true);
    onSelect?.("");
  };

  const displayText = (item) => {
    if (seartchFiled && item[seartchFiled]) {
      return String(item[seartchFiled]);
    } else {
      return `${item.firstName || ""} ${item.lastName || ""}`.trim();
    }
  };

  useEffect(() => {
    if (!seartchData.trim() || !isOpen) {
      setFlrerdResults([]);
      return;
    }

    const timeOut = setTimeout(() => {
      const lowerSeartch = seartchData.toLocaleLowerCase();

      const matches = arrayList.filter((item) => {
        const textToSeartch = seartchFiled
          ? String(item[seartchFiled] ?? "")
          : `${item.firstName ?? ""} ${item.lastName ?? ""}`.trim();
        return textToSeartch.toLocaleLowerCase().includes(lowerSeartch);
      });

      setFlrerdResults(matches);
    }, 600);

    return () => clearTimeout(timeOut);
  }, [arrayList, seartchData, seartchFiled, isOpen]);

  useEffect(() => {
    setSeartchData("");
    setFlrerdResults([]);
  }, [resetKey]);

  const handelClick = (item) => {
    const selected =
      item.contactPersonID ?? item.userID ?? item.companyID ?? item.salesID;
    if (onSelect) {
      onSelect(selected);
    }
    setSeartchData(displayText(item));
    setFlrerdResults([]);
    setisOpen(false);
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
      {isOpen && flrerdResults.length > 0 && (
        <ul className="absolute border-2 border-cyan-400 bg-white rounded-lg z-100 w-45">
          {flrerdResults.map((item) => (
            <li
              key={
                item.contactPersonID ??
                item.userID ??
                item.companyID ??
                item.salesID
              }
              className="flex flex-row justify-between w-80 p-1 cursor-pointer"
            >
              <button type="button" onClick={() => handelClick(item)}>
                {displayText(item)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
