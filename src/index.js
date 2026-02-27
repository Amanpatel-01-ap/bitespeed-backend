import express from "express";
import identifyRouter from "./routes/identify.js";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Bitespeed Backend Running");
});
app.use("/", identifyRouter);


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});