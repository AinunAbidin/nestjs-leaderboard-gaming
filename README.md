## Cara Jalankan (Docker)
1. `docker compose up --build`
2. Tunggu prisma migrate jalan otomatis lalu API ready di `http://localhost:3000`.
3. Swagger UI: `http://localhost:3000/docs`
4. Postman: import `postman/Leaderboard.postman_collection.json` lalu set `base_url=http://localhost:3000`.

## Cara Jalankan (Local tanpa Docker)
1. Copy `.env` dengan `DATABASE_URL` pointing ke Postgres.
2. `npm install`
3. `npx prisma migrate dev` lalu `npx prisma generate`
4. `npm run start:dev`
5. Swagger: `http://localhost:3000/docs`
6. Postman: gunakan koleksi `postman/Leaderboard.postman_collection.json`

Here is the English version:

## **How to Run (Docker)**

1. Run: `docker compose up --build`
2. Wait for Prisma migrations to run automatically, then the API will be ready at `http://localhost:3000`.
3. Swagger UI: `http://localhost:3000/docs`
4. Postman: import `postman/Leaderboard.postman_collection.json` and set `base_url=http://localhost:3000`.

## **How to Run (Local without Docker)**

1. Copy `.env` and set `DATABASE_URL` pointing to your Postgres instance.
2. Run `npm install`
3. Run `npx prisma migrate dev` then `npx prisma generate`
4. Start the server: `npm run start:dev`
5. Swagger UI: `http://localhost:3000/docs`
6. Postman: use the collection `postman/Leaderboard.postman_collection.json`


