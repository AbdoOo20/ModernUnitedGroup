import { db, doc, updateDoc } from "../../Database/firebase-config.js";

const orderData = JSON.parse(sessionStorage.getItem("orderData"));

// Display the data
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
      const orderDocRef = doc(db, "orders", orderData.id); // Use the correct path to your document
      await updateDoc(orderDocRef, {
        SelectedDate: selectedDate,
      });
      alert("Date Selected successfully!");
      document.getElementById("orderDetails").innerHTML += `${selectedDate}`;
    } catch (error) {
      alert("Error updating date. Please try again.");
    }
  } else {
    alert("Please select a date before updating.");
  }
});
