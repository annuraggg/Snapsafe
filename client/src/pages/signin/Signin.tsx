import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { z } from "zod";
import axios from "axios";
import { ReloadIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import Cookies from "js-cookie";

const Signin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [show, setShow] = useState<boolean>(false);

  const submit = async () => {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    });

    try {
      schema.parse({ email, password });
    } catch (error) {
      toast.error("Please fill in all fields correctly.");
      return;
    }

    setLoading(true);

    axios
      .post(`${import.meta.env.VITE_BACKEND_ADDRESS}/auth/login`, {
        email,
        password,
      })
      .then((res) => {
        Cookies.set("token", res.data.token);
        setLoading(false);
        navigate("/");
      })
      .catch((err) => {
        toast.error(err.response.data.error);
        setLoading(false);
      });
  };

  return (
    <div className="flex items-center justify-center h-full flex-col">
      <h2 className="font-poly drop-shadow-glow text-5xl">Snapsafe</h2>
      <p className="mt-2 text-gray-500 text-sm">
        Login to Your Account to Continue
      </p>

      <Input
        type="text"
        placeholder="Email"
        className=" w-[300px] px-2 py-5 mt-10 border-gray-500"
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        value={email}
      />
      <div className="flex items-center w-[300px] gap-2 justify-center  mt-2">
        <Input
          type={show ? "text" : "password"}
          placeholder="Password"
          className="px-2 py-5 border-gray-500"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          value={password}
        />
        <Button onClick={() => setShow(!show)} className="py-5">
          {show ? <FaEye /> : <FaEyeSlash />}
        </Button>
      </div>
      <p className="mt-2 text-gray-500 text-xs text-end w-[300px] cursor-pointer hover:text-primary duration-300 transition-all">
        Forgot Password?
      </p>

      <Button className="mt-5 w-[300px]" onClick={() => submit()}>
        {loading ? <ReloadIcon className="h-4 w-4 animate-spin" /> : "Sign In"}
      </Button>

      <p
        className="mt-2 text-gray-500 text-xs cursor-pointer hover:text-primary duration-300 transition-all"
        onClick={() => navigate("/signup")}
      >
        Don't have an account? Sign Up
      </p>
    </div>
  );
};

export default Signin;
