// tslint:disable:export-name
import {
    sp
} from '@pnp/sp';
import { IService } from './IService';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IPlanungsItem } from '../types/IPlanungsItem';
import { Mapper } from './Mapper';
import { ISpItem } from '../types/ISpItem';
import { IMapper } from './IMapper';

export class Service implements IService {
    private _mapper: IMapper;
    constructor(context: WebPartContext) {
        sp.setup(
            {
                spfxContext: context
            }
        );
        this._mapper = new Mapper();
    }

    public async saveListItem(listId: string, item: IPlanungsItem): Promise<boolean> {
        const spItem: ISpItem = this._mapper.PlanungToSp(item);
        if (spItem.Id && spItem.Id > 0) {
            // Update existing item}
            return sp.web.lists.getById(listId).items.getById(spItem.Id).update(spItem)
                .then((result) => {
                    console.log('Item updated successfully', result);
                    return true;
                })
                .catch((error) => {
                    console.error('Error updating item', error);
                    return false;
                });
        } else {
            // Create new item
            return sp.web.lists.getById(listId).items.add(spItem)
                .then((result) => {
                    console.log('Item created successfully', result);
                    return true;
                })
                .catch((error) => {
                    console.error('Error creating item', error);
                    return false;
                });
        }
    }

    public async readListItem(listId: string, itemId: number): Promise<IPlanungsItem> {
        // Read item
        const item: ISpItem = await sp.web.lists
            .getById(listId)
            .items
            .getById(itemId)
            .get<ISpItem>();
        if (item) {
            const planungsItem: IPlanungsItem = this._mapper.SpToPlanung(item);
            return planungsItem;
        } else {
            return undefined;
        }
    }

    public getEmptyItem(): IPlanungsItem {
        return {
            ende: undefined,
            start: undefined,
            id: undefined,
            thema: '',
            verpflegung: false,
            verpflegungAnzahl: 0
        };
    }
}