import { useEffect, useState } from "react";

function AbbreviateNumber({ className, rawNumber }) {
  const [abbNumber, setAbbNumber] = useState();
  useEffect(() => {
    if (rawNumber >= 1e9) {
      setAbbNumber((rawNumber / 1e9).toFixed(1) + " B"); // Billion
    } else if (rawNumber >= 1e6) {
      setAbbNumber((rawNumber / 1e6).toFixed(1) + " M"); // Million
    } else if (rawNumber >= 1e3) {
      setAbbNumber((rawNumber / 1e3).toFixed(1) + " K"); // Thousand
    } else {
      setAbbNumber(rawNumber); // Less than a thousand
    }
  }, [rawNumber]);

  return <span className={className}>{abbNumber}</span>;
}
export default AbbreviateNumber;
