import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { User } from "@modules/users/entities/User";
import { AppError } from "@shared/errors/AppError";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase; 
let createUserUseCase: CreateUserUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get Statement Operation", () => {

    beforeEach(() => {
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createStatementUseCase = new CreateStatementUseCase( inMemoryUsersRepository, inMemoryStatementsRepository)
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
        
    })

    it("should be able to get a deposit statement operation for a registered User", async () => {
        
        const user: User = await createUserUseCase.execute({
            name: " User",
            email: "user@email.com",
            password: "test"

        });

        const depositStatement = await createStatementUseCase.execute({
            user_id: user.id as string,
            type: "deposit"  ,
            amount: 100,
            description: "statement test"

        } as ICreateStatementDTO)

        const statementOperation = await getStatementOperationUseCase.execute({
            user_id: user.id as string, 
            statement_id: depositStatement.id as string
        })
    
        expect(statementOperation.id).toEqual(statementOperation.id)
        expect(statementOperation.type).toEqual("deposit")
    })
    it("should be able to get a withdraw statement operation for a registered User", async () => {
        
        const user: User = await createUserUseCase.execute({
            name: " User",
            email: "user@email.com",
            password: "test"

        });

        const depositStatement = await createStatementUseCase.execute({
            user_id: user.id as string,
            type: "deposit"  ,
            amount: 100,
            description: "statement test"

        } as ICreateStatementDTO)

        const withdrawStatement = await createStatementUseCase.execute({
            user_id: user.id as string,
            type: "withdraw"  ,
            amount: 100,
            description: "statement test"

        } as ICreateStatementDTO)

        const statementOperation = await getStatementOperationUseCase.execute({
            user_id: user.id as string, 
            statement_id: withdrawStatement.id as string
        })
    
        expect(statementOperation.id).toEqual(statementOperation.id)
        expect(statementOperation.type).toEqual("withdraw")
    })
    it("should not be able to get a deposit statement operation for a nonexistent User", async () => {
        
        const user: User = await createUserUseCase.execute({
            name: " User",
            email: "user@email.com",
            password: "test"

        });

        const depositStatement = await createStatementUseCase.execute({
            user_id: user.id,
            type: "deposit"  ,
            amount: 100,
            description: "statement test"

        } as ICreateStatementDTO)

        expect( async () => {
            await getStatementOperationUseCase.execute({
                user_id: "nonexistentUser_id", 
                statement_id: depositStatement.id as string
            })
        }).rejects.toEqual(new AppError('User not found', 404))    
        
    })
    it("should not be able to get a withdraw statement operation for a nonexistent User", async () => {
        
        const user: User = await createUserUseCase.execute({
            name: " User",
            email: "user@email.com",
            password: "test"

        });

        const depositStatement = await createStatementUseCase.execute({
            user_id: user.id,
            type: "deposit"  ,
            amount: 100,
            description: "statement test"

        } as ICreateStatementDTO)

        const withdrawStatement = await createStatementUseCase.execute({
            user_id: user.id as string,
            type: "withdraw"  ,
            amount: 100,
            description: "statement test"

        } as ICreateStatementDTO)

        expect( async () => {
            await getStatementOperationUseCase.execute({
                user_id: "nonexistentUser_id", 
                statement_id: withdrawStatement.id as string
            })
        }).rejects.toEqual(new AppError('User not found', 404))    
        
    })
    it("should not be able to get a nonexistent deposit statement operation", async () => {
        
        const user: User = await createUserUseCase.execute({
            name: " User",
            email: "user@email.com",
            password: "test"

        });

        const depositStatement = await createStatementUseCase.execute({
            user_id: user.id,
            type: "deposit"  ,
            amount: 100,
            description: "statement test"

        } as ICreateStatementDTO)

        expect( async () => {
            await getStatementOperationUseCase.execute({
                user_id: user.id as string, 
                statement_id: "nonexistentStatement_id"
            })
        }).rejects.toEqual(new AppError('Statement not found', 404))    
        
    })
    it("should not be able to get a nonexistent withdraw statement operation", async () => {
        
        const user: User = await createUserUseCase.execute({
            name: " User",
            email: "user@email.com",
            password: "test"

        });

        const depositStatement = await createStatementUseCase.execute({
            user_id: user.id,
            type: "deposit"  ,
            amount: 100,
            description: "statement test"

        } as ICreateStatementDTO)

        const withdrawStatement = await createStatementUseCase.execute({
            user_id: user.id as string,
            type: "withdraw"  ,
            amount: 100,
            description: "statement test"

        } as ICreateStatementDTO)

        expect( async () => {
            await getStatementOperationUseCase.execute({
                user_id: user.id as string, 
                statement_id: "nonexistentStatement_id"
            })
        }).rejects.toEqual(new AppError('Statement not found', 404))    
        
    })
   
})