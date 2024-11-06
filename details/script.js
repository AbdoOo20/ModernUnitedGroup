import { db, doc, updateDoc, getDoc } from "../../Database/firebase-config.js";

const urlParams = new URLSearchParams(window.location.search);
const orderId = urlParams.get("orderId");
const docRef = doc(db, "orders", orderId);
const docSnap = await getDoc(docRef);
var orderData = docSnap.data();

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
