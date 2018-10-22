## Architecture
In general, the technical architecture for this game has 3 parts (services) as following:

- Web fontend, it is based on ReactJS. It will connect to API endpoits to manipulate database. It also connect to Socket IO service in order to allow players exchange data in realtime.
- Rest API, it is build with Swagger tool so that we can design API specs before implementing API enpoints. See http://localhost:3000/docs/#/default for cheching API endpoints doc.
- Socket IO service, it is build for exchanging data in realtime between multiple players during playing game such synching player's movement on game board among players.

And, the above services are runing seperately.

## Tech Stack

There technical stack used for this game as following:

- React
- Bootstrap
- NodeJS 10.6.0
- MongoDB 3.4.1
- Socket IO

Code generator/libs (KICKSTARTER CODE):
- create-react-app
- swagger
- yarn

## Deploy:

Clone the project from github.
### `$ git clone https://github.com/mnbao1975/RingierTicTacToe.git`

Go to the RingierTicTacToe folder.
### `$ cd RingierTicTacToe`

Build and run Web fontend.
### `$ cd web-app && npm install`
### `$ PORT=5000 yarn start`

Build and run API service.
### `$ cd ../api && npm install`
### `$ node app.js`

Build and run Socket IO service
### `$ cd ../socket-io && npm install`
### `$ node app.js`

Start MongoDB locally
### `$ mongod`

## TEST
- Open this link http://localhost:5000 on two browsers.
- On the first browsers, the first player taps on the "+ Create a new game".
- On the second browser, the second player need to refresh it to see the new game just creatd by the first player.
- Those two browser will let you know that the game is started. And, the 2 players can start to play the game together.
- Every movement of a player will be synced to the other player's browser in realtime.
- When there is a winner, the two browsers will be get informed immedately.
- The completed games can be loaded (from the home page, http://localhost:5000), but the saved one can not be continued to playe again (need to be improved). 

## NOTEs:
During testing the game.
- Please stay on the game board and try to complete the game. If one of players leaves the current page, the game's state is persistent. But, it cannot be continued again (need to be improved). 
- Please do NOT restart any service (API, Socket IO or Web fontend) or refresh any browser (need to be improved).
- Reused code from https://reactjs.org/tutorial/tutorial.html
- Reused css code from https://codepen.io/shammadahmed/pen/JOWEGW for designing game board. 

