import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { User } from "@modules/users/entities/User";
import { AppError } from "@shared/errors/AppError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase; 
let createUserUseCase: CreateUserUseCase;

describe("Create Statement", () => {

    beforeEach(() => {
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createStatementUseCase = new CreateStatementUseCase( inMemoryUsersRepository, inMemoryStatementsRepository)
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
        
    })

    it("should be able to create a deposit statement for a registered User", async () => {
        
        const user: User = await createUserUseCase.execute({
            name: " User",
            email: "user@email.com",
            password: "test"

        });

        const statement = await createStatementUseCase.execute({
            user_id: user.id as string,
            type: "deposit"  ,
            amount: 100,
            description: "statement test"

        } as ICreateStatementDTO)

        
        expect(statement).toHaveProperty("id")
        expect(statement.type).toEqual("deposit")
    })
    it("should be able to create a withdraw statement for a registered User", async () => {
        
        const user: User = await createUserUseCase.execute({
            name: "New user",
            email: "user@email.com",
            password: "test"

        });

        await createStatementUseCase.execute({
            user_id: user.id as string,
            type: "deposit"  ,
            amount: 100,
            description: "statement test"

        } as ICreateStatementDTO)

        const statement = await createStatementUseCase.execute({
            user_id: user.id as string,
            type: "withdraw"  ,
            amount: 100,
            description: "statement test"

        } as ICreateStatementDTO)

        
        expect(statement).toHaveProperty("id")
        expect(statement.type).toEqual("withdraw")
    })
    it("should not be able to create a withdraw statement for a registered User with insufficient funds", async () => {
        
        const user: User = await createUserUseCase.execute({
            name: "New user",
            email: "user@email.com",
            password: "test"

        });

       expect( async () => {

        const statement = await createStatementUseCase.execute({
            user_id: user.id as string,
            type: "withdraw"  ,
            amount: 100,
            description: "statement test"

        } as ICreateStatementDTO)
       }).rejects.toEqual(new AppError('Insufficient funds', 400))
  
    })
    it("should not be able to create a deposit statement for nonexistent User", async () => {
        
       expect( async () => {
        
        const statement = await createStatementUseCase.execute({
            user_id: "nonexistentUser_id",
            type: "deposit",
            amount: 100,
            description: "statement test"

        } as ICreateStatementDTO)
        console.log(statement)
       })
       .rejects.toEqual(new AppError('User not found', 404))
    })
    it("should not be able to create a withdraw statement for nonexistent User", async () => {
        
       expect( async () => {
        
        const statement = await createStatementUseCase.execute({
            user_id: "nonexistentUser_id",
            type: "withdraw"  ,
            amount: 100,
            description: "statement test"

        } as ICreateStatementDTO)
       }).rejects.toEqual(new AppError('User not found', 404))
  
    })
   
})