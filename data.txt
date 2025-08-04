import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import QRCode from "qrcode";
import inquirer from "inquirer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;

// رابط السيرفر العام على Render
const BASE_URL = "https://qrcode-1-p8ud.onrender.com";

// قاعدة بيانات بسيطة
let secretKey = ""; // الرمز السري سيتم إدخاله من المستخدم
const filePath = path.join(__dirname, "data.txt"); // الملف الذي فيه البيانات
const id = "data-access-001"; // ID فريد للملف


// اطلب كلمة المرور من المستخدم قبل بدء السيرفر
inquirer.prompt([
  {
    type: "password",
    message: "أدخل كلمة المرور التي تريد استخدامها:",
    name: "password",
    mask: "*"
  }
]).then((answers) => {
  secretKey = answers.password;

  // إنشاء QR Code يحتوي على رابط الوصول
  QRCode.toFile("qrcode.png", `${BASE_URL}/secure/${id}`, err => {
    if (err) throw err;
    console.log("✅ QR Code تم إنشاؤه بنجاح في qrcode.png");
  });

  // بدء السيرفر بعد إدخال كلمة المرور
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ الخادم يعمل على ${BASE_URL}`);
  });
});

// عرض صفحة فيها prompt عند زيارة الرابط
app.get("/secure/:id", (req, res) => {
  if (req.params.id !== id) {
    return res.send("❌ هذا الرابط غير صالح");
  }

  res.send(`
    <script>
      const password = prompt("أدخل الرمز السري للوصول إلى البيانات:");

      fetch('/data?key=' + password)
        .then(res => res.text())
        .then(data => {
          document.body.innerHTML = "<pre>" + data + "</pre>";
        })
        .catch(() => {
          document.body.innerHTML = "❌ حدث خطأ.";
        });
    </script>
  `);
});

// تحقق من الرمز وأرجع البيانات
app.get("/data", (req, res) => {
  const key = req.query.key;

  if (key !== secretKey) {
    return res.status(403).send("❌ الرمز غير صحيح.");
  }

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) return res.status(500).send("حدث خطأ في قراءة الملف.");
    res.send(data);
  });
});

// ...existing code...
