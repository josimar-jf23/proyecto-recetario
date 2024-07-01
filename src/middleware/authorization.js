import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const authorize = (menuOptionName, permissionName) => {
    return async (req, res, next) => {
        try {
            const datos = req.session.user || {};
            const userCode = datos.id || "";

            if (!permissionName) {
                return res
                    .status(404)
                    .json({ error: "Colocar Permiso en la ruta" });
            }

            const menuOption = await prisma.menuOption.findFirst({
                where: { type: menuOptionName },
            });

            if (!menuOption) {
                return res.status(404).json({ error: "Menu option not found" });
            }

            const user = await prisma.user.findFirst({
                where: {
                    code: userCode,
                },
                select: {
                    roleId: true,
                },
            });

            const userPermisos = await prisma.rolePermission.findMany({
                select: {
                    permiso: true,
                },
                where: {
                    rolId: user.roleId,
                    menuOptionId: menuOption.id,
                },
            });

            if (!userPermisos.length) {
                return res.status(403).json({ error: "Access forbidden" });
            }
            let hasAccess = false;
            for (const obj_permiso in userPermisos) {
                let permiso = userPermisos[obj_permiso].permiso;

                if (permiso.name == "access") {
                    hasAccess = true;
                    break;
                }
            }
            if (!hasAccess) {
                return res.status(403).json({ error: "Access forbidden" });
            }

            let hasPermission = false;
            for (const obj_permiso in userPermisos) {
                let permiso = userPermisos[obj_permiso].permiso;

                if (permiso.name == permissionName) {
                    hasPermission = true;
                    break;
                }
            }

            if (!hasPermission) {
                return res
                    .status(403)
                    .json({ error: `Permission '${permissionName}' denied` });
            }
        } catch (error) {
            return res.status(403).json({ error: `Access denied` });
        }

        next();
    };
};

export default authorize;
