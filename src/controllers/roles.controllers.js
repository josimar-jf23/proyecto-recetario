import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getRoles = async (req, res) => {
    const roles = await prisma.role.findMany();
    res.json(roles);
};