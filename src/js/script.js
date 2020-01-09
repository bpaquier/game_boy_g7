oxo.inputs.listenKeyOnce('enter', function() {
  oxo.screens.loadScreen('game', function() {
    game();
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

function game() {
  const $originalTrees = document.querySelector('.game-area__trees');
  const $pauseOverlay = document.querySelector('.game-area__pause-overlay');
  const $gameArea = document.querySelector('.game-area');
  const $brontis = document.querySelector('.brontis');
  const $squeeze = document.querySelector('.squeeze');
  const $brontisLifes = document.querySelector('.game-area__brontisLifes');
  const $squeezeLifes = document.querySelector('.game-area__squeezeLifes');
  const $timer = document.querySelector('.game-area__timer');
  const $button = document.querySelector('.button');

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
  let timeWhileBrontisInvincibleTimeout;

  let brontisIsInvincible = false;
  let squezeeIsInvincible = false;
  let isFighting = false;
  let isShooting = false;
  let isPaused = false;
  let isMuted = false;
  let lifes = 5;
  let brontisLifes = lifes;
  let squeezeLifes = lifes;
  let time = 60;
  let volume = 1;

  (function play() {
    $musiqueDeFond.play();
    $musiqueDeFond.volume = 0.5;
    chooseVolume();
    pause();
    moveBrontis();
    moveBrontis();
    itemsApparition();
    addSqueez();
    setTimeout(function() {
      brontisCatchSqueeze();
    }, 500);

    $originalTrees.classList.add('is-moving');
    lifeIllustration(brontisLifes, $brontisLifes);
  })();

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
          timeWhileBrontisInvincibleTimeout = setTimeout(
            timeWhileBrontisInvincible,
            3000
          );
          if (!isFighting) {
            timerTemplate = setInterval(timer, 1000);
          }
        }
      }
    });
  }

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
        getRandomNumber(1000, 2000)
      );
    }, 4000);

    apparitionDogTemplate = setInterval(function() {
      dogRandomApparitionTemplate = setTimeout(function() {
        $squeeze.classList.add('is-throwing-back');
        setTimeout(function() {
          let randomDog = appearRandomItem('div', 'enemy', 'dog', 4);
          brontisHitElt(randomDog);
          $squeeze.classList.remove('is-throwing-back');
        }, 300);
      }, getRandomNumber(1000, 4000));
    }, 6000);
  }

  function clearAllIntervalAndTimeoutDuringRun() {
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
    if (!isMuted) {
      $victorySound.play();
    }
    $musiqueDeFond.pause();
    $squeeze.classList.add('is-dead');
    setTimeout(function() {
      oxo.screens.loadScreen('end', function() {
        const $winDiv = document.querySelector('.win');
        $winDiv.style.visibility = 'visible';
        endPage();
      });
    }, 2000);
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
        if (!isMuted) {
          $collapseSound.play();
        }
        if (brontisLifes > 1) {
          brontisLifes--;
          brontisIsInvincible = true;
          $brontis.classList.add('is-flashing');
          lifeIllustration(brontisLifes, $brontisLifes);

          timeWhileBrontisInvincibleTimeout = setTimeout(
            timeWhileBrontisInvincible,
            3000
          );
        } else {
          brontisIsDead();
        }
      }
    });
  }

  function timeWhileBrontisInvincible() {
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
    if (!isMuted) {
      $musiqueDeFond.play();
    }
    isFighting = true;
    removeEnemies();
    resetLifes();
    flashing();
    moveDuringFight();
    setTimeout(function() {
      replaceBrontis();
      replaceSqueeze();
    }, 500);

    squeezeThrowDogsFinalTemplate = setInterval(function() {
      $squeeze.classList.add('is-throwing');
      setTimeout(function() {
        squeezeThrowDogs();
        $squeeze.classList.remove('is-throwing');
      }, 400);
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
              0,
              1
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

  function squeezeThrowDogs() {
    let squeezeWeapon = createWeapon(
      'div',
      'squeeze-dog',
      $squeeze,
      'left',
      150,
      -150,
      2
    );
    $gameArea.appendChild(squeezeWeapon);
    hitBrontis(squeezeWeapon);
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
    let positionY = owner.offsetTop + Yvariation;
    let positionX = owner.offsetLeft + owner.offsetWidth + Xvariation;

    element.style.top = positionY + 'px';
    element.style.left = positionX + position.x + 'px';

    setInterval(function() {
      oxo.animation.move(element, direction, speed, true);
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
        if (!isMuted) {
          $collapseSound.play();
        }
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
