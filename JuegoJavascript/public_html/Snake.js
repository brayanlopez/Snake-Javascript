/**
 * Codigo correspondiente a lo logica del juego Snake
 * 
 * @version 1.1
 * 
 * @author Brayan Lopez
 * 
 * History
 * 1.1 se mejoro el codigo y la documentacion del mismo.
 * 1.0 se creo el juego con base al tutorial
 * Juego de Snake en Javascript HTML5 Canvas. GioCode.
 * https://www.youtube.com/watch?v=xBVYyto4U5Y
 **/

//Variables globales
var velocidad = 100; //velocidad del juego, entre mas pequeño mas rapido
var tamano = 15; //tamno de la culebrita

/**
 * @class Objeto
 * @description Clase base para otras
 */
class Objeto {
    constructor() {
        this.tamano = tamano;
    }
    choque(obj) {
        var difx = Math.abs(this.x - obj.x);
        var dify = Math.abs(this.y - obj.y);
        if (difx >= 0 && difx < tamano && dify >= 0 && dify < tamano) {
            return true;
        } else {
            return false;
        }
    }
}

/**
 * @class Cola
 * @description representa la cola del objeto 
 * @extends Objeto
 */
class Cola extends Objeto {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.siguiente = null;
    }
    dibujar(ctx) {
        if (this.siguiente !== null) {
            this.siguiente.dibujar(ctx);
        }
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, this.tamano, this.tamano);
    }
    setPos(x, y) {
        if (this.siguiente !== null) {
            this.siguiente.setPos(this.x, this.y);
        }
        this.x = x;
        this.y = y;
    }
    meter() {
        if (this.siguiente === null) {
            this.siguiente = new Cola(this.x, this.y);
        } else {
            this.siguiente.meter();
        }
    }
    verSiguiente() {
        return this.siguiente;
    }
}

/**
 * @class Comida
 * @description representa la comida de la serpiente
 * */
class Comida extends Objeto {
    constructor() {
        super();
        this.x = this.generar();
        this.y = this.generar();
    }
    generar() {
        var num = (Math.floor(Math.random() * 59)) * 10;
        return num;
    }
    colocar() {
        this.x = this.generar();
        this.y = this.generar();
    }
    dibujar(ctx, color = "red") {
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.tamano, this.tamano);
    }
}

/**
 * @class Juego
 * @description Representa la logica del juego
 * */
class Juego {
    constructor() {
        this.puntaje = 0;
    }
    aumentar() {
        this.puntaje += 1;
    }

    reiniciarPuntaje() {
        this.puntaje = 0;
    }

    getPuntaje() {
        return this.puntaje;
    }
}
/**
 * Funcion encargada del movimiento 
 */
function movimiento() {
    var nx = cabeza.x + xdir;
    var ny = cabeza.y + ydir;
    cabeza.setPos(nx, ny);
}

/**
 * Funcion encargada del control de la culebrita
 * @param {evento} event es el evento que recibe la funcion
 * */
function control(event) {
    var cod = event.keyCode;
    if (cod === 13) {
        jugando = true;
    }
    if (ejex) {
        if (cod === 38) {
            ydir = -tamano;
            xdir = 0;
            ejex = false;
            ejey = true;
        }
        if (cod === 40) {
            ydir = tamano;
            xdir = 0;
            ejex = false;
            ejey = true;
        }
    }
    if (ejey) {
        if (cod === 37) {
            ydir = 0;
            xdir = -tamano;
            ejey = false;
            ejex = true;
        }
        if (cod === 39) {
            ydir = 0;
            xdir = tamano;
            ejey = false;
            ejex = true;
        }
    }
}
/**
 * @function finDeJuego
 * @description se ejecuta cuando se acaba el juego
 */
function finDeJuego() {
    xdir = 0;
    ydir = 0;
    ejex = true;
    ejey = true;

    cabeza = new Cola(20, 20);
    comida = new Comida();
    //alert("Perdiste " + "Puntaje: " + gestor.getPuntaje());

    gestor.reiniciarPuntaje();
}

/**
 * @function choquePared
 * @description Comprueba cuando la serpiente se choca con una pared
 */
function choquePared() {
    var canvas = document.getElementById("canvas");
    if (cabeza.x < 0 || cabeza.x > (canvas.width - 10) || cabeza.y < 0 || cabeza.y > (canvas.height - 10)) {
        jugando = false;
        finDeJuego();
    }
}

/**
 * @function choqueCuerpo
 * @description Comprueba cuando la serpiente se choca consigo misma
 */
function choqueCuerpo() {
    var temp = null;
    try {
        temp = cabeza.verSiguiente().verSiguiente();
    } catch (err) {
        temp = null;
    }
    while (temp !== null) {
        if (cabeza.choque(temp)) {
            jugando = false;
            //fin de juego
            finDeJuego();
        } else {
            temp = temp.verSiguiente();
        }
    }
}

/**
 * @function
 * @description se encargada de dibujar la serpiente
 */
function dibujar() {
    var canvas = document.getElementById("canvas");
    var score = document.getElementById("puntaje");
    var ctx = canvas.getContext("2d");
    var ctxScore = score.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctxScore.clearRect(0, 0, score.width, score.height);
    ctxScore.font = "30px Arial";
    ctx.font = "30px Arial";
    if (!jugando) {
        ctx.fillText("perdiste, oprimer enter", 10, 50);
    }
    ctxScore.fillText(gestor.getPuntaje(), 10, 50);
    //aquí abajo va todo el dibujo
    cabeza.dibujar(ctx);
    comida.dibujar(ctx, "green");
}

/**
 * @function main
 * @description funcion principal
 */
function main() {
    if (jugando) {
        choqueCuerpo();
        choquePared();
        dibujar();
        movimiento();
        if (cabeza.choque(comida)) {
            gestor.aumentar();
            comida.colocar();
            cabeza.meter();
        }
    }
}

//Objetos del juego
var gestor = new Juego();
var cabeza = new Cola(20, 20);
var comida = new Comida();
var ejex = true;
var ejey = true;
var xdir = 0;
var ydir = 0;


var jugando = true;
setInterval("main()", velocidad);