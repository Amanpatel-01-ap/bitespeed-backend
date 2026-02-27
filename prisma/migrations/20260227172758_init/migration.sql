-- CreateTable
CREATE TABLE "Contact" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255),
    "phoneNumber" VARCHAR(20),
    "linkedId" INTEGER,
    "linkPrecedence" VARCHAR(20),
    "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(6),

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);
