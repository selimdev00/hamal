import { useState } from "react";

export default function useBoolean(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  function setTrue() {
    setValue(true);
  }

  function setFalse() {
    setValue(false);
  }

  function toggle() {
    setValue((v) => !v);
  }

  return [
    value,
    {
      setTrue,
      setFalse,
      toggle,
    },
  ];
}
