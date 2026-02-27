import express from "express";
import prisma from "./prisma.js";

const router = express.Router();

router.post("/identify", async (req, res) => {
  const { email, phoneNumber } = req.body;

  // 1. Find existing contacts
  const contacts = await prisma.contact.findMany({
    where: {
      OR: [
        email ? { email } : undefined,
        phoneNumber ? { phoneNumber } : undefined,
      ].filter(Boolean),
    },
    orderBy: { createdAt: "asc" },
  });

  // 2. No contacts → create PRIMARY
  if (contacts.length === 0) {
    const primary = await prisma.contact.create({
      data: {
        email: email ?? null,
        phoneNumber: phoneNumber ?? null,
        linkPrecedence: "primary",
      },
    });

    return res.status(200).json({
      contact: {
        primaryContactId: primary.id,
        emails: primary.email ? [primary.email] : [],
        phoneNumbers: primary.phoneNumber ? [primary.phoneNumber] : [],
        secondaryContactIds: [],
      },
    });
  }

  // 3. Determine PRIMARY (oldest)
  // Find all primaries
const primaries = contacts.filter(
  (c) => c.linkPrecedence === "primary"
);

// Oldest primary stays primary
const primary =
  primaries.length > 0
    ? primaries.sort((a, b) => a.createdAt - b.createdAt)[0]
    : contacts[0];

// Other primaries become secondary
const otherPrimaries = primaries.filter(
  (c) => c.id !== primary.id
);

for (const contact of otherPrimaries) {
  await prisma.contact.update({
    where: { id: contact.id },
    data: {
      linkPrecedence: "secondary",
      linkedId: primary.id,
    },
  });
}

  // 4. Check if incoming info is NEW
  const emailExists = email && contacts.some((c) => c.email === email);
  const phoneExists =
    phoneNumber && contacts.some((c) => c.phoneNumber === phoneNumber);

  let newSecondary = null;

  if ((email && !emailExists) || (phoneNumber && !phoneExists)) {
    newSecondary = await prisma.contact.create({
      data: {
        email: email ?? null,
        phoneNumber: phoneNumber ?? null,
        linkedId: primary.id,
        linkPrecedence: "secondary",
      },
    });
  }

  // 5. Fetch all linked contacts
  const allContacts = await prisma.contact.findMany({
    where: {
      OR: [{ id: primary.id }, { linkedId: primary.id }],
    },
    orderBy: { createdAt: "asc" },
  });

  // 6. Build response
  const emails = [
    ...new Set(allContacts.map((c) => c.email).filter(Boolean)),
  ];
  const phoneNumbers = [
    ...new Set(allContacts.map((c) => c.phoneNumber).filter(Boolean)),
  ];
  const secondaryContactIds = allContacts
    .filter((c) => c.linkPrecedence === "secondary")
    .map((c) => c.id);

  return res.status(200).json({
    contact: {
      primaryContactId: primary.id,
      emails,
      phoneNumbers,
      secondaryContactIds,
    },
  });
});

export default router;