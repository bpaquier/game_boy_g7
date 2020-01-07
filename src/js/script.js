//oxo.inputs.listenKeyOnce('enter', function() {
  oxo.screens.loadScreen('game', function() {
    game();
  });
//});

function game() {
  const $gameArea = document.querySelector('.game-area');
  const $brontis = document.querySelector('.brontis');

  let apparitionObstaclesTemplate;
  let crabRandomApparitionTemplate;

  let brontisIsInvincible = false;

  apparitionObstaclesTemplate = setInterval(function() {
    crabRandomApparitionTemplate = setTimeout(
      appearRandomElement,
      getRandomNumberForObstacles()
    );
  }, 3000);

  addBrontis();
  moveBrontis();

  function addBrontis() {
    $brontis.classList.add('is-visible');
  }

  function moveBrontis() {
    oxo.inputs.listenArrowKeys(function(key) {
      switch (key) {
        case 'up':
          if ($brontis.classList.contains('is-bending-down')) {
            $brontis.classList.remove('is-bending-down');
          } else {
            brontisIsJunping();
          }
          break;
        case 'down':
          if ($brontis.classList.contains('is-jumping')) {
            $brontis.classList.remove('is-jumping');
          } else {
            brontisIsBendingDown();
          }
          break;
      }
    });
  }

  function brontisIsJunping() {
    if (!$brontis.classList.contains('is-jumping')) {
      $brontis.classList.add('is-jumping');
      setTimeout(function() {
        $brontis.classList.remove('is-jumping');
      }, 1000);
    }
  }

  function brontisIsBendingDown() {
    if (!$brontis.classList.add('is-bending-down')) {
      $brontis.classList.add('is-bending-down');
      setTimeout(function() {
        $brontis.classList.remove('is-bending-down');
      }, 800);
    }
  }

  function getRandomNumberForObstacles() {
    let number;
    do {
      number = Math.floor(Math.random() * 23) * 100;
    } while (number < 900);
    return number;
  }

  function appearRandomElement(elt) {
    const $randomElt = document.createElement('div');
    $randomElt.classList.add('element');
    $gameArea.appendChild($randomElt);
    setInterval(function() {
      oxo.animation.move($randomElt, 'left', 10, true);
    }, 100);
    oxo.elements.onLeaveScreenOnce(
      $randomElt,
      function() {
        $randomElt.remove();
      },
      true
    );
    brontisHitElt($randomElt);
  }

  function brontisHitElt(element) {
    oxo.elements.onCollisionWithElement($brontis, element, function() {
      console.log('ouch');
      $brontis.classList.add('is-dead');
    });
  }

  function brontisAie() {
    if (!brontisIsInvincible) {
      let pikaPositionX = $pikachu.offsetLeft + $pikachu.offsetWidth - 10;
      let pikaPositionY = $pikachu.offsetTop + $pikachu.offsetHeight - 5;
  
      document.querySelectorAll('.game__cactus').forEach(function(cactus) {
        if (
          cactus.offsetLeft < pikaPositionX &&
          $pikachu.offsetLeft + 20 < cactus.offsetLeft + cactus.offsetWidth &&
          cactus.offsetTop < pikaPositionY
        ) {
          if (lifes > 0) {
            lifes--;
            pikaInvicible = true;
            $pikachu.classList.add('is-flashing');
            $showLife.innerHTML = 'Life : ' + lifes;
            setTimeout(function() {
              $pikachu.classList.remove('is-flashing');
              pikaInvicible = false;
            }, 3000);
          } else {
            reset();
          }
        }
      });
    }
  }
}
