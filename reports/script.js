import {
    db,
    collection,
    getDocs,
    orderBy,
    query,
} from "./../Database/firebase-config.js";

const parentUnit = document.getElementById("ParentUnit");
const UserID = localStorage.getItem("email");
var index = 0;
const selectElement = document.getElementById('type-select');
var input = document.getElementById("searchInput");
var selectedValue;
document.getElementById("searchBTN").addEventListener('click', async function () {
    if (input.value && (selectedValue === undefined || selectedValue === null || selectedValue === "")) {
        getData("الكل", input.value);
    }
    else {
        getData(selectedValue, input.value);
    }
});

selectElement.addEventListener('change', async function (event) {
    selectedValue = event.target.value;
});

parentUnit.addEventListener("click", async (event) => {
    if (
        event.target &&
        event.target.classList.contains("show-details-button")
    ) {
        const data = event.target.getAttribute("data-item");
        showDetails(data);
    }
});

function showDetails(data) {
    try {
        var d = JSON.parse(data);
        window.location.href = `../../details/index.html?orderId=${d.id}`;
    } catch (error) {
        console.error("Error storing data in sessionStorage:", error);
    }
}

async function getData(type, phone) {
    var itemHTML;
    parentUnit.innerHTML = ``;
    const Units = collection(db, "orders");
    const unitsQuery = await query(Units, orderBy("Date", "desc"));
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
        if (type === 'الكل' && data.phone === phone) {
            if (UserID === "employee") {
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
            else {
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
        else if (data.OrderType === type && data.phone === phone) {
            if (UserID === "employee") {
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
            else {
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
    if (parentUnit.innerHTML === ``) {
        document.getElementById("searchTitle").innerHTML = `
        <i class="fa-solid fa-face-frown my-3" style="color: #37426c;"></i>
         لا يوجد طلبات لهذا الرقم 
        `;
    } else {
        document.getElementById("searchTitle").innerHTML = ``;
    }
}

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
    } else {
        return "equal";
    }
}