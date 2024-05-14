import "./App.css";
import Navbar from "./components/Navbar";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signin from "./pages/signin/Signin";
import Signup from "./pages/signup/Signup";
import { Toaster } from "sonner";

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
    path: "/*",
    element: <div>404</div>,
  },
]);

function App() {
  return (
    <div className="h-[89vh]">
      <Navbar />
      <Toaster />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
