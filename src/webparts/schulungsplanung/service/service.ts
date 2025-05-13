import {
    Field,
    FolderAddResult,
    Item,
    List,
    ListItemFormUpdateValue,
    PrincipalInfo,
    PrincipalSource,
    PrincipalType,
    SiteUserProps,
    sp,
    Web
} from '@pnp/sp';
import { IService } from './IService';
import { WebPartContext } from '@microsoft/sp-webpart-base';

export class Service implements IService {
    constructor(context: WebPartContext) {
        sp.setup(
            {
                spfxContext: context
            }
        )
    }
    public async writeListItem(listId: string, itemId: number, item: any): Promise<any> {
        if (itemId && itemId > 0) {
            // Update existing item}
            sp.web.lists.getById(listId).items.getById(itemId).update(item)
                .then((result) => {
                    console.log('Item updated successfully', result);
                })
                .catch((error) => {
                    console.error('Error updating item', error);
                });

        } else {
            // Create new item
            sp.web.lists.getById(listId).items.add(item)
                .then((result) => {
                    console.log('Item created successfully', result);
                })
                .catch((error) => {
                    console.error('Error creating item', error);
                });
        }
    }

    public async readListItem(listId: string, itemId: number): Promise<any> {
        // Read item
        return sp.web.lists.getById(listId).items.getById(itemId);
    }
}