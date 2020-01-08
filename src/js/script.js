
oxo.inputs.listenKeyOnce("enter", function() {
  oxo.screens.loadScreen("game", function() {
    game();
  });

});
//});

function endFunction() {
  oxo.inputs.listenKeyOnce("enter", function() {
    oxo.screens.loadScreen("game", function() {
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

  let apparitionCrabTemplate;
  let appartionTreeTemplate;
  let apparitionBallTemplate;
  let apparitionDogTemplate;

  let crabRandomApparitionTemplate;
  let treeRandomApparitionTemplate;
  let ballRandomApparitionTemplate;
  let dogRandomApparitionTemplate;

  let brontisIsInvincible = false;
  let brontisLifes = 5;
  let squeezeLifes = 5;
  let isFighting = false;
  let isShooting = false;

  (function play() {
    appearRandomTree();
    appearRandomCrab();
    moveBrontis();
    itemsApparition();
    addSqueez();
    brontisCatchSqueeze();


    $originalTrees.classList.add('is-moving');
    $brontisLifes.innerHTML = 'Life : ' + brontisLifes;

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

  function addSqueez() {
    $squeeze.classList.add("is-visible");
  }

  function moveBrontis() {
    $brontis.classList.add('is-running');
    oxo.inputs.listenArrowKeys(function(key) {
      switch (key) {
        case "up":
          brontisIsJunping();
          break;
        case "down":
          if ($brontis.classList.contains("is-jumping")) {
            $brontis.classList.remove("is-jumping");
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
    window.addEventListener("keyup", function(key) {
      switch (key.keyCode) {
        case 40:

          $brontis.classList.remove('is-bending-down');
          break;

      }
    });
  }

  function brontisHitElt(element) {
    oxo.elements.onCollisionWithElement($brontis, element, function() {
      if (!brontisIsInvincible) {
        if (brontisLifes > 0) {
          brontisLifes--;
          brontisIsInvincible = true;

          $brontis.classList.add('is-flashing');
          $brontisLifes.innerHTML = 'Life : ' + brontisLifes;

          setTimeout(function() {
            $brontis.classList.remove("is-flashing");
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

      if (!isFighting) {
        console.log('FIGHT');
        clearAllIntervalAndTimeout();
        freezeTrees();
        fight();
      }
    });
  }

  function brontisIsJunping() {
    if (!$brontis.classList.contains("is-jumping")) {
      $brontis.classList.add("is-jumping");
      setTimeout(function() {
        $brontis.classList.remove("is-jumping");
      }, 1000);
    }
  }

  function brontisIsBendingDown() {
    if (!$brontis.classList.add("is-bending-down")) {
      $brontis.classList.add("is-bending-down");
    }
  }
  function brontisIsDead() {
    $brontis.classList.add("is-dead");
    brontisIsAlive = false;
    clearAllIntervalAndTimeout();
    setTimeout(function() {
      oxo.screens.loadScreen("end", function() {
        endFunction();
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

  function appearRandomCrab() {

    const $crab = document.createElement('div');
    $crab.classList.add('enemy', 'crab');
    $gameArea.appendChild($crab);
    setInterval(function() {
      oxo.animation.move($crab, "left", 1, true);
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
    const $tree = document.createElement("div");
    $tree.classList.add("trees", "tree__random");
    $tree.style.width = getRandomNumber(150, 350) + "px";
    $gameArea.appendChild($tree);
    setInterval(function() {
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
    document.querySelectorAll(".tree__random").forEach(function(tree) {
      var position = oxo.animation.getPosition(tree);
      tree.style.transform = "none";
      tree.style.left = 1290 + position.x + "px";
    });
  }

  function appearRandomBall() {

    const $ball = document.createElement('div');
    $ball.classList.add('enemy', 'ball');
    $gameArea.appendChild($ball);
    let positionX = $ball.offsetLeft;
    setInterval(function() {
      positionX -= 1;
      $ball.style.left = positionX + "px";
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
    $dog.classList.add('enemy', 'dog');
    $gameArea.appendChild($dog);
    setInterval(function() {
      oxo.animation.move($dog, "left", 1, true);
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
    const $boat = document.createElement("div");
    $boat.classList.add("boat");
    $gameArea.appendChild($boat);
    oxo.elements.onLeaveScreenOnce(
      $boat,
      function() {
        $boat.remove();
      },
      true
    );
  }

  function fight() {
    isFighting = true;
    removeEnemies();
    setSqueezeLifes();
    resetbrontisLifes();
    flashing();
    setTimeout(function() {
      replaceBrontis();
      replaceSqueeze();
    }, 500);
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
        brontisThrowWeapon();
      }
    });
  }

  function removeEnemies() {
    document.querySelectorAll('.enemy').forEach(function(elt) {
      elt.remove();
    });
  }
  function setSqueezeLifes() {
    $squeezeLifes.innerHTML = 'Life : ' + squeezeLifes;
  }
  function resetbrontisLifes() {
    brontisLifes = 3;
    $brontisLifes.innerHTML = 'Life : ' + brontisLifes;
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
  }

  function brontisThrowWeapon() {
    createBrontisWeapon();
  }

  function createBrontisWeapon() {
    if (!isShooting) {
      isShooting = true;

      const $brontisWeapon = document.createElement('div');
      $brontisWeapon.classList.add('weapon');

      let position = oxo.animation.getPosition($brontis);
      let positionY = $brontis.offsetTop + 80;
      let positionX = $brontis.offsetLeft + $brontis.offsetWidth;

      $brontisWeapon.style.top = positionY + 'px';
      $brontisWeapon.style.left = positionX + position.x + 'px';
      $gameArea.appendChild($brontisWeapon);
      setInterval(function() {
        oxo.animation.move($brontisWeapon, 'right', 1, true);
      }, 1);
      setTimeout(function() {
        isShooting = false;
      }, 500);
      hitSqueeze($brontisWeapon);
    }
  }

  function hitSqueeze(element) {
    oxo.elements.onCollisionWithElement($squeeze, element, function() {
      element.remove();
      if (squeezeLifes > 0) {
        squeezeLifes--;
        $squeezeLifes.innerHTML = 'Life : ' + squeezeLifes;
        setTimeout(function() {
          $brontis.classList.remove('is-flashing');
          brontisIsInvincible = false;
        }, 3000);
      } else {
        console.log('squeeze id DEAD');
      }
    });
  }
}
