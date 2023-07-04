import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"
import { ICreateUserDTO } from "../createUser/ICreateUserDTO"
import { User } from "@modules/users/entities/User"
import { AppError } from "@shared/errors/AppError"

let inMemoryUsersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase
let showUserProfileUseCase: ShowUserProfileUseCase 

describe("Show User Profile", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
        showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository) 
    })

    it("should be able to show User profile", async () => {
      
        const user: ICreateUserDTO = {
            name: "User",
            email: "user@email.com",
            password: "1234"
        }
        const createdUser:User = await createUserUseCase.execute(user)
      
        const userProfile = await showUserProfileUseCase.execute(
            createdUser.id as string)

        expect(userProfile).toHaveProperty("id")
    
    })
    it("should not be able to show profile to a nonexistent user", async () => {
        expect( async () => {
            await showUserProfileUseCase.execute(
                "nonexistentUser_id")
        }).rejects.toEqual(new AppError('User not found', 404))
    })
    
})