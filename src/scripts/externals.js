// import local files
import '../components/sass/style.scss';
import '../components/images/sonybg.jpg';
import '../components/images/billiard.png';

// imports
require('bootstrap/dist/js/bootstrap.min.js');

// Font Awesome 5 (Free)
require('@fortawesome/fontawesome-free/js/fontawesome')
require('@fortawesome/fontawesome-free/js/solid');
require('@fortawesome/fontawesome-free/js/regular');
require('@fortawesome/fontawesome-free/js/brands');


// jquery codes

$(document).ready(function() {

    // go down
    $('.btn-go-down').on('click', function(e) {
        e.preventDefault();

        $('html , body').animate({
            scrollTop: $('#go-down').offset().top
        }, 200);
    })

    // go up
    $('.btn-go-up').on('click', function(e) {
        e.preventDefault();

        $('html , body').animate({
            scrollTop: $('#go-up').offset().top
        }, 200);
    })

    // get previous (current) input value
    $('.main-section .card .user input').on('focus', function() {
        const value = $(this).val();
        $('#input-name').text(value);
    })

})