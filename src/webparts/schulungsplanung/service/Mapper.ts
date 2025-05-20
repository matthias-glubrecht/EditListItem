import { IPlanungsItem } from '../types/IPlanungsItem';
import { ISpItem } from '../types/ISpItem';

export class Mapper {
    public static SpToPlanung(spItem: ISpItem): IPlanungsItem {
        return {
            id: spItem.Id,
            thema: spItem.Title,
            start: new Date(spItem.Beginn),
            ende: new Date(spItem.Ende),
            verpflegung: spItem.Verpflegung,
            verpflegungAnzahl: spItem.AnzahlEssen

        };
    }

    public static PlanungToSp(planungsItem: IPlanungsItem): ISpItem {
        return {
            Id: planungsItem.id,
            Title: planungsItem.thema,
            Beginn: planungsItem.start.toISOString(),
            Ende: planungsItem.ende.toISOString(),
            Verpflegung: planungsItem.verpflegung,
            AnzahlEssen: planungsItem.verpflegungAnzahl
        };
    }
}