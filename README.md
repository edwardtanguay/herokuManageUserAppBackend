#  herokuManageUserAppBackend

This is the backend for a user-management app **published at Heroku connected to a MongoDB Atlas database** that has a create-react-app frontend and Node/Express API backend which  carries out CRUD operations.

See also the [frontend](https://github.com/edwardtanguay/herokuManageUserAppFrontend).

## Setup

- `npm i`
- `npm start`
- install and start the [frontend](https://github.com/edwardtanguay/herokuManageUserAppFrontend) 

## Test

- in VSCode, install the Rest Client extension
- open `test.http`
- click on e.g. "Send Request" under "### show all users"

## Publish to Heroku

- create and push your code to a repository called e.g. `herokuManageUserAppBackend`
- create a Heroku site also called `herokuManageUserAppBackend` connected to that repository
- create an environment variable called `MONGODB_URI` which contains as its value the connection string to your Atlas/MongoDB database, e.g. `mongodb+srv://mainuser:YOURPASSWORD@cluster0.ogshn.mongodb.net/app001`
