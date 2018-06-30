const pixelMaker = (function() {

    const $pixelCanvas = $('#pixel_canvas');
    const $colorSaver = $('#color_saver');
    const $colorLoader = $('#color_loader');
    const $undoButton = $('#undo_button');
    const $eraser = $('#eraser');
    const $brush = $('#brush');
    let eraserColor = false;
    let pixelHeight;
    let pixelWidth;

    const previousCanvas = {
        accessible: false,
        td: [],
        tdColor: [],
        prepare: function(el) {
            this.td.push(el);
            this.tdColor.push(el.css('background-color'));
            this.accessible = true;
            $undoButton.addClass('active');
        },
        undo: function() {
            if (this.accessible === false) {
                return;
            }
            this.td.pop().css('background-color', this.tdColor.pop());
            if (!this.td.length > 0) {
                $undoButton.removeClass('active');
                this.accessible = false;
            }
        }
    };

    const previousColor = {
        accessible: false,
        color: '',
        saveColor: function() {
            this.color = $('#colorPicker').val();
            this.accessible = true;
            $colorLoader.addClass('active');
            $colorLoader.css('background-color', this.color);
        },
        loadColor: function() {
            if(this.accessible===false) {
                return;
            }
            $('#colorPicker').val(this.color);
        }
    };

    const bindEvents = function() {

        $('#sizePicker').on('submit', function(e) { makeGrid(e); });
        $pixelCanvas.on('click', function(e) { colour(e); });
        $colorSaver.on('click', function() { previousColor.saveColor(); });
        $colorLoader.on('click', function() { previousColor.loadColor(); });
        $undoButton.on('click', function() { previousCanvas.undo() });
        $eraser.on('click', function() {
            $pixelCanvas.hover( function() { $pixelCanvas.css('cursor', 'url(img/eraser.png) 5 15, pointer'); });
            eraserColor = true;
        });
        $brush.on('click', function() {
            $pixelCanvas.hover( function() { $pixelCanvas.css('cursor', 'url(img/paint-brush.png) 5 15, pointer'); });
            eraserColor = false;
        });
    };

    const makeGrid = function(e) {
        e.preventDefault();
        const width = $('#input_width').val();
        const height = $('#input_height').val();
        const sum = width * height;

        pixelWidth = (width * 20);
        pixelHeight = (height * 20);

        let html = '<tr>';

        for (let i = 1; i <= sum; i++) {
            html += '<td></td>';
            if ((i % width === 0) && (i < sum)) html += '</tr><tr>';
        }
        html += '</tr>';

        $undoButton.show();
        $eraser.show();
        $brush.show();
        $pixelCanvas.html(html);
        $('#control').html('<button id="saveButton" class="active">Save</button>');
        $('#saveButton').on('click', saveCanvas);
        $brush.click();
    };

    const colour = function(e) {
        const $el = $(e.target);
        if (!$el.is('td')) {
            return;
        }
        if (eraserColor === true) {
            $el.css('background-color', 'white');
            return;
        }
        const color = $('#colorPicker').val();
        previousCanvas.prepare($el);
        $el.css('background-color', color);
    };

    const saveCanvas = function() {

        const canvasDiv = document.getElementById('canvasDiv');
        const canvasPainter = document.createElement('canvas');
        canvasPainter.setAttribute('width', pixelWidth+4);
        canvasPainter.setAttribute('height', pixelHeight+4);

        const pic = canvasPainter.getContext('2d');

        pic.lineWidth = 2;

        const $pixs = $('td');

        let x = 2;
        let y = 2;
        for (const pix of $pixs) {
            const pixColor = $(pix).css('background-color');
            pic.fillStyle = pixColor;
            pic.strokeRect(x, y, 20, 20);
            pic.fillRect(x, y, 20, 20);
            x += 20;
            if(x >= pixelWidth) {
                y += 20;
                x = 2;
            }
        }

        const imageURL  = canvasPainter.toDataURL("image/png");

        const saver = document.createElement('a');
        saver.setAttribute('download', 'image.png');
        saver.setAttribute('href', imageURL);
        canvasDiv.appendChild(saver);
        saver.click();
        canvasDiv.removeChild(saver);

    };

    const init = function() {
        bindEvents();
        $undoButton.hide();
        $eraser.hide();
        $brush.hide();
    };

    return {
        init : init
    };

})();

$(function(){
    pixelMaker.init();
});
