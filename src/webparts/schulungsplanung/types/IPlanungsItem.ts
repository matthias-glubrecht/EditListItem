export interface IPlanungsItem {
    id: number;
    thema: string;
    start: Date;
    ende: Date;
    verpflegung: boolean;
    verpflegungAnzahl: number;
}