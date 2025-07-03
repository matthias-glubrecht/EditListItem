import { IPlanungsItem } from '../types/IPlanungsItem';
import { ISpItem } from '../types/ISpItem';
import { ISPUser } from '../types/ISPUser';
import { IMapper } from './IMapper';

export class Mapper implements IMapper {
    public SpToPlanung(spItem: ISpItem): IPlanungsItem {
        return {
            id: spItem.Id,
            leiter: spItem.Leiter.loginName,
            thema: spItem.Title,
            start: new Date(spItem.Beginn),
            ende: new Date(spItem.Ende),
            verpflegung: spItem.Verpflegung,
            verpflegungAnzahl: spItem.AnzahlEssen
        };
    }

    public PlanungToSp(planungsItem: IPlanungsItem): ISpItem {
        const { id, thema, leiter, start, ende, verpflegung, verpflegungAnzahl } = planungsItem;
        return {
            Id: id,
            Title: thema,
            Leiter: this.convertUser(leiter),
            Beginn: start ? start.toISOString() : '',
            Ende: ende ? ende.toISOString() : '',
            Verpflegung: verpflegung,
            AnzahlEssen: verpflegungAnzahl
        };
    }

    private convertUser(userString: string): ISPUser {
        if (!userString || userString.length === 0) {
            return null;
        } else {
            const parts = userString.split(';#');
            return {
                email: '',
                id: parseInt(parts[0], 10),
                loginName: parts[1],
                title: ''
            };
        }
    }
}
