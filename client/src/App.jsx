import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Sidebar from "./components/sidebar/Sidebar";

/* import Home from "./pages/home/Home"; */
/* import Profile from "./pages/profile/Profile"; */
import "./style.scss";
/* import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/authContext"; */

function App() {
  const Layout = () => {
    return (
      <div className="theme-light">
        <Navbar />
        <Outlet />
        <Sidebar />
      </div>
    );
  };

  /*  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    return children;
  }; */

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        /*  <ProtectedRoute> */
        <Layout />
        /*  </ProtectedRoute> */
      ),
      children: [
        /*  {
          path: "/",
          element: <Home />,
        }, */
        /* {
          path: "/profile/",
          element: <Profile />,
        }, */
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
