function jugador() {
    var personaje = document.getElementById("personaje");
}
;

var juego = new Phaser.Game(200, 300, Phaser.CANVAS, "canvas");

var estadoPrincipal = {
    // carga recursos del juego
    preload: function () {
        juego.stage.backgroundColor = "#0000";
    },
    //muestra en pantalla
    create: function () {

    },
    //anima el juego
    update: function () {

    }
};

juego.state.add("principal", estadoPrincipal);
juego.state.start("principal");
