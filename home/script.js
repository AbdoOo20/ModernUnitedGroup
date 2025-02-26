import {
  db,
  collection,
  getDocs,
  orderBy,
  query,
  doc,
  deleteDoc
} from "./../Database/firebase-config.js";
const UserID = localStorage.getItem("email");
var index = 0;

document.addEventListener("DOMContentLoaded", async () => {
  if (window.location.pathname === '/home/index.html') {
    window.history.replaceState({}, document.title, '/');
  }
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
  parentUnit.addEventListener("click",async (event) => {
    if (
      event.target &&
      event.target.classList.contains("show-details-button")
    ) {
      const data = event.target.getAttribute("data-item");
      showDetails(data);
    }
    if (
      event.target &&
      event.target.classList.contains("delete-button")
    ) {
      const id = event.target.getAttribute("data-item");
      await deleteOrder(id);
    }
  });
  const selectElement = document.getElementById('type-select');
  selectElement.addEventListener('change', async function (event) {
    const selectedValue = event.target.value;
    getData(selectedValue);
  });
  (async () => {
    getData("الكل");
  })();

  async function getData(type) {
    parentUnit.innerHTML = `
      <div class="table-responsive" dir="rtl">
        <table class="table table-bordered text-center" style="white-space: nowrap;">
          <thead class="table-dark">
            <tr>
              <th>الرقم</th>
              <th>اسم العميل</th>
              <th>التاريخ</th>
              <th>النوع</th>
              <th>العنوان</th>
              <th>الهاتف</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody id="ordersTableBody">
          </tbody>
        </table>
      </div>
    `;
  
    const tableBody = document.getElementById("ordersTableBody");
    const ordersCollection = collection(db, "orders");
    const ordersQuery = query(ordersCollection, orderBy("Date", "desc"));
    const querySnapshot = await getDocs(ordersQuery);
  
    let index = 0;
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      index++;
  
      const dateTimestamp = data.Date;
      const jsDate = dateTimestamp.toDate(); 
      const formattedDate = jsDate.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
  
      if (type === "الكل" || data.OrderType === type) {
        const color = getColor(data.SelectedDate, data.status, data.comment);
        const rowHTML = `
          <tr>
            <td style="background-color: ${color}; color: white; font-weight: bold;">${index}</td>
            <td>${data.name}</td>
            <td>${formattedDate}</td>
            <td>${data.OrderType}</td>
            <td>${data.address}</td>
            <td>${data.phone}</td>
            <td>
              <button style="background-color: #37426c; color: white;" class="btn delete-button" data-item='${doc.id}'>حذف</button>
              <button style="background-color: ${color}; color: white;" class="btn show-details-button"
                data-item='${JSON.stringify({
                  Date: data.Date,
                  OrderDetails: data.OrderDetails,
                  OrderType: data.OrderType,
                  address: data.address,
                  name: data.name,
                  notes: data.notes,
                  phone: data.phone,
                  status: data.status,
                  id: doc.id,
                  SelectedDate: data.SelectedDate,
                })}'>
                عرض التفاصيل
              </button>
            </td>
          </tr>
        `;
        tableBody.insertAdjacentHTML("beforeend", rowHTML);
      }
    });
  }


  const tableBody = document.getElementById("ordersTableBody");

searchInput.addEventListener("input", function () {
  const filter = searchInput.value.toLowerCase();
  const rows = tableBody.getElementsByTagName("tr");

  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].getElementsByTagName("td");
    let rowContainsFilter = false;

    for (let j = 0; j < cells.length; j++) {
      const cellText = cells[j].textContent.toLowerCase();
      if (cellText.includes(filter)) {
        rowContainsFilter = true;
        break; // No need to check further if a match is found
      }
    }

    rows[i].style.display = rowContainsFilter ? "" : "none";
  }
});

// Clear Search Button Functionality
document.getElementById("clearSearch").addEventListener("click", () => {
  searchInput.value = "";
  const rows = tableBody.getElementsByTagName("tr");
  for (let i = 0; i < rows.length; i++) {
    rows[i].style.display = "";
  }
});
  
});

