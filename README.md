# SciencePostmortems Setup and Run Commands

## 1. Database Setup

First, ensure PostgreSQL is running and create the database:

```bash
# If you're using psql directly
psql postgres

# Inside the PostgreSQL console
CREATE DATABASE science_postmortems;
CREATE USER your_username WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE science_postmortems TO your_username;
\c science_postmortems
GRANT ALL ON SCHEMA public TO your_username;
ALTER USER your_username WITH CREATEDB;
\q
```

## 2. Environment Configuration

Update the `.env` file with your database credentials:

```
DATABASE_URL="postgresql://your_username:your_password@localhost:5432/science_postmortems"
JWT_SECRET="your-secret-key-change-this-in-production"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

## 3. Run Database Migrations

Run Prisma migrations to create the database schema:

```bash
npx prisma migrate dev --name init
```

## 4. Seed Initial Data

```bash
npm install -D ts-node
npx prisma db seed
```

## 5. Run the Development Server

Start the development server:

```bash
npm run dev
```

Your application should now be running at [http://localhost:3000](http://localhost:3000).

## 6. Deployment to Vercel

1. Push your code to GitHub
2. Connect your repo to Vercel
3. Configure the following environment variables in Vercel:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_BASE_URL`
4. Deploy your application

## 7. Next Steps After Deployment

- Create an admin account
- Add more categories as needed
- Customize the styling to fit your branding
- Add more features like voting and reputation systems
