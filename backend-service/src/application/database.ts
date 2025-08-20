import { PrismaClient } from "@prisma/client";
import { logging } from "./logging";

export const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'event',
      level: 'error',
    },
    {
      emit: 'event',
      level: 'info',
    },
    {
      emit: 'event',
      level: 'warn',
    },
  ],
});

prisma.$on('query', (e) => {
  logging.info(e)
})

prisma.$on('error', (e) => {
  logging.error(e)
})

prisma.$on('info', (e) => {
  logging.info(e)
})

prisma.$on('warn', (e) => {
  logging.warn(e)
})