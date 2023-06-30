import { InMemoryUsersRepository }  from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase"
import { AppError } from "@shared/errors/AppError";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository; 

describe("Create User", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    })

    it("should be able to create a new User", async () => {
        const user = await createUserUseCase.execute({
            name: "New user",
            email: "user@email.com",
            password: "test"

        })        
        expect(user).toHaveProperty("id")
    })
    it("should not be able to create a new User with a email adress that already exists", async () => {
        const user = await inMemoryUsersRepository.create({
            name: "New user",
            email: "user@email.com",
            password: "test"

        })
        await expect(
            createUserUseCase.execute({
                name: "Other user",
                email: "user@email.com",
                password: "test"
            })
        ).rejects.toEqual(new AppError('User already exists'))
    })
})