import express from "express";
import prisma from "../prisma.js";

const router = express.Router();

router.post("/identify", async (req, res) => {
  const { email, phoneNumber } = req.body;

  // 1. Find existing contacts by email OR phone
  const contacts = await prisma.contact.findMany({
    where: {
      OR: [
        email ? { email } : undefined,
        phoneNumber ? { phoneNumber } : undefined,
      ].filter(Boolean),
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // 2. If no contact exists → create PRIMARY
  if (contacts.length === 0) {
    const newPrimary = await prisma.contact.create({
      data: {
        email: email ?? null,
        phoneNumber: phoneNumber ?? null,
        linkPrecedence: "primary",
      },
    });

    return res.status(200).json({
      contact: {
        primaryContactId: newPrimary.id,
        emails: newPrimary.email ? [newPrimary.email] : [],
        phoneNumbers: newPrimary.phoneNumber ? [newPrimary.phoneNumber] : [],
        secondaryContactIds: [],
      },
    });
  }

  // TEMP response (we’ll handle other cases next)
  return res.status(200).json({
    message: "Existing contact found",
    contacts,
  });
});

export default router;