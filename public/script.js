// eslint-disable-next-line quotes

(function () {
    var signature = document.getElementById('signature')
    var pad = document.getElementsByClassName('pad')
    var context
    if (signature && pad.length === 0) {
        context = signature.getContext('2d')
        context.strokeStyle = 'white'
        context.lineWidth = 2
    }

    resizeImage()

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

    $('*').on('mouseover', function () {
        resizeImage()
    });


    function resizeImage () {
        var allelements = $('*')

        var heights = allelements.map(function () {
            return $(this).outerHeight(true)
        }).get()

        var maxHeight = Math.max.apply(null, heights)

        $('video').height(maxHeight)
    }
    
})()
