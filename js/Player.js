class Player {
  constructor() {
    this.name = null
    this.index = null
    this.positionX = 0
    this.positionY = 0
    this.rank = 0
    this.score = 0
    this.life  = 185
    this.fuel = 185
  }

  getCount(){
    var playerCountRef = database.ref("playerCount")
    playerCountRef.on("value", function(data){
      playerCount = data.val()
    })
  }

  updateCount(count){
    database.ref("/").update({
      playerCount: count
    })
  }

  addPlayer(){
    var playerIndex = "players/player" + this.index

    if (this.index == 1) {
      this.positionX = width/2 - 100
    } else {
      this.positionX = width/2 + 100
    }
    database.ref(playerIndex).set({
      name: this.name,
      positionX: this.positionX,
      positionY: this.positionY,
      rank:this.rank,
      score:this.score
    })
  }

  static getPlayerInfo(){
    var playerInfoRef = database.ref("players")
    playerInfoRef.on("value", (data)=>{
      allPlayers = data.val()
    })
  }

  update(){
    var playerIndex = "players/player" + this.index
    database.ref(playerIndex).update({
      positionX: this. positionX,
      positionY: this. positionY,
      rank: this.rank,
      score:this.score,
      life: this.life
    })
  }

  getCarsAtEnd(){
    database.ref('carsAtEnd').on("value",(data)=>{
      this.rank = data.val();
    })
  }

  static updateCarsAtEnd(rank){
    database.ref("/").update({
      catsAtEnd:rank
    })
  }


}
