import {
  auth,
  signInWithEmailAndPassword,
  doc,
  getDoc,
  db,
} from "../../Database/firebase-config.js";

document.addEventListener("DOMContentLoaded", function () {
  var form = document.querySelector("form");
  var successMessage = document.getElementById("successMessage");

  var email = document.getElementById("email");
  var password = document.getElementById("password");
  var employee;
  var admin;
  async function loadEmails() {
    const docRefEmployee = doc(db, "users", "fFa7SEFXGndOs0V5X1BZ");
    const docSnapEmployee = await getDoc(docRefEmployee);
    employee = docSnapEmployee.data();
    const docRefAdmin = doc(db, "users", "mCCUsuHYPzK2aFHugOyT");
    const docSnapAdmin = await getDoc(docRefAdmin);
    admin = docSnapAdmin.data();
  }

  loadEmails();

  function submitForm() {
    if (email.value === admin.email && password.value === admin.password) {
      localStorage.setItem("email", "admin");
      document.getElementById("email").value = "";
      document.getElementById("password").value = "";
      window.location.href = "../../home/index.html";
    } else if (
      email.value === employee.email &&
      password.value === employee.password
    ) {
      localStorage.setItem("email", "employee");
      document.getElementById("email").value = "";
      document.getElementById("password").value = "";
      window.location.href = "../../home/index.html";
    } else {
      showAlert("البريد الإلكترونى او كلمة السر خاطئة", "danger");
    }
  }

  function showAlert(message, type) {
    // type => // danger // success // warning
    const alertContainer = document.getElementById("alert-container");
    const alertDiv = document.createElement("div");
    alertDiv.className = `alert alert-${type}`;
    alertDiv.role = "alert";
    alertDiv.innerText = message;
    alertContainer.appendChild(alertDiv);
    setTimeout(() => {
      alertDiv.remove();
    }, 3000);
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    submitForm();
  });
});

window.onload = () => {
  localStorage.clear();
  const savedEmail = localStorage.getItem("email");
  if (savedEmail && savedEmail == "admin@yahoo.com") {
    window.location.href = "../../Admin/home/home.html";
  } else if (savedEmail && savedEmail != "admin@yahoo.com") {
    window.location.href = "../../User/home/index.html";
  }
};
