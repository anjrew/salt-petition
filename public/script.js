// eslint-disable-next-line quotes

(function () {
    var canvas = document.getElementById('signature')
    var pad = document.getElementsByClassName('pad')
    var context
    if (canvas && pad.length === 0) {
        context = canvas.getContext('2d')
        context.strokeStyle = 'white'
        context.lineWidth = 2
    }

    resizeImage()

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
})()
