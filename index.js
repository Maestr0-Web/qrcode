    import inquirer from "inquirer";
    import qr from "qrcode";
    import fs from "fs";

    // دالة للحصول على وقت بصيغة تصلح كاسم ملف
    function getTimestamp() {
    return new Date().toISOString().replace(/[:.]/g, "-"); 
    }

    inquirer
    .prompt([
        {
        message: "Enter one or more URLs separated by commas:",
        name: "urls",
        },
    ])
    .then((answers) => {      
        // تقسيم النص إلى روابط منفصلة وتنظيفها من الفراغات
        const urlList = answers.urls.split(",").map((url) => url.trim());

        urlList.forEach((url, index) => {
        const timestamp = getTimestamp();
        // اسم ملف صورة QR مع رقم فريد
        const qrFileName = `qrcode-${timestamp}-${index + 1}.png`;
        // اسم ملف نصي للرابط مع رقم فريد
        const textFileName = `url-${timestamp}-${index + 1}.txt`;

        // إنشاء صورة QR
        qr.toFile(qrFileName, url, {
    color: {
        dark: "#ff00ff",
        light: "#00ff00",
    },
    }, (err) =>{
    if (err) throw err;
    console.log(`✅ QR code saved as ${qrFileName}`);
    });

        // حفظ الرابط في ملف نصي
        fs.writeFile(textFileName, url, (error) => {
            if (error) throw error;
            console.log(`✅ QR code saved as ${qrFileName}`);
            console.log(`✅ URL saved to ${textFileName}`);
        });
        });
    });
