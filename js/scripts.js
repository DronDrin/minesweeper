let first, game, gameWidth, gameHeight, lose;
$(document).bind('refresh', e => {
    if (first)
        return;
    checkMines();
    const field = game.getPlayerField();
    for (let i = 0; i < field.length; i++) {
        for (let j = 0; j < field[i].length; j++) {
            const sqr = $('.game__item__' + i + '_' + j);
            if (field[i][j] == -2) {
                if (!sqr.hasClass('game__item__minned'))
                    sqr.addClass('game__item__minned');
                continue;
            }
            else {
                if (sqr.hasClass('game__item__minned'))
                    sqr.removeClass('game__item__minned');
            }
            if (field[i][j] == -3) {
                if (!sqr.hasClass('game__item__error'))
                    sqr.addClass('game__item__error');
                continue;
            }
            if (field[i][j] == 0) {
                if (!sqr.hasClass('game__item__void'))
                    sqr.addClass('game__item__void');
                continue;
            }
            else {
                if (sqr.hasClass('game__item__void'))
                    sqr.removeClass('game__item__void');
            }
            if (field[i][j] > 0 && field[i][j] < 9) {
                if (!sqr.hasClass('game__item__' + field[i][j]))
                    sqr.addClass('game__item__' + field[i][j]);
                sqr.children().html(field[i][j]);
                sqr.children().css({ 'opacity': '1' });
            }
            else if (field[i][j] == 9) {
                sqr.addClass('game__item__losed');
            }
            else if (field[i][j] == 10) {
                sqr.addClass('game__item__losed-click');
            }
        }
    }
});
$(document).bind('lose', e => {
    lose = true;
    $('#loseText').show();
});
$(document).bind('win', e => {
    $('#winText').show();
});
$('#restart').click(() => {
    location.reload();
});
function createGame(width, height) {
    $('.mines-counter').html('Мин осталось: ' + 99);
    lose = false;
    gameWidth = width;
    gameHeight = height;
    first = true;
    let gameHTML = '';
    for (let i = 0; i < width; i++) {
        let gameColumn = '<div class="game__column">';
        for (let j = 0; j < height; j++)
            gameColumn += '<div class="game__item game__item__' + i + '_' + j +
                '" onmousedown="clickSquare(event)" oncontextmenu="return false;"><div>0</div></div>';
        gameColumn += '</div>';
        gameHTML += gameColumn;
    }
    $('#game').append(gameHTML);
    updateSquares();
}
createGame(30, 16);

function updateSquares() {
    let squares = $('.game__item');
    for (let i = 0; i < squares.length; i++)
        $(squares[i]).height($(squares[i]).width());
}

function clickSquare(e) {
    if (lose)
        return;
    let match = /game__item__(\d+)_(\d+)/.exec(e.target.classList[1]);
    const x = match[1];
    const y = match[2];
    if (first) {
        if (e.button == 0) {
            first = false;
            game = new Game();
            game.createGame(gameWidth, gameHeight, 99, Number.parseInt(x), Number.parseInt(y));
        }
    }
    else {
        if (e.button == 0)
            game.openSquare(Number.parseInt(x), Number.parseInt(y));
        else
            game.setMine(Number.parseInt(x), Number.parseInt(y));
    }
    return false;
}

function checkMines() {
    let counter = 99;
    const field = game.getPlayerField();
    for (let i = 0; i < field.length; i++) {
        for (let j = 0; j < field[i].length; j++) {
            if (field[i][j] == -2)
                counter--;
        }
    }
    $('.mines-counter').html('Мин осталось: ' + counter);
}

$(window).resize(updateSquares);
