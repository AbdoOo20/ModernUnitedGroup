import {
  db,
  collection,
  getDocs,
} from "../../Database/firebase-config.js";
const UserID = localStorage.getItem("email");
var index = 0;

document.addEventListener("DOMContentLoaded", async () => {
  if (UserID == null) {
    Array.from(document.getElementsByClassName("icons")).forEach((item) => {
      item.classList.add("d-none");
    });
    document.getElementById("LoginIcon").classList.remove("d-none");
    window.location.href = "../../login/index.html";
  } else {
    document.getElementById("LoginIcon").classList.add("d-none");
  }
  const parentUnit = document.getElementById("ParentUnit");
  parentUnit.addEventListener("click", (event) => {
    if (
      event.target &&
      event.target.classList.contains("show-details-button")
    ) {
      const data = event.target.getAttribute("data-item");
      showDetails(data);
    }
  });
  (async () => {
    const Units = collection(db, "orders");
    const querySnapshot = await getDocs(Units);
    index = 0;
    querySnapshot.forEach((doc) => {
      index++;
      const data = doc.data();
      const itemHTML = `
                                        <div class="col">
                                                <div class="card product-card position-relative">
                                                <div class="position-absolute top-0 end-0 p-1 bg-primary text-white" style="background-color: ${getColor(
                                                  data.SelectedDate,
                                                  data.status,
                                                  data.comment
                                                )} !important;">
                                                ${index}
                                                </div>
                                                <div class="card-body text-end mt-3" style="direction: rtl;">    
                                                        <h5 class="card-title">${
                                                          data.name
                                                        }</h5>
                                                        <p class="card-text"><strong>التاريخ:</strong> ${
                                                          data.Date
                                                        }</p>
                                                        <p class="card-text"><strong>النوع:</strong> ${
                                                          data.OrderType
                                                        }</p>
                                                        <p class="card-text"><strong>العنوان:</strong> ${
                                                          data.address
                                                        }</p>
                                                        <p class="card-text"><strong>الهاتف:</strong> ${
                                                          data.phone
                                                        }</p>
                                                </div>
                                                <button class="btn btn-primary show-details-button" style="background-color: ${getColor(
                                                  data.SelectedDate,
                                                  data.status,
                                                  data.comment
                                                )}; border: none; border-radius: 5px;"
                                                data-item='${JSON.stringify({
                                                  Date: data.Date,
                                                  OrderDetails:
                                                    data.OrderDetails,
                                                  OrderType: data.OrderType,
                                                  address: data.address,
                                                  name: data.name,
                                                  notes: data.notes,
                                                  phone: data.phone,
                                                  status: data.status,
                                                  id: doc.id,
                                                  SelectedDate:
                                                    data.SelectedDate,
                                                })}'>عرض التفاصيل</button>
                                                </div>
                                        </div>
                                        `;
      parentUnit.insertAdjacentHTML("beforeend", itemHTML);
    });
  })();
});

function getColor(date, status, comment) {
  console.log(compareDate(date));
  
  if (status === "Pending" && date === "") {
    return "#FF0000"; // red
  } else if (
    status === "Pending" &&
    date !== "" &&
    compareDate(date) == "big"
  ) {
    return "#dd792d"; // orange
  } else if (
    status === "Pending" &&
    date !== "" &&
    compareDate(date) == "equal"
  ) {
    return "#FFC107"; // amber
  } else if (date !== "" && status === "Complete" && comment !== "") {
    return "#22BF2C"; // green
  } else if (date !== "" && status === "Complete" && comment === "") {
    return "#0000FF"; // blue
  } else {
    return "#A9A9A9";
  }
}

function compareDate(selectedDate) {
  const selected = new Date(selectedDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  selected.setHours(0, 0, 0, 0);
  if (selected > today) {
    return "big";
  } else if (selected < today) {
    return "small";
  } else {
    return "equal";
  }
}

const searchInput = document.getElementById("searchInput");
const cardContainer = document.getElementById("ParentUnit");
const cards = cardContainer.getElementsByClassName("card");

function showDetails(data) {
  try {
    var d = JSON.parse(data);
    window.location.href = `../../details/index.html?orderId=${d.id}`;
  } catch (error) {
    console.error("Error storing data in sessionStorage:", error);
  }
}

searchInput.addEventListener("keypress", function () {
  const filter = searchInput.value.toLowerCase();
  for (let i = 0; i < cards.length; i++) {
    const title = cards[i]
      .getElementsByClassName("card-title")[0]
      .textContent.toLowerCase();
    const text = cards[i]
      .getElementsByClassName("card-text")[0]
      .textContent.toLowerCase();
    if (title.includes(filter) || text.includes(filter)) {
      cards[i].parentElement.style.display = "";
    } else {
      cards[i].parentElement.style.display = "none";
    }
  }
});

document.getElementById("clearSearch").addEventListener("click", () => {
  searchInput.value = null;
  for (let i = 0; i < cards.length; i++) {
    if ((cards[i].parentElement.style.display = "none")) {
      cards[i].parentElement.style.display = "";
    }
  }
});

document.getElementById("Logout").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "../../login/index.html";
});
