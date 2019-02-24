//Variables globales
var velocidad = 80;
var tamano = 10;

/**
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

class Cola extends Objeto {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.siguiente = null;
    }
    dibujar(ctx) {
        if (this.siguiente != null) {
            this.siguiente.dibujar(ctx);
        }
        ctx.fillStyle = "#0000FF";
        ctx.fillRect(this.x, this.y, this.tamano, this.tamano);
    }
    setPos(x, y) {
        if (this.siguiente != null) {
            this.siguiente.setPos(this.x, this.y);
        }
        this.x = x;
        this.y = y;
    }
    meter() {
        if (this.siguiente == null) {
            this.siguiente = new Cola(this.x, this.y);
        } else {
            this.siguiente.meter();
        }
    }
    verSiguiente() {
        return this.siguiente;
    }
}

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

//Objetos del juego
var gestor = new Juego();
var cabeza = new Cola(20, 20);
var comida = new Comida();
var ejex = true;
var ejey = true;
var xdir = 0;
var ydir = 0;

function movimiento() {
    var nx = cabeza.x + xdir;
    var ny = cabeza.y + ydir;
    cabeza.setPos(nx, ny);
}
function control(event) {
    var cod = event.keyCode;
    if(cod == 13){
        jugando = true;
    }
    if (ejex) {
        if (cod == 38) {
            ydir = -tamano;
            xdir = 0;
            ejex = false;
            ejey = true;
        }
        if (cod == 40) {
            ydir = tamano;
            xdir = 0;
            ejex = false;
            ejey = true;
        }
    }
    if (ejey) {
        if (cod == 37) {
            ydir = 0;
            xdir = -tamano;
            ejey = false;
            ejex = true;
        }
        if (cod == 39) {
            ydir = 0;
            xdir = tamano;
            ejey = false;
            ejex = true;
        }
    }
}

function findeJuego() {
    xdir = 0;
    ydir = 0;
    ejex = true;
    ejey = true;
        
    cabeza = new Cola(20, 20);
    comida = new Comida();
    //alert("Perdiste " + "Puntaje: " + gestor.getPuntaje());
    
    gestor.reiniciarPuntaje();
}
function choquepared() {
    if (cabeza.x < 0 || cabeza.x > 590 || cabeza.y < 0 || cabeza.y > 590) {
        jugando = false;
        findeJuego();
        
    }
}
function choquecuerpo() {
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
            findeJuego();
        } else {
            temp = temp.verSiguiente();
        }
    }
}

function dibujar() {
    var canvas = document.getElementById("canvas");
    var score = document.getElementById("puntaje");
    var ctx = canvas.getContext("2d");
    var ctxpt = score.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctxpt.clearRect(0, 0, score.width, score.height);
    ctxpt.font = "30px Arial";
    ctx.font = "30px Arial";
    if(!jugando) ctx.fillText("perdiste, oprimer enter", 10, 50);
    ctxpt.fillText(gestor.getPuntaje(), 10, 50);
    //aquí abajo va todo el dibujo
    cabeza.dibujar(ctx);
    comida.dibujar(ctx, "green");
}
function main() {
    if(jugando){
        choquecuerpo();
        choquepared();
        dibujar();
        movimiento();
        if (cabeza.choque(comida)) {
            gestor.aumentar();
            comida.colocar();
            cabeza.meter();
        }
    }
}
var jugando=true;
setInterval("main()", velocidad);