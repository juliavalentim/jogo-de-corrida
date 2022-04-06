class Game {
  constructor() {
    this.resetTitle = createElement('h2')
    this.resetButton = createButton('')
    this.rankTitle = createElement('h2')
    this.leader1 = createElement('h2')
    this.leader2 = createElement('h2')
  }

  getState() {
    var gameStateRef = database.ref("gameState")
    gameStateRef.on("value", function (data) {
      gameState = data.val()
    })
  }

  updateState(state) {
    database.ref("/").update({
      gameState: state
    })
  }

  start() {

    player = new Player();

    playerCount = player.getCount()

    form = new Form();
    form.display();


    car1 = createSprite(width / 2 - 50, height - 100)
    car1.addImage(car1img)
    car1.scale = 0.07
    car2 = createSprite(width / 2 + 100, height - 100)
    car2.addImage(car2img)
    car2.scale = 0.07

    cars = [car1, car2]

    fuels = new Group()
    coins = new Group()
    obstacles = new Group()

    this.addSprites(4, fuels, fuelimg, 0.02)

    this.addSprites(18, coins, coinimg, 0.09)

    var obstaclesPositions = [
      { x: width / 2 + 250, y: height - 800, image: obsimg2 },
      { x: width / 2 - 150, y: height - 1300, image: obsimg1 },
      { x: width / 2 + 250, y: height - 1800, image: obsimg1 },
      { x: width / 2 - 180, y: height - 2300, image: obsimg2 },
      { x: width / 2, y: height - 2800, image: obsimg2 },
      { x: width / 2 - 180, y: height - 3300, image: obsimg1 },
      { x: width / 2 + 180, y: height - 3300, image: obsimg2 },
      { x: width / 2 + 250, y: height - 3800, image: obsimg2 },
      { x: width / 2 - 150, y: height - 4300, image: obsimg1 },
      { x: width / 2 + 250, y: height - 4800, image: obsimg2 },
      { x: width / 2, y: height - 5300, image: obsimg1 },
      { x: width / 2 - 180, y: height - 5500, image: obsimg2 }
    ];

    this.addSprites(obstaclesPositions.length, obstacles, obsimg1, 0.04, obstaclesPositions)
  }

  addSprites(NumberOfSprites, SpriteGroup, SpriteImg, SpriteScale, position = []) {

    for (let i = 0; i < NumberOfSprites; i++) {
      var x, y

      if (position.length > 0) {
        x = position[i].x
        y = position[i].y
        SpriteImg = position[i].image
      } else {
        x = random(width / 2 + 150, width / 2 - 150)
        y = random(-height * 4.5, height - 400)
      }

      var Sprite = createSprite(x, y)
      Sprite.addImage(SpriteImg)
      Sprite.scale = SpriteScale
      SpriteGroup.add(Sprite)


    }
  }

  handleElements() {
    form.hide()
    form.titleImg.position(40, 50)
    form.titleImg.class("gameTitleAfterEffect")

    //título do botão de reset
    this.resetTitle.html('Reset Game')
    this.resetTitle.position(width / 2 + 200, 40)
    this.resetTitle.class('resetText')

    this.resetButton.position(width / 2 + 230, 100)
    this.resetButton.class('resetButton')

    //titulo do placar
    this.rankTitle.html('Placar')
    this.rankTitle.position(width / 3 - 60, 40)
    this.rankTitle.class('resetText')

    this.leader1.position(width / 3 - 50, 80)
    this.leader1.class('leaderText')
    this.leader2.position(width / 3 - 50, 130)
    this.leader2.class('leaderText')
  }

  play() {
    this.handleElements()
    Player.getPlayerInfo()
    this.handleResetButton()
    player.getCarsAtEnd()

    if (allPlayers != undefined) {
      image(track, 0, -height * 5, width, height * 6)

      this.showLeaderBoard()
      this.showLife()

      var index = 0
      for (const plr in allPlayers) {
        index++
        var x = allPlayers[plr].positionX
        var y = height - allPlayers[plr].positionY

        cars[index - 1].position.x = x
        cars[index - 1].position.y = y

        if (index === player.index) {
          fill('red')
          ellipse(x, y, 60, 60)
          this.handleCoin(index)
          this.handleFuel(index)

          //camera.position.x = cars[index-1].position.x
          camera.position.y = cars[index - 1].position.y
        }
      }
      this.handlePlayerControl()

      const finishLine = height*6 -100
      if (player.positionY > finishLine) {
        gameState = 2
        player.rank ++
        Player.updateCarsAtEnd(player.rank)
        player.update()
        this.showRank()
        
      }
      drawSprites()
    }
  }

  handlePlayerControl() {
    if (keyIsDown(UP_ARROW)) {
      player.positionY += 10
      player.update()
    }

    if (keyIsDown(LEFT_ARROW) && player.positionX > width / 3 - 50) {
      player.positionX -= 5
      player.update()
    }

    if (keyIsDown(RIGHT_ARROW) && player.positionX < width / 2 + 300) {
      player.positionX += 5
      player.update()
    }
  }

  handleResetButton() {
    this.resetButton.mousePressed(() => {
      database.ref("/").set({
        gameState: 0,
        playerCount: 0,
        players: {},
        carsAtEnd:0
      })
      window.location.reload();
    })
  }

  showLeaderBoard() {
    var leader1, leader2
    var players = Object.values(allPlayers)

    if ((players[0].rank == 0 && players[1].rank == 0) || players[0].rank == 1) {
      //&emsp; usada p/ exibir quatro espaços
      leader1 = players[0].rank + '&emsp;' + players[0].name + '&emsp;' + players[0].score
      leader2 = players[1].rank + '&emsp;' + players[1].name + '&emsp;' + players[1].score
    }

    if (players[1].rank == 1) {
      leader2 = players[0].rank + '&emsp;' + players[0].name + '&emsp;' + players[0].score
      leader1 = players[1].rank + '&emsp;' + players[1].name + '&emsp;' + players[1].score
    }

    this.leader1.html(leader1)
    this.leader2.html(leader2)
  }

  handleFuel(index) {
    cars[index - 1].overlap(fuels, function (collector, collected) {
      player.fuel = 185
      collected.remove()
    })
  }

  handleCoin(index) {
    cars[index - 1].overlap(coins, function (collector, collected) {
      player.score += 21
      player.update()
      collected.remove()
    })
  }

  showRank() {
    swal({
      title: `Incrível!${"\n"}Rank${"\n"}${player.rank}`,
      text: "Você alcançou a linha de chegada com sucesso!",
      imageUrl:
        "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize: "100x100",
      confirmButtonText: "Ok"
    });
  }

  gameOver() {
    swal({
      title: `Fim de Jogo`,
      text: "Oops você perdeu a corrida!",
      imageUrl:
        "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSize: "100x100",
      confirmButtonText: "Obrigado por jogar"
    });
  }

  showLife(){
    push()
    image(lifeimg,width/2 -130,height-player.positionY - 300,20,20)
    fill("#ffffff")
    rect(width/2 -100,height-player.positionY - 300,185,20)
    fill("#f50057")
    rect(width/2 -100,height-player.positionY - 300,player.life,20)
    pop()
  }
}




