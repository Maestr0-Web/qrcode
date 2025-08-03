import QRCode from 'qrcode';

const phoneNumber = 'https://wa.me/967779898916'; // رابط واتساب الصحيح

QRCode.toFile('whatsapp-qr.png', phoneNumber, {
  color: {
    dark: '#000',  // لون الرمز
    light: '#FFF'  // خلفية
  }
},  (err) =>{
  if (err) throw err;
  console.log('✅ تم إنشاء رمز QR لرقم واتسابك بنجاح!');
});
