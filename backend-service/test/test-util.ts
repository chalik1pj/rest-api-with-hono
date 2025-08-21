import { Address, Contact } from "@prisma/client";
import { prisma } from "../src/application/database";

export class UserTest {
  static async create() {
    await prisma.user.create({
      data: {
        username: "test",
        name: "test",
        password: await Bun.password.hash("test", {
          algorithm: "bcrypt",
          cost: 10,
        }),
        token: "test",
      },
    });
  }

  static async delete() {
    await prisma.user.deleteMany({
      where: {
        username: "test",
      },
    });
  }
}

export class ContactTest {
  static async deleteAll() {
    await prisma.contact.deleteMany({
      where: {
        username: "test"
      }
    })
  }

  static async create() {
    await prisma.contact.create({
      data: {
        first_name: 'Syafwan',
        last_name: 'Chalik',
        email: 'test@gmail.com',
        phone: '08123456744',
        username: 'test'
      }
    })
  }

  static async createMany(n: number) {
    for (let i = 0; i < n; i++) {
      await this.create()      
    }
  }

  static async get(): Promise<Contact> {
    return await prisma.contact.findFirstOrThrow({
      where: {
        username: 'test'
      }
    })
  }
}

export class AddressTest {
  static async create() {
    const contact = await ContactTest.get()
    await prisma.address.create({
      data: {
        contact_id: contact.id,
        street: 'Jalan',
        city: 'Kota',
        province: 'Provinsi',
        country: 'Indonesia',
        postal_code: '12345'
      }
    })
  }

  static async get(): Promise<Address> {
    return await prisma.address.findFirstOrThrow({
      where: {
        contact: {
          username: 'test'
        }
      }
    })
  }

  static async deleteAll() {
    await prisma.address.deleteMany({
      where: {
        contact: {
          username: 'test'
        }
      }
    })
  }
}