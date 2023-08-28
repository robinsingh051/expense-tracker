// Put DOM elements into variables
const myForm = document.querySelector("#my-form");
const expense = document.querySelector("#expense");
const desc = document.querySelector("#desc");
const cat = document.querySelector("#category");
const msg = document.querySelector(".msg");
const expenseList = document.querySelector("#expenses");

//retrieving token from local storage
const token = localStorage.getItem("token");

//user not logged in
if (!token) {
  window.location.href = "login.html";
}
console.log(token);
axios.defaults.headers.common["Authorization"] = `${token}`;

// Listen for form submit
myForm.addEventListener("submit", onSubmit);

async function onSubmit(e) {
  e.preventDefault();
  try {
    if (expense.value === "" || desc.value === "" || cat.value === "") {
      msg.classList.add("error");
      msg.textContent = "Please enter all fields";

      // Remove error after 3 seconds
      setTimeout(() => {
        msg.textContent = "";
        msg.classList.remove("error");
      }, 3000);
    } else {
      const newDetails = {
        expense: expense.value,
        desc: desc.value,
        cat: cat.value,
      };
      const response = await axios.post(
        "http://localhost:3000/expenses",
        newDetails
      );
      console.log(response.data);
      showData(response.data);

      // Clear fields
      expense.value = "";
      desc.value = "";
      cat.value = "";
    }
  } catch (err) {
    console.error(err);
  }
}

function showData(obj) {
  const li = document.createElement("li");
  li.id = obj.id;

  const delBtn = document.createElement("button");
  delBtn.classList.add("btn", "btn-danger", "del");
  delBtn.appendChild(document.createTextNode("Delete"));

  const editBtn = document.createElement("button");
  editBtn.classList.add("btn", "btn-warning", "edit");
  editBtn.appendChild(document.createTextNode("Edit"));

  li.appendChild(
    document.createTextNode(`${obj.expense} - ${obj.desc} - ${obj.cat}`)
  );
  li.appendChild(delBtn);
  li.appendChild(editBtn);

  expenseList.appendChild(li);
}

expenseList.addEventListener("click", removeItem);
expenseList.addEventListener("click", editItem);

async function removeItem(e) {
  if (e.target.classList.contains("del")) {
    if (confirm("Are You Sure?")) {
      try {
        const li = e.target.parentElement;
        const response = await axios.delete(
          `http://localhost:3000/expense/${li.id}`
        );
        console.log(response);
        expenseList.removeChild(li);
      } catch (err) {
        console.log(err);
      }
    }
  }
}

async function editItem(e) {
  if (e.target.classList.contains("edit")) {
    if (confirm("Are You Sure?")) {
      try {
        const li = e.target.parentElement;
        const res = await axios.get(`http://localhost:3000/expense/${li.id}`);
        expense.value = res.data.expense;
        desc.value = res.data.desc;
        cat.value = res.data.cat;

        const deleteResponse = await axios.delete(
          `http://localhost:3000/expense/${li.id}`
        );
        console.log(deleteResponse);

        expenseList.removeChild(li);
      } catch (err) {
        console.log(err);
      }
    }
  }
}

//Run the function after the script is loaded in the browser
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await axios.get("http://localhost:3000/expenses");
    for (let i = 0; i < response.data.length; i++) {
      showData(response.data[i]);
    }
  } catch (err) {
    console.log(err);
  }
});
