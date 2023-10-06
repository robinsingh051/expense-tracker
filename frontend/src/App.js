import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Route, Switch, Redirect } from "react-router-dom";
import { authActions } from "./store/auth";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "./UI/Loading";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Forget from "./pages/Forget";
import Header from "./components/Header";
import Profile from "./pages/Profile";
import { useState } from "react";

function App() {
  const darkMode = useSelector((state) => state.darkMode.darkMode);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  // useffect for user validation
  useEffect(() => {
    const token = localStorage.getItem("token");

    function removeSpecialCharacters(email) {
      return email.replace(/[.@]/g, "");
    }

    const validateUser = async (token) => {
      if (token) {
        try {
          const { data } = await axios.post(
            `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.REACT_APP_API_KEY}`,
            { idToken: token }
          );
          dispatch(
            authActions.login({
              token: token,
              email: removeSpecialCharacters(data.users[0].email),
            })
          );
          const res = await axios.get(
            `https://react-practice-9b982-default-rtdb.firebaseio.com/expenses/${removeSpecialCharacters(
              data.users[0].email
            )}/premium.json`
          );
          if (res.data) {
            dispatch(authActions.setPremium(true));
          }
          setLoading(false);
        } catch (error) {
          console.log(error);
          toast.error("something went wrong");
        }
      }
    };
    validateUser(token);
  }, []);

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  if (loading) return <Loading />;
  return (
    <div
      style={{
        backgroundColor: darkMode ? "black" : "white",
        color: darkMode ? "white" : "black",
        height: "100vh",
      }}
    >
      <Header />
      <Switch>
        <Route path="/" exact>
          {isLoggedIn && <Redirect to="/home" />}
          {!isLoggedIn && <Redirect to="/login" />}
        </Route>
        <Route path="/home">
          {isLoggedIn && <Home />}
          {!isLoggedIn && <Redirect to="/login" />}
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/profile">
          {isLoggedIn && <Profile />}
          {!isLoggedIn && <Redirect to="/login" />}
        </Route>
        {!isLoggedIn && (
          <Route path="/forget">
            <Forget />
          </Route>
        )}
      </Switch>
    </div>
  );
}

export default App;
