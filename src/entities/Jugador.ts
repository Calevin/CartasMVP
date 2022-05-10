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
        this.mazo = Carta.mezclarCartas(this.descarte);
        this.descarte = [];
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