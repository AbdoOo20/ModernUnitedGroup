import { db, doc, updateDoc, getDoc } from "../../Database/firebase-config.js";

const urlParams = new URLSearchParams(window.location.search);
const orderId = urlParams.get("orderId");
const docRef = doc(db, "orders", orderId);
const docSnap = await getDoc(docRef);
var orderData = docSnap.data();
const email = localStorage.getItem("email");
if (email === "admin") {
  document.getElementById("setDateButton").style.display = "none";
  document.getElementById("dateInput").style.display = "none";
}

document.getElementById("orderDetails").innerHTML = `
            <p><strong>الاسم:</strong> ${orderData.name}</p>
            <p><strong>التاريخ:</strong> ${orderData.Date}</p>
            <p><strong>النوع:</strong> ${orderData.OrderType}</p>
            <p><strong>العنوان:</strong> ${orderData.address}</p>
            <p><strong>الهاتف:</strong> ${orderData.phone}</p>
            <p><strong>الحالة:</strong> ${orderData.status}</p>
            <p><strong>ملاحظات:</strong> ${orderData.notes}</p>
            <p><strong>تفاصيل الطلب:</strong> ${orderData.OrderDetails}</p>
            <p id= "date"><strong>التاريخ المحدد:</strong> ${orderData.SelectedDate}</p>
        `;

document.getElementById("setDateButton").addEventListener("click", async () => {
  const selectedDate = document.getElementById("dateInput").value;

  if (selectedDate) {
    try {
      const orderDocRef = doc(db, "orders", orderId);
      await updateDoc(orderDocRef, {
        SelectedDate: selectedDate,
      });
      alert("تم تحديد الموعد بنجاح");
      document.getElementById("orderDetails").innerHTML += `${selectedDate}`;
    } catch (error) {
      alert("يوجد خطا فى تحديد التاريخ");
    }
  } else {
    alert("من فضلك اختر التاريخ");
  }
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

function checkOrderComment() {
  if (orderData.comment) {
    // Display the comment
    document.getElementById("commentDisplay").textContent = orderData.comment;

    // Display the stars based on the rating
    const ratingDisplay = document.getElementById("ratingDisplay");
    ratingDisplay.innerHTML = "";
    for (let i = 0; i < orderData.rate; i++) {
      const star = document.createElement("span");
      star.classList.add("fa", "fa-star", "selected"); // Add selected class to fill the stars
      ratingDisplay.appendChild(star);
    }

    // Hide the rating form and show the comment
    document.getElementById("ratingFormContainer").style.display = "none";
    document.getElementById("commentContainer").style.display = "block";
  } else if (
    orderData.status === "Complete" &&
    orderData.comment === "" &&
    email === "employee"
  ) {
    // If no comment, show the rating form
    document.getElementById("ratingFormContainer").style.display = "block";
    document.getElementById("commentContainer").style.display = "none";
  } else {
    document.getElementById("commentContainer").style.display = "none";
    document.getElementById("ratingFormContainer").style.display = "none";
  }
}

checkOrderComment();

// Form Submit Event
const form = document.getElementById("ratingForm");
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const comment = document.getElementById("comment").value;

  // Check if rating and comment are provided
  if (selectedRating === 0 || !comment) {
    alert("الرجاء تقديم تقييم وتعليق.");
    return;
  }

  // Store the rating and comment in Firestore
  const docRef = doc(db, "orders", orderId);

  // Update the date field with a new Date object
  await updateDoc(docRef, {
    rate: selectedRating,
    comment: comment,
    RateDate: Date().toString(),
  })
    .then(() => {
      alert("شكرًا لتقييمك وتعليقك!");
      document.getElementById("ratingFormContainer").style.display = "none";
      document.getElementById("commentDisplay").textContent = comment;
      document.getElementById("commentContainer").style.display = "block";
      form.reset();
      stars.forEach((star) => star.classList.remove("selected"));
    })
    .catch((error) => {
      console.error("خطأ في إضافة الوثيقة: ", error);
    });
});
