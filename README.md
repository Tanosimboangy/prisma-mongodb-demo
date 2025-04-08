# Prisma & MongoDB Demo App with Accelerate

⭐ Star this repo if you find it useful!

This is a [Next.js](https://nextjs.org) project demonstrating how to build a full-stack application using Prisma, MongoDB Atlas, and Prisma Accelerate. The application allows you to manage users and their posts. It also includes caching and connection pooling with Prisma Accelerate. 

## Learn More

To learn more about this project:

📺 Watch the video tutorial 📺
[![Watch the video](https://img.youtube.com/vi/7t_cL2BQ5Ok/maxresdefault.jpg)](https://youtu.be/7t_cL2BQ5Ok)

📖 Read the written tutorial 📖
[Written tutorial](https://dev.to/mongodb/10x-your-development-speed-prisma-mongodb-nextjs-ultimate-stack-5g1o)

## Prerequisites

Before running this application, you'll need to set up the following:

1. **MongoDB Atlas Database**
   - Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register/?utm_campaign=devrel&utm_source=third-party-content&utm_medium=cta&utm_content=prisma-mongodb-tutorial&utm_term=jesse.hall)
   - Set up a new cluster and get your connection string
   - Add your connection string to `.env` as `DIRECT_DATABASE_URL`

2. **Prisma Accelerate**clou
   - Sign up for [Prisma Cloud](https://cloud.prisma.io)
   - Create a new project and enable Prisma Accelerate
   - Get your MongoDB Atlas connection string
   - Add it to `.env` as `DATABASE_URL`

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# Your MongoDB Atlas connection string
DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=your_api_key"


# Your Prisma Accelerate connection string
DIRECT_DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/database_name"
```

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [MongoDB Atlas](https://www.mongodb.com/atlas/?utm_campaign=devrel&utm_source=third-party-content&utm_medium=cta&utm_content=prisma-mongodb-tutorial&utm_term=jesse.hall) - Database
- [Prisma Accelerate](https://www.prisma.io/data-platform/accelerate) - Database caching and connection pooling
- [TailwindCSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI components

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.