import { Carta } from './Carta';

export class Jugador {
    nombre: string;
    mazo: Carta[];
    mano: Carta[];
    jugadas: Carta[];
    descarte: Carta[];
    cartaSeleccionada: Carta;

    constructor(nombre: string) {
        this.nombre = nombre;
        this.mano = [];
        this.jugadas = [];
        this.descarte = [];
    }

    public recibirCarta(carta:Carta): void {
        this.mano.push(carta);
    }

    public isPerdedor() {
        return (this.mazo.length===0 && this.descarte.length===0);
    }

    public seleccionarCarta(idCartaSeleccionada: number){
        console.group(`seleccionarCarta (${this.nombre})`);
        this.cartaSeleccionada = this.mano.find((c: Carta) => {
            return c.id==idCartaSeleccionada;
        });
        console.log(`${this.nombre} selecciona la carta: ${this.cartaSeleccionada.palo}-${this.cartaSeleccionada.valor}`);
        console.groupEnd();
    }

    public jugarCarta() {
        console.group(`JugarCarta (${this.nombre})`);
        console.log(`${this.nombre} tiene en la mano ${this.mano.length} cartas`);
        console.log(`${this.nombre} jugo la carta: (${this.cartaSeleccionada.id}) ${this.cartaSeleccionada.valor} de ${this.cartaSeleccionada.palo}`);
        if(this.mano.length > 1) {
            console.log(`${this.nombre} va a descartar ${this.mano.length-1} cartas no jugadas`); 
            let cartasDescartadas = this.mano.filter((c: Carta) => c.id!=this.cartaSeleccionada.id); 
            this.descarte = this.descarte.concat(cartasDescartadas);
            console.log(`${this.nombre} ahora tiene ${this.descarte.length} en descarte`);
        }

        console.groupEnd();
        this.jugadas.push(this.cartaSeleccionada);
        this.mano = [];
    }

    public rellenarMazo() {
        console.group(`rellenarMazo (${this.nombre})`)
        console.log(`pre rellenar: en mazo ${this.mazo.length} cartas y en descarte ${this.descarte.length}`);
        
        this.mazo = Carta.mezclarCartas(this.descarte.concat(this.mazo));
        this.descarte = [];

        console.log(`post rellenar: en mazo ${this.mazo.length} cartas y en descarte ${this.descarte.length}`);
        console.groupEnd();
    }
    
        public tieneMazoVacio(): boolean {
        return (this.mazo.length < 3);
    }        

    public getCantidadCartas(): number {
        return this.mano.length + this.mazo.length + this.descarte.length;
    }

    public reset(): void {
        this.mazo = [];
        this.mazo = [];
        this.descarte = [];
    }
}