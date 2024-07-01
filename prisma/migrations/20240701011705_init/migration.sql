-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "password" TEXT NOT NULL,
    "token" TEXT,
    "roleId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuOption" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "MenuOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles_permissions" (
    "id" SERIAL NOT NULL,
    "rolId" INTEGER NOT NULL,
    "menuOptionId" INTEGER NOT NULL,
    "permissionId" INTEGER NOT NULL,

    CONSTRAINT "roles_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "units_measure" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "short" VARCHAR(20) NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "units_measure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "description" TEXT,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipes" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" VARCHAR(250) NOT NULL,
    "description" TEXT,
    "preparation_time" DECIMAL(9,2) NOT NULL,
    "UserId" INTEGER NOT NULL,

    CONSTRAINT "recipes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipe_steps" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "step" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "RecipeId" INTEGER NOT NULL,

    CONSTRAINT "recipe_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipe_ingredients" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "ingredient" TEXT NOT NULL,
    "amount" DECIMAL(9,2) NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "RecipeId" INTEGER NOT NULL,

    CONSTRAINT "recipe_ingredients_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_code_key" ON "users"("code");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "roles_code_key" ON "roles"("code");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_name_key" ON "permissions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_code_key" ON "permissions"("code");

-- CreateIndex
CREATE UNIQUE INDEX "roles_permissions_rolId_menuOptionId_permissionId_key" ON "roles_permissions"("rolId", "menuOptionId", "permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "units_measure_name_key" ON "units_measure"("name");

-- CreateIndex
CREATE UNIQUE INDEX "units_measure_code_key" ON "units_measure"("code");

-- CreateIndex
CREATE UNIQUE INDEX "categories_code_key" ON "categories"("code");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "recipes_code_key" ON "recipes"("code");

-- CreateIndex
CREATE UNIQUE INDEX "recipe_steps_code_key" ON "recipe_steps"("code");

-- CreateIndex
CREATE UNIQUE INDEX "recipe_ingredients_code_key" ON "recipe_ingredients"("code");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles_permissions" ADD CONSTRAINT "roles_permissions_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles_permissions" ADD CONSTRAINT "roles_permissions_menuOptionId_fkey" FOREIGN KEY ("menuOptionId") REFERENCES "MenuOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles_permissions" ADD CONSTRAINT "roles_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_steps" ADD CONSTRAINT "recipe_steps_RecipeId_fkey" FOREIGN KEY ("RecipeId") REFERENCES "recipes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "recipe_ingredients_RecipeId_fkey" FOREIGN KEY ("RecipeId") REFERENCES "recipes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
