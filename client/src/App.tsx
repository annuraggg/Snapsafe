import "./App.css";
import Navbar from "./components/Navbar";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signin from "./pages/signin/Signin";
import Signup from "./pages/signup/Signup";
import { Toaster } from "sonner";
import Home from "./pages/home/Home";
import axios from "axios";
import Fzf from "./pages/Fzf/Fzf";
import Redirect from "./pages/Redirect/Redirect";

const router = createBrowserRouter([
  {
    path: "/signin",
    element: <Signin />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/contents/*",
    element: <Home />,
  },
  {
    path: "/",
    element: <Redirect />,
  },
  {
    path: "/*",
    element: <Fzf />,
  },
]);

function App() {
  axios.defaults.withCredentials = true;

  return (
    <div className="h-[89vh]">
      <Navbar />
      <Toaster />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
