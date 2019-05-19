// eslint-disable-next-line quotes

(function () {
    var signature = document.getElementById('signature')
    var context
    if (signature) {
        context = signature.getContext('2d')
        context.strokeStyle = 'white'
        context.lineWidth = 2
    }

    $(signature).mousedown(function (event) {
        context.beginPath()
        context.moveTo(event.offsetX, event.offsetY)

        $(signature).mousemove(function (event) {
            context.lineTo(event.offsetX, event.offsetY)
            context.stroke()
            var data = this.toDataURL()
            $('#data').val(data)
        })
    }).on('mouseup mouseleave', function (event) { $(signature).off('mousemove mouseleave') })

    $(window).on('resize', function () {
        resizeImage()
    })

    $('#yesdel').click(function (e) {
    })

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

    function resizeImage () {
        var allelements = $('*')

        var heights = allelements.map(function () {
            return $(this).outerHeight(true)
        }).get()

        var maxHeight = Math.max.apply(null, heights)

        $('video').height(maxHeight)
    }
})()
