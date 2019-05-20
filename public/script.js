// eslint-disable-next-line quotes

(function () {
    var cookiesAccepted = localStorage.getItem('cookiesAccepted')
    var popup = $('#popup')
    var closePopUpButton = $('#close-popup')
    var canvas = document.getElementById('signature')
    var overlay = document.getElementById('overlay')
    var pad = document.getElementsByClassName('pad')
    var context
    if (canvas && pad.length === 0) {
        context = canvas.getContext('2d')
        context.strokeStyle = 'white'
        context.lineWidth = 2
    }

    resizeImage()

    if (!cookiesAccepted) {
        welcomePopup()
    }

    $(canvas).mousedown(function (event) {
        context.beginPath()
        context.moveTo(event.offsetX, event.offsetY)

        $(canvas).mousemove(function (event) {
            context.lineTo(event.offsetX, event.offsetY)
            context.stroke()
            var data = this.toDataURL()
            $('#data').val(data)
        })
    }).on('mouseup mouseleave', function (event) { $(canvas).off('mousemove mouseleave') })

    // Buttons

    $('#delete-nav').on('click', function (event) {
        $('#pages').css({
            'transform': 'translateX(25%)'
        })
        $('#delete-nav').css({
            'transform': 'scale(0.0)'
        })
    })

    $('#no').click(function (e) {
        $('#pages').css({
            'transform': 'translateX(-25%)'
        })
        $('#delete-nav').css({
            'transform': 'scale(1.0)'
        })
    })

    $('#clear').click(function (e) {
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.restore()
    })

    $('*').on('mouseover', function () {
        resizeImage()
    })

    // To Resize image

    $(window).on('resize', function () {
        resizeImage()
    })

    function resizeImage () {
        var allelements = $('*')

        var heights = allelements.map(function () {
            return $(this).outerHeight(true)
        }).get()

        var maxHeight = Math.max.apply(null, heights)

        $('video').height(maxHeight)
    }

    function welcomePopup () {
        overlay.classList.add('on')
        popup.addClass('on')
    }

    // Executed after the modal popup has fully dismissed
    overlay.addEventListener('transitionend', function (event) {
        popup.removeClass('unsetting')
        overlay.classList.remove('unsetting')
        event.stopPropagation()
    })

    // Executed when the user presses the close button
    closePopUpButton.click(function (event) {
        overlay.classList.add('unsetting')
        popup.addClass('unsetting')
        overlay.classList.remove('on')
        popup.removeClass('on')
        event.stopPropagation()
    })

    closePopUpButton.click(function (event) {
        localStorage.setItem('cookiesAccepted', true)
        overlay.classList.add('unsetting')
        popup.addClass('unsetting')
        overlay.classList.remove('on')
        popup.removeClass('on')
        event.stopPropagation()
    })
})()
