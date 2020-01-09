oxo.inputs.listenKeyOnce('enter', function() {
  oxo.screens.loadScreen('game', function() {
    game();
  });
});

function endFunction() {
  oxo.inputs.listenKeyOnce('enter', function() {
    oxo.screens.loadScreen('game', function() {
      game();
    });
  });
}

function game() {
  const $originalTrees = document.querySelector('.game-area__trees');
  const $gameArea = document.querySelector('.game-area');
  const $brontis = document.querySelector('.brontis');
  const $squeeze = document.querySelector('.squeeze');
  const $brontisLifes = document.querySelector('.game-area__brontisLifes');
  const $squeezeLifes = document.querySelector('.game-area__squeezeLifes');
  const $timer = document.querySelector('.game-area__timer');

  let apparitionCrabTemplate;
  let appartionTreeTemplate;
  let apparitionBallTemplate;
  let apparitionDogTemplate;
  let timerTemplate;

  let crabRandomApparitionTemplate;
  let treeRandomApparitionTemplate;
  let ballRandomApparitionTemplate;
  let dogRandomApparitionTemplate;

  let brontisIsInvincible = false;
  let squezeeIsInvincible = false;
  let lifes = 6;
  let brontisLifes = lifes;
  let squeezeLifes = lifes;
  let time = 60;
  let isFighting = false;
  let isShooting = false;

  (function play() {
    moveBrontis();
    itemsApparition();
    addSqueez();
    setTimeout(function() {
      brontisCatchSqueeze();
    }, 500);

    $originalTrees.classList.add('is-moving');
    lifeIllustration(brontisLifes, $brontisLifes);
  })();

  function itemsApparition() {
    timer();
    let randomTree = appearRandomItem('div', 'trees', 'tree__random', 30);
    let randomCrab = appearRandomItem('div', 'enemy', 'crab', 10);
    brontisHitElt(randomCrab);

    timerTemplate = setInterval(timer, 1000);

    apparitionCrabTemplate = setInterval(function() {
      crabRandomApparitionTemplate = setTimeout(function() {
        randomCrab = appearRandomItem('div', 'enemy', 'crab', 10);
        brontisHitElt(randomCrab);
      }, getRandomNumber(1000, 2000));
    }, 3000);

    appartionTreeTemplate = setInterval(function() {
      treeRandomApparitionTemplate = setTimeout(function() {
        randomTree = appearRandomItem('div', 'trees', 'tree__random', 30);
        randomTree.style.width = getRandomNumber(150, 350) + 'px';
      }, getRandomNumber(3000, 7000));
    }, 8000);

    apparitionBallTemplate = setInterval(function() {
      ballRandomApparitionTemplate = setTimeout(
        appearRandomBall,
        getRandomNumber(3000, 5000)
      );
    }, 6000);

    apparitionDogTemplate = setInterval(function() {
      dogRandomApparitionTemplate = setTimeout(function() {
        $squeeze.classList.add('is-throwing-back');
        setTimeout(function() {
          let randomDog = appearRandomItem('div', 'enemy', 'dog', 4);
          brontisHitElt(randomDog);
          $squeeze.classList.remove('is-throwing-back');
        }, 300);
      }, getRandomNumber(2000, 4000));
    }, 11000);
  }

  function clearAllIntervalAndTimeout() {
    clearInterval(timerTemplate);
    clearInterval(apparitionCrabTemplate);
    clearInterval(appartionTreeTemplate);
    clearInterval(apparitionBallTemplate);
    clearInterval(apparitionDogTemplate);

    clearTimeout(crabRandomApparitionTemplate);
    clearTimeout(treeRandomApparitionTemplate);
    clearTimeout(ballRandomApparitionTemplate);
    clearTimeout(dogRandomApparitionTemplate);
  }

  function lifeIllustration(nbLife, eltParent) {
    eltParent.innerHTML = '';
    for (let i = 0; i < nbLife; i++) {
      const $lifeImage = document.createElement('div');
      $lifeImage.classList.add('life-illustration');
      eltParent.appendChild($lifeImage);
    }
  }

  function timer() {
    $timer.innerHTML = 'Time : ' + time + 's';
    time--;
    if (time < 10) {
      $timer.classList.add('red');
      if (time < 0) {
        brontisIsDead();
      }
    }
  }

  function addSqueez() {
    $squeeze.classList.add('is-running');
  }

  function squeezeIsDead() {
    $squeeze.classList.add('is-dead');
  }

  function moveBrontis() {
    $brontis.classList.add('is-running');
    oxo.inputs.listenArrowKeys(function(key) {
      switch (key) {
        case 'up':
          brontisIsJunping();
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
          if (!$brontis.classList.contains('is-running')) {
            $brontis.classList.add('is-running');
          }
          break;
        case 'left':
          oxo.animation.move($brontis, 'left', 4, true);
          if (!$brontis.classList.contains('is-running')) {
            $brontis.classList.add('is-running');
          }

          break;
      }
    });
    window.addEventListener('keyup', function(key) {
      switch (key.keyCode) {
        case 40:
          $brontis.classList.remove('is-bending-down');
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
    }
  }
  function brontisIsDead() {
    $brontis.classList.add('is-dead');
    clearAllIntervalAndTimeout();
  }

  function getRandomNumber(min, max) {
    let number;
    do {
      number = Math.floor(Math.random() * max);
    } while (number < min);
    return number;
  }

  function appearRandomItem(type, class1, class2, speed) {
    const element = document.createElement(type);
    element.classList.add(class1, class2);
    $gameArea.appendChild(element);
    setInterval(function() {
      oxo.animation.move(element, 'left', 1, true);
    }, speed);
    oxo.elements.onLeaveScreenOnce(
      element,
      function() {
        element.remove();
      },
      true
    );
    return element;
  }

  function appearRandomBall() {
    const $ball = document.createElement('div');
    $ball.classList.add('enemy', 'ball');
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

  function brontisHitElt(element) {
    oxo.elements.onCollisionWithElement($brontis, element, function() {
      if (!brontisIsInvincible) {
        if (brontisLifes > 1) {
          brontisLifes--;
          brontisIsInvincible = true;
          $brontis.classList.add('is-flashing');
          lifeIllustration(brontisLifes, $brontisLifes);
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

  function freezeTrees() {
    document.querySelectorAll('.tree__random').forEach(function(tree) {
      var position = oxo.animation.getPosition(tree);
      tree.style.transform = 'none';
      tree.style.left = 1290 + position.x + 'px';
    });
  }

  function brontisCatchSqueeze() {
    oxo.elements.onCollisionWithElement($brontis, $squeeze, function() {
      if (!isFighting) {
        $timer.innerHTML = '';
        clearAllIntervalAndTimeout();
        freezeTrees();
        fight();
      }
    });
  }

  ////////////////////////////////////////////////////FIGHT/////////////////////////////////////////////

  function fight() {
    isFighting = true;
    removeEnemies();
    resetLifes();
    flashing();
    moveDuringFight();
    setTimeout(function() {
      replaceBrontis();
      replaceSqueeze();
    }, 500);

    setInterval(function() {
      let squeezeWeapon = createWeapon(
        'div',
        'squeeze-dog',
        $squeeze,
        'left',
        150,
        -150
      );
      $gameArea.appendChild(squeezeWeapon);
      hitBrontis(squeezeWeapon);
    }, 2000);
  }

  function moveDuringFight() {
    window.addEventListener('keyup', function(key) {
      switch (key.keyCode) {
        case 39:
          $brontis.classList.remove('is-running');
          break;
        case 37:
          $brontis.classList.remove('is-running');
          break;
      }
    });
    window.addEventListener('keydown', function(e) {
      if (e.keyCode === 32) {
        if (!isShooting) {
          isShooting = true;
          $brontis.classList.add('is-throwing');
          setTimeout(function() {
            let brontisWeapon = createWeapon(
              'div',
              'weapon',
              $brontis,
              'right',
              80,
              0
            );
            $gameArea.appendChild(brontisWeapon);
            hitSqueeze(brontisWeapon);
            $brontis.classList.remove('is-throwing');
          }, 300);
          setTimeout(function() {
            isShooting = false;
          }, 500);
        }
      }
    });
  }

  function removeEnemies() {
    document.querySelectorAll('.enemy').forEach(function(elt) {
      elt.remove();
    });
  }

  function resetLifes() {
    brontisLifes = lifes;
    lifeIllustration(brontisLifes, $brontisLifes);
    lifeIllustration(squeezeLifes, $squeezeLifes);
  }

  function flashing() {
    const $overlay = document.createElement('div');
    $overlay.classList.add('overlay');
    $gameArea.appendChild($overlay);
    setTimeout(function() {
      $overlay.remove();
    }, 1000);
  }

  function replaceBrontis() {
    $brontis.classList.add('ready-to-fight');
    $brontis.classList.remove('is-running');
  }

  function replaceSqueeze() {
    $squeeze.classList.add('ready-to-fight');
    $squeeze.classList.remove('is-running');
  }

  function createWeapon(
    type,
    classname,
    owner,
    direction,
    Yvariation,
    Xvariation
  ) {
    const element = document.createElement(type);
    element.classList.add(classname);

    let position = oxo.animation.getPosition(owner);
    let positionY = owner.offsetTop + Yvariation;
    let positionX = owner.offsetLeft + owner.offsetWidth + Xvariation;

    element.style.top = positionY + 'px';
    element.style.left = positionX + position.x + 'px';

    setInterval(function() {
      oxo.animation.move(element, direction, 1, true);
    }, 1);
    return element;
  }

  function hitSqueeze(element) {
    oxo.elements.onLeaveScreenOnce(
      element,
      function() {
        element.remove();
      },
      true
    );
    oxo.elements.onCollisionWithElement($squeeze, element, function() {
      element.remove();
      if (!squezeeIsInvincible) {
        if (squeezeLifes > 1) {
          squezeeIsInvincible = true;
          squeezeLifes--;
          lifeIllustration(squeezeLifes, $squeezeLifes);
          $squeeze.classList.add('is-flashing');
          setTimeout(function() {
            $squeeze.classList.remove('is-flashing');
            squezeeIsInvincible = false;
          }, 2000);
        } else {
          squeezeIsDead();
        }
      }
    });
  }

  function hitBrontis(element) {
    oxo.elements.onLeaveScreenOnce(
      element,
      function() {
        element.remove();
      },
      true
    );
    oxo.elements.onCollisionWithElement($brontis, element, function() {
      element.remove();
      if (!brontisIsInvincible) {
        if (brontisLifes > 1) {
          brontisIsInvincible = true;
          brontisLifes--;
          lifeIllustration(brontisLifes, $brontisLifes);
          $brontis.classList.add('is-flashing');
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
}
