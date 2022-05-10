import { Carta } from "../src/entities/Carta";
import { Juego } from "../src/Juego";
import { Jugador } from "../src/entities/Jugador";

const dataCartas = require('../resources/cartas.json');
const dataCartasMinimas = require('../resources/cartasMinimas.json');

export class MainController {
    
    cartas: Carta[] = [];
    jugador: Jugador;
    adversario: Jugador;
    juego: Juego;
    barajaSeleccionada: string;

    // BOTONES
    readonly id_btn_comenzar: string = "btn_comenzar";
    readonly id_btn_siguiente_turno: string = "btn_siguiente_turno";
    readonly id_btn_jugar_carta: string = "btn_jugar_carta";
    btn_siguiente_turno: any;
    btn_comenzar: any;
    btn_jugar_carta: any;

    //OPTIONS
    readonly id_select_baraja: string = "select_baraja";
    select_baraja: any;
    readonly id_select_carta: string = "select_carta";
    select_carta: any;

    constructor() {
        console.group('Creando MainController');

        this.cartas = dataCartas;

        this.jugador = new Jugador('Seba');
        this.adversario = new Jugador('IA');

        this.juego = new Juego(this.jugador, this.adversario);

        //BOTONES
        this.btn_comenzar = document.getElementById(this.id_btn_comenzar);
        this.btn_comenzar.addEventListener("click", (e:Event) => this.comenzar());        

        this.btn_siguiente_turno = document.getElementById(this.id_btn_siguiente_turno);
        this.btn_siguiente_turno.addEventListener("click", (e:Event) => this.siguienteTurno());
        this.desactivarBotonSiguienteTurno();

        this.btn_jugar_carta = document.getElementById(this.id_btn_jugar_carta);
        this.btn_jugar_carta.addEventListener("click", (e:Event) => this.jugarCarta());
        this.desactivarBotonJugarCarta();

        //OPTIONS
        this.select_baraja = document.getElementById(this.id_select_baraja);
        this.select_baraja.addEventListener("change", (e:Event) => this.seleccionarBaraja(e));

        this.select_carta = document.getElementById(this.id_select_carta);
        this.select_carta.addEventListener("change", (e:Event) => this.seleccionarCarta(e));

        console.groupEnd();
      }

      private comenzar() {
        console.group('INICIANDO JUEGO');

        this.juego.setMazo(this.cartas);

        this.juego.mezclarMazo();

        this.juego.iniciarJuego();

        this.activarBotonSiguienteTurno();

        this.activarSelectCarta();

        this.limpiarInfoGanador();

        this.renderOptionCartaManoVacia();
        console.groupEnd();
      }

      private siguienteTurno() {
        console.log(`Comienza el turno numero ${ this.juego.getNroTurno() }`);
        this.juego.incrementarNroTurno();
    
        this.juego.logearEstado();
    
        // SI LOS JUGADORES NO TIENEN CARTAS SE RELLENAN LOS MAZOS
        this.juego.refillMazosSiEsNecesario();
    
        //CADA JUGADOR RECIBE UNA CARTA DEL MAZO
        this.jugador.recibirCarta(this.jugador.mazo.pop());
        this.adversario.recibirCarta(this.adversario.mazo.pop());

        this.renderOptionCarta();

        this.desactivarBotonSiguienteTurno();
        this.activarBotonJugarCarta();
      }

      private jugarCarta() {
        console.group('jugarCarta ################################################');
        //SE RESUELVE LA JUGADA        
        let mensajeResultado: string[] = this.juego.resolverJugada();
        mensajeResultado.forEach( (e) => {console.log(e)});

        this.renderInfoResultadoPartida(mensajeResultado);
    
        //SE COMPRUEBA SI HAY GANADOR
        this.juego.comprobarEstado();
    
        //SE VALIDA EL ESTADO GENERAL DEL JUEGO
        this.juego.validarEstado();

        this.renderInfoTurno();

        //EN CASO DE HABER UN GANADOR EL JUEGO TERMINA
        if(!this.juego.jugando) {       
            this.renderInfoResultado();
            this.juego.reset();
            this.desactivarBotonSiguienteTurno();
            
        }

        this.activarBotonSiguienteTurno();
        this.desactivarBotonJugarCarta();
        this.renderOptionCartaManoVacia();
        console.log('################################################');
        console.groupEnd();
      }

      seleccionarBaraja(e:any) {
        let seleccionado: string = e.target.value;
        if(seleccionado==='cartas') {
          console.log(`seteado cartas`);
          this.cartas = dataCartas;
        } else {
          console.log(`seteado cartasMinimas`);
          this.cartas = dataCartasMinimas;
        }

      }

      seleccionarCarta(e:any) {
        let seleccionado: string = e.target.value;

        console.log(`CARTA SELECCIONADA: ${seleccionado}`);
      }      

      public isComenzado(): boolean {
          return this.juego.jugando;
      }

      private limpiarInfoGanador(){
        let div_ganador = document.getElementById("ganador");
        div_ganador.innerHTML = `<h1> Esperando resultado...`;
      }

      private renderOptionCarta(){
        let div_ganador = document.getElementById("select_carta");
        let cartaJugador: Carta = this.juego.jugador.mano[0];

        let innerHTML = `<select id="select_carta">
                            <option value="${cartaJugador.palo}-${cartaJugador.id}" selected>${cartaJugador.palo} ${cartaJugador.valor}</option>
                         </select>`;
        div_ganador.innerHTML = innerHTML;        
      }

      private renderOptionCartaManoVacia(){
        let div_ganador = document.getElementById("select_carta");

        let innerHTML = `<select id="select_carta">
                            <option value="" selected> Esperando cartas...</option>
                         </select>`;
        div_ganador.innerHTML = innerHTML;
      }

      private renderInfoTurno(){
        let div_ganador = document.getElementById("info_turno");
        let innerHTML = `<h1> Turno: ${ this.juego.getNroTurno() } <br/>
                        <h1> Cartas del jugador: ${ this.juego.jugador.getCantidadCartas() }
                        <h1> Cartas del adversario: ${ this.juego.adversario.getCantidadCartas() }`;
        div_ganador.innerHTML = innerHTML;
      }

      private renderInfoResultado(){
        let div_ganador = document.getElementById("ganador");
        let innerHTML = ``;
        if(this.juego.ganador && this.juego.perdedor){
            innerHTML += 
                `<h1> Ganador: ${this.juego.ganador.nombre}
                <br/>
                <h1> Perdedor: ${this.juego.perdedor.nombre}`;
        }

        div_ganador.innerHTML = innerHTML;
      }

      private renderInfoResultadoPartida(mensajes: string[]){
        let div_partida = document.getElementById("info_partida");
        let innerHTML = ``;
        mensajes.forEach( (msj) =>{
          innerHTML += `<br/><h1> ${msj}`;
        });

        div_partida.innerHTML = innerHTML;
      }

      private activarBotonSiguienteTurno(){
        (this.btn_siguiente_turno as HTMLButtonElement).disabled = false;
      }

      private desactivarBotonSiguienteTurno(){
        (this.btn_siguiente_turno as HTMLButtonElement).disabled = true;
      }

      private activarSelectCarta(){
        (this.select_carta as HTMLOptionElement).hidden = false;
      }

      private activarBotonJugarCarta(){
        (this.btn_jugar_carta as HTMLButtonElement).disabled = false;
      }
      
      private desactivarBotonJugarCarta(){
        (this.btn_jugar_carta as HTMLButtonElement).disabled = true;
      }     
}