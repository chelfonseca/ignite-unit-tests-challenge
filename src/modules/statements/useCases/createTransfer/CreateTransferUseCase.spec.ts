import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { User } from "@modules/users/entities/User";
import { AppError } from "@shared/errors/AppError";
import { CreateTransferUseCase } from "./CreateTransferUseCase";
import { ICreateTransferDTO } from "./ICreateTransferDTO";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";

let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;
let createTransferUseCase: CreateTransferUseCase; 
let createUserUseCase: CreateUserUseCase;

describe("Create Transfer", () => {

    beforeEach(() => {
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createStatementUseCase = new CreateStatementUseCase( inMemoryUsersRepository, inMemoryStatementsRepository)
        createTransferUseCase = new CreateTransferUseCase( inMemoryUsersRepository, inMemoryStatementsRepository)
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
        
    })

    it("should be able to create a transfer from a sender user to received user both registed", async () => {
        
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
            amount: 100,
            description: "statement test"

        } as ICreateStatementDTO)

        const transfer = await createTransferUseCase.execute({
            sender_id: senderUser.id,
            receiver_id: receiverUser.id,
            amount: 100,
            description: "statement test"

        } as ICreateTransferDTO)

        
        // console.log(transfer)
        expect(transfer).toHaveProperty("senderOperation")
        expect(transfer).toHaveProperty("receiverOperation")
    
    })
    it("should not be able to create a transfer from a unregister sender user ", async () => {
        

        const receiverUser: User = await createUserUseCase.execute({
            name: " ReceiverUser",
            email: "receiverUser@email.com",
            password: "receiveruser"

        });

    await expect( async () => {

        await createTransferUseCase.execute({
            sender_id: "unregisteredUser",
            receiver_id: receiverUser.id,
            amount: 100,
            description: "statement test"

        } as ICreateTransferDTO)
       }).rejects.toEqual(new AppError('Sender user not found', 404))
        
    
    })
    it("should not be able to create a transfer to a unregister receiver user ", async () => {
        
        const senderUser: User = await createUserUseCase.execute({
            name: " SenderUser",
            email: "senderUser@email.com",
            password: "senderuser"

        });

        await createStatementUseCase.execute({
            user_id: senderUser.id,
            type: "deposit"  ,
            amount: 100,
            description: "statement test"

        } as ICreateStatementDTO)

    await expect( async () => {

        await createTransferUseCase.execute({
            sender_id: senderUser.id,
            receiver_id: "unregistedUser",
            amount: 100,
            description: "statement test"

        } as ICreateTransferDTO)
       }).rejects.toEqual(new AppError('Receiver user not found', 404))
        
    
    })
    it("should not be able to create a transfer with insufficient fund", async () => {
        
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

        await expect( async () => {

            await createTransferUseCase.execute({
                sender_id: senderUser.id,
                receiver_id: receiverUser.id,
                amount: 100,
                description: "statement test"
    
            } as ICreateTransferDTO)
           }).rejects.toEqual(new AppError('Insufficient funds', 400))
            
    
    })
    // it("should be able to create a withdraw statement for a registered User", async () => {
        
    //     const user: User = await createUserUseCase.execute({
    //         name: "New user",
    //         email: "user@email.com",
    //         password: "test"

    //     });

    //     await createStatementUseCase.execute({
    //         user_id: user.id as string,
    //         type: "deposit"  ,
    //         amount: 100,
    //         description: "statement test"

    //     } as ICreateStatementDTO)

    //     const statement = await createStatementUseCase.execute({
    //         user_id: user.id as string,
    //         type: "withdraw"  ,
    //         amount: 100,
    //         description: "statement test"

    //     } as ICreateStatementDTO)

        
    //     expect(statement).toHaveProperty("id")
    //     expect(statement.type).toEqual("withdraw")
    // })
    // it("should not be able to create a withdraw statement for a registered User with insufficient funds", async () => {
        
    //     const user: User = await createUserUseCase.execute({
    //         name: "New user",
    //         email: "user@email.com",
    //         password: "test"

    //     });

    //    expect( async () => {

    //     const statement = await createStatementUseCase.execute({
    //         user_id: user.id as string,
    //         type: "withdraw"  ,
    //         amount: 100,
    //         description: "statement test"

    //     } as ICreateStatementDTO)
    //    }).rejects.toEqual(new AppError('Insufficient funds', 400))
  
    // })
    // it("should not be able to create a deposit statement for nonexistent User", async () => {
        
    //    expect( async () => {
        
    //     const statement = await createStatementUseCase.execute({
    //         user_id: "nonexistentUser_id",
    //         type: "deposit",
    //         amount: 100,
    //         description: "statement test"

    //     } as ICreateStatementDTO)
    //     console.log(statement)
    //    })
    //    .rejects.toEqual(new AppError('User not found', 404))
    // })
    // it("should not be able to create a withdraw statement for nonexistent User", async () => {
        
    //    expect( async () => {
        
    //     const statement = await createStatementUseCase.execute({
    //         user_id: "nonexistentUser_id",
    //         type: "withdraw"  ,
    //         amount: 100,
    //         description: "statement test"

    //     } as ICreateStatementDTO)
    //    }).rejects.toEqual(new AppError('User not found', 404))
  
    // })
   
})