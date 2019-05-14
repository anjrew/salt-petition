(function () {
    'use strict'
    var signature = document.getElementById('signature')
    var context = signature.getContext('2d')
    context.strokeStyle = '#900'
    context.lineWidth = 2

    // $('#signature').mousedown(function (event) {
    //     context.beginPath()
    //     // var x = (event.clientX - this.offsetLeft) * this.width / this.clientWidth
    //     // var y = (event.clientY - this.offsetTop) * this.height / this.clientHeight
    //     // var x = event.clientX - $('#signature').offset().left
    //     // var y = event.clientY - $('#signature').offset().top
    //     var x = event.offsetX
    //     var y = event.offsetY
    //     console.log(event.offsetX, event.offsetY)
    //     console.log(x, y)

    //     context.moveTo(x, y)

    //     $('#signature').mousemove(function (event) {
    //         var x = (event.clientX - this.offsetLeft) * this.width / this.clientWidth
    //         var y = (event.clientY - this.offsetTop) * this.height / this.clientHeight
    //         context.lineTo(x, y)
    //         console.log(x, y)
    //         context.stroke()
    //     }).on('mouseup mouseleave', function (event) { $('#signature').off('mousemove mouseleave') })
    // })

    // $('#sumbit').mousedown(function (e) {
    //     $('"input[name="signature]"').val($('#signature').toDataURL())
    // })

    // Kinda working
    $('#signature').mousedown(function (event) {
        context.beginPath()
        // var x = (event.clientX - this.offsetLeft) * this.width / this.clientWidth
        // var y = (event.clientY - this.offsetTop) * this.height / this.clientHeight
        // var x = event.clientX - $('#signature').offset().left
        // var y = event.clientY - $('#signature').offset().top
        // var x = event.offsetX
        var x = event.offsetX / 2
        var y = event.offsetY
       
        console.log(event.offsetX, event.offsetY)
        console.log(x, y)

        context.moveTo(x, y)
        console.log(event.offsetX, event.offsetY)
        // console.log('pX: ' + event.clientX - event.offsetLeft + ', Y: ' + event.clientY - event.offsetTop)
        // context.moveTo(event.offsetX - event.currentTarget.offsetLeft, event.offsetY - event.currentTarget.offsetTop)

        $('#signature').mousemove(function (event) {
            var x = event.offsetX / 2
            var y = event.offsetY

            context.lineTo(x, y)
            context.stroke()
        })
    }).on('mouseup mouseleave', function (event) { $('#signature').off('mousemove mouseleave') })

    $('#sumbit').mousedown(function (e) {
        $('"input[name="signature]"').val($('#signature').toDataURL())
    })
})()
