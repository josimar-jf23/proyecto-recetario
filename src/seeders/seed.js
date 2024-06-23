import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import bcrypt from "bcrypt";
config();

const saltRounds = parseInt(process.env.SALT_HASH ?? 10);
console.log(saltRounds);
const prisma = new PrismaClient();

async function seedCreate() {
    const password= await bcrypt.hash("admin123",saltRounds);
    const adminRole = await prisma.role.create({
        data: {
          name: 'admin',
        },
      });

    const admin = await prisma.user.upsert({
        where: { email: "admin@admin.com" },
        update: {
            roleId:adminRole.id
        },
        create: {
            email: "admin@admin.com",
            name: "Administrador",
            password: password,
            roleId:adminRole.id
        },
    });
    console.log({ admin });
}
seedCreate()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
