import React, { useRef, useEffect } from "react";
import { Button, Form, Card, Container } from "react-bootstrap";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const AddExpenseForm = (props) => {
  const darkMode = useSelector((state) => state.darkMode.darkMode);
  const email = useSelector((state) => state.auth.email);

  const amountInputRef = useRef();
  const descInputRef = useRef();
  const catInputRef = useRef();

  useEffect(() => {
    if (props.expense) {
      amountInputRef.current.value = props.expense.amount;
      descInputRef.current.value = props.expense.desc;
      catInputRef.current.value = props.expense.cat;
    }
  }, [props.expense]);

  const submitHandler = async (event) => {
    event.preventDefault();
    const enteredAmount = amountInputRef.current.value;
    const enteredDesc = descInputRef.current.value;
    const enteredCat = catInputRef.current.value;
    const expense = {
      amount: enteredAmount,
      desc: enteredDesc,
      cat: enteredCat,
    };
    try {
      const response = await axios.post(
        `https://react-practice-9b982-default-rtdb.firebaseio.com/expenses/${email}/expenses.json`,
        expense
      );
      toast.success("Expense added successfully");
      props.onSubmit({ ...expense, id: response.data.name });
      amountInputRef.current.value = "";
      descInputRef.current.value = "";
    } catch (err) {
      console.log(err);
      toast.error("unable to add expense");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center mt-1">
      <Container
        style={{
          width: "25rem",
          padding: ".5rem",
          border: "0",
          backgroundColor: darkMode ? "black" : "white",
          color: darkMode ? "white" : "black",
        }}
      >
        <Card
          style={{
            border: "0",
            backgroundColor: darkMode ? "black" : "white",
            color: darkMode ? "white" : "black",
          }}
        >
          <Card.Body className="text-center">
            <h5 style={{ marginBottom: "1rem" }}>Add Expense</h5>
            <Form onSubmit={submitHandler}>
              <Form.Group controlId="formAmount" className="mb-3">
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter amount"
                  name="amount"
                  required
                  ref={amountInputRef}
                />
              </Form.Group>

              <Form.Group controlId="formDesc" className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter expense description"
                  name="desc"
                  required
                  ref={descInputRef}
                />
              </Form.Group>

              <Form.Group controlId="formCat" className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  aria-label="Select expense category"
                  name="cat"
                  required
                  ref={catInputRef}
                >
                  <option value="Family">Family</option>
                  <option value="Friend">Friend</option>
                  <option value="Personal">Personal</option>
                </Form.Select>
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                style={{ marginRight: "1rem" }}
              >
                Add Expense
              </Button>
              <Button
                variant="secondary"
                onClick={props.onClose}
                style={{
                  marginLeft: "1rem",
                  paddingLeft: "2.5rem",
                  paddingRight: "2.5rem",
                }}
              >
                Close
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </Container>
  );
};

export default AddExpenseForm;
