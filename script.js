document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    const scoreDisplay = document.getElementById('score')
    const timeDisplay = document.getElementById('vreme')
    const width = 40 //visina - 40px x 20 = 800px  i  sirina - 40px x 20 = 800px 
    let score = 0


    //vreme istice
    let timer = setInterval(() => vreme(), 1000);
    function vreme() {  
        timeDisplay.innerHTML -= 1;        
    }


    //tabla sa svakom kockicom (40px*40px)
    const layout = [
        1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
        1,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,1,
        1,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,3,0,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,0,0,0,3,0,0,0,0,0,0,3,0,0,0,0,0,0,1,
        1,0,3,0,0,0,0,0,3,0,0,0,0,0,0,0,0,3,3,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,1,1,1,1,1,0,1,1,0,0,0,0,0,0,3,0,0,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,1,1,1,1,1,0,1,1,0,1,0,0,0,0,3,0,1,3,1,
        1,0,0,0,0,0,0,0,0,0,1,0,0,0,3,0,0,1,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,1,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,3,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,0,0,0,0,0,0,3,0,0,0,0,0,0,3,0,3,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,        
        1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1     
      ]

      const squares = []
      //Legenda
      //0 - prazno polje
      //1 - zid
      //2 - 
      //3 - dragon egg
      
      //iscrtaj tablu
      function createBoard() {
          for (let i=0; i< layout.length; i++){
              const square = document.createElement('div')              
              grid.appendChild(square)
              squares.push(square)

      //dodaj klasu za svako polje (1,3)       
            if (layout[i] === 1) {
                squares[i].classList.add('wall') 
            } else if (layout[i] === 3) {
                squares[i].classList.add('dragon-egg') 
            } 
      }
    }
    createBoard()

    //pocetna pozicija carobnjaka
    let wizzardCurrentIndex = 321

    squares[wizzardCurrentIndex].classList.add('wizzard')

    //kretanje carobnjaka

    function moveWizzard(e) {
        
        squares[wizzardCurrentIndex].classList.remove('wizzard')
        //37 levo 39 desno 38 gore  40 dole  
        switch(e.keyCode) {
            case 37:
                if(wizzardCurrentIndex % width !== 0 && !squares[wizzardCurrentIndex -1].classList.contains('wall')) wizzardCurrentIndex -=1
                break 
            case 38: 
                if(wizzardCurrentIndex - width >= 0 && !squares[wizzardCurrentIndex -width/2].classList.contains('wall')) wizzardCurrentIndex -=width/2
                break   
            case 39: 
                if(wizzardCurrentIndex % width < width-1 && !squares[wizzardCurrentIndex +1].classList.contains('wall')) wizzardCurrentIndex +=1
                break  
            case 40: 
                if(wizzardCurrentIndex + width < width * width && !squares[wizzardCurrentIndex +width/2].classList.contains('wall')) wizzardCurrentIndex +=width/2
                break
        }

        squares[wizzardCurrentIndex].classList.add('wizzard')
        
        dragonEggEaten()
        checkForGameOver()
        checkForWin()
    }
    document.addEventListener('keydown', moveWizzard)


    //sta se desi kad carobnjak pojede dragon-egg
        function dragonEggEaten() {
            if(squares[wizzardCurrentIndex].classList.contains('dragon-egg')) {
                score +=1
                scoreDisplay.innerHTML = score
                squares[wizzardCurrentIndex].classList.remove('dragon-egg')
            }
        }





    //Kretanje zmajeva - template
    class Dragon {
        constructor(className, startIndex, speed) {
            this.className = className
            this.startIndex = startIndex
            this.speed = speed
            this.currentIndex = startIndex
            this.timerId = NaN
        }
    }

    dragons = [
        new Dragon('dragon1', 348, 150),
        new Dragon('dragon2', 376, 100),
        new Dragon('dragon3', 351, 100),
        new Dragon('dragon4', 376, 100),
        new Dragon('dragon4', 375, 900),
        new Dragon('dragon4', 375, 900),
        new Dragon('dragon4', 375, 900),
        new Dragon('dragon4', 375, 900),
        

    ]

    //iscrtaj zmajeve na tablu
    dragons.forEach(dragon => {
        squares[dragon.currentIndex].classList.add(dragon.className)
        squares[dragon.currentIndex].classList.add('dragon')
    })
        
    // random kretanje zmajeva
    dragons.forEach(dragon => movedragon(dragon))

    //funkcija za kretanje zmajeva
    function movedragon(dragon) {
        const directions = [-1, +1 , width/2, -width/2]
        let direction = directions[Math.floor(Math.random() * directions.length)]

        dragon.timerId = setInterval(function() {
            if (!squares[dragon.currentIndex + direction].classList.contains('wall') && !squares[dragon.currentIndex + direction].classList.contains('dragon')){
                //remove sve dragon related classes
                squares[dragon.currentIndex].classList.remove(dragon.className, 'dragon')
                //promeni currentindex ka novom polju
                dragon.currentIndex += direction
                //iscrtaj zmaja u novom polju
                squares[dragon.currentIndex].classList.add(dragon.className, 'dragon')
                //else nadji drugi direction     
            } else direction = directions[Math.floor(Math.random() * directions.length)]

            checkForGameOver()
        }, dragon.speed)

    }
  
    
    //Game over stranica i game over funkcija 
    function gameoverPage() {
        location.href = "gameover.html";
      }
    function checkForGameOver() {
        if (squares[wizzardCurrentIndex].classList.contains('dragon') || timeDisplay.innerHTML == 0) {
            dragons.forEach(dragon => clearInterval(dragon.timerId))
            document.removeEventListener('keydown', moveWizzard)
            clearInterval(timer)
            scoreDisplay.innerHTML = 'GAME OVER'
            gameoverPage()
        }        
    }

    //win stranica i win funkcija
    function winPage() {
        location.href = "win.html";
      }
    function checkForWin() {
        if (score === 21){
            dragons.forEach(dragon => clearInterval(dragon.timerId))
            document.removeEventListener('keydown', moveWizzard)
            clearInterval(timer)
            scoreDisplay.innerHTML = 'YOU WON!!!!'
            winPage()
        }
    }

})