import { IPlanungsItem } from '../types/IPlanungsItem';
import { ISpItem } from '../types/ISpItem';

export interface IMapper {
    SpToPlanung(spItem: ISpItem): IPlanungsItem;
    PlanungToSp(planungsItem: IPlanungsItem): ISpItem;
}