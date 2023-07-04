import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";
import createConnection from "@shared/infra/typeorm";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";

let connection: Connection;

describe("Authenticate User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

  });
  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to authenticate an User", async () => {
    
    await request(app).post("/api/v1/users").send({
        name: "user",
        email: "user@email.com",
        password: "1234"
    });

    const response = await request(app).post("/api/v1/sessions").send({
        email: "user@email.com",
        password: "1234"
    });
   
    expect(response.status).toBe(200);
  });

  it("should not be able to authenticate an nonexistent user", async () => {
    
    const response = await request(app).post("/api/v1/sessions").send({
      email: "nonexistent-user@email.com",
      password: "1234"
  });
    expect(response.status).toBe(401);
  });
  it("should not be able to authenticate with incorrect password", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "user@email.com",
      password: "incorrect_password"
  });
    expect(response.status).toBe(401);

  });
  it("should not be able to authenticate incorrect email", async () => {
    
    const response = await request(app).post("/api/v1/sessions").send({
      email: "incorrect@email.com",
        password: "1234"
  });
    expect(response.status).toBe(401);

  });
});