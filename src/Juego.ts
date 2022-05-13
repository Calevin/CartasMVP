import { Carta } from './entities/Carta';
import { Jugador } from './entities/Jugador';
import { ResultadoPartida } from './entities/ResultadoPartida';

export class Juego {

    mazo: Carta[];
    cartasAcumuladasPorEmpate: Carta[];
    jugador: Jugador;
    adversario: Jugador;
    ganador: Jugador;
    perdedor: Jugador;
    jugando: boolean = false;
    numeroCartasEnJuego: number;
    numeroTurno: number = 0;

    constructor(jugador: Jugador, adversario: Jugador, mazo?: Carta[]) {
        if(mazo != null){
            this.mazo = mazo;
            this.numeroCartasEnJuego = this.mazo.length;
        }
        
        this.jugador = jugador;
        this.adversario = adversario;
        this.cartasAcumuladasPorEmpate = [];
    }

    public setMazo(mazo: Carta[]){
        this.mazo = mazo;
        this.numeroCartasEnJuego = this.mazo.length;
        console.log(`Cartas en juego: ${this.numeroCartasEnJuego}`);
    }

    public mezclarMazo(): void {
        console.group('mezclarMazo');
        this.mazo = Carta.mezclarCartas(this.mazo);
        console.log('El mazo fue mezclado');
        console.log(`El mazo tiene ${this.mazo.length} cartas`);
        console.groupEnd();
    }

    public iniciarJuego(): void {
        this.repartirCartas();
        this.jugando = true;
    }

    public repartirCartas(): void {
        console.group('repartirCartas');
        const half = Math.ceil(this.mazo.length / 2);
        const firstHalf = this.mazo.slice(0, half);
        const secondHalf = this.mazo.slice(-half);

        console.log('El mazo fue partido');
        console.log(`Jugador recibira ${firstHalf.length} cartas`);
        this.jugador.mazo = firstHalf;
        console.log(`Adversario recibira ${secondHalf.length} cartas`);
        this.adversario.mazo = secondHalf;
        console.groupEnd();
    }

    public resolverJugada(): ResultadoPartida {
        let resultadoPartida: ResultadoPartida = new ResultadoPartida();
        console.group('resolverJugada');
        console.log('RESOLVER JUGADA');

        let mensaje = [];
        let cartaJugador: Carta = this.jugador.jugadas.pop();
        resultadoPartida.cartaJugador = cartaJugador;
        let cartaAdversario: Carta = this.adversario.jugadas.pop();
        resultadoPartida.cartaAdversario = cartaAdversario;
        //mensaje.push(` - cartaJugador: ${JSON.stringify(cartaJugador)} vs cartaAdversario: ${JSON.stringify(cartaAdversario)}`);
        
        if(cartaJugador.valor === cartaAdversario.valor) {
            mensaje.push(` - PARTIDA EMPATADA EN ${cartaJugador.valor} - ${cartaAdversario.valor}`);
            this.cartasAcumuladasPorEmpate.push(cartaJugador, cartaAdversario);
    
        } else if(cartaJugador.valor > cartaAdversario.valor){
            mensaje.push(' - PARTIDA GANADA POR EL JUGADOR');
            this.jugador.descarte.push(cartaJugador, cartaAdversario);

            if(this.cartasAcumuladasPorEmpate.length > 0) {
                mensaje.push(' - JUGADOR SE LLEVA EL POZO');
                this.jugador.descarte = this.jugador.descarte.concat(this.cartasAcumuladasPorEmpate);
                this.cartasAcumuladasPorEmpate = [];
            }
    
        } else {
            mensaje.push(' - PARTIDA GANADA POR EL ADVERSARIO');
            this.adversario.descarte.push(cartaJugador, cartaAdversario);

            if(this.cartasAcumuladasPorEmpate.length > 0) {
                mensaje.push(' - ADVERSARIO SE LLEVA EL POZO');
                this.adversario.descarte = this.adversario.descarte.concat(this.cartasAcumuladasPorEmpate);
                this.cartasAcumuladasPorEmpate = [];
            }
        }

        console.groupEnd();
        resultadoPartida.mensaje = mensaje;
        return resultadoPartida;
    }

    public refillManos(){
        console.group('refillManos');
        this.refillManoSiEsNecesario(this.jugador);
        this.refillManoSiEsNecesario(this.adversario);               
        console.groupEnd();
    }

    public refillManoSiEsNecesario(jugador: Jugador){
        let mazoLength: number = jugador.mazo.length;
        console.log(`${jugador.nombre} su mazo tiene ${mazoLength} y su mano tiene ${jugador.mano.length} `);
        
        for (let index = 0; index < 3 && index < mazoLength; index++) {
            console.log(`${jugador.nombre} toma ${index} carta`);
            jugador.recibirCarta(jugador.mazo.pop());
        }
        console.log(`${jugador.nombre} ahora su mazo tiene ${jugador.mazo.length} y su mano tiene ${jugador.mano.length} `);
    }    

    public comprobarEstado(): void {
        console.group('comprobarEstado');
        if(this.jugador.isPerdedor()) {
            console.log(`${this.jugador.nombre} PERDIO!`);

            this.ganador = this.adversario;
            this.perdedor = this.jugador;

            this.jugando = false;
        } else if(this.adversario.isPerdedor()) {
            console.log(`${this.adversario.nombre} PERDIO!`);
            this.ganador = this.jugador;
            this.perdedor = this.adversario;

            this.jugando = false;
        }
        console.groupEnd();
    }

    public refillMazosSiEsNecesario(){
        console.group('refillMazosSiEsNecesario');
        this.refillMazoSiEsNecesario(this.jugador);
        this.refillMazoSiEsNecesario(this.adversario);
        console.groupEnd();
    }

    private refillMazoSiEsNecesario(jugador: Jugador) {
        if(jugador.tieneMazoVacio()) {
            console.log(`${jugador.nombre} se quedo sin cartas, toma el descarte`);
            jugador.rellenarMazo();
        }
    }

    public validarEstado(){
        console.group('validarEstado');
        let numeroDeCartasJugador = this.jugador.getCantidadCartas();
        let numeroDeCartasAdversario = this.adversario.getCantidadCartas();

        if((numeroDeCartasJugador+numeroDeCartasAdversario)+this.cartasAcumuladasPorEmpate.length===this.numeroCartasEnJuego){
            console.log(`Turno: ${this.numeroTurno} termina OK`);
        } else {
            console.error(`Turno: ${this.numeroTurno} termina NO OK!!!!!!!!!!!!!!`);

            this.logearEstado();

            this.jugando = false
        }
        console.groupEnd();
    }

    public logearEstado(): void {
        console.group(`logearEstado, turno ${this.numeroTurno}`);
        console.log(`Jugador Mazo: ${this.jugador.mazo.length} -\nDescartes: ${this.jugador.descarte.length} -\nMano: ${this.jugador.mano.length} `);
        console.log(`Adversario Mazo: ${this.adversario.mazo.length} -\nDescartes: ${this.adversario.descarte.length} -\nMano: ${this.adversario.mano.length} `);

        console.log(`Cartas en la mesa (empates) ${this.cartasAcumuladasPorEmpate.length}`);
        console.groupEnd();
    }

    public reset(): void {
        console.log('Reseteando juego');
        this.jugador.reset();
        this.adversario.reset();
        this.cartasAcumuladasPorEmpate = [];
        this.numeroTurno = 0;
        this.jugando = false;
    }

    public incrementarNroTurno() {
        this.numeroTurno++;
    }


    public getNroTurno() {
        return this.numeroTurno;
    }
}