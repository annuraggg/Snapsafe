import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ReloadIcon } from "@radix-ui/react-icons";
import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const submit = async () => {
    const schema = z.object({
      firstName: z.string().nonempty(),
      lastName: z.string().nonempty(),
      email: z.string().email(),
      password: z.string().min(6),
    });

    try {
      schema.parse({ firstName, lastName, email, password });
    } catch (error) {
      toast.error("Please fill in all fields correctly.");
      return;
    }

    setLoading(true);

    axios
      .post(`${import.meta.env.VITE_BACKEND_ADDRESS}/auth/signup`, {
        firstName,
        lastName,
        email,
        password,
      })
      .then((res) => {
        toast.success("Account created successfully.");
        console.log(res.data);
        Cookies.set("token", res.data.token);
        navigate("/contents");
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const toggleShow = () => {
    setShow(!show);
  };

  return (
    <div className="flex items-center justify-center h-full flex-col">
      <h2 className="font-poly drop-shadow-glow text-5xl">Snapsafe</h2>
      <p className="mt-2 text-gray-500 text-sm">
        Welcome! Create an Account to Continue.
      </p>

      <div className="flex items-center justify-center gap-2 mt-10">
        <Input
          type="text"
          placeholder="First Name"
          className=" w-[180px] px-2 py-5 border-gray-500"
          onChange={(e) => {
            setFirstName(e.target.value);
          }}
          value={firstName}
        />
        <Input
          type="text"
          placeholder="Last Name"
          className="mt- w-[180px] px-2 py-5 border-gray-500"
          onChange={(e) => {
            setLastName(e.target.value);
          }}
          value={lastName}
        />
      </div>

      <Input
        type="text"
        placeholder="Email"
        className=" w-[368px] px-2 py-5 mt-2 border-gray-500"
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        value={email}
      />
      <div className="flex w-[368px] gap-2 items-center justify-center mt-2">
        <Input
          type={show ? "text" : "password"}
          placeholder="Password"
          className="px-2 py-5 border-gray-500"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          value={password}
        />
        <Button onClick={toggleShow} className="py-5">
          {show ? <FaEye /> : <FaEyeSlash />}
        </Button>
      </div>
      <p className="mt-2 text-xs text-gray-500">
        Password must be at least 6 characters long.
      </p>

      <Button
        className="mt-5 w-[368px] bg-primary text-white py-3 rounded-md"
        onClick={() => submit()}
      >
        {loading ? (
          <ReloadIcon className="w-4 h-4 animate-spin" />
        ) : (
          "Create Account"
        )}
      </Button>

      <p
        className="mt-2 text-gray-500 text-xs cursor-pointer hover:text-primary duration-300 transition-all"
        onClick={() => navigate("/signin")}
      >
        Already have an account? Login
      </p>
    </div>
  );
};

export default Signup;
