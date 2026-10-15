import { useState } from "react";
import { InputFieldComponent } from "../smallComponents/inputFieldComponent";

export function NumberFilterComponent({ filterType, onChange }) {
  const [showTowInputs, setShowTowInputs] = useState(false);

  const handelChange = (e) => {
    const value = e.target.value;

    if (value === "between") {
      setShowTowInputs(true);
    } else {
      setShowTowInputs(false);
    }

    onChange("calculation", value, filterType);
  };

  return (
    <div className="flex flex-col gap-1 ml-2">
      <label>
        <input
          type="radio"
          name="calculation"
          value="greaterThen"
          onChange={handelChange}
        />
        Störe en:
      </label>
      <label>
        <input
          type="radio"
          name="calculation"
          value="smallerThen"
          onChange={handelChange}
        />
        Mindre en:
      </label>
      <label>
        <input
          type="radio"
          name="calculation"
          value="between"
          onChange={handelChange}
        />
        Mellan talen:
      </label>
      <InputFieldComponent
        className={"mb-3"}
        type={"number"}
        name={"smallestNumber"}
        placeholder={"Numret.."}
        onChange={(e) => onChange("smallestNumber", e.target.value, filterType)}
      />
      {showTowInputs && (
        <InputFieldComponent
          className={"mb-3"}
          type={"number"}
          name={"highestNumber"}
          placeholder={"och numret..."}
          onChange={(e) =>
            onChange("highestNumber", e.target.value, filterType)
          }
        />
      )}
    </div>
  );
}
