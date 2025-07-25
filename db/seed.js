import db from "#db/client";
import { createEmployee } from "./queries/employees.js";
import { faker } from "@faker-js/faker";

await db.connect();
await seedEmployees();
await db.end();
console.log("🌱 Database seeded.");

async function seedEmployees() {
  for (let i = 0; i < 10; i++) {
    await createEmployee({
      name: faker.person.fullName(),
      birthday: faker.date.birthdate({ min: 1950, max: 2005, mode: "year" }),
      salary: faker.number.int({ min: 30000, max: 120000 }),
    });
  }
}
/*async function seedMovies() {
  for (let i = 0; i < 10; i++) {
    const movie = {
      name: faker.book.title(),
      releaseDate: faker.date.past({ years: 10 }),
      runningTime: faker.number.int({ min: 60, max: 240 }),
    };
    await createMovie(movie);
  }
}
*/
