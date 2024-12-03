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

  async function getData(type){
    parentUnit.innerHTML = ``;
      const Units = collection(db, "orders");
      const unitsQuery  = await query(Units, orderBy("Date", "desc"));
      const querySnapshot = await getDocs(unitsQuery);   
      index = 0;
      querySnapshot.forEach((doc) => {
        index++;
        const data = doc.data();
        var dateTimestamp = data.Date;
      const jsDate = dateTimestamp.toDate(); // Convert Firestore Timestamp to JavaScript Date
      const formattedDate = jsDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
      });
      if (type === 'الكل'){
        var itemHTML;
          if(UserID === "employee"){
            itemHTML = `
                                          <div class="col" id=${doc.id}>
                                                  <div class="card product-card position-relative">
                                                  <div class="position-absolute top-0 end-0 p-1 bg-primary text-white" style="background-color: ${getColor(
          data.SelectedDate,
          data.status,
          data.comment
        )} !important;">
                                                  ${index}
                                                  </div>
                                                  <div class="card-body text-end mt-3" style="direction: rtl;">    
                                                          <h5 class="card-title">${data.name
          }</h5>
                                                          <p class="card-text"><strong>التاريخ:</strong> ${formattedDate
          }</p>
                                                          <p class="card-text"><strong>النوع:</strong> ${data.OrderType
          }</p>
                                                          <p class="card-text"><strong>العنوان:</strong> ${data.address
          }</p>
                                                          <p class="card-text"><strong>الهاتف:</strong> ${data.phone
          }</p>
                                                  </div>
  
          
          <div class="d-flex" style="width: 100%">  
           <button class="btn text-white delete-button" data-item='${doc.id}' style="width: 50%;background-color: #37426c">حذف</button> 
           <button class="btn btn-primary show-details-button" style="width: 50%;background-color: ${getColor(
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
                                          </div>
                                          `;
          }
           else{
            itemHTML = `
                                          <div class="col" id=${doc.id}>
                                                  <div class="card product-card position-relative">
                                                  <div class="position-absolute top-0 end-0 p-1 bg-primary text-white" style="background-color: ${getColor(
          data.SelectedDate,
          data.status,
          data.comment
        )} !important;">
                                                  ${index}
                                                  </div>
                                                  <div class="card-body text-end mt-3" style="direction: rtl;">    
                                                          <h5 class="card-title">${data.name
          }</h5>
                                                          <p class="card-text"><strong>التاريخ:</strong> ${formattedDate
          }</p>
                                                          <p class="card-text"><strong>النوع:</strong> ${data.OrderType
          }</p>
                                                          <p class="card-text"><strong>العنوان:</strong> ${data.address
          }</p>
                                                          <p class="card-text"><strong>الهاتف:</strong> ${data.phone
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
           }
          parentUnit.insertAdjacentHTML("beforeend", itemHTML);
      }
      else if (data.OrderType === type) {
          var itemHTML;
          if(UserID === "employee"){
            itemHTML = `
                                          <div class="col" id=${doc.id}>
                                                  <div class="card product-card position-relative">
                                                  <div class="position-absolute top-0 end-0 p-1 bg-primary text-white" style="background-color: ${getColor(
          data.SelectedDate,
          data.status,
          data.comment
        )} !important;">
                                                  ${index}
                                                  </div>
                                                  <div class="card-body text-end mt-3" style="direction: rtl;">    
                                                          <h5 class="card-title">${data.name
          }</h5>
                                                          <p class="card-text"><strong>التاريخ:</strong> ${formattedDate
          }</p>
                                                          <p class="card-text"><strong>النوع:</strong> ${data.OrderType
          }</p>
                                                          <p class="card-text"><strong>العنوان:</strong> ${data.address
          }</p>
                                                          <p class="card-text"><strong>الهاتف:</strong> ${data.phone
          }</p>
                                                  </div>
  
          
          <div class="d-flex" style="width: 100%">  
            <button class="btn text-white delete-button" data-item='${doc.id}' style="width: 50%;background-color: #37426c">حذف</button>
           <button class="btn btn-primary show-details-button" style="width: 50%;background-color: ${getColor(
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
                                          </div>
                                          `;
          }
           else{
            itemHTML = `
                                          <div class="col" id=${doc.id}>
                                                  <div class="card product-card position-relative">
                                                  <div class="position-absolute top-0 end-0 p-1 bg-primary text-white" style="background-color: ${getColor(
          data.SelectedDate,
          data.status,
          data.comment
        )} !important;">
                                                  ${index}
                                                  </div>
                                                  <div class="card-body text-end mt-3" style="direction: rtl;">    
                                                          <h5 class="card-title">${data.name
          }</h5>
                                                          <p class="card-text"><strong>التاريخ:</strong> ${formattedDate
          }</p>
                                                          <p class="card-text"><strong>النوع:</strong> ${data.OrderType
          }</p>
                                                          <p class="card-text"><strong>العنوان:</strong> ${data.address
          }</p>
                                                          <p class="card-text"><strong>الهاتف:</strong> ${data.phone
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
           }
          parentUnit.insertAdjacentHTML("beforeend", itemHTML);
      }
      });
  }
});

function getColor(date, status, comment) {
  if (status === "Pending" && date === "") {
    return "#FF0000"; // red
  } else if (
    status === "Pending" &&
    date !== "" &&
    compareDate(date) == "big"
  ) {
    return "#dd792d"; // orange
  } 
  else if (
    status === "Pending" &&
    date === "الانتظار"
  ) {
    return "#FFC107"; // amber
  } 
  else if (
    status === "Pending" &&
    date === "تم ارسال الصور"
  ) {
    return "#dd792d"; // orange
  }
  else if (
    status === "Complete" &&
    date === "تم التعاقد"
  ) {
    return "#22BF2C"; // green
  } 
  else if (
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