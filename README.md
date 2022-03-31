# Time Tracer

### How to run this project locally

Clone the repo and cd into the folder
```sh
git clone https://github.com/tmrscu/timer-tracer.git
cd timer-tracer
```

Install all the required dependencies for the project
```sh
npm install
```

You will now need to set up some environment variables. (Make sure these are not committed to any public repositories anywhere)

Create a .env.local file in the root folder of your timer-tracer project
```sh
touch .env.local
```

Add the following to you .env.local file
```sh
NEXT_PUBLIC_SUPABASE_URL=Your Supabase URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=Your Supabase Anon Key
SERVICE_KEY=Your Service Key
```
To start a development server.
```sh
npm run dev
```
