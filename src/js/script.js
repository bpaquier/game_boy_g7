//oxo.inputs.listenKeyOnce('enter', function() {
oxo.screens.loadScreen('game', function() {
  game();
});
//});

function game() {
  const $originalTrees = document.querySelector('.game-area__trees');
  const $gameArea = document.querySelector('.game-area');
  const $brontis = document.querySelector('.brontis');

  let apparitionCrabTemplate;
  let appartionTreeTemplate;
  let apparitionBallTemplate;

  let crabRandomApparitionTemplate;
  let treeRandomApparition;

  let brontisIsInvincible = false;

  (function play() {
    appearRandomTree();
    addBrontis();
    moveBrontis();

    $originalTrees.classList.add('is-moving');

    apparitionCrabTemplate = setInterval(function() {
      crabRandomApparitionTemplate = setTimeout(
        appearRandomCrab,
        getRandomNumber(1000, 3000)
      );
    }, 4000);

    appartionTreeTemplate = setInterval(function() {
      treeRandomApparition = setTimeout(
        appearRandomTree,
        getRandomNumber(3000, 7000)
      );
    }, 10000);

    apparitionBallTemplate = setInterval(appearRandomBall, 10000);
  })();

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
        case 'right':
          oxo.animation.move($brontis, 'right', 5, true);
          break;
        case 'left':
          oxo.animation.move($brontis, 'left', 5, true);
          break;
      }
    });
  }

  function brontisHitElt(element) {
    oxo.elements.onCollisionWithElement($brontis, element, function() {
      console.log('touch');
      $brontis.classList.add('is-dead');
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

  function getRandomNumber(min, max) {
    let number;
    do {
      number = Math.floor(Math.random() * max);
    } while (number < min);
    return number;
  }

  function appearRandomCrab(e) {
    const $crab = document.createElement('div');
    $crab.classList.add('crab');
    $gameArea.appendChild($crab);
    setInterval(function() {
      oxo.animation.move($crab, 'left', 1, true);
    }, 8);
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
  }
}
