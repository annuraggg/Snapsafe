import app from "./config/init";
import auth from "./api/auth/main.js";
import files from "./api/files/main.js";

app.use("/auth", auth);
app.use("/files", files);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
