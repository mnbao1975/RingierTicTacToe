Tech Stack

Web App:
1. React
2. Bootstrap

API
1. NodeJS 10.6.0
2. MongoDB 3.4.1

Secket
1. NodeJS 10.6.0
2. MongoDB 3.4.1

Code generator (KICKSTARTER CODE)
1. create-react-app for Web App.
2. swagger for API

NOTEs:
. Have not handled the player's status yet. So, do not refresh the browser during testing.
. Reused code from https://reactjs.org/tutorial/tutorial.html


Deploy:
Webapp:
$ cd web-app
$ PORT=5000 yarn start

API
$ cd api && node app.js

Socket
$ cd socket-io && node app.js

