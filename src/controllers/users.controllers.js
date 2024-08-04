import { PrismaClient } from "@prisma/client";
import { validationResult } from "express-validator";
import { config } from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

config();

const prisma = new PrismaClient();
const { SALT_HASH = 10, SECRET_KEY } = process.env;

const generateToken = (id) => jwt.sign({ id }, SECRET_KEY, { expiresIn: '7d' });

export const getUsers = async (req, res, next) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                code: true,
                email: true,
                name: true,
            },
        });
        const arr_users = users.map(({ code, email, name }) => ({
            id: code,
            email,
            name,
        }));
        res.status(200).json(arr_users);
    } catch (error) {
        next(error);
    }
};

export const getUser = async (req, res, next) => {
    const userId = parseInt(req.params.userId ?? "0");
    try {
        const user = await prisma.user.findUnique({
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
                        code: true,
                    },
                },
            },
        });
        if (!user) {
            return res.status(404).json({ errors: ["User not found"] });
        }
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

export const addUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array().map(error => error.msg) });
    }

    const saltRounds = parseInt(SALT_HASH);
    const { email, name, password, roleId = 2 } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) {
            return res.status(400).json({ errors: ["El correo ya está en uso"] });
        }

        const userRole = await prisma.role.findUnique({
            where: { id: roleId },
            select: { id: true },
        });

        if (!userRole) {
            return res.status(400).json({ errors: ["No hay rol para asignar"] });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await prisma.user.create({
            data: {
                code: crypto.randomUUID(),
                email,
                name,
                password: hashedPassword,
                roleId: userRole.id,
            },
        });

        const token = generateToken(newUser.code);

        await prisma.user.update({
            where: { id: newUser.id },
            data: { token },
        });

        res.status(201).json({
            id: newUser.code,
            email: newUser.email,
            name: newUser.name,
            token,
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array().map(error => error.msg) });
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

        if (!existingUser || !(await bcrypt.compare(password, existingUser.password))) {
            return res.status(400).json({ errors: ["El correo o la contraseña son incorrectos"] });
        }

        const token = generateToken(existingUser.code);

        await prisma.user.update({
            where: { id: existingUser.id },
            data: { token },
        });

        res.status(200).json({
            name: existingUser.name,
            email: existingUser.email,
            role: existingUser.role,
            token,
            message: "Inicio de sesión correctamente",
        });
    } catch (error) {
        next(error);
    }
};

export const logout = async (req, res, next) => {
    const token = req.session?.access_token || null;
    const user = req.session?.user || null;

    if (!token) {
        return res.status(401).json({ errors: ["Sin autorización"] });
    }

    try {
        await prisma.user.update({
            where: {
                id: user.id,
                token,
            },
            data: { token: null },
        });
        res.status(200).json({ message: "Se cerró la sesión correctamente" });
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    const { userId } = req.body;
    if (!userId) {
        return res.status(400).json({ errors: ["Sin usuario que eliminar"] });
    }

    try {
        await prisma.user.delete({
            where: { code: userId },
        });
        res.status(200).json({ message: "Se eliminó al usuario correctamente" });
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (req, res, next) => {
    const { userId, name, rolId } = req.body;
    if (!userId || !name || !rolId) {
        return res.status(400).json({ errors: ["Complete los parámetros obligatorios"] });
    }

    try {
        const userRole = await prisma.role.findUnique({
            where: { code: rolId },
            select: { id: true },
        });

        if (!userRole) {
            return res.status(400).json({ errors: ["El rolId no existe"] });
        }

        await prisma.user.update({
            where: { code: userId },
            data: {
                name,
                roleId: userRole.id,
            },
        });

        res.status(200).json({ message: "Se actualizó al usuario correctamente" });
    } catch (error) {
        next(error);
    }
};
