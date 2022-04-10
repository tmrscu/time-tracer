# Time Tracer

Time tracer is a time recording application which is inherently simple to capture time, expenses and generate invoices which is focused on sole traders and small businesses.

### Technologies Used

<hr>
 - Frontend - <a href='https://nextjs.org/'>Next JS</a> - A React framework that gives you the best developer experience with all the features you need for production: hybrid static & server rendering, TypeScript support, smart bundling, route pre-fetching, and more. No config needed.<br><br>
- UI Library - <a href='https://chakra-ui.com/'>Chakra UI</a> - a simple, modular and accessible component library that gives you the building blocks you need to build your React applications.<br><br>
- Backend - <a href='https://supabase.com/'>Supabase</a> - a Postgres Database, Authentication, instant APIs, Realtime subscriptions and Storage.
<br>
<br>

### Authentication

<hr>
Supabase provides numerous authentication methods but in the case of our web app we have limited users to an email (must be unique) and password combination. When a user successfully signs up, a new user record is created in a private auth.users table (not accessible via public queries) where their unique user id (uuid), email, encrypted password and user meta data are all stored. The user must authenticate/confirm their sign up via email, which is also handled by Supabase (until confirmation is acquired, the user will be unable to sign in).<br><br>

From then on, when that user attempts to sign in to the app, Supabase checks their email and password against the data stored in the auth.users table and authenticates the user if it is correct (allowing them access to the app and their user data (clients, projects, task types, etc).

Password reset is also handled by Supabase. When users choose to reset their password, they are sent a reset link (via email), which contains an access_token that can be used to update the user's password in the auth.users table.

### Authorisation

<hr>
Supabase handles authorisation and database security using PostgreSQL’s Row Level Security (RLS). At a simplified level, RLS allows the developer to implement row level policies that control what users can interact with in the database.<br><br>

For example, we want users to only be able to create, read, update, and delete their own user profile. Therefore, we need to secure the database in a way that only allows an authorised user to interact with their own user profile. When a user signs up to the app, they are given a hidden unique user id (uuid) within Supabase, and this uuid is linked to their user profile (profile_id). We can use these uuid’s to apply RLS to the ‘profiles’ table as follows.

### How to run this project locally

<hr>

Clone the repo and cd into the folder.

```sh
git clone https://github.com/tmrscu/timer-tracer.git
cd timer-tracer
```

Install all the required dependencies for the project.

```sh
npm install
```

You will now need to set up some environment variables. (Make sure these are not committed to any public repositories anywhere).

Create a .env.local file in the root folder of your timer-tracer project.

```sh
touch .env.local
```

Add the following to you .env.local file.

```sh
NEXT_PUBLIC_SUPABASE_URL=Your Supabase URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=Your Supabase Anon Key
SERVICE_KEY=Your Service Key
```

To start a development server.

```sh
npm run dev
```

### How this project is deployed to production

<hr>

This project is hosted on <a href='https://vercel.com/'>Vercel</a>. A GitHub intergration is setup so that each time code is pushed to the main branch and automatic production deploy takes place. 

Vercel allows GitHub to automatically deploy your GitHub projects with Vercel, providing Preview Deployment URLs, and automatic Custom Domain updates.

A guide to how this is achieved can be found <a href="https://vercel.com/docs/concepts/git#deploying-a-git-repository">here.</a>