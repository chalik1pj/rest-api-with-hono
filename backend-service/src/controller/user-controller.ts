import { Hono } from "hono";
import { applicationVariable } from "../model/app-model";
import { userService } from "../service/user-service";
import { loginUserRequest, registerUserRequest, toUserResponse, updateUserRequest } from "../model/user-model";
import { authMiddleware } from "../middleware/auth-middleware";
import { User } from "@prisma/client";

export const userController = new Hono<{ Variables: applicationVariable}>();

userController.post('/api/users', async (c) => {
  const request = await c.req.json() as registerUserRequest;
  const response = await userService.register(request);

  return c.json({
    data: response
  })
})

userController.post('/api/users/login', async (c) => {
  const request = await c.req.json() as loginUserRequest;
  const response = await userService.login(request);

  return c.json({
    data: response
  })
})

userController.use(authMiddleware)

userController.get('/api/users/current', async (c) => {
  const user = c.get('user') as User

  return c.json({
    data: toUserResponse(user)
  })
})

userController.patch('/api/users/current', async (c) => {
  const user = c.get('user') as User;
  const request = await c.req.json() as updateUserRequest;
  const response = await userService.update(user, request)

  return c.json({
    data: response
  })
})

userController.delete('/api/users/current', async (c) => {
  const user = c.get('user') as User;
  const response = await userService.logout(user)

  return c.json({
    data: response
  })
})