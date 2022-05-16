import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

interface IPayload {
    sub: string
}

export async function ensureAuthenticateClient(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return response.status(401).json({
      message: "token missing",
    });
  }
  const [, token] = authHeader.split(" ");
  try {
    const { sub } = verify(token, "fae62da37210a6b0c9b58b527538cede") as IPayload;
  
    request.id_client = sub;

    return next();
  } catch (err) {
    return response.status(401).json({
      message: "token invalid",
    });
  }
}
