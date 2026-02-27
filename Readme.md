Bitespeed Identity Reconciliation (Backend)

A backend service that identifies and links customer identities across multiple purchases using email and phone number, built for the Bitespeed Backend Task.


## Tech Stack
- Node.js
- Express
- PostgreSQL
- Prisma ORM
- Hosted on Render


## API Endpoint
POST /identify

Request Body (JSON):
        {
        "email": "string (optional)",
        "phoneNumber": "string (optional)"
        }

Response :
        {
        "contact": {
            "primaryContactId": number,
            "emails": string[],
            "phoneNumbers": string[],
            "secondaryContactIds": number[]
            }
        }


## Setup

Install dependencies:

bash
npm install

npx prisma migrate dev

Run the server:

bash
npm run dev

## Live API
POST https://bitespeed-backend-nswn.onrender.com