import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import bcrypt from "bcrypt";
import crypto from "crypto";
config();

const saltRounds = parseInt(process.env.SALT_HASH ?? 10);
console.log(saltRounds);
const prisma = new PrismaClient();

async function seedCreate() {
    const menuUsuarios = await prisma.menuOption.create({
        data: { name: "usuarios", type: "users" },
    });
    const menuRoles = await prisma.menuOption.create({
        data: { name: "roles", type: "roles" },
    });
    const menuPermissions = await prisma.menuOption.create({
        data: { name: "permisos", type: "permissions" },
    });
    const menuUnitsMeasure = await prisma.menuOption.create({
        data: { name: "unidades medida", type: "units_measure" },
    });
    const menuCategories = await prisma.menuOption.create({
        data: { name: "categorias", type: "categories" },
    });
    const menuRecipes = await prisma.menuOption.create({
        data: { name: "recetas", type: "recipes" },
    });

    const permissionAccess = await prisma.permission.create({
        data: { name: "access", code: crypto.randomUUID() },
    });
    const permissionInsert = await prisma.permission.create({
        data: { name: "insert", code: crypto.randomUUID() },
    });
    const permissionUpdate = await prisma.permission.create({
        data: { name: "update", code: crypto.randomUUID() },
    });
    const permissionDelete = await prisma.permission.create({
        data: { name: "delete", code: crypto.randomUUID() },
    });
    const permissionExport = await prisma.permission.create({
        data: { name: "export", code: crypto.randomUUID() },
    });

    const roleAdmin = await prisma.role.create({
        data: { name: "admin", code: crypto.randomUUID() },
    });
    const roleGuest = await prisma.role.create({
        data: { name: "guest", code: crypto.randomUUID() },
    });
    const createMany = await prisma.rolePermission.createMany({
        data: [
            //ADMIN
            //MENU USUARIOS
            {
                rolId: roleAdmin.id,
                menuOptionId: menuUsuarios.id,
                permissionId: permissionAccess.id,
            },
            {
                rolId: roleAdmin.id,
                menuOptionId: menuUsuarios.id,
                permissionId: permissionInsert.id,
            },
            {
                rolId: roleAdmin.id,
                menuOptionId: menuUsuarios.id,
                permissionId: permissionUpdate.id,
            },
            {
                rolId: roleAdmin.id,
                menuOptionId: menuUsuarios.id,
                permissionId: permissionDelete.id,
            },
            {
                rolId: roleAdmin.id,
                menuOptionId: menuUsuarios.id,
                permissionId: permissionExport.id,
            },
            //MENU ROLES
            {
                rolId: roleAdmin.id,
                menuOptionId: menuRoles.id,
                permissionId: permissionAccess.id,
            },
            {
                rolId: roleAdmin.id,
                menuOptionId: menuRoles.id,
                permissionId: permissionInsert.id,
            },
            {
                rolId: roleAdmin.id,
                menuOptionId: menuRoles.id,
                permissionId: permissionUpdate.id,
            },
            {
                rolId: roleAdmin.id,
                menuOptionId: menuRoles.id,
                permissionId: permissionDelete.id,
            },
            {
                rolId: roleAdmin.id,
                menuOptionId: menuRoles.id,
                permissionId: permissionExport.id,
            },
            //MENU PERMISOS
            {
                rolId: roleAdmin.id,
                menuOptionId: menuPermissions.id,
                permissionId: permissionAccess.id,
            },
            {
                rolId: roleAdmin.id,
                menuOptionId: menuPermissions.id,
                permissionId: permissionInsert.id,
            },
            {
                rolId: roleAdmin.id,
                menuOptionId: menuPermissions.id,
                permissionId: permissionUpdate.id,
            },
            {
                rolId: roleAdmin.id,
                menuOptionId: menuPermissions.id,
                permissionId: permissionDelete.id,
            },
            {
                rolId: roleAdmin.id,
                menuOptionId: menuPermissions.id,
                permissionId: permissionExport.id,
            },
            //MENU UNIDADES MEDIDA
            {
                rolId: roleAdmin.id,
                menuOptionId: menuUnitsMeasure.id,
                permissionId: permissionAccess.id,
            },
            {
                rolId: roleAdmin.id,
                menuOptionId: menuUnitsMeasure.id,
                permissionId: permissionInsert.id,
            },
            {
                rolId: roleAdmin.id,
                menuOptionId: menuUnitsMeasure.id,
                permissionId: permissionUpdate.id,
            },
            {
                rolId: roleAdmin.id,
                menuOptionId: menuUnitsMeasure.id,
                permissionId: permissionDelete.id,
            },
            {
                rolId: roleAdmin.id,
                menuOptionId: menuUnitsMeasure.id,
                permissionId: permissionExport.id,
            },
            //MENU CATEGORIAS
            {
                rolId: roleAdmin.id,
                menuOptionId: menuCategories.id,
                permissionId: permissionAccess.id,
            },
            {
                rolId: roleAdmin.id,
                menuOptionId: menuCategories.id,
                permissionId: permissionInsert.id,
            },
            {
                rolId: roleAdmin.id,
                menuOptionId: menuCategories.id,
                permissionId: permissionUpdate.id,
            },
            {
                rolId: roleAdmin.id,
                menuOptionId: menuCategories.id,
                permissionId: permissionDelete.id,
            },
            {
                rolId: roleAdmin.id,
                menuOptionId: menuCategories.id,
                permissionId: permissionExport.id,
            },
            //MENU RECETAS
            {
                rolId: roleAdmin.id,
                menuOptionId: menuRecipes.id,
                permissionId: permissionAccess.id,
            },
            {
                rolId: roleAdmin.id,
                menuOptionId: menuRecipes.id,
                permissionId: permissionInsert.id,
            },
            {
                rolId: roleAdmin.id,
                menuOptionId: menuRecipes.id,
                permissionId: permissionUpdate.id,
            },
            {
                rolId: roleAdmin.id,
                menuOptionId: menuRecipes.id,
                permissionId: permissionDelete.id,
            },
            {
                rolId: roleAdmin.id,
                menuOptionId: menuRecipes.id,
                permissionId: permissionExport.id,
            },

            //GUEST
            {
                rolId: roleGuest.id,
                menuOptionId: menuUnitsMeasure.id,
                permissionId: permissionAccess.id,
            },
            {
                rolId: roleGuest.id,
                menuOptionId: menuCategories.id,
                permissionId: permissionAccess.id,
            },
            {
                rolId: roleGuest.id,
                menuOptionId: menuRecipes.id,
                permissionId: permissionAccess.id,
            },
        ],
    });

    const admin_password = await bcrypt.hash("admin123", saltRounds);
    const admin = await prisma.user.upsert({
        where: { email: "admin@recetariotec.com" },
        update: {
            roleId: roleAdmin.id,
        },
        create: {
            code: crypto.randomUUID(),
            email: "admin@recetariotec.com",
            name: "Administrador",
            password: admin_password,
            roleId: roleAdmin.id,
        },
    });

    const guest_password = await bcrypt.hash("guest123", saltRounds);
    const guest = await prisma.user.upsert({
        where: { email: "guest@recetariotec.com" },
        update: {
            roleId: roleGuest.id,
        },
        create: {
            code: crypto.randomUUID(),
            email: "guest@recetariotec.com",
            name: "Guest",
            password: guest_password,
            roleId: roleGuest.id,
        },
    });

    const createManyUnitMeasure = await prisma.unitMeasure.createMany({
        data: [
            { name: "Mililitro", short: "ml", code: crypto.randomUUID() },
            { name: "Litro", short: "l", code: crypto.randomUUID() },
            { name: "Gramo", short: "g", code: crypto.randomUUID() },
            { name: "Kilogramo", short: "kg", code: crypto.randomUUID() },
            { name: "Miligramo", short: "mg", code: crypto.randomUUID() },
            {
                name: "Centímetro cúbico",
                short: "cc",
                code: crypto.randomUUID(),
            },
            { name: "Taza", short: "cup", code: crypto.randomUUID() },
            { name: "Cucharada", short: "tbsp", code: crypto.randomUUID() },
            { name: "Cucharadita", short: "tsp", code: crypto.randomUUID() },
            { name: "Onza", short: "oz", code: crypto.randomUUID() },
            { name: "Libra", short: "lb", code: crypto.randomUUID() },
            { name: "Pinta", short: "pt", code: crypto.randomUUID() },
            { name: "Galón", short: "gal", code: crypto.randomUUID() },
            { name: "Pizca", short: "pinch", code: crypto.randomUUID() },
        ],
    });
    const createManyCategories = await prisma.category.createMany({
        data: [
            {
                name: "Entradas",
                code: crypto.randomUUID(),
                description:
                    "Consiste en pequeños aperitivos servidos antes del plato principal.",
            },
            {
                name: "Sopas",
                code: crypto.randomUUID(),
                description: "Una variedad de sopas y caldos.",
            },
            {
                name: "Pescados",
                code: crypto.randomUUID(),
                description: "Platos de pescado y mariscos.",
            },
            {
                name: "Entrée",
                code: crypto.randomUUID(),
                description:
                    "Se refiere a un platillo servido antes del plato principal.",
            },
            {
                name: "Postres",
                code: crypto.randomUUID(),
                description: "Postres, dulces y tortas",
            },
            {
                name: "Cocteles",
                code: crypto.randomUUID(),
                description:
                    "Los cócteles son bebidas mezcladas que combinan diferentes ingredientes, como licores, jugos, jarabes, frutas y otros aditivos, para crear sabores únicos y complejos.",
            },
            {
                name: "Bebidas",
                code: crypto.randomUUID(),
                description:
                    "Las bebidas están diseñadas para proporcionar refresco, sabor y disfrute sin los efectos embriagadores del alcohol",
            },
            {
                name: "Licores",
                code: crypto.randomUUID(),
                description:
                    "Son bebidas alcohólicas que se caracterizan por su alto contenido de azúcar y saborizantes adicionales, como frutas, hierbas, especias, flores, semillas, raíces, plantas y otros botánicos.",
            },
        ],
    });
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
