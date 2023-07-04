import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";
import createConnection from "@shared/infra/typeorm";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";

let connection: Connection;

describe("Show User Profile", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

  });
  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to show User profile", async () => {
    
    await request(app).post("/api/v1/users").send({
        name: "user",
        email: "user@email.com",
        password: "1234"
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "user@email.com",
      password: "1234"
    });
    const { token  } = responseToken.body;

    const response = await request(app).get("/api/v1/profile")
    .set({
        Authorization: `Bearer ${token}`
    })
  
    expect(response.status).toBe(200);
  });

 });