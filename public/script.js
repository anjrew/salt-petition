(function () {
    var signature = document.getElementById('signature')
    var context; 
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

})()