function getColor(date, status, comment) {
  if (status === "Pending" && date === "") {
    return "#FF0000"; // Red
  } else if (status === "Pending" && date !== "" && compareDate(date) === "big") {
    return "#dd792d"; // Orange
  } else if (status === "Pending" && (date === "تم دفع رسوم رفع مقاس" || date === "الانتظار")) {
    return "#FFC107"; // Amber
  } else if (status === "Pending" && date === "تم ارسال الصور") {
    return "#dd792d"; // Orange
  } else if (status === "Complete" && date === "تم التعاقد") {
    return "#22BF2C"; // Green
  } else if (status === "Pending" && date !== "" && compareDate(date) === "equal") {
    return "#FFC107"; // Amber
  } else if (date !== "" && status === "Complete" && comment !== "") {
    return "#22BF2C"; // Green
  } else if (date !== "" && status === "Complete" && comment === "") {
    return "#0000FF"; // Blue
  } else {
    return "#A9A9A9"; // Gray
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
  }else {
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

async function deleteOrder(id){
  const confirmation = window.confirm("هل أنت متأكد من حذف الطلب ؟");
  if (confirmation) {
    const orderRef = doc(db, "orders", id);
    await deleteDoc(orderRef);
    const orderElement = document.getElementById(id);
    if (orderElement) {
      orderElement.remove();
    }
  }
}



document.getElementById("Logout").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "../../login/index.html";
});

// async function fetchOrders() {
//   const orders = [];
//   const Units = collection(db, "orders");
//   const snapshot = await getDocs(Units);
//   snapshot.forEach((doc) => {
//     orders.push({ id: doc.id, ...doc.data() });
//   });

//   // Save to localStorage
//   localStorage.setItem("orders", JSON.stringify(orders));
//   console.log("Orders fetched and stored in localStorage.");
// }

// function printOrdersFromLocalStorage() {
//   const storedOrders = localStorage.getItem("orders");

//   if (storedOrders) {
//     const orders = JSON.parse(storedOrders);
//     console.log("Printing orders from localStorage:");
//     orders.forEach((order, index) => {
//       console.log(`Order ${order.id}:`, order);
//       console.log("------------");
//     });
//   } else {
//     console.log("No orders found in localStorage.");
//   }
// }
// printOrdersFromLocalStorage();

// async function pushToNewProject() {
//   const orders = JSON.parse(localStorage.getItem("orders"));

//   if (orders) {
//     try {
//       for (const order of orders) {
//         const docRef = doc(db, "orders", order.id); // Use `order.id` as the document ID
//         await setDoc(docRef, order);
//       }
//       console.log("Orders pushed to new Firebase project with specific IDs.");
//     } catch (error) {
//       console.error("Error pushing data to new Firebase project:", error);
//     }
//   } else {
//     console.error("No orders found in localStorage.");
//   }
// }

// async function updateDateFields() {
//     // Get the collection reference
//     const unitsCollection = collection(db, "orders");

//     // Fetch all the documents from the collection
//     const querySnapshot = await getDocs(unitsCollection);

//     // Loop through each document
//     querySnapshot.forEach(async (docSnapshot) => {
//         const documentData = docSnapshot.data();
//         try {
//           // Convert the string date (e.g., "2024-11-25") to a Date object
//           const newDate = new Date(documentData.Date); 

//           // Check if the new Date is valid
         
//           // typeof documentData.Date === 'string'
//           // !isNaN(newDate.getTime())
//           if (typeof documentData.Date === 'string') {
//               // Create a Firestore Timestamp from the Date object
//               const timestamp = newDate;  // Firestore accepts JavaScript Date objects directly
              
//               // Prepare the document reference to update
//               const docRef = doc(db, "orders", docSnapshot.id);

//               // Update the document with the new Timestamp
//               await updateDoc(docRef, {
//                   Date: timestamp,
//               });

//               console.log(`Document ${docSnapshot.id} updated with new Date`);
//           } else {
//               console.log(`Invalid date format in document ${docSnapshot.id}`);
//           }
//       } catch (error) {
//           console.error("Error updating document:", docSnapshot.id, error);
//       }
//     });
// }

// updateDateFields();