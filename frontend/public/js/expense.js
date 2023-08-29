// Put DOM elements into variables
const myForm = document.querySelector("#my-form");
const expense = document.querySelector("#expense");
const desc = document.querySelector("#desc");
const cat = document.querySelector("#category");
const msg = document.querySelector(".msg");
const expenseList = document.querySelector("#expenses");
const premiumUser = document.querySelector("#premiumUser");
const rzpBtn = document.querySelector("#rzp-button");
const logoutBtn = document.querySelector("#logoutBtn");
const divForleaderboardBtn = document.querySelector(".mr-3");
const downloadBtn = document.querySelector("#downloadexpense");

//retrieving token from local storage
const token = localStorage.getItem("token");
//user not logged in
if (!token) {
  window.location.href = "login.html";
}
console.log(token);
axios.defaults.headers.common["Authorization"] = `${token}`;

async function getPremiumStatus() {
  try {
    const premiumStatus = await axios.get(
      "http://localhost:3000/purchase/checkpremium"
    );
    premiumUser.innerHTML = "<span>You are premium user now</span>";
    // Create the leaderboard button
    const leaderBoardBtn = document.createElement("button");
    leaderBoardBtn.classList.add("btn", "btn-outline-primary");
    leaderBoardBtn.textContent = "Leaderboard";
    leaderBoardBtn.addEventListener("click", leaderBoard);

    // Append the button after premiumUser element
    divForleaderboardBtn.appendChild(leaderBoardBtn);
    // remove buy premium button
    rzpBtn.remove();
  } catch (err) {
    downloadBtn.remove();
    premiumUser.innerHTML = "";
  }
}
getPremiumStatus();

// listen to click on logoutBtn
logoutBtn.addEventListener("click", logout);
// listen to click on rzpBtn
rzpBtn.addEventListener("click", payments);
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

//payments function implementation
async function payments(e) {
  const response = await axios.get(
    "http://localhost:3000/purchase/premiummembership"
  );
  console.log(response);
  var options = {
    key: response.data.key_id,
    order_id: response.data.order.id,
    handler: async function (response) {
      await axios.post(
        "http://localhost:3000/purchase/updatetransactionstatus",
        {
          order_id: options.order_id,
          payment_id: response.razorpay_payment_id,
        }
      );
      alert("you are a premium user now");
      premiumUser.innerHTML = "<span>You are premium user now</span>";
      getPremiumStatus();
    },
    modal: {
      ondismiss: async function () {
        console.log("Payment failed or dismissed");
        alert("Payment failed or dismissed");
        await axios.post(
          "http://localhost:3000/purchase/failedtransactionstatus",
          {
            order_id: options.order_id,
          }
        );
      },
    },
  };
  const rzpl = new Razorpay(options);
  rzpl.open();
  e.preventDefault();

  rzpl.on("payment.failed", function (response) {
    console.log(response);
    alert("Something went wrong");
  });
}

//logout function
function logout() {
  axios.defaults.headers.common["Authorization"] = `${token}`;
  localStorage.removeItem("token");
  alert("You are logged out successfully");
  window.location.href = "login.html";
}

async function leaderBoard() {
  try {
    const response = await axios.get(
      "http://localhost:3000/purchase/getleaderboard"
    );
    const userExpenses = response.data;
    console.log(userExpenses);
    const leaderBoardList = document.querySelector("#leaderBoard");
    leaderBoardList.innerHTML = "";
    for (let i = 0; i < userExpenses.length; i++)
      showLeaderBoard(leaderBoardList, userExpenses[i]);
  } catch (error) {
    console.error("Error fetching user expenses:", error);
  }
}

function showLeaderBoard(leaderBoardList, userExpense) {
  const li = document.createElement("li");
  li.appendChild(
    document.createTextNode(
      `Name - ${userExpense.name} -- Total Expenses - ${userExpense.totalExpense}`
    )
  );
  leaderBoardList.appendChild(li);
}

async function download() {
  try {
    const response = await axios.get("http://localhost:3000/user/download");
    if (response.status === 201) {
      // The backend is sending a download link
      // which if we open in the browser, the file would download
      const a = document.createElement("a");
      a.href = response.data.fileUrl;
      a.download = "myexpense.csv";
      a.click();
    } else {
      throw new Error(response.data.message);
    }
  } catch (err) {
    console.log(err);
  }
}
