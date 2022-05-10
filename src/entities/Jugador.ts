import { Carta } from './Carta';

export class Jugador {
    nombre: string;
    mazo: Carta[];
    mano: Carta[];
    descarte: Carta[];

    constructor(nombre: string) {
        this.nombre = nombre;
        this.mano = [];
        this.descarte = [];
    }

    public recibirCarta(carta:Carta): void {
        this.mano.push(carta);
    }

    public isPerdedor() {
        return (this.mazo.length===0 && this.descarte.length===0);
    }

    public rellenarMazo() {
        console.group(`rellenarMazo (${this.nombre})`)
        console.log(`pre rellenar: en mazo ${this.mazo.length} cartas y en descarte ${this.descarte.length}`);
        
        this.mazo = Carta.mezclarCartas(this.descarte);
        this.descarte = [];

        console.log(`post rellenar: en mazo ${this.mazo.length} cartas y en descarte ${this.descarte.length}`);
        console.groupEnd();
    }

    public tieneMazoVacio(): boolean {
        return (this.mazo.length===0);
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