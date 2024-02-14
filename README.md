# Real-Time Voting System

## Overview

This project is a real-time voting system designed to provide instant feedback using Fastify, WebSockets, Prisma, Redis (for poll ranking storage), and PostgreSQL. The system allows users to participate in polls and view live updates of voting results.

## Features / Techs

- **Real-time Feedback:** Experience instant updates on poll results as votes are cast.
- **Fastify and WebSockets:** Utilizes the Fastify web framework for high performance and incorporates WebSockets for real-time communication.
- **Prisma:** Connects to the database using Prisma, an efficient for TypeScript or JavaScript.
- **Redis for Polls Ranking Storage:** Implements Redis as a fast and scalable data store to efficiently manage and retrieve poll rankings.
- **PostgreSQL:** Stores persistent data such as user information, polls, and historical voting data.

### Prerequisites

Make sure you have Node.js and npm (Node Package Manager) or Yarn installed on your machine.

- Node.js: [Download Node.js](https://nodejs.org/)
- Npm: [Download npm](https://www.npmjs.com/get-npm)
- Yarn: [Download Yarn](https://yarnpkg.com/getting-started/install)

### Installing

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/gabrikf/polls-realtime.git

   ```

2. Navigate to the project directory:

   ```bash
   cd polls-realtime
   ```

3. Install dependencies using npm or yarn:

   ```bash
     npm install
   ```

   or

   ```bash
    yarn
   ```

4. Running imigrations:

   ```bash
    npx prisma migrate dev
   ```

   or

   ```bash
    yarn prisma migrate dev
   ```
5. Running in Development Mode:

   ```bash
    npm run dev
   ```

   or

   ```bash
    yarn dev
   ```
