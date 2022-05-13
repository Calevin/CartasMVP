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

    //DIVS
    readonly id_div_partida: string = "info_partida";
    readonly id_div_ganador: string = "ganador";
    div_partida: any;
    div_ganador: any;

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

        //DIVS
        this.div_partida = document.getElementById(this.id_div_partida);
        this.div_ganador = document.getElementById(this.id_div_ganador);

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

        this.desactivarOptionsCarta();

        this.desactivarOptionsBaraja();

        console.groupEnd();
      }

      private siguienteTurno() {
        console.log(`Comienza el turno numero ${ this.juego.getNroTurno() }`);
        this.juego.incrementarNroTurno();
    
        this.juego.logearEstado();
    
        // SI LOS JUGADORES NO TIENEN CARTAS SE RELLENAN LOS MAZOS
        this.juego.refillMazosSiEsNecesario();
    
        //CADA JUGADOR RECIBE UNA CARTA DEL MAZO
        this.juego.refillManos();

        this.renderOptionCarta();

        this.desactivarBotonSiguienteTurno();
        this.activarOptionsCarta();
        this.activarBotonJugarCarta();
      }

      private jugarCarta() {
        console.group('jugarCarta ################################################');
        //JUGADOR JUEGA CARTA
        this.jugador.jugarCarta();
        this.adversarioSeleccionarAlAzar();
        this.adversario.jugarCarta();

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
            this.activarOptionsBaraja();
        }

        this.activarBotonSiguienteTurno();
        this.desactivarBotonJugarCarta();
        this.renderOptionCartaManoVacia();
        this.desactivarOptionsCarta();
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

      private adversarioSeleccionarAlAzar(){
        let cartaAdverario: Carta;
        if(this.adversario.mano.length > 0){
          cartaAdverario = this.adversario.mano[Math.floor(Math.random()*this.adversario.mano.length)];
          console.log(`Adversario eligio: (${cartaAdverario.id}) ${cartaAdverario.valor} de ${cartaAdverario.palo}`);          
        } else  {
          console.log(`Adversario solo tiene una carta: (${cartaAdverario.id}) ${cartaAdverario.valor} de ${cartaAdverario.palo}`);
          cartaAdverario = this.adversario.mano[0];
        }

        this.adversario.seleccionarCarta(cartaAdverario.id);
      }        
      
      
      seleccionarCarta(e:any) {
        let idCartaSeleccionada: number = e.target.value;

        this.jugador.seleccionarCarta(idCartaSeleccionada);
      }     

      public isComenzado(): boolean {
          return this.juego.jugando;
      }

      private limpiarInfoGanador(){
        this.div_ganador.innerHTML = `<h1> Esperando resultado...`;
      }
      private renderOptionCarta(){
        let innerHTML = `<select id="select_carta">`;

        this.juego.jugador.mano.forEach((cartaJugador: Carta) => {
          innerHTML += `<option value="${cartaJugador.id}" >${cartaJugador.palo} ${cartaJugador.valor}</option>`;
        });

        innerHTML += `</select>`;
        this.select_carta.innerHTML = innerHTML;        
      } 

      private renderOptionCartaManoVacia(){
        let innerHTML = `<select id="select_carta">
                            <option value="" selected> Esperando cartas...</option>
                         </select>`;
        this.select_carta.innerHTML = innerHTML;
      }

      private renderInfoTurno(){
        let innerHTML = `<h1> Turno: ${ this.juego.getNroTurno() } <br/>
                        <h1> Cartas del jugador: ${ this.juego.jugador.getCantidadCartas() }
                        <h1> Cartas del adversario: ${ this.juego.adversario.getCantidadCartas() }`;
        this.div_ganador.innerHTML = innerHTML;
      }

      private renderInfoResultado(){
        let innerHTML = ``;
        if(this.juego.ganador && this.juego.perdedor){
            innerHTML += 
                `<h1> Ganador: ${this.juego.ganador.nombre}
                <br/>
                <h1> Perdedor: ${this.juego.perdedor.nombre}`;
        }

        this.div_ganador.innerHTML = innerHTML;
      }

      private renderInfoResultadoPartida(mensajes: string[]){
        let innerHTML = ``;
        mensajes.forEach( (msj) =>{
          innerHTML += `<br/><h1> ${msj}`;
        });

        this.div_partida.innerHTML = innerHTML;
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

      private activarOptionsBaraja(){
        (this.select_baraja as HTMLOptionElement).disabled = false;
      }

      private desactivarOptionsBaraja(){
        (this.select_baraja as HTMLOptionElement).disabled = true;
      }


      private activarOptionsCarta(){
        (this.select_carta as HTMLOptionElement).disabled = false;
      }

      private desactivarOptionsCarta(){
        (this.select_carta as HTMLOptionElement).disabled = true;
      }      
}