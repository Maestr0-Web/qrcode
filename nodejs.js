import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import QRCode from "qrcode";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;

// نأخذ البيانات من متغيرات البيئة
const secretKey = process.env.QR_SECRET || "123456";
const qrFileName = process.env.QR_NAME || "qrcode";
const filePath = path.join(__dirname, "data.txt");
const id = "data-access-001";

// إنشاء QR Code بالرابط
QRCode.toFile(`${qrFileName}.png`, `https://qrcode-1-p8ud.onrender.com/secure/${id}`, err => {
  if (err) throw err;
  console.log(`✅ تم إنشاء الكود في ${qrFileName}.png`);
});

// صفحة إدخال كلمة المرور
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

// إرسال البيانات عند تطابق كلمة السر
app.get("/data", (req, res) => {
  const key = req.query.key;
  if (key !== secretKey) {
    return res.status(403).send("❌ الرمز غير صحيح.");
  }
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) return res.status(500).send("❌ خطأ في قراءة البيانات.");
    res.send(data);
  });
});

app.listen(PORT, () => {
  console.log(`✅ الخادم يعمل على http://localhost:${PORT}`);
});
// حفظ البيانات في ملف
fs.writeFile(filePath, "هذه بيانات سرية", err => {
  if (err) throw err;
  console.log(`✅ تم حفظ البيانات في ${filePath}`);
});     