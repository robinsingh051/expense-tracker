// Put DOM elements into variables
const myForm = document.querySelector("#my-form");
const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const msg = document.querySelector(".msg");
const showBtn = document.querySelector("#showBtn");

//toggle the password input type on clicking show button
showBtn.addEventListener("click", toggle);

// Listen for form submit
myForm.addEventListener("submit", onSubmit);

async function onSubmit(e) {
  e.preventDefault();
  if (
    nameInput.value === "" ||
    emailInput.value === "" ||
    passwordInput.value === ""
  ) {
    msg.classList.add("error");
    msg.textContent = "Please enter all fields";
    setTimeout(() => {
      msg.textContent = "";
      msg.remove();
    }, 2000);
  } else {
    // Create new details object
    const newDetails = {
      name: nameInput.value,
      email: emailInput.value,
      password: passwordInput.value,
    };

    console.log(newDetails);

    try {
      // post to backend using axios
      const response = await axios.post(
        "http://localhost:3000/users/login",
        newDetails
      );

      console.log(response);
    } catch (err) {
      console.error(err);
    }

    // Clear fields
    nameInput.value = "";
    emailInput.value = "";
    passwordInput.value = "";
  }
}

function toggle() {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
  } else {
    passwordInput.type = "password";
  }
}
