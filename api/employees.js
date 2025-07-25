import express from "express";
import {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "#db/queries/employees";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Welcome to the Fullstack Employees API.");
});

router
  .route("/employees")
  .get(async (req, res) => {
    const employees = await getEmployees();
    res.send(employees);
  })
  .post(async (req, res, next) => {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).send("Request must have a body.");
    }

    const { name, birthday, salary } = req.body;

    if (
      typeof name !== "string" ||
      typeof birthday !== "string" || // it may come as string
      isNaN(Number(salary))
    ) {
      return res
        .status(400)
        .send("Request body must include: name, birthday, salary");
    }

    try {
      const newEmployee = await createEmployee({
        name,
        birthday,
        salary,
      });
      res.status(201).send(newEmployee);
    } catch (err) {
      next(err);
    }
  });

router.param("id", async (req, res, next, id) => {
  if (!/^\d+$/.test(id))
    return res.status(400).send("ID must be a positive integer.");

  // Try to find the employee with the specified ID
  const employee = await getEmployee(id);
  if (!employee) return res.status(404).send("employee not found.");

  req.employee = employee;
  next();
});

router
  .route("/employees/:id")
  .get((req, res) => {
    res.send(req.employee);
  })

  .put(async (req, res, next) => {
    const { name, birthday, salary } = req.body || {};
    if (!name || !birthday || salary === undefined) {
      return res
        .status(400)
        .send("Request body must include: name, birthday, salary");
    }

    try {
      const updated = await updateEmployee({
        id: req.employee.id,
        name,
        birthday,
        salary,
      });
      res.status(200).send(updated);
    } catch (err) {
      next(err);
    }
  })
  .delete(async (req, res, next) => {
    try {
      await deleteEmployee(req.employee.id);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  });

export default router;
