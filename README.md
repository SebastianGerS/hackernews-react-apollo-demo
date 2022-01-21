# Info

This demo project was created following [graphql-js](https://www.howtographql.com/graphql-js) and [react-apollo](https://www.howtographql.com/react-apollo) tutorials from www.howtographql.com

* note that i use v3 instead of version 2 of the apollo server

## Setup

## server (in /server)
`yarn`\
`npx prisma migrate dev`\
`npx prisma generate`\
`cp secrets.example.mjs secrets.mjs`\
`yarn start`

## client (in /client)
`yarn`\
`cp .env.example .env`\
`yarn start`