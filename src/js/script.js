//oxo.inputs.listenKeyOnce('enter', function() {
oxo.screens.loadScreen('game', function() {
  game();
});
//});

function game() {
  const $originalTrees = document.querySelector('.game-area__trees');
  const $gameArea = document.querySelector('.game-area');
  const $brontis = document.querySelector('.brontis');
  const $squeeze = document.querySelector('.squeeze');
  const $life = document.querySelector('.game-area__life');

  let apparitionCrabTemplate;
  let appartionTreeTemplate;
  let apparitionBallTemplate;
  let apparitionDogTemplate;
  let itemsMovingTemplate;

  let crabRandomApparitionTemplate;
  let treeRandomApparitionTemplate;
  let ballRandomApparitionTemplate;
  let dogRandomApparitionTemplate;

  let brontisIsInvincible = false;
  let life = 4;

  (function play() {
    appearRandomTree();
    appearRandomCrab();
    addBrontis();
    addSqueez();
    setTimeout(moveBrontis, 2000);
    itemsApparition();
    brontisCatchSqueeze();

    $originalTrees.classList.add('is-moving');
    $life.innerHTML = 'Life : ' + life;
  })();

  function itemsApparition() {
    appearRandomBoat();
    apparitionCrabTemplate = setInterval(function() {
      crabRandomApparitionTemplate = setTimeout(
        appearRandomCrab,
        getRandomNumber(1000, 3000)
      );
    }, 6000);

    appartionTreeTemplate = setInterval(function() {
      treeRandomApparitionTemplate = setTimeout(
        appearRandomTree,
        getRandomNumber(3000, 7000)
      );
    }, 8000);

    apparitionBallTemplate = setInterval(function() {
      ballRandomApparitionTemplate = setTimeout(
        appearRandomBall,
        getRandomNumber(3000, 5000)
      );
    }, 8000);

    apparitionDogTemplate = setInterval(function() {
      dogRandomApparitionTemplate = setTimeout(
        appearRandomDog,
        getRandomNumber(2000, 4000)
      );
    }, 11000);
  }

  function clearAllIntervalAndTimeout() {
    clearInterval(apparitionCrabTemplate);
    clearInterval(appartionTreeTemplate);
    clearInterval(apparitionBallTemplate);
    clearInterval(apparitionDogTemplate);

    clearTimeout(crabRandomApparitionTemplate);
    clearTimeout(treeRandomApparitionTemplate);
    clearTimeout(ballRandomApparitionTemplate);
    clearTimeout(dogRandomApparitionTemplate);
  }

  function addBrontis() {
    $brontis.classList.add('is-visible');
  }

  function addSqueez() {
    $squeeze.classList.add('is-visible');
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
        case 'right':
          oxo.animation.move($brontis, 'right', 4, true);
          break;
        case 'left':
          oxo.animation.move($brontis, 'left', 4, true);
          break;
      }
    });
  }

  function brontisHitElt(element) {
    oxo.elements.onCollisionWithElement($brontis, element, function() {
      if (!brontisIsInvincible) {
        if (life > 0) {
          life--;
          brontisIsInvincible = true;
          $brontis.classList.add('is-flashing');
          $life.innerHTML = 'Life : ' + life;
          setTimeout(function() {
            $brontis.classList.remove('is-flashing');
            brontisIsInvincible = false;
          }, 3000);
        } else {
          brontisIsDead();
        }
      }
    });
  }

  function brontisCatchSqueeze() {
    oxo.elements.onCollisionWithElement($brontis, $squeeze, function() {
      console.log('FIGHT');
      clearAllIntervalAndTimeout();
      freezeTrees();
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
  function brontisIsDead() {
    $brontis.classList.add('is-dead');
    brontisIsAlive = false;
    clearAllIntervalAndTimeout();
  }

  function getRandomNumber(min, max) {
    let number;
    do {
      number = Math.floor(Math.random() * max);
    } while (number < min);
    return number;
  }

  function appearRandomCrab() {
    const $crab = document.createElement('div');
    $crab.classList.add('crab');
    $gameArea.appendChild($crab);
    setInterval(function() {
      oxo.animation.move($crab, 'left', 1, true);
    }, 10);
    oxo.elements.onLeaveScreenOnce(
      $crab,
      function() {
        $crab.remove();
      },
      true
    );
    brontisHitElt($crab);
  }

  function appearRandomTree() {
    const $tree = document.createElement('div');
    $tree.classList.add('trees', 'tree__random');
    $tree.style.width = getRandomNumber(150, 350) + 'px';
    $gameArea.appendChild($tree);
    itemsMovingTemplate = setInterval(function() {
      oxo.animation.move($tree, 'left', 1, true);
    }, 30);
    oxo.elements.onLeaveScreenOnce(
      $tree,
      function() {
        $tree.remove();
      },
      true
    );
  }

  function freezeTrees() {
    document.querySelectorAll('.tree__random').forEach(function(tree) {
      var position = oxo.animation.getPosition(tree);
      tree.style.transform = 'none';
      tree.style.left = 1290 + position.x + 'px';
    });
  }

  function appearRandomBall() {
    const $ball = document.createElement('div');
    $ball.classList.add('ball');
    $gameArea.appendChild($ball);
    let positionX = $ball.offsetLeft;
    setInterval(function() {
      positionX -= 1;
      $ball.style.left = positionX + 'px';
    }, 6);
    oxo.elements.onLeaveScreenOnce(
      $ball,
      function() {
        $ball.remove();
      },
      true
    );
    brontisHitElt($ball);
  }

  function appearRandomDog() {
    const $dog = document.createElement('div');
    $dog.classList.add('dog');
    $gameArea.appendChild($dog);
    setInterval(function() {
      oxo.animation.move($dog, 'left', 1, true);
    }, 4);
    oxo.elements.onLeaveScreenOnce(
      $dog,
      function() {
        $dog.remove();
      },
      true
    );
    brontisHitElt($dog);
  }

  function appearRandomBoat() {
    const $boat = document.createElement('div');
    $boat.classList.add('boat');
    $gameArea.appendChild($boat);
    oxo.elements.onLeaveScreenOnce(
      $boat,
      function() {
        $boat.remove();
      },
      true
    );
  }
}
