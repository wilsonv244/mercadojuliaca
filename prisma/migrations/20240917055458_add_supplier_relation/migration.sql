-- CreateTable
CREATE TABLE "User" (
    "id_user" SERIAL NOT NULL,
    "user_name" VARCHAR(15) NOT NULL,
    "user_password" VARCHAR(25) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id_user")
);
