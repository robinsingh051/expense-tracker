import React from "react";
import { Nav, Navbar, Container, Button } from "react-bootstrap";
import { NavLink, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../store/auth";
import { darkModeActions } from "../store/darkMode";
import toast from "react-hot-toast";
import axios from "axios";

const Header = (props) => {
  const items = useSelector((state) => state.expenses.items);
  const darkMode = useSelector((state) => state.darkMode.darkMode);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const email = useSelector((state) => state.auth.email);
  const isPremium = useSelector((state) => state.auth.isPremium);
  const isPremiumAvailable = useSelector(
    (state) => state.expenses.isPremiumAvailable
  );
  const dispatch = useDispatch();
  const history = useHistory();

  const loginHandler = () => {
    history.push("/login");
  };

  const registerHandler = () => {
    history.push("/register");
  };

  const logoutHandler = () => {
    dispatch(authActions.logout());
    history.replace("/");
  };

  const activatePremiumHandler = async () => {
    try {
      await axios.post(
        `https://react-practice-9b982-default-rtdb.firebaseio.com/expenses/${email}/premium.json`,
        {
          premium: true,
        }
      );
      toast.success("You are a premium user now");
      dispatch(authActions.setPremium(true));
    } catch (err) {
      console.log(err);
      toast.err("something went wrong");
    }
  };

  function convertToCSV(items) {
    const header = ["Amount", "Description", "Category"];
    const csvData = items.map((item) => [item.amount, item.desc, item.cat]);

    return [header, ...csvData]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
  }

  const downloadExpensesHandler = () => {
    const csv = convertToCSV(items);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "expenses.csv";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const darkModeHandler = () => {
    dispatch(darkModeActions.toggleMode());
  };

  return (
    <Navbar
      bg={darkMode ? "light" : "dark"}
      variant={darkMode ? "light" : "dark"}
    >
      <Container>
        <Nav className="me-auto" variant={darkMode ? "light" : "dark"}>
          {isLoggedIn && (
            <NavLink
              to="/home"
              className="nav-link"
              variant={darkMode ? "light" : "dark"}
            >
              Home
            </NavLink>
          )}
          {isLoggedIn && (
            <NavLink
              to="/profile"
              className="nav-link"
              variant={darkMode ? "light" : "dark"}
            >
              Profile
            </NavLink>
          )}
        </Nav>
        {isPremiumAvailable && isLoggedIn && !isPremium && (
          <Button
            variant={darkMode ? "outline-dark" : "outline-light"}
            style={{ marginRight: 6 }}
            onClick={activatePremiumHandler}
          >
            Activate Premium
          </Button>
        )}
        {isPremium && isLoggedIn && (
          <Button
            variant={darkMode ? "outline-dark" : "outline-light"}
            style={{ marginRight: 6 }}
            onClick={darkModeHandler}
          >
            {!darkMode && "Dark Mode"}
            {darkMode && "Light Mode"}
          </Button>
        )}
        {isLoggedIn && isPremium && (
          <Button
            variant={darkMode ? "outline-dark" : "outline-light"}
            style={{ marginRight: 6 }}
            onClick={downloadExpensesHandler}
          >
            Download Expenses
          </Button>
        )}
        {isLoggedIn && (
          <Button
            variant={darkMode ? "outline-dark" : "outline-light"}
            onClick={logoutHandler}
          >
            Log Out
          </Button>
        )}
        {!isLoggedIn && (
          <Button
            variant={darkMode ? "outline-dark" : "outline-light"}
            onClick={registerHandler}
            style={{ marginRight: 6 }}
          >
            Register
          </Button>
        )}
        {!isLoggedIn && (
          <Button
            variant={darkMode ? "outline-dark" : "outline-light"}
            onClick={loginHandler}
          >
            Log In
          </Button>
        )}
      </Container>
    </Navbar>
  );
};

export default Header;
