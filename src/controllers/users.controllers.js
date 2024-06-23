import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUsers = async (req, res) => {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            name: true,
            roleId: true,
            role: {
                select: {
                    id: true,
                    name: true,
                },
            }
        },
    });
    console.log(users);
    res.json(users);
};
