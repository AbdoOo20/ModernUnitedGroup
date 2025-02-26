import { db, doc, updateDoc, getDoc, collection , getDocs} from "../../Database/firebase-config.js";

const urlParams = new URLSearchParams(window.location.search);
const orderId = urlParams.get("orderId");
const docRef = doc(db, "orders", orderId);
const docSnap = await getDoc(docRef);
var orderData = docSnap.data();
const email = localStorage.getItem("email");
if (email === "employee") {
  document.getElementById("setDateButton").style.display = "block";
  document.getElementById("dateInput").style.display = "block";
  document.getElementById("notes").innerText = orderData.OrderDetails;
  if (orderData.status === 'Pending' && orderData.SelectedDate !== "" && (compareDate(orderData.SelectedDate) === 'equal' || compareDate(orderData.SelectedDate) === 'small')) {
    document.getElementById("confirmOrder").style.display = "block";
  }
  if (orderData.OrderType === "طلب صيانة") {
    document.getElementById("teamFormContainer").style.display = "block";
    document.getElementById("teamText").innerText = orderData.team;
  }
  if (orderData.OrderType === "زائر جديد") {
    document.getElementById("selectUserType").style.display = "block";
    if (orderData.status === "Pending" && orderData.SelectedDate === "") {
      document.getElementById("status1").checked = true;
    }
    if (orderData.status === "Pending" && orderData.SelectedDate === "تم ارسال الصور") {
      document.getElementById("status2").checked = true;
    }
    if (orderData.status === "Pending" && orderData.SelectedDate === "تم دفع رسوم رفع مقاس") {
      document.getElementById("status4").checked = true;
    }
    if (orderData.status === "Complete" && orderData.SelectedDate === "تم التعاقد") {
      document.getElementById("status3").checked = true;
    }
  }
  if (orderData.OrderType !== "زائر جديد") {
    document.getElementById("selectDate").style.display = "block";
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

if (window.location.pathname === '/details/index.html') {
  window.history.replaceState({}, document.title, `/orderId=${orderId}`);
}

var dateTimestamp = orderData.Date;
const jsDate = dateTimestamp.toDate(); // Convert Firestore Timestamp to JavaScript Date
const formattedDate = jsDate.toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

if (orderData.OrderType === "طلب صيانة") {
  document.getElementById("orderDetails").innerHTML = `
    <div class="table-responsive">
  <table class="table table-bordered text-center">
    <thead>
      <tr>
        <th>اسم العميل</th>
        <th>المكان</th>
        <th>رقم الجوال</th>
        <th>سبب المشكلة</th>
        <th>تاريخ طلب الصيانة</th>
        <th>تاريخ الصيانة المحدد</th>
        <th>الفريق</th>
        <th class="w-25">الإجراء</th> <!-- Bootstrap width class -->
      </tr>
    </thead>
    <tbody>
      <tr>

        <td>${orderData.name}</td>
        <td>${orderData.address}</td>
        <td> ${orderData.phone}</td>
        <td> ${orderData.notes} </td>
        <td>${formattedDate}</td>
        <td id= "date">${orderData.SelectedDate}</td>
        <td id= "team">${orderData.team}</td>
        <td id= "details" class="notes-cell">${orderData.OrderDetails}</td>
      </tr>
    </tbody>
  </table>
  </div>
  `;
} else {
  document.getElementById("orderDetails").innerHTML = `
  <p><strong>الاسم:</strong> ${orderData.name}</p>
  <p><strong>التاريخ:</strong> ${formattedDate}</p>
  <p><strong>النوع:</strong> ${orderData.OrderType}</p>
  <p><strong>العنوان:</strong> ${orderData.address}</p>
  <p><strong>الهاتف:</strong> ${orderData.phone}</p>
  <p><strong>الحالة:</strong> ${orderData.status}</p>
  <p><strong>تفاصيل الطلب:</strong> ${orderData.notes}</p>
  <p id= "details"><strong>ملاحظات:</strong> ${orderData.OrderDetails}</p>
  <p id= "date"><strong>${orderData.OrderType === "زائر جديد" ? "الحاله:" : "التاريخ المحدد:"}</strong> ${orderData.SelectedDate}</p>
`;
}


document.getElementById("setDateButton").addEventListener("click", async () => {
  const selectedDate = document.getElementById("dateInput").value;
  const orderDocRef = doc(db, "orders", docSnap.id);
  if (selectedDate) {
    try {
      alert("تم تحديد الموعد بنجاح");
      if (orderData.OrderType === "طلب صيانة") {
        document.getElementById("date").innerHTML = `${selectedDate}`;
      }else{
        document.getElementById("orderDetails").innerHTML += `${selectedDate}`;
      }
      await updateDoc(orderDocRef, {
        SelectedDate: selectedDate,
      });
    } catch (error) {
      alert("يوجد خطا فى تحديد التاريخ");
    }
  } else {
    alert("من فضلك اختر التاريخ");
  }
});

document.getElementById("confirmOrder").addEventListener("click", async () => {
  const orderDocRef = doc(db, "orders", docSnap.id);
  await updateDoc(orderDocRef, {
    status: 'Complete',
  });
  document.getElementById("confirmOrder").style.display = "none";
  alert("تم إكمال الطلب بنجاح");
});

let selectedRating = 0;
const stars = document.querySelectorAll("#rating .fa-star");
stars.forEach((star) => {
  star.addEventListener("click", function () {
    selectedRating = this.dataset.value;
    stars.forEach((star) => star.classList.remove("selected"));
    for (let i = 0; i < selectedRating; i++) {
      stars[i].classList.add("selected");
    }
  });
});

// function checkOrderComment() {
//   if (orderData.comment) {
//     // Display the comment
//     document.getElementById("commentDisplay").textContent = orderData.comment;

//     // Display the stars based on the rating
//     const ratingDisplay = document.getElementById("ratingDisplay");
//     ratingDisplay.innerHTML = "";
//     for (let i = 0; i < orderData.rate; i++) {
//       const star = document.createElement("span");
//       star.classList.add("fa", "fa-star", "selected"); // Add selected class to fill the stars
//       ratingDisplay.appendChild(star);
//     }

//     // Hide the rating form and show the comment
//     document.getElementById("ratingFormContainer").style.display = "none";
//     document.getElementById("commentContainer").style.display = "block";
//   } else if (
//     orderData.status === "Complete" &&
//     (orderData.comment === "" || orderData.comment === undefined) &&
//     email === "admin"
//   ) {
//     document.getElementById("ratingFormContainer").style.display = "none";
//     document.getElementById("commentContainer").style.display = "none";
//   } else if (
//     orderData.status === "Complete" &&
//     (orderData.comment === "" || orderData.comment === undefined) &&
//     email !== "admin"
//   ) {
//     document.getElementById("ratingFormContainer").style.display = "block";
//     document.getElementById("commentContainer").style.display = "none";
//   } else {
//     document.getElementById("commentContainer").style.display = "none";
//     document.getElementById("ratingFormContainer").style.display = "none";
//   }
// }

// checkOrderComment();

// Form Submit Event
// const form = document.getElementById("ratingForm");
// form.addEventListener("submit", async function (e) {
//   e.preventDefault();

//   const comment = document.getElementById("comment").value;

//   // Check if rating and comment are provided
//   if (selectedRating === 0 || !comment) {
//     alert("الرجاء تقديم تقييم وتعليق.");
//     return;
//   }

//   // Store the rating and comment in Firestore
//   const docRef = doc(db, "orders", orderId);

//   // Update the date field with a new Date object
//   await updateDoc(docRef, {
//     rate: selectedRating,
//     comment: comment,
//     RateDate: Date().toString(),
//   })
//     .then(() => {
//       alert("شكرًا لتقييمك وتعليقك!");
//       document.getElementById("ratingFormContainer").style.display = "none";
//       document.getElementById("commentDisplay").textContent = comment;
//       // document.getElementById("commentContainer").style.display = "block";
//       form.reset();
//       stars.forEach((star) => star.classList.remove("selected"));
//     })
//     .catch((error) => {
//       alert(error);
//     });
// });

// form notes
const formNotes = document.getElementById("noteForm");
formNotes.addEventListener("submit", async function (e) {
  e.preventDefault();
  const orderDocRef = doc(db, "orders", docSnap.id);
  const comment = document.getElementById("notes").value;
  await updateDoc(orderDocRef, {
    OrderDetails: comment,
  });
  if (orderData.OrderType === "طلب صيانة") {
    document.getElementById("details").innerHTML = `${comment}`;
  }
  else{
    document.getElementById("details").innerHTML += `${comment}`;
  }

  alert("تم الحفظ");
});

// form team
const teamNotes = document.getElementById("teamForm");
teamNotes.addEventListener("submit", async function (e) {
  e.preventDefault();
  const orderDocRef = doc(db, "orders", docSnap.id);
  const comment = document.getElementById("teamText").value;
  console.log(comment);
  
  await updateDoc(orderDocRef, {
    team: comment,
  });
  document.getElementById("team").innerHTML = `${comment}`;
  alert("تم الحفظ");
});

// Function to save the selected status to Firestore
async function saveStatusToFirestore(NewStatu) {
  try {
    const orderDocRef = doc(db, "orders", docSnap.id);
    await updateDoc(orderDocRef, {
      SelectedDate: NewStatu,
      status: NewStatu === "تم التعاقد" ? "Complete" : "Pending"
    });
    alert(NewStatu);
    if (NewStatu === "تم التعاقد") {
      // document.getElementById("ratingFormContainer").style.display = "block";
      // document.getElementById("notesFormContainer").style.display = "block";
    }
  } catch (error) {
    alert("Error saving status: " + error);
  }
}

// Add event listener for radio buttons
document.querySelectorAll('input[name="status"]').forEach((radio) => {
  radio.addEventListener("change", (event) => {
    const selectedStatus = event.target.value;
    saveStatusToFirestore(selectedStatus);
  });
});