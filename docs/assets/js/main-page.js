(function () {
    "use strict";

    function handleScroll() {
        const ud_header = document.querySelector(".ud-header");
        const logoSigla = document.querySelector("#logo-sigla");
        const logoNome = document.querySelector("#logo-nome");

        logoNome.style.color = "#006d6b";
        logoSigla.style.color = "#006d6b";

        // show or hide the back-to-top button
        const backToTop = document.querySelector(".back-to-top");
        backToTop.style.display =
            window.pageYOffset > 50 ? "flex" : "none";
    }

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("DOMContentLoaded", () => {
        setTimeout(handleScroll, 100); // Garante a ativação sem precisar rolar
    });

    //===== close navbar-collapse when a clicked
    let navbarToggler = document.querySelector(".navbar-toggler");
    const navbarCollapse = document.querySelector(".navbar-collapse");

    document.querySelectorAll(".ud-menu-scroll").forEach((e) =>
        e.addEventListener("click", () => {
            navbarToggler.classList.remove("active");
            navbarCollapse.classList.remove("show");
        })
    );
    navbarToggler.addEventListener("click", function () {
        navbarToggler.classList.toggle("active");
        navbarCollapse.classList.toggle("show");
    });

    // ===== wow js
    new WOW().init();

    // ====== scroll top js
    function scrollTo(element, to = 0, duration = 500) {
        const start = element.scrollTop;
        const change = to - start;
        const increment = 20;
        let currentTime = 0;

        const animateScroll = () => {
            currentTime += increment;

            const val = Math.easeInOutQuad(currentTime, start, change, duration);

            element.scrollTop = val;

            if (currentTime < duration) {
                setTimeout(animateScroll, increment);
            }
        };

        animateScroll();
    }

    Math.easeInOutQuad = function (t, b, c, d) {
        t /= d / 2;
        if (t < 1) return (c / 2) * t * t + b;
        t--;
        return (-c / 2) * (t * (t - 2) - 1) + b;
    };

    document.querySelector(".back-to-top").onclick = () => {
        scrollTo(document.documentElement);
    };
})();
