import { IPlanungsItem } from '../types/IPlanungsItem';
import { ISpItem } from '../types/ISpItem';
import { IMapper } from './IMapper';

export class Mapper implements IMapper {
    public SpToPlanung(spItem: ISpItem): IPlanungsItem {
        return {
            id: spItem.Id,
            thema: spItem.Title,
            start: new Date(spItem.Beginn),
            ende: new Date(spItem.Ende),
            verpflegung: spItem.Verpflegung,
            verpflegungAnzahl: spItem.AnzahlEssen

        };
    }

    public PlanungToSp(planungsItem: IPlanungsItem): ISpItem {
        const {id, thema, start, ende, verpflegung, verpflegungAnzahl} = planungsItem;
        return {
            Id: id,
            Title: thema,
            Beginn: start ? start.toISOString() : '',
            Ende: ende ? ende.toISOString() : '',
            Verpflegung: verpflegung,
            AnzahlEssen: verpflegungAnzahl
        };
    }
}