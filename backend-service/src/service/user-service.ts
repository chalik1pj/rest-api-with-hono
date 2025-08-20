import type { User } from "@prisma/client"
import { prisma } from "../application/database"
import {
  type loginUserRequest,
  type registerUserRequest,
  toUserResponse,
  type updateUserRequest,
  type userResponse,
} from "../model/user-model"
import { userValidation } from "../validation/user-validation"
import { HTTPException } from "hono/http-exception"

export class userService {
  static async register(request: registerUserRequest): Promise<userResponse> {
    request = userValidation.REGISTER.parse(request) as registerUserRequest

    const totalUserWithSameUsername = await prisma.user.count({
      where: {
        username: request.username,
      },
    })

    if (totalUserWithSameUsername != 0) {
      throw new HTTPException(400, {
        message: "Username already exists",
      })
    }

    request.password = await Bun.password.hash(request.password, {
      algorithm: "bcrypt",
      cost: 10,
    })

    const user = await prisma.user.create({
      data: request,
    })

    return toUserResponse(user)
  }

  static async login(request: loginUserRequest): Promise<userResponse> {
    request = userValidation.LOGIN.parse(request) as loginUserRequest

    let user = await prisma.user.findUnique({
      where: {
        username: request.username,
      },
    })

    if (!user) {
      throw new HTTPException(401, {
        message: "Username or password is wrong",
      })
    }

    const isPasswordValid = await Bun.password.verify(request.password, user.password, "bcrypt")
    if (!isPasswordValid) {
      throw new HTTPException(401, {
        message: "Username or password is wrong",
      })
    }

    user = await prisma.user.update({
      where: {
        username: request.username,
      },
      data: {
        token: crypto.randomUUID(),
      },
    })

    const response = toUserResponse(user)
    response.token = user.token!
    return response
  }

  static async get(token: string | undefined | null): Promise<User> {
    const result = userValidation.TOKEN.safeParse(token)

    if (result.error) {
      throw new HTTPException(401, {
        message: "Unauthorized",
      })
    }

    const user = await prisma.user.findFirst({
      where: {
        token: token,
      },
    })

    if (!user) {
      throw new HTTPException(401, {
        message: "Unauthorized",
      })
    }

    return user
  }

  static async update(user: User, request: updateUserRequest): Promise<userResponse> {
    request = userValidation.UPDATE.parse(request) as updateUserRequest

    if (request.name) {
      user.name = request.name
    }

    if (request.password) {
      user.password = await Bun.password.hash(request.password, {
        algorithm: "bcrypt",
        cost: 10,
      })
    }

    user = await prisma.user.update({
      where: {
        username: user.username,
      },
      data: user,
    })

    return toUserResponse(user)
  }

  static async logout(user: User): Promise<boolean> {
    await prisma.user.update({
      where: {
        username: user.username,
      },
      data: {
        token: null,
      },
    })

    return true
  }
}
