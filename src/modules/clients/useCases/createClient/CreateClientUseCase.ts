import { prisma } from "../../../../database/prismaClient";
import { hash } from "bcrypt";

interface ICreateClient {
  username: string;
  password: string;
}

export class CreateClientUseCase {
  async execute({ password, username }: ICreateClient) {
    //Validar se o usuário existe
    const clientExists = await prisma.clients.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    });

    if (clientExists) {
      throw new Error("Client Already Exists!");
    }

    //criptografar a senha
    const hashPasword = await hash(password, 10);

    //Salvar o client
    const client = await prisma.clients.create({
      data: {
        username,
        password: hashPasword,
      },
    });
    return client;
  }
}
