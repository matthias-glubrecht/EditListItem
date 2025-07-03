export interface IPlanungsItem {
    id: number;
    thema: string;
    leiter: string;
    start: Date;
    ende: Date;
    verpflegung: boolean;
    verpflegungAnzahl: number;
}