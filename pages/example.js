import React from "react";
import { useState, useEffect } from "react";

function Example() {
  const [counter, setCounter] = useState(60);
  useEffect(() => {
    counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
  }, [counter]);
  return (
    <div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <button onClick={() => console.log("HAI JUGA")}>{counter}</button> MANA
    </div>
  );
}

export default Example;
