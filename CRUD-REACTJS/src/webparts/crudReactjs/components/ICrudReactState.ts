import { ISoftwareListItem } from "./ISoftwareListItem";


export interface ICrudReactState {
    status : string;
    SoftwareListItems  : ISoftwareListItem[];
    SoftwareListItem : ISoftwareListItem;

}
