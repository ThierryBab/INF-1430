export function parseArray(input) {
    if (!input.trim()) return [];
    if (!input.includes(',')) {
        const size = parseInt(input);
        return Array.from({ length: size }, () => Math.floor(Math.random() * 100000));
    }
    return input.split(',').map(Number);
}

export function generateRandomArray(size) {
    const arr = [];
    for (let i = 0; i < size; i++) {
        arr.push(Math.floor(Math.random() * 10000));
    }
    return arr;
}

export function disableButtons() {
    document.getElementById('runTestsBtn').disabled = true;
    document.getElementById('triWasmBtn').disabled = true;
    document.getElementById('triJsBtn').disabled = true;
    document.getElementById('matrixWasmBtn').disabled = true;
    document.getElementById('matrixJsBtn').disabled = true;
}

export function enableButtons() {
    document.getElementById('runTestsBtn').disabled = false;
    document.getElementById('triWasmBtn').disabled = false;
    document.getElementById('triJsBtn').disabled = false;
    document.getElementById('matrixWasmBtn').disabled = false;
    document.getElementById('matrixJsBtn').disabled = false;
}

export function updateButtonsState() {
    const inputValue = document.getElementById('arrayInput').value.trim();
    const triJsBtn = document.getElementById('triJsBtn');
    const triWasmBtn = document.getElementById('triWasmBtn');

    if (inputValue === '') {
        triJsBtn.disabled = true;
        triWasmBtn.disabled = true;
    } else {
        triJsBtn.disabled = false;
        triWasmBtn.disabled = false;
    }
}




(function ($) {
    "use strict";
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };

    spinner();
    new WOW().init();

    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.sticky-top').addClass('bg-primary shadow-sm').css('top', '0px');
        } else {
            $('.sticky-top').removeClass('bg-primary shadow-sm').css('top', '-150px');
        }
    });

    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });


    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
        return false;
    });

    $(".testimonial-carousel").owlCarousel({
        items: 1,
        autoplay: true,
        smartSpeed: 1000,
        dots: true,
        loop: true,
        nav: true,
        navText: [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ]
    });

})(jQuery);