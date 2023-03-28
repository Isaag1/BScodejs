import runServer from './server.js';

// info is called when you create your Battlesnake on play.battlesnake.com
// and controls your Battlesnake's appearance
// TIP: If you open your Battlesnake URL in a browser you should see this data
function info() {
  console.log("INFO");

  return {
    apiversion: "1",
    author: "",       // TODO: Your Battlesnake Username
    color: "#888888", // TODO: Choose color
    head: "default",  // TODO: Choose head
    tail: "default",  // TODO: Choose tail
  };
}

// start is called when your Battlesnake begins a game
function start(gameState) {
  console.log("GAME START");
}

// end is called when your Battlesnake finishes a game
function end(gameState) {
  console.log("GAME OVER\n");
}

// move is called on every turn and returns your next move
// Valid moves are "up", "down", "left", or "right"
// See https://docs.battlesnake.com/api/example-move for available data
function move(gameState) {

  let isMoveSafe = {
    up: true,
    down: true,
    left: true,
    right: true
  };

  // We've included code to prevent your Battlesnake from moving backwards
  const myHead = gameState.you.body[0];
  const myNeck = gameState.you.body[1];

  if (myNeck.x < myHead.x) {        // Neck is left of head, don't move left
    isMoveSafe.left = false;

  } else if (myNeck.x > myHead.x) { // Neck is right of head, don't move right
    isMoveSafe.right = false;

  } else if (myNeck.y < myHead.y) { // Neck is below head, don't move down
    isMoveSafe.down = false;

  } else if (myNeck.y > myHead.y) { // Neck is above head, don't move up
    isMoveSafe.up = false;
  }

  // TODO: Step 1 - Prevent your Battlesnake from moving out of bounds
  const boardWidth = gameState.board.width;
  const boardHeight = gameState.board.height;

  if (myHead.x === 0) {             // Head is at the left edge, don't move left
    isMoveSafe.left = false;
  } else if (myHead.x === boardWidth - 1) { // Head is at the right edge, don't move right
    isMoveSafe.right = false;
  }

  if (myHead.y === 0) {             // Head is at the bottom edge, don't move down
    isMoveSafe.down = false;
  } else if (myHead.y === boardHeight - 1) { // Head is at the top edge, don't move up
    isMoveSafe.up = false;
  }

  // TODO: Step 2 - Prevent your Battlesnake from colliding with itself
  const myBody = gameState.you.body;
  for (let i = 1; i < myBody.length; i++) {
    const segment = myBody[i];
    if (myHead.x == segment.x && myHead.y == segment.y) {
      isMoveSafe.up = false;
      isMoveSafe.down = false;
      isMoveSafe.left = false;
      isMoveSafe.right = false;
      break;
    }
  }


  // TODO: Step 3 - Prevent your Battlesnake from colliding with other Battlesnakes
  const opponents = gameState.board.snakes;
  for (const opponent of opponents) {
    const body = opponent.body;
    for (let i = 0; i < body.length; i++) {
      const segment = body[i];
      if (myHead.x == segment.x && myHead.y == segment.y) {
        if (myHead.x == segment.x) {
          if (myHead.y < segment.y) {
            isMoveSafe.up = false;
          } else if (myHead.y > segment.y) {
            isMoveSafe.down = false;
          }
        }
        if (myHead.y == segment.y) {
          if (myHead.x < segment.x) {
            isMoveSafe.left = false;
          } else if (myHead.x > segment.x) {
            isMoveSafe.right = false;
          }
        }
      }
    }
  }


  // Are there any safe moves left?
  const safeMoves = Object.keys(isMoveSafe).filter(key => isMoveSafe[key]);
  if (safeMoves.length == 0) {
    console.log(`MOVE ${gameState.turn}: No safe moves detected! Moving down`);
    return { move: "down" };
  }

  // Choose a random move from the safe moves
  const nextMove = safeMoves[Math.floor(Math.random() * safeMoves.length)];

  // TODO: Step 4 - Move towards food instead of random, to regain health and survive longer
  // food = gameState.board.food;

  console.log(`MOVE ${gameState.turn}: ${nextMove}`)
  return { move: nextMove };
}

runServer({
  info: info,
  start: start,
  move: move,
  end: end
});