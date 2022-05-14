import { prisma } from "../../../database/prismaClient";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";

interface IAuthenticateClient {
  username: string;
  password: string;
}

export class AuthenticateClientUseCase {
  async execute({ username, password }: IAuthenticateClient) {
    //Receber username, password

    //verificar se username cadastrar,
    const client = await prisma.clients.findFirst({
      where: {
        username,
      },
    });

    if (!client) {
      throw new Error("Username or password invalid!");
    }

    //verificar se a senha corresponde
    const passwordMatch = await compare(password, client.password);

    if (!passwordMatch) {
      throw new Error("Username or password invalid!");
    }
    //Gerar token
    const token = sign({ username }, "fae62da37210a6b0c9b58b527538cede", {
      subject: client.id,
      expiresIn: "1d",
    });
    return token;
  }
}
