(function ($) {

    "use strict";
    
    

    // Dropdown on mouse hover
    $(document).ready(function () {
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        dots: true,
        loop: true,
        items: 1
    });
    
})(jQuery);

document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita el envío del formulario de manera tradicional

    // Obtén los datos del formulario
    const formData = new FormData(this);
    const data = {};
    formData.forEach((value, key) => {
       // Si el campo ya existe en el objeto data (como availabilityDays), convierte su valor a un array
       if (data[key]) {
        if (!Array.isArray(data[key])) {
            data[key] = [data[key]]; // Convierte a array si no lo es
        }
        data[key].push(value); // Agrega el nuevo valor al array existente
    } else {
        data[key] = value; // Asigna el valor normalmente si no es un array aún
    }
});

    // Envía los datos a través de fetch
    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => {
        if (response.ok) {
            // Muestra la alerta SweetAlert2
            Swal.fire({
                title: "Registro exitoso",
                text: "Te enviaremos un correo con toda la información!",
                icon: "success"
            }).then(() => {
                document.getElementById('registrationForm').reset(); // Resetea el formulario
            });
        } else {
            // Maneja los errores de registro
            Swal.fire({
                title: "Error",
                text: "Hubo un problema al registrar el usuario.",
                icon: "error"
            });
        }
    }).catch(error => {
        console.error('Error:', error);
        Swal.fire({
            title: "Error",
            text: "Hubo un problema al registrar el usuario.",
            icon: "error"
        });
    });
});
