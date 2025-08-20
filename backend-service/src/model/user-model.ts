import { User } from "@prisma/client";

export type registerUserRequest = {
  username: string;
  password: string;
  name: string;
}

export type loginUserRequest = {
  username: string;
  password: string;
}

export type updateUserRequest = {
  password?: string;
  name?: string;
}

export type userResponse = {
  username: string;
  name: string;
  token?: string;
}

export function toUserResponse(user: User): userResponse {
  return {
    name: user.name,
    username: user.username
  }
}