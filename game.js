var ctx = document.getElementById("app").getContext('2d')
var scale = 3, x = 10, y = 10, totalPoints = bestPoints = 0, state = new Array(x), snake, food = { inter: null, x: null, y: null }

function initTable() {
  for (let k = 0; k < x; k++) state[k] = new Array(y).fill(0)
  snake = { size: 3, dir: 'RIGHT', x: Math.round(x / 2), y: Math.round(y / 2), v: 200, inter: null, ready: true, hungry: x * y * 2 }
  state[snake.x][snake.y] = snake.size
}

function drawSquare(x, y, fill, head) {
  x *= (10 * scale), y *= (10 * scale), y += 105
  ctx.fillStyle = fill !== 0 ? head ? '#009' : '#000' : '#eee'
  ctx.fillRect(x, y, 10 * scale, 10 * scale)
  ctx.fillStyle = '#fff'
  ctx.fillRect(x + 1 * scale, y + 1 * scale, 8 * scale, 8 * scale)
  ctx.fillStyle = fill !== 0 ? head ? '#009' : '#000' : '#eee'
  ctx.fillRect(x + 2 * scale, y + 2 * scale, 6 * scale, 6 * scale)
}

function drawPoints() {
  ctx.fillStyle = '#eee'
  ctx.fillRect(0, 0, x * scale * 10, 105)
  ctx.fillStyle = '#000', ctx.font = '24px monospace'
  ctx.fillText("SuperSnake", 5, 21)
  ctx.fillText("Score:", 5, 47)
  ctx.fillText("Best:", 5, 72)
  ctx.fillText("Hungry:", 5, 97)
  ctx.fillText(totalPoints, 110, 47)
  ctx.fillText(bestPoints, 110, 72)
  ctx.fillText(snake.hungry, 110, 97)
}

function updatefood() {
  food.inter !== null && clearInterval(food.inter)
  food = chooseNewPoint()
  state[food.x][food.y] = -1
  food.inter = setInterval(function () { state[food.x][food.y] = state[food.x][food.y] === -1 ? 0 : -1 }, 400)
}

function newGame() {
  initTable()
  updatefood()
  updateTable()
  initKeyboard()
}

function incPontos() {
  bestPoints = ++totalPoints >= bestPoints ? totalPoints : bestPoints
  snake.size++;
  snake.v -= 2
  snake.hungry = x * y * 2
  updatefood()
}

function updateTable() {
  clearInterval(snake.inter)
  snake.inter = setInterval(function () {
    snake.dir === 'LEFT' && (snake.x = snake.x - 1 < 0 ? x - 1 : snake.x - 1)
    snake.dir === 'DOWN' && (snake.y = snake.y + 1 >= y ? 0 : snake.y + 1)
    snake.dir === 'RIGHT' && (snake.x = snake.x + 1 >= x ? 0 : snake.x + 1)
    snake.dir === 'UP' && (snake.y = snake.y - 1 < 0 ? y - 1 : snake.y - 1)
    try {
      if (state[snake.x][snake.y] > 1 || --snake.hungry < 0) throw new Error()
      snake.x === food.x && snake.y === food.y && incPontos()
      state[snake.x][snake.y] = snake.size + 1
      iterState(function (i, j) {
        state[i][j] > 0 && state[i][j]--
        drawSquare(i, j, state[i][j], i === snake.x && j === snake.y)
      })
      drawPoints()
      snake.ready = true
    } catch (e) {
      clearInterval(snake.inter)
      confirm("GAME OVER! Play again?") && newGame()
    }
  }, snake.v)
}


function initKeyboard() {
  window.onkeydown = function (ev) {
    snake.ready && ev.key === 'ArrowUp' && snake.dir !== 'DOWN' && (snake.dir = 'UP')
    snake.ready && ev.key === 'ArrowRight' && snake.dir !== 'LEFT' && (snake.dir = 'RIGHT')
    snake.ready && ev.key === 'ArrowDown' && snake.dir !== 'UP' && (snake.dir = 'DOWN')
    snake.ready && ev.key === 'ArrowLeft' && snake.dir !== 'RIGHT' && (snake.dir = 'LEFT')
    snake.ready = false
  }
}

function chooseNewPoint() {
  var options = []
  iterState(function (i, j) { state[i][j] === 0 && options.push({ x: i, y: j }) })
  return options[Math.floor(Math.random() * options.length)]
}

function iterState(func) {
  for (let i = 0; i < x; i++)
    for (let j = 0; j < y; j++) func(i, j)
}

newGame()
