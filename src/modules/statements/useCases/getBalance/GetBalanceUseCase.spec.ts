import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { GetBalanceUseCase } from "./GetBalanceUseCase";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase"
import { User } from "@modules/users/entities/User";
import { AppError } from "@shared/errors/AppError";

let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Get Balance", () => {

    beforeEach(() => {
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        inMemoryUsersRepository = new InMemoryUsersRepository();
        getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository)
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
        
    })

    it("should be able to get balance for a registered User", async () => {
        const user: User = await createUserUseCase.execute({
            name: "New user",
            email: "user@email.com",
            password: "test"

        });
        const result = await getBalanceUseCase.execute({user_id: user.id as string})
        expect(result).toHaveProperty("balance")
    })
    it("should be able to get balance for a nonexistent User", async () => {
        expect(async () => {
            await getBalanceUseCase.execute({user_id: "nonexistentuser"})
        }).rejects.toEqual(new AppError('User not found', 404))
    })
})