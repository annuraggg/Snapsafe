import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Token from "@/@types/TokenType";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";

const Navbar = () => {
  const [signedIn, setSignedIn] = useState<boolean>(false);

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      setSignedIn(false);
      return;
    }
    const decoded: Token = jwtDecode(token);
    if (decoded.exp < Date.now() / 1000) {
      setSignedIn(false);
      return;
    }

    setSignedIn(true);
  }, []);

  const logout = async () => {
    axios
      .post(`${import.meta.env.VITE_BACKEND_ADDRESS}/auth/logout`)
      .then(() => {
        Cookies.remove("token");
        toast.success("Signed out successfully.");
        window.location.href = "/signin";
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="px-10 py-5 flex justify-between">
      <h1 className="text-2xl font-poly">Snapsafe</h1>
      <div>
        {signedIn ? (
          <Button onClick={() => logout()}>Sign Out</Button>
        ) : (
          <Button onClick={() => (window.location.href = "/signin")}>
            Sign In
          </Button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
