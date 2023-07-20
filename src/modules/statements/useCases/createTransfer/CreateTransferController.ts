import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateTransferUseCase } from './CreateTransferUseCase';
import { ICreateTransferDTO } from './ICreateTransferDTO';


enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer',
}



export class CreateTransferController {
  async execute(request: Request, response: Response) {
    const { id: sender_id } = request.user;
    const { amount, description } = request.body;
    const { user_id: receiver_id } = request.params;

    const createTransfer = container.resolve(CreateTransferUseCase);

    
    const transfer = await createTransfer.execute({
      sender_id, 
      receiver_id, 
      amount, 
      description
    });

    return response.status(201).json(transfer);
  }
}
