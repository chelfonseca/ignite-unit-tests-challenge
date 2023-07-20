import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { inject, injectable } from "tsyringe";
import { Statement } from "../../entities/Statement";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { ICreateTransferDTO } from "./ICreateTransferDTO";
import { CreateTransferError } from "./CreateTransferError";

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
    TRANSFER = 'transfer',
  }

interface IReponse {
    senderOperation: Statement,
    receiverOperation: Statement,
}
@injectable()      
class CreateTransferUseCase {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        
        @inject("StatementsRepository")
        private statementsRepository: IStatementsRepository,
    ){}

    async execute({ sender_id, receiver_id, amount, description }: ICreateTransferDTO){

        const senderUser = await this.usersRepository.findById(sender_id);

        if(!senderUser) {
          throw new CreateTransferError.SenderUserNotFound();
          }

        const receiverUser = await this.usersRepository.findById(receiver_id);

        if(!receiverUser) {
          throw new CreateTransferError.ReceiverUserNotFound();
        }
       

        const senderUserBalance = await this.statementsRepository.getUserBalance({
            user_id: sender_id
          });
      
        if(senderUserBalance.balance < amount){
            throw new CreateTransferError.InsufficientFunds();

        }

        const senderOperation = await this.statementsRepository.create({
            user_id: sender_id,
            sender_id,
            type: OperationType.TRANSFER,
            amount,
            description: `Transfer to ${receiverUser?.name} - ${description}`
          });

        const receiverOperation = await this.statementsRepository.create({
            user_id: receiver_id ,
            sender_id,
            type: OperationType.TRANSFER,
            amount,
            description: `Received from ${senderUser.name} - ${description}`
          });
      
          const statements: IReponse = {
            senderOperation,
            receiverOperation
          }

          console.log(senderOperation.type, receiverOperation.type)
  

        return statements
      

    }

}
export {
    CreateTransferUseCase
}