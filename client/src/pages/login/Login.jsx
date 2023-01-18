import {
  //useContext,
  useState,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../state/authApi";
/* import { AuthContext } from "../../context/authContext"; */
import "./login.scss";

const Login = () => {
  //const { login } = useContext(AuthContext);

  const [login, { isLoading }] = useLoginMutation();

  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await login(inputs).unwrap();
      console.log(data.user);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section className="login">
      <div className="card">
        <div className="left">
          <h1>Hello Friend.</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cum,
            alias totam numquam ipsa exercitationem dignissimos, error nam,
            consequatur.
          </p>
          <span>You don't have an account?</span>
          <Link to="/register">
            <button>Register</button>
          </Link>
        </div>
        <div className="right">
          <h1>Login</h1>
          <form>
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
            />
            {error}
            <button onClick={handleLogin}>Login</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
