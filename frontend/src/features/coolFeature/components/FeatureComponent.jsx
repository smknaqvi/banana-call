import { useEffect, useState } from "react";
import { requestFn } from "../client/featureClient";

function FeatureComponent() {
  const [featureValue, setFeatureValue] = useState("...loading");
  useEffect(() => {
    requestFn({ image: "Cool Image" })
      .then((res) => setFeatureValue(res.data))
      .catch((err) => setFeatureValue(`Err ${JSON.stringify(err)}`));
  }, [setFeatureValue]);

  return <div>{featureValue}</div>;
}

export default FeatureComponent;
