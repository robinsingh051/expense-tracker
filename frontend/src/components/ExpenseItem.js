import React from "react";
import axios from "axios";
import { Card, Button } from "react-bootstrap";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const ExpenseItem = (props) => {
  const darkMode = useSelector((state) => state.darkMode.darkMode);
  const email = useSelector((state) => state.auth.email);
  const deleteData = async () => {
    try {
      await axios.delete(
        `https://react-practice-9b982-default-rtdb.firebaseio.com/expenses/${email}/expenses/${props.id}.json`
      );
    } catch (err) {
      console.log(err);
      toast.error("something went wrong");
    }
  };
  const onEdit = () => {
    deleteData();
    props.onEdit(props.id);
  };
  const onDelete = () => {
    deleteData();
    toast.success("Expense deleted");
    props.onDelete(props.id);
  };
  return (
    <Card
      className="mb-2"
      style={{
        backgroundColor: darkMode ? "black" : "white",
        color: darkMode ? "white" : "black",
      }}
    >
      <Card.Body className="d-flex justify-content-between align-items-center">
        <div>
          <Card.Title>{props.description}</Card.Title>
          <Card.Text>
            Category: {props.category}
            <div style={{ marginBottom: ".4rem" }}></div>
            Amount: ₹{props.amount.toFixed(2)}
          </Card.Text>
        </div>
        <div>
          <Button variant="outline-primary" className="mx-1" onClick={onEdit}>
            Edit
          </Button>
          <Button variant="outline-danger" className="mx-1" onClick={onDelete}>
            Delete
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ExpenseItem;
