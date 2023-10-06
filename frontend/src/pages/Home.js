import React, { useState, useEffect } from "react";
import { Button, Container } from "react-bootstrap";
import AddExpenseForm from "../components/AddExpenseForm";
import ExpenseList from "../components/ExpenseList";
import axios from "axios";
import Loading from "../UI/Loading";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { expensesActions } from "../store/expenses";

const Home = (props) => {
  const [loading, setLoading] = useState(true);
  const items = useSelector((state) => state.expenses.items);
  const email = useSelector((state) => state.auth.email);
  const dispatch = useDispatch();
  const [expense, setExpense] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const getExpenses = async () => {
      try {
        const res = await axios.get(
          `https://react-practice-9b982-default-rtdb.firebaseio.com/expenses/${email}/expenses.json`
        );
        const loadedExpenses = [];
        for (const key in res.data) {
          loadedExpenses.push({
            id: key,
            amount: res.data[key].amount,
            cat: res.data[key].cat,
            desc: res.data[key].desc,
          });
        }
        setLoading(false);
        dispatch(expensesActions.setExpenses({ items: loadedExpenses }));
      } catch (err) {
        console.log(err);
        toast.error("Unable to fetch expenses");
      }
    };
    getExpenses();
  }, [email]);

  const showFormHandler = () => {
    setShowForm(true);
    setExpense(null);
  };

  const hideFormHandler = () => {
    setShowForm(false);
    setExpense(null);
  };

  const submitHandler = (expense) => {
    dispatch(expensesActions.add({ item: expense }));
  };

  const editHandler = (id) => {
    const editedExpense = items.find((item) => item.id === id);
    if (editedExpense) {
      setExpense(editedExpense);
      setShowForm(true);
    }
    dispatch(expensesActions.remove({ id: id }));
  };

  const deleteHandler = (id) => {
    dispatch(expensesActions.remove({ id: id }));
  };

  if (loading) return <Loading />;

  return (
    <>
      <Container className="d-flex justify-content-center align-items-center mt-5">
        {!showForm && (
          <Button
            className="mb-4"
            variant="outline-info"
            onClick={showFormHandler}
          >
            Add Expense
          </Button>
        )}
        {showForm && (
          <AddExpenseForm
            expense={expense}
            onSubmit={submitHandler}
            onClose={hideFormHandler}
          />
        )}
      </Container>
      <ExpenseList onDelete={deleteHandler} onEdit={editHandler} />
    </>
  );
};

export default Home;
