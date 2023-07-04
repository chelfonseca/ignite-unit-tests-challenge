import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";
import createConnection from "@shared/infra/typeorm";

let connection: Connection;
describe("Create Category Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

  });
  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a new user", async () => {
    const response = await request(app).post("/api/v1/users").send({
        name: "user",
        email: "user@email.com",
        password: "1234"
    });
   
    expect(response.status).toBe(201);
  });

  it("should not be able to create a new User with a email adress that already exists", async () => {

    const response = await request(app).post("/api/v1/users").send({
        name: "user",
        email: "user@email.com",
        password: "1234"
    });
   
    expect(response.status).toBe(400);
  });
});