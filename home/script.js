import {
  db,
  collection,
  getDocs,
  signOut,
  auth,
} from "../../Database/firebase-config.js";
const UserID = localStorage.getItem("id");
var index = 0;

document.addEventListener("DOMContentLoaded", async () => {
  if (UserID == null) {
    Array.from(document.getElementsByClassName("icons")).forEach((item) => {
      item.classList.add("d-none");
    });
   // document.getElementById("LoginIcon").classList.remove("d-none");
  } else {
    //document.getElementById("LoginIcon").classList.add("d-none");
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
                                                <div class="position-absolute top-0 end-0 p-1 bg-primary text-white" style="background-color: #dd792d !important;">
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
                                                <button class="btn btn-primary show-details-button" style="background-color: #dd792d; border: none; border-radius: 5px;"
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

const searchInput = document.getElementById("searchInput");
const cardContainer = document.getElementById("ParentUnit");
const cards = cardContainer.getElementsByClassName("card");

function showDetails(data) {
  try {
    sessionStorage.setItem("orderData", data);
    window.location.href = "../../details/index.html";
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

// document.getElementById("Logout").addEventListener("click", () => {
//   signOut(auth).then(() => {
//     localStorage.clear();
//     window.location.href = "../../Authentication/login/index.html";
//   });
// });
