require("dotenv").config();
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: `${process.env.USER_MAIL}`,
    pass: `${process.env.PASS_MAIL}`,
  },
});

const sendMail = (to, subject, htmlContent) => {
  const options = {
    from: `${process.env.USER_MAIL}`, // địa chỉ admin email bạn dùng để gửi
    to: to, // địa chỉ gửi đến
    subject: "Schedule Capstone Team Project Defence", // Tiêu đề của mail
    html: htmlContent, // Phần nội dung mail mình sẽ dùng html thay vì thuần văn bản thông thường.
  };
  // hàm transporter.sendMail() này sẽ trả về cho chúng ta một Promise
  return transporter.sendMail(options);
};
