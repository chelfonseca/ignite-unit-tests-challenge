
import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";
import createConnection from "@shared/infra/typeorm";
import { idText } from "typescript";
let connection: Connection;

describe("Get Statement Operation", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

  });
  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to get a deposit statement operation for a registered User", async () => {
    
    await request(app).post("/api/v1/users").send({
        name: "user",
        email: "user@email.com",
        password: "1234"
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "user@email.com",
      password: "1234"
    });
    const { id: user_id, token  } = responseToken.body;

    const responseDeposit = await request(app).post("/api/v1/statements/deposit")
    .send({
        user_id,
        type: "deposit",
        amount: 100,
        description: "statement test"
    })
    .set({
        Authorization: `Bearer ${token}`
    })

    const { id: statement_id } = responseDeposit.body;
    
    const response = await request(app).get(`/api/v1/statements/${statement_id}`)
    .set({
        Authorization: `Bearer ${token}`,
    })
 
    expect(response.status).toBe(200);
  });
  it("should be able to get a withdraw statement operation for a registered User", async () => {
    
    await request(app).post("/api/v1/users").send({
        name: "user",
        email: "user@email.com",
        password: "1234"
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "user@email.com",
      password: "1234"
    });
    const { id: user_id, token  } = responseToken.body;

    await request(app).post("/api/v1/statements/deposit")
    .send({
        user_id,
        type: "deposit",
        amount: 100,
        description: "statement test"
    })
    .set({
        Authorization: `Bearer ${token}`
    })
    const responseWithdraw = await request(app).post("/api/v1/statements/withdraw")
    .send({
        user_id,
        type: "withdraw",
        amount: 100,
        description: "statement test"
    })
    .set({
        Authorization: `Bearer ${token}`
    })

    const { id: statement_id } = responseWithdraw.body;
    
    const response = await request(app).get(`/api/v1/statements/${statement_id}`)
    .set({
        Authorization: `Bearer ${token}`,
    })
 
    expect(response.status).toBe(200);
  });
    
  it("should not be able to get a nonexistent statement or withdraw operation", async () => {
    
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
  
    const statement_id = "f58d5f31-d25f-48cc-82d8-921ae742cb44"
    const response = await request(app).get(`/api/v1/statements/${statement_id}`)
    .set({
        Authorization: `Bearer ${token}`,
    })
 
    expect(response.status).toBe(404);
  });
    
//     const responseToken = await request(app).post("/api/v1/sessions").send({
//       email: "user@email.com",
//       password: "1234"
//     });
//     const { id, token  } = responseToken.body;

//     await request(app).post("/api/v1/statements/deposit")
//     .send({
//         user_id: id,
//         type: "deposit",
//         amount: 100,
//         description: "deposit test"
//     })
//     .set({
//         Authorization: `Bearer ${token}`
//     })

//     const response = await request(app).post("/api/v1/statements/withdraw")
//     .send({
//         user_id: id,
//         type: "withdraw",
//         amount: 50,
//         description: "withdraw test"
//     })
//     .set({
//         Authorization: `Bearer ${token}`
//     })

//     expect(response.status).toBe(201);
//   });

 });

