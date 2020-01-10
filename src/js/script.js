// LOADING SCREENS FUNCTIONS

oxo.inputs.listenKeyOnce('enter', function() {
  oxo.screens.loadScreen('game', function() {
    countdown();
  });
});

function endPage() {
  document.addEventListener('keydown', function(key) {
    if (key.keyCode === 13) {
      oxo.screens.loadScreen('game', function() {
        game();
      });
    } else if (key.keyCode === 77) {
      oxo.screens.loadScreen('home', function() {});
    }
  });
}

// GAMES FUNCTIONS
function countdown() {
  let countdownStart = 3;
  const $countdown = document.querySelector('.countdown');
  let countdownTemplate = setInterval(function() {
    if (countdownStart > 0) {
      $countdown.innerHTML = countdownStart;
      countdownStart--;
    } else {
      $countdown.innerHTML = 'GO!';
      clearInterval(countdownTemplate);
      setTimeout(function() {
        game();
        document.querySelector('.start-overlay').style.display = 'none';
      }, 1000);
    }
  }, 1000);
}
function game() {
  const $originalTrees = document.querySelector('.game-area__trees');
  const $pauseOverlay = document.querySelector('.game-area__pause-overlay');
  const $gameArea = document.querySelector('.game-area');
  const $brontis = document.querySelector('.brontis');
  const $squeeze = document.querySelector('.squeeze');
  const $brontisLifes = document.querySelector('.game-area__brontisLifes');
  const $squeezeLifes = document.querySelector('.game-area__squeezeLifes');
  const $timer = document.querySelector('.game-area__timer');
  const $button = document.querySelector('.sound-control');

  let $musiqueDeFond = document.querySelector('.musique-de-fond');
  const $jumpSound = document.querySelector('.jump-sound');
  const $loseSound = document.querySelector('.lose-sound');
  const $collapseSound = document.querySelector('.collapse-sound');
  const $victorySound = document.querySelector('.victory-sound');

  let apparitionCrabTemplate;
  let appartionTreeTemplate;
  let apparitionBallTemplate;
  let apparitionDogTemplate;
  let timerTemplate;
  let squeezeThrowDogsFinalTemplate;

  let crabRandomApparitionTemplate;
  let treeRandomApparitionTemplate;
  let ballRandomApparitionTemplate;
  let dogRandomApparitionTemplate;

  let squeezeWeapon;

  let brontisIsInvincible = false;
  let squezeeIsInvincible = false;
  let isFighting = false;
  let isShooting = false;
  let isPaused = false;
  let isMuted = false;
  let lifes = 6;
  let brontisLifes = lifes;
  let squeezeLifes = lifes;
  let time = 45;

  (function play() {
    $musiqueDeFond.play();
    $musiqueDeFond.volume = 0.5;
    chooseVolume();
    pause();
    itemsApparition();
    addSqueezie();
    setTimeout(function() {
      brontisCatchSqueeze();
      moveBrontis();
    }, 1000);

    $originalTrees.classList.add('is-moving');
    lifeIllustration(brontisLifes, $brontisLifes);
  })();

  // global functions

  function chooseVolume() {
    $button.addEventListener('click', function() {
      if (!isMuted) {
        isMuted = true;
        $musiqueDeFond.pause();
        $button.innerHTML = 'TURN SOUND ON';
      } else {
        isMuted = false;
        $musiqueDeFond.play();
        $button.innerHTML = 'TURN SOUND OFF';
      }
    });
  }

  function pause() {
    window.addEventListener('keydown', function(key) {
      if (key.keyCode === 80) {
        $pauseOverlay.classList.toggle('is-visible');
        if (!isPaused) {
          isPaused = true;
          $brontis.style.display = 'none';
          $squeeze.style.visibility = 'hidden';
          clearInterval(timerTemplate);
          clearInterval(squeezeThrowDogsFinalTemplate);
        } else {
          isPaused = false;
          $brontis.style.display = 'block';
          $squeeze.style.visibility = 'visible';
          $brontis.classList.add('is-flashing');
          brontisIsInvincible = true;
          squeezeThrowDogsFinalTemplate = setInterval(squeezeThrowDogs, 2000);
          setTimeout(brontisIsNoMoreInvincible, 3000);
          if (!isFighting) {
            timerTemplate = setInterval(timer, 1000);
          }
        }
      }
    });
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

  function getRandomNumber(min, max) {
    let number;
    do {
      number = Math.floor(Math.random() * max);
    } while (number < min);
    return number;
  }

  // items Functions

  function itemsApparition() {
    timer();
    addRandomItems('div', 'trees', 'tree__random', 30);
    addRandomItems('div', 'enemy', 'crab', 10, true);
    timerTemplate = setInterval(timer, 1000);
    $button.style.visibility = 'visible';

    apparitionCrabTemplate = setInterval(function() {
      crabRandomApparitionTemplate = setTimeout(function() {
        addRandomItems('div', 'enemy', 'crab', 10, true);
      }, getRandomNumber(1500, 3000));
    }, 4000);

    appartionTreeTemplate = setInterval(function() {
      treeRandomApparitionTemplate = setTimeout(function() {
        let randomTree = addRandomItems('div', 'trees', 'tree__random', 30);
        randomTree.style.width = getRandomNumber(150, 350) + 'px';
      }, getRandomNumber(3000, 7000));
    }, 8000);

    apparitionBallTemplate = setInterval(function() {
      ballRandomApparitionTemplate = setTimeout(
        addRandomBall,
        getRandomNumber(3000, 7000)
      );
    }, 9000);

    apparitionDogTemplate = setInterval(function() {
      dogRandomApparitionTemplate = setTimeout(function() {
        $squeeze.classList.add('is-throwing-back');
        setTimeout(function() {
          addRandomItems('div', 'enemy', 'dog', 4, true);
          $squeeze.classList.remove('is-throwing-back');
        }, 300);
      }, getRandomNumber(2000, 3000));
    }, 5000);
  }

  function clearAllIntervalAndTimeoutDuringRun() {
    clearInterval(timerTemplate);
    clearInterval(apparitionCrabTemplate);
    clearInterval(appartionTreeTemplate);
    clearInterval(apparitionBallTemplate);
    clearInterval(apparitionDogTemplate);
    clearInterval(squeezeThrowDogsFinalTemplate);

    clearTimeout(crabRandomApparitionTemplate);
    clearTimeout(treeRandomApparitionTemplate);
    clearTimeout(ballRandomApparitionTemplate);
    clearTimeout(dogRandomApparitionTemplate);
  }

  function addRandomItems(type, class1, class2, speed, ennemy = false) {
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
    if (ennemy) {
      brontisHitElt(element);
    }
    return element;
  }

  function addRandomBall() {
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

  // squeezie functions

  function addSqueezie() {
    $squeeze.classList.add('is-running');
  }

  function squeezieIsDead() {
    if (!isMuted) {
      $victorySound.play();
    }
    $musiqueDeFond.pause();
    $squeeze.classList.add('is-dead');
    $squeezeLifes.style.display = 'none';
    clearAllIntervalAndTimeoutDuringRun();
    setTimeout(function() {
      oxo.screens.loadScreen('end', function() {
        const $winDiv = document.querySelector('.win');
        $winDiv.style.visibility = 'visible';
        endPage();
      });
    }, 2000);
  }

  // Brontis functions
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
          if (!$brontis.classList.contains('is-running')) {
            $brontis.classList.add('is-running');
          }
          break;
        case 'left':
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
      if (!isMuted) {
        $jumpSound.play();
      }
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
    if (!isMuted) {
      $loseSound.play();
    }
    $musiqueDeFond.pause();
    $brontisLifes.style.display = 'none';
    $brontis.classList.add('is-dead');
    clearAllIntervalAndTimeoutDuringRun();
    setTimeout(function() {
      oxo.screens.loadScreen('end', function() {
        const $loseDiv = document.querySelector('.lose');
        $loseDiv.style.visibility = 'visible';
        endPage();
      });
    }, 2000);
  }

  function brontisHitElt(element, remove = false) {
    oxo.elements.onCollisionWithElement($brontis, element, function() {
      if (remove) {
        element.remove();
      }
      if (!brontisIsInvincible) {
        if (!isMuted) {
          $collapseSound.play();
        }
        if (brontisLifes > 1) {
          brontisLifes--;
          brontisIsInvincible = true;
          $brontis.classList.add('is-flashing');
          lifeIllustration(brontisLifes, $brontisLifes);

          timeWhileBrontisInvincibleTimeout = setTimeout(
            brontisIsNoMoreInvincible,
            3000
          );
        } else {
          brontisIsDead();
        }
      }
    });
  }

  function brontisIsNoMoreInvincible() {
    $brontis.classList.remove('is-flashing');
    brontisIsInvincible = false;
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
        clearAllIntervalAndTimeoutDuringRun();
        freezeTrees();
        fight();
      }
    });
  }

  ////////////////////////////////////////////////////FIGHT/////////////////////////////////////////////

  function fight() {
    $musiqueDeFond.remove();
    $musiqueDeFond = document.querySelector('.fight-sound');
    $musiqueDeFond.volume = 0.5;
    if (!isMuted) {
      $musiqueDeFond.play();
    }
    isFighting = true;
    resetLifes();
    flashing();
    keyListenerDuringFight();
    setTimeout(function() {
      replaceBrontis();
      replaceSqueeze();
      removeEnemies();
    }, 500);
  }

  function squeezieStartAttack() {
    squeezeThrowDogsFinalTemplate = setInterval(function() {
      $squeeze.classList.add('is-throwing');
      setTimeout(function() {
        squeezeThrowDogs();
        $squeeze.classList.remove('is-throwing');
      }, 400);
    }, 1500);
  }

  function keyListenerDuringFight() {
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
              0,
              1
            );
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
    const $overlay = document.querySelector('.overlay-fight');
    const $fightText = document.querySelector('.fight-text');
    $overlay.classList.add('is-visible');
    $fightText.classList.add('is-visible');
    setTimeout(function() {
      $overlay.classList.remove('is-visible');
      $fightText.classList.remove('is-visible');
      squeezieStartAttack();
    }, 3000);
  }

  function replaceBrontis() {
    $brontis.classList.add('ready-to-fight');
    $brontis.classList.remove('is-running');
  }

  function replaceSqueeze() {
    $squeeze.classList.add('ready-to-fight');
    $squeeze.classList.remove('is-running');
  }

  function squeezeThrowDogs() {
    squeezeWeapon = createWeapon(
      'div',
      'squeeze-dog',
      $squeeze,
      'left',
      150,
      -150,
      2
    );
    brontisHitElt(squeezeWeapon, true);
  }

  function createWeapon(
    type,
    classname,
    owner,
    direction,
    Yvariation,
    Xvariation,
    speed
  ) {
    const element = document.createElement(type);
    element.classList.add(classname);
    let position = oxo.animation.getPosition(owner);
    $gameArea.appendChild(element);
    let positionY = owner.offsetTop + Yvariation;
    let positionX = owner.offsetLeft + owner.offsetWidth + Xvariation;
    element.style.top = positionY + 'px';
    element.style.left = positionX + position.x + 'px';
    setInterval(function() {
      oxo.animation.move(element, direction, speed, true);
    }, 1);
    oxo.elements.onLeaveScreenOnce(
      element,
      function() {
        element.remove();
      },
      true
    );
    return element;
  }

  function hitSqueeze(element) {
    oxo.elements.onCollisionWithElement($squeeze, element, function() {
      element.remove();
      if (!squezeeIsInvincible) {
        if (!isMuted) {
          $collapseSound.play();
        }
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
          squeezieIsDead();
        }
      }
    });
  }
}
