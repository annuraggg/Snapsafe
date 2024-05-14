import { useEffect } from "react";

const Redirect = () => {
  useEffect(() => {
    window.location.href = "/contents";
  }, []);
  return <div>Redirect</div>;
};

export default Redirect;
