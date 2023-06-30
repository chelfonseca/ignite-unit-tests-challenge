import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AppError } from "@shared/errors/AppError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase : CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository; 

describe("Authenticate User", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
        authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
    })

    it("should be able to authenticate an User", async () => {
      
        const user: ICreateUserDTO = {
            name: "User",
            email: "user@email.com",
            password: "1234"
        }
        await createUserUseCase.execute(user)
        
        const result = await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password 
        })
        expect(result).toHaveProperty("token")
    })
    it("should not be able to authenticate an nonexistent user", async () => {
        expect(async () => {
            
            await authenticateUserUseCase.execute({
                email: "nonexistent@email.com",
                password: "password"
            })
        }).rejects.toEqual(new AppError("Incorrect email or password", 401))

        
    })
    it("should not be able to authenticate with incorrect password", async () => {
        expect(async () => {
            const user: ICreateUserDTO ={
                name: "Other user",
                email: "user@email.com",
                password: "test"
            }
            await createUserUseCase.execute(user)

            await authenticateUserUseCase.execute({
                email: user.email,
                password: "incorrectPassword"
            })
        }).rejects.toEqual(new AppError("Incorrect email or password", 401))
        
    })
    it("should not be able to authenticate incorrect email", async () => {
        expect(async () => {
            const user: ICreateUserDTO ={
                name: "Other user",
                email: "user@email.com",
                password: "test"
            }
            await createUserUseCase.execute(user)

            await authenticateUserUseCase.execute({
                email: "incorect@email.com",
                password: user.password
            })
            
        }).rejects.toEqual(new AppError("Incorrect email or password", 401))
        
    })
})