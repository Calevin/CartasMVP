import { Carta } from './entities/Carta';
import { Jugador } from './entities/Jugador';

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
        this.mazo = Carta.mezclarCartas(this.mazo);
        console.log('El mazo fue mezclado');
        console.log(`El mazo tiene ${this.mazo.length} cartas`);
    }

    public iniciarJuego(): void {
        this.repartirCartas();
        this.jugando = true;
    }

    public repartirCartas(): void {
        const half = Math.ceil(this.mazo.length / 2);
        const firstHalf = this.mazo.slice(0, half);
        const secondHalf = this.mazo.slice(-half);

        console.log('El mazo fue partido');
        console.log(`Jugador recibira ${firstHalf.length} cartas`);
        this.jugador.mazo = firstHalf;
        console.log(`Adversario recibira ${secondHalf.length} cartas`);
        this.adversario.mazo = secondHalf;
    }

    public resolverJugada(): string[] {
        console.log('RESOLVER JUGADA');

        let mensaje = [];
        let cartaJugador: Carta = this.jugador.mano.pop();
        let cartaAdversario: Carta = this.adversario.mano.pop();
        mensaje.push(` - cartaJugador: ${JSON.stringify(cartaJugador)} vs cartaAdversario: ${JSON.stringify(cartaAdversario)}`);
        
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

        return mensaje;
    }

    public comprobarEstado(): void {

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
    }

    public refillMazosSiEsNecesario(){
        this.refillMazoSiEsNecesario(this.jugador);
        this.refillMazoSiEsNecesario(this.adversario);
    }

    private refillMazoSiEsNecesario(jugador: Jugador) {
        if(jugador.tieneMazoVacio()) {
            console.log(`${jugador.nombre} se quedo sin cartas, toma el descarte`);
            jugador.rellenarMazo();
        }
    }

    public validarEstado(){
        let numeroDeCartasJugador = this.jugador.getCantidadCartas();
        let numeroDeCartasAdversario = this.adversario.getCantidadCartas();

        if((numeroDeCartasJugador+numeroDeCartasAdversario)+this.cartasAcumuladasPorEmpate.length===this.numeroCartasEnJuego){
                console.log(`Turno: ${this.numeroTurno} termina OK`);
            } else {
                console.error(`Turno: ${this.numeroTurno} termina NO OK!!!!!!!!!!!!!!`);

                this.logearEstado();

                this.jugando = false
            }
    }

    public logearEstado(): void {
        console.log(`Mazo del jugador ${this.jugador.mazo.length}`);
        console.log(`Mazo del adversario ${this.adversario.mazo.length}`);
        console.log(`Mano del jugador ${this.jugador.mano.length}`);
        console.log(`Mano del adversario ${this.adversario.mano.length}`);
        console.log(`Descartes del jugador ${this.jugador.descarte.length}`);
        console.log(`Descartes del Adversario ${this.adversario.descarte.length}`);
        console.log(`Cartas en la mesa (empates) ${this.cartasAcumuladasPorEmpate.length}`);
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