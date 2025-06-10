import { IPlanungsItem } from '../types/IPlanungsItem';

export interface IService {
    readListItem(listId: string, itemId: number): Promise<IPlanungsItem>;
    saveListItem(listId: string, item: IPlanungsItem): Promise<boolean>;
    getEmptyItem(): IPlanungsItem;
}