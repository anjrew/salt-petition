// eslint-disable-next-line quotes
/* global $ */

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

    // Mouse
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

    // Touch
    $(canvas).on('touchstart', function (event) {
        context.beginPath()
        context.moveTo(
            $(event)[0].originalEvent.touches[0].pageX - $(canvas).offset().left, event.offsetY,
            $(event)[0].originalEvent.touches[0].pageY - $(canvas).offset().top)

        $(canvas).on('touchmove', function (event) {
            var x = $(event)[0].originalEvent.touches[0].pageX - $(canvas).offset().left
            var y = $(event)[0].originalEvent.touches[0].pageY - $(canvas).offset().top
            var touch = event.touches[0]
            event.preventDefault()
            context.lineTo(x, y)
            context.stroke()
            var data = this.toDataURL()
            $('#data').val(data)
            if (canvas !== document.elementFromPoint(touch.pageX, touch.pageY)) {
                touchleave()
            }
        }).on('touchend', function (event) { $(canvas).off('touchmove touchstart') })
    })

    function touchleave () {
        $(canvas).off('touchmove touchstart')
    }

    // Buttons

    $('#delete-nav').on('click', function (event) {
        $('#delete-nav').css({
            'transform': 'scale(1.0)'
        })

        $('#pages').css({
            'transform': 'translateX(33%)'
        })
        $('#delete-nav').css({
            'transform': 'scale(0.0)'
        }).off('transitionend')
    })

    $('#no').click(function (e) {
        $('#pages').css({
            'transform': 'translateX(0%)'
        })
        $('#delete-nav').css({
            'transform': 'scale(1.0)'
        }).off('transitionend')
    })

    $('#about-nav').click(function (e) {
        $('#pages').css({
            'transform': 'translateX(-33%)'
        })
        $('#about-nav').css({
            'transform': 'scale(0.0)'

        }).on('transitionend', function (event) {
            $('#about-nav').css({ 'display': 'none' })
            $('#petition-nav').css({
                'display': 'inline-block',
                'transform': 'scale(1.0)'
            }).off('transitionend')
        })
    })

    $('#petition-nav').click(function (e) {
        $('#pages').css({
            'transform': 'translateX(0%)'
        })
        $('#petition-nav').css({
            'transform': 'scale(1.0)'
        }).on('transitionend', function (event) {
            $('#petition-nav').css({
                'display': 'none'
            })
            $('#about-nav').show().css({
                'disply': 'inline-block',
                'transform': 'scale(1.0)'
            }).off('transitionend')
        })
    })

    $('#clear').click(function (e) {
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.restore()
    })

    $('*').on('mouseover', function () {
        resizeImage()
    })

    // Touch Events

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
