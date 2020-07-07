$(document).ready(function() {
    const links = $(".nav-link");
    links.on('click', function(e) {
        e.stopPropagation();
        const clicked = this.text;
        cube.rotateTo(clicked);
    })
});