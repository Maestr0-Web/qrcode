import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import QRCode from "qrcode";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = 3000;

// قاعدة بيانات بسيطة
const secretKey = "123456"; // الرمز السري
const filePath = path.join(__dirname, "data.txt"); // الملف الذي فيه البيانات
const id = "data-access-001"; // ID فريد للملف

// إنشاء QR Code يحتوي على رابط الوصول
QRCode.toFile("qrcode.png", `http://10.3.47.14:${PORT}/secure/${id}`, err => {
  if (err) throw err;
  console.log("✅ QR Code تم إنشاؤه بنجاح في qrcode.png");
});

// عرض صفحة فيها prompt عند زيارة الرابط
app.get("/secure/:id", (req, res) => {
  if (req.params.id !== id) {
    return res.send("❌ هذا الرابط غير صالح");
  }

  // HTML بسيط فيه prompt و fetch
  res.send(`
    <script>
      const password = prompt("أدخل الرمز السري للوصول إلى البيانات:");

      fetch('/data?key=' + password)
        .then(res => res.text())
        .then(data => {
          document.body.innerHTML = "<pre>" + data + "</pre>";
        })
        .catch(err => {
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

app.listen(PORT, () => {
  console.log(`✅ الخادم يعمل على http://localhost:${PORT}`);
});
