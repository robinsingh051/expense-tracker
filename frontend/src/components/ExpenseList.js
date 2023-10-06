import React from "react";
import ExpenseItem from "./ExpenseItem";
import { useSelector } from "react-redux";

const ExpenseList = (props) => {
  const items = useSelector((state) => state.expenses.items);
  const expenses = items.map((item) => {
    return (
      <ExpenseItem
        onDelete={props.onDelete}
        onEdit={props.onEdit}
        key={item.id}
        id={item.id}
        description={item.desc}
        category={item.cat}
        amount={+item.amount}
      />
    );
  });
  return <> {expenses}</>;
};
export default ExpenseList;
