import {
    db,
    collection,
    addDoc,
    updateDoc,
    doc,
    getDocs
} from "../../Database/firebase-config.js";

if (window.location.pathname === '/order/sections.html') {
    document.getElementById("order").addEventListener('click', function () {
        window.location.href = "./follow.html";
    });
    document.getElementById("repair").addEventListener('click', function () {
        window.location.href = "./index.html?type=طلب صيانة";
    });
    document.getElementById("problem").addEventListener('click', function () {
        window.location.href = "./index.html?type=شكوى"; 
    });
    document.getElementById("question").addEventListener('click', function () {
        window.location.href = "./index.html?type=استفسار"; 
    });
}


if (window.location.pathname === '/order/index.html') {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get("type");
    document.getElementById("titlePage").innerText = type;
    document.getElementById('detailsForm').addEventListener('submit', async function (e) {
        e.preventDefault();
        if (!this.checkValidity()) {
            e.stopPropagation();
        } else {
            // Show loading spinner
            document.getElementById('loadingSpinner').style.display = 'flex';
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const address = document.getElementById('address').value;
            const notes = document.getElementById('notes').value;
            const docRef = await addDoc(collection(db, "orders"), {
                Date: new Date(),
                OrderType: type,
                SelectedDate: "",
                OrderDetails: "",
                RateDate: "",
                address: address,
                comment: "",
                id: "",
                name: name,
                status: "Pending",
                notes: notes,
                phone: phone,
                rate: 0,
            });
            await updateDoc(docRef, {
                id: docRef.id,
            });
            const randomCode = generateRandomFromOrderId(docRef.id);
            sendSmsMessage(phone, docRef.id, randomCode);
            document.getElementById('loadingSpinner').style.display = 'none';
            this.reset();
            alert('تم إرسال النموذج بنجاح!');
        }
        this.classList.add('was-validated');
    });
}

async function sendSmsMessage(phone, orderId, randomNumber) {
    const url = 'https://api.oursms.com/msgs/sms';
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer gSlFblx2K62oFrL9zTxS',
    };

    const body = {
        src: 'UnitedCo',
        body: `مرحبًا بك!
  تم تقديم طلبك بنجاح.
  
  لمتابعة طلبك، برجاء استخدام رقم الطلب الخاص بك (${randomNumber}) وزيارة الموقع الإلكتروني الخاص بالشركة:
  http://www.unitedgroup.ai/details/index.html?orderId=${orderId}
  
  شكرًا لتعاملكم معنا!`,
        dests: [phone],
    };

    const docRef = doc(db, "orders", orderId);
    await updateDoc(docRef, {
        code: randomNumber,
    });
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body),
        });

        if (response.ok) {
            console.log('SMS sent successfully!');
        } else {
            const errorResponse = await response.json();
            console.error('Failed to send SMS:', errorResponse);
        }
    } catch (error) {
        console.error('Error sending SMS:', error);
    }
}

function generateRandomFromOrderId(orderId) {
    // Extract all alphanumeric characters from the orderId (letters and digits)
    const alphanumeric = orderId.replace(/[^a-zA-Z0-9]/g, '');

    // Ensure we have enough characters
    if (alphanumeric.length < 6) {
        console.error("Order ID doesn't contain enough alphanumeric characters.");
        return null;
    }

    // Generate a random 6-character string
    let randomCode = '';
    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * alphanumeric.length);
        randomCode += alphanumeric[randomIndex];
    }
    return randomCode;
}

if (window.location.pathname === '/order/follow.html') {
    // Handle form submission
    document.getElementById('orderForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        const orderInput = document.getElementById('orderInput').value.trim();
        const errorAlert = document.getElementById('errorAlert');
        const loadingSpinner = document.getElementById('loadingSpinner');

        // Hide error alert initially
        errorAlert.classList.add('d-none');
        loadingSpinner.classList.remove('d-none');

        if (!orderInput) {
            // If input is empty, show error alert
            errorAlert.textContent = 'الرجاء إدخال رقم الطلب أو الرمز العشوائي';
            errorAlert.classList.remove('d-none');
            loadingSpinner.classList.add('d-none');
            return;
        }

        try {
            // Search for the order ID or random code in Firestore
            const ordersRef = collection(db, 'orders');
            const querySnapshot = await getDocs(ordersRef);

            let orderFound = false;
            let orderId = null;

            querySnapshot.forEach((doc) => {
                const orderData = doc.data();
                const orderIdFromDb = doc.id;  // Assuming the field is 'orderId'
                const randomCode = orderData.code;  // Assuming the field is 'code'
                // Check if the order ID matches or the random code matches
                if (orderInput === orderIdFromDb || orderInput === randomCode) {
                    orderId = doc.id;  // Get the document ID
                    orderFound = true;
                    return;
                }
            });
            loadingSpinner.classList.add('d-none');
            if (orderFound && orderId) {
                // Redirect to the order details page
                window.open(`./../details/index.html?orderId=${orderId}`, '_blank');
            } else {
                errorAlert.textContent = 'رقم الطلب أو الرمز غير صحيح';
                errorAlert.classList.remove('d-none');
            }
        } catch (error) {
            errorAlert.textContent = 'حدث خطأ في جلب بيانات الطلب';
            errorAlert.classList.remove('d-none');
            loadingSpinner.classList.add('d-none');
        }
    });
}