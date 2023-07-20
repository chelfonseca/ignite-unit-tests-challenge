import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { GetBalanceUseCase } from "./GetBalanceUseCase";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase"
import { User } from "@modules/users/entities/User";
import { AppError } from "@shared/errors/AppError";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { CreateTransferUseCase } from "../createTransfer/CreateTransferUseCase";
import { ICreateTransferDTO } from "../createTransfer/ICreateTransferDTO";

let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase; 
let createTransferUseCase: CreateTransferUseCase; 

describe("Get Balance", () => {

    beforeEach(() => {
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        inMemoryUsersRepository = new InMemoryUsersRepository();
        getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository)
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
        createStatementUseCase = new CreateStatementUseCase( inMemoryUsersRepository, inMemoryStatementsRepository)
        createTransferUseCase = new CreateTransferUseCase( inMemoryUsersRepository, inMemoryStatementsRepository)
    })

    it("should be able to get balance for a registered User", async () => {
        const senderUser: User = await createUserUseCase.execute({
            name: " SenderUser",
            email: "senderUser@email.com",
            password: "senderuser"

        });

        const receiverUser: User = await createUserUseCase.execute({
            name: " ReceiverUser",
            email: "receiverUser@email.com",
            password: "receiveruser"

        });

        await createStatementUseCase.execute({
            user_id: senderUser.id,
            type: "deposit"  ,
            amount: 200,
            description: "statement test"

        } as ICreateStatementDTO)

        await createStatementUseCase.execute({
            user_id: senderUser.id,
            type: "withdraw"  ,
            amount: 100,
            description: "statement test"

        } as ICreateStatementDTO)

        await createTransferUseCase.execute({
            sender_id: senderUser.id ,
            receiver_id: receiverUser.id,
            amount: 100,
            description: "statement test"

        } as ICreateTransferDTO)

        const senderUserResult = await getBalanceUseCase.execute({user_id: senderUser.id!})

        // console.log(senderUserResult)
    
        expect(senderUserResult).toHaveProperty("balance")
    })
    it("should be able to get balance for a nonexistent User", async () => {
        expect(async () => {
            await getBalanceUseCase.execute({user_id: "nonexistentuser"})
        }).rejects.toEqual(new AppError('User not found', 404))
    })
})