enum Palo {
    Espada = 'Espada',
    Basto = 'Basto',
    Copa = 'Copa',
    Oro = 'Oro'
}

export class Carta {
    id: number;
    palo: string;
    valor: number;

    constructor(id: number, palo: string, valor: number) {
        this.id = id;
        this.palo = palo;
        this.valor = valor;
    }

    public static mezclarCartas(cartas: Carta[]): Carta[] {
        return cartas.sort(() => Math.random() - 0.5);
    }

}