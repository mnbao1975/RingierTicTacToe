## Architecture
In general, the technical architecture for this game has 3 parts (services) as following:

- Web fontend, it is based on ReactJS. I will connection API endpoits to manipulate database. I also connect with Socket IO service in order to allow players exchange data in realtime.
- Rest API, it is build with Swagger tool so that we can design API specs before implementing API enpoints. See http://localhost:3000/docs/#/default for cheching API endpoints.
- Socket IO service, it is build for exchanging data in realtime between multiple players during playing game such synching player's movement on game board among players.

And, the above services are runing seperately.

## Tech Stack

There technical stack used for this game are:

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
- On the first browers, tap on the "+ Create a new game".
- On the second window, please refresh it to see the new game just creatd by the first browser.
- Those two browser will let you know that the game is started so that the 2 players can start to play the game.
- Every movement of a player will be synced to the other browser in realtime.
- When there is the winner, the two browser will be get informed immedately.
- The completed games can be loaded, but the saved can not continue to played (need to be improved). 

## NOTEs:
During testing the game.
- Please try to complete the game. If one of players move to other screen, the game's state is persistent. But, it cannot replay again. 
- Please do NOT restart any service (API, Socket IO or Web fontend) or refresh any browser.
- Reused code from https://reactjs.org/tutorial/tutorial.html
- Reused css code from https://codepen.io/shammadahmed/pen/JOWEGW for designing game board. 

