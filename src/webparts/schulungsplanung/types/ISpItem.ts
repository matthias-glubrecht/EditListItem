import { ISPUser } from "./ISPUser";

export interface ISpItem {
    Id: number;
    Title: string;
    Leiter: ISPUser;
    Beginn: string;
    Ende: string;
    Verpflegung: boolean;
    AnzahlEssen: number;
}