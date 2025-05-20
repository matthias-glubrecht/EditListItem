import { IPlanungsItem } from '../types/IPlanungsItem';

export interface ISchulungsplanungState {
    title: string;
    item: IPlanungsItem;
    isLoading: boolean;
    isError: boolean;
    errorMessage: string;
}