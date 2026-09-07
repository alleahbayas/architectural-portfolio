import bcrypt from "bcryptjs";

const password = "admin123$"; // pick a new password here
const hash = bcrypt.hashSync(password, 10);
console.log(hash);