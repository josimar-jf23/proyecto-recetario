import { PrismaClient } from "@prisma/client";
import { validationResult } from "express-validator";
import { config } from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
config();

const prisma = new PrismaClient();
const env_local = process.env;

export const getUsers = async (req, res) => {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            code: true,
            email: true,
            name: true,
        },
    });
    let arr_users = [];
    users.forEach((user) => {
        let obj_user = {
            id: user.code,
            email: user.email,
            name: user.name,
        };
        arr_users.push(obj_user);
    });

    res.status(200).json(arr_users);
};

export const getUser = async (req, res) => {
    const userId = parseInt(req.params.userId ?? "0");
    const user = await prisma.user.findMany({
        where: { id: userId },
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
            },
        },
    });
    res.status(200).json(user);
};

export const addUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        return res.status(400).json({ errors: errorMessages });
    }

    const saltRounds = parseInt(env_local.SALT_HASH ?? 10);
    const { email, name, password } = req.body;
    let { roleId } = req.body;
    roleId = roleId ?? 2;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res
                .status(400)
                .json({ errors: ["El correo ya está en uso"] });
        }

        const userRole = await prisma.role.findMany({
            where: { id: roleId },
            select: {
                id: true,
                code: true,
            },
        });

        if (!userRole) {
            return res
                .status(400)
                .json({ errors: ["No hay rol para asignar"] });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await prisma.user.create({
            data: {
                code: crypto.randomUUID(),
                email: email,
                name: name,
                password: hashedPassword,
                roleId: userRole.id,
            },
        });

        let token = jwt.sign(
            {
                id: newUser.code,
            },
            env_local.SECRET_KEY,
            {
                expiresIn: "7d",
            }
        );
        const updateUser = await prisma.user.update({
            where: {
                id: newUser.id,
            },
            data: {
                token: token,
            },
        });

        res.status(201).json({
            id: newUser.code,
            email: newUser.email,
            name: newUser.name,
            token: token,
        });
    } catch (error) {
        res.status(500).json({ error: [error], mensajes: "errores" });
    }
};

export const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        return res.status(400).json({ errors: errorMessages });
    }

    const { email, password } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                code: true,
                email: true,
                name: true,
                password: true,
                roleId: true,
                role: {
                    select: {
                        name: true,
                        code: true,
                    },
                },
            },
        });

        if (!existingUser) {
            return res.status(400).json({
                errors: ["El correo o la contraseña son incorrectos"],
            });
        }

        const hashedCompare = await bcrypt.compare(
            password,
            existingUser.password
        );
        if (!hashedCompare) {
            return res.status(400).json({
                errors: ["El correo o la contraseña son incorrectos."],
            });
        }
        let token = jwt.sign(
            {
                id: existingUser.code,
            },
            env_local.SECRET_KEY,
            {
                expiresIn: "7d",
            }
        );

        const updateUser = await prisma.user.update({
            where: {
                id: existingUser.id,
            },
            data: {
                token: token,
            },
        });

        res.status(200).json({
            name: existingUser.name,
            email: existingUser.email,
            role: existingUser.role,
            token: token,
            message: "Inicio de session correctamente",
        });
    } catch (error) {
        res.status(500).json({ error: [error] });
    }
};

export const logout = async (req, res) => {
    const token = req.session.access_token || null;
    const data = req.session.user || null;
    if (!token) {
        return res.status(401).json({
            errors: ["Sin auterizacion"],
        });
    }

    try {
        const user = await prisma.user.update({
            where: {
                id: data.id,
                token: token,
            },
            data: {
                token: null,
            },
        });
        res.status(200).json({ message: "Se cerro la session correctamente" });
    } catch (error) {
        return res.status(404).json({
            errors: ["Parametros incorrectos"],
        });
    }
};

export const deleteUser = async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        return res.status(404).json({
            errors: ["Sin usuario que eliminar"],
        });
    }
    try {
        await prisma.user.delete({
            where: {
                code: userId,
            },
        });
        res.status(200).json({
            message: "Se eliminó al usuario correctamente",
        });
    } catch (error) {
        return res.status(404).json({
            errors: ["Parametros incorrectos"],
        });
    }
};

export const updateUser = async (req, res) => {
    const { userId, name, rolId } = req.body;
    if (!userId || !name || !rolId) {
        return res.status(404).json({
            errors: ["Complete los parametros obligatorios"],
        });
    }
    try {
        const userRol = await prisma.role.findFirst({
            where: {
                code: rolId,
            },
            select: {
                id: true,
            },
        });
        if (!userRol) {
            return res.status(404).json({
                errors: ["El rolId es no existe"],
            });
        }

        const updateUser = await prisma.user.update({
            where: {
                code: userId,
            },
            data: {
                name: name,
                roleId: userId.roleId,
            },
        });
        res.status(200).json({
            message: "Se actualizó al usuario correctamente",
        });
    } catch (error) {
        return res.status(404).json({
            errors: ["Parametros incorrectos"],
        });
    }
};
