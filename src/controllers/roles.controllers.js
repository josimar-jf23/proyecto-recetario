import { PrismaClient } from "@prisma/client";
import { validationResult } from "express-validator";
import crypto from "crypto";

const prisma = new PrismaClient();

export const getRoles = async (req, res, next) => {
    try {
        const roles = await prisma.role.findMany();
        res.status(200).json(roles);
    } catch (error) {
        next(error);
    }
};

export const getRole = async (req, res, next) => {
    const roleId = req.params.roleId ?? "";
    try {
        const roles = await prisma.role.findMany({
            where: { code: roleId },
            select: {
                code: true,
                name: true,
                rol_permiso: {
                    select: {
                        permiso: {
                            select: { code: true, name: true },
                        },
                    },
                },
            },
        });
        if (!roles.length) {
            return res.status(404).json({ errors: ["Role not found"] });
        }
        res.status(200).json(roles);
    } catch (error) {
        next(error);
    }
};

export const addRole = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array().map(error => error.msg) });
    }

    const { name, permissions, modules } = req.body;

    if (!Array.isArray(permissions) || !Array.isArray(modules)) {
        return res.status(400).json({ errors: ["Los permisos o los modulos no tienen la estructura correcta"] });
    }

    try {
        const existingRole = await prisma.role.findUnique({ where: { name } });

        if (existingRole) {
            return res.status(400).json({ errors: ["El nombre ya está en uso"] });
        }

        const selPermissions = await prisma.permission.findMany({
            where: { code: { in: permissions } },
            select: { id: true, code: true },
        });

        const permissionsNotExists = permissions.filter(
            codePermission => !selPermissions.some(permission => permission.code === codePermission)
        );

        if (permissionsNotExists.length > 0) {
            return res.status(400).json({ errors: ["Los permisos no son los correctos"] });
        }

        const selModules = await prisma.menuOption.findMany({
            where: { type: { in: modules } },
            select: { id: true, type: true },
        });

        const modulesNotExists = modules.filter(
            codeModule => !selModules.some(module => module.type === codeModule)
        );

        if (modulesNotExists.length > 0) {
            return res.status(400).json({ errors: ["Los modulos no son los correctos"] });
        }

        const code = crypto.randomUUID();
        const newRole = await prisma.role.create({
            data: { code, name },
        });

        const arrRolesPermissions = selModules.flatMap(obj_module =>
            selPermissions.map(obj_permission => ({
                rolId: newRole.id,
                menuOptionId: obj_module.id,
                permissionId: obj_permission.id,
            }))
        );

        await prisma.rolePermission.createMany({ data: arrRolesPermissions });

        res.status(201).json({ roleId: newRole.code });
    } catch (error) {
        next(error);
    }
};
