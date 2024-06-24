import { PrismaClient } from "@prisma/client";
import { validationResult } from "express-validator";
import { config } from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
config();

const prisma = new PrismaClient();
const env_local = process.env;

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
            },
        },
    });
    res.status(200).json(users);
};

export const getUser = async (req, res) => {
    const userId = parseInt(req.params.userId ?? "0");
    console.log(req.params.userId);
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
    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res
                .status(400)
                .json({ errors: ["El correo ya está en uso"] });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = await prisma.user.create({
            data: {
                email: email,
                name: name,
                password: hashedPassword,
            },
        });
        res.status(201).json({
            email: newUser.email,
            name: newUser.name,
        });
    } catch (error) {
        res.status(500).json({ error: [error] });
    }
};

export const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        return res.status(400).json({ errors: errorMessages });
    }

    const saltRounds = parseInt(env_local.SALT_HASH ?? 10);
    const { email, password } = req.body;

    const existingUser = await prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            email: true,
            name: true,
            password: true,
            roleId: true,
            role: {
                select: {
                    name: true,
                },
            },
        },
    });

    if (!existingUser) {
        return res
            .status(400)
            .json({ errors: ["El correo o la contraseña son incorrectos"] });
    }

    try {
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
                id: existingUser.id,
                name: existingUser.name,
                role: existingUser.roleId,
            },
            env_local.SECRET_KEY,
            {
                expiresIn: "1d",
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
        return res.status(401).json({
            errors: ["Sin auterizacion"],
        });
    }
};
