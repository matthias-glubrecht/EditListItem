export interface IService {
    readListItem(listId: string, itemId: number): Promise<any>;
    writeListItem(listId: string, itemId: number, item: any): Promise<any>;
}