<div align="center">
    <h1>KURZ</h1>
    <p>Quickly share texts and links with your friends</p>
</div>

## Stack

- Next.js
- Tailwind CSS
- Shadcn UI
- Lucide Icons
- Drizzle ORM
- Turso
- SQLite
- BetterAuth

## Features

- Create short links (KURZ)
- Share links with your friends
- Expire links after a certain time
- Create texts and share them with your friends
- Syntax highlighting

## Development

### Requirements

- Node.js 22+
- A [Turso](https://turso.tech/) account

### Setup

1. Clone the repository

```bash
git clone https://github.com/derlesh/kurz.git
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file and set the environment variables

```bash
BETTER_AUTH_SECRET= # Can be generated with `npx better-auth@latest secret`
BETTER_AUTH_URL=

TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=

GH_CLIENT_ID=
GH_CLIENT_SECRET=

NEXT_PUBLIC_APP_URL=
```

4. Generate the database schema

```bash
npm run db:push
```

5. Run the development server

```bash
npm run dev
```

## Thanks

I've planned to do something like this for a while now. I've wanted a better way to share texts with friends. After I've found [slug](https://slug.vercel.app/) I had the motivation to start this project. The project now has an URL shortening feature which I didn't have in mind when I started.

So thank you [slug](https://slug.vercel.app/) for the inspiration!