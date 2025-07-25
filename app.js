import express from "express";
const app = express();

import employeeRouter from "#api/employees";
app.use(express.json());

//app.use("/employees", employeeRouter);
app.use("/", employeeRouter); //Employees MIDLEWARE

//error handlerz middleware

app.use((req, res, next) => {
  res.status(404).send("Not found.");
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Whoops! Something went wrong :(");
});

export default app;
