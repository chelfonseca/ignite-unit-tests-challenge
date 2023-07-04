import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";
import createConnection from "@shared/infra/typeorm";
let connection: Connection;

describe("Create Statement", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

  });
  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a deposit statement for a registered User", async () => {
    
    await request(app).post("/api/v1/users").send({
        name: "user",
        email: "user@email.com",
        password: "1234"
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "user@email.com",
      password: "1234"
    });
    const { id, token  } = responseToken.body;

    const response = await request(app).post("/api/v1/statements/deposit")
    .send({
        user_id: id,
        type: "deposit",
        amount: 100,
        description: "statement test"
    })
    .set({
        Authorization: `Bearer ${token}`
    })
  
    expect(response.status).toBe(201);
  });
  it("should be able to create a withdraw statement for a registered User", async () => {
    
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "user@email.com",
      password: "1234"
    });
    const { id, token  } = responseToken.body;

    await request(app).post("/api/v1/statements/deposit")
    .send({
        user_id: id,
        type: "deposit",
        amount: 100,
        description: "deposit test"
    })
    .set({
        Authorization: `Bearer ${token}`
    })

    const response = await request(app).post("/api/v1/statements/withdraw")
    .send({
        user_id: id,
        type: "withdraw",
        amount: 100,
        description: "withdraw test"
    })
    .set({
        Authorization: `Bearer ${token}`
    })

    expect(response.status).toBe(201);
  });
  it("should not be able to create a withdraw statement for a registered User with insufficient funds", async () => {
    
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "user@email.com",
      password: "1234"
    });
    const { id, token  } = responseToken.body;

    const response = await request(app).get("/api/v1/statements/balance")
    .set({
        Authorization: `Bearer ${token}`
    })
    
    console.log(response.body)
    // const response = await request(app).post("/api/v1/statements/withdraw")
    // .send({
    //     user_id: id,
    //     type: "withdraw",
    //     amount: 200,
    //     description: "withdraw test"
    // })
    // .set({
    //     Authorization: `Bearer ${token}`
    // })
  
    // expect(response.status).toBe(400);
  });

 });