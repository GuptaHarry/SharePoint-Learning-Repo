import { Log } from '@microsoft/sp-core-library';
import {
  BaseListViewCommandSet,
  RowAccessor,
  type Command,
  type IListViewCommandSetExecuteEventParameters,
  type ListViewStateChangedEventArgs
} from '@microsoft/sp-listview-extensibility';
import { Dialog } from '@microsoft/sp-dialog';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */

import * as pnp from 'sp-pnp-js';

export interface IListViewCustomizeCommandSetProperties {
  // This is an example; replace with your own properties
  sampleTextOne: string;
  sampleTextTwo: string;
}

export interface rowsType {
  
}
const LOG_SOURCE: string = 'ListViewCustomizeCommandSet';

export default class ListViewCustomizeCommandSet extends BaseListViewCommandSet<IListViewCustomizeCommandSetProperties> {

  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, 'Initialized ListViewCustomizeCommandSet');

    // initial state of the command's visibility
    const compareOneCommand: Command = this.tryGetCommand('COMMAND_1');
    compareOneCommand.visible = false;

    this.context.listView.listViewStateChangedEvent.add(this, this._onListViewStateChanged);

    return Promise.resolve();
  }

  public onExecute(event: IListViewCommandSetExecuteEventParameters): void {
    switch (event.itemId) {
      case 'COMMAND_1':
        Dialog.alert(`${this.properties.sampleTextOne}`).catch(() => {
          /* handle error */
        });
        break;
      case 'COMMAND_2':
        Dialog.alert(`${this.properties.sampleTextTwo}`).catch(() => {
          /* handle error */
        });
        break;

        case 'COMMAND_3' : 
        Dialog.prompt("Project Status Remarks")
        .then( (value: string)=>{
          this.UpdateRemarks(event.selectedRows,value)
          
        }).catch((err:Error)=>{
          console.log(err);
        })
        break;
      default:
        throw new Error('Unknown command');
    }
  }
 

  private UpdateRemarks( items : readonly RowAccessor[]  , value : string) : void{

    const batch = pnp.sp.createBatch();

    items.forEach ( (item :  RowAccessor ) =>{
      pnp.sp.web.lists.getByTitle("SoftwareCatalog").items.getById(item.getValueByName("ID")).inBatch(batch).update({Remarks : value}).
      then( res =>{
         console.log();
      }).catch( (err :Error)=>{
        console.log(err);
      });

    });

    batch.execute().then( res=>{
      location.reload();
    }).catch((err:Error)=>{
      console.log(err);
    })
    
  }

  private _onListViewStateChanged = (args: ListViewStateChangedEventArgs): void => {
    Log.info(LOG_SOURCE, 'List view state changed');

    const compareOneCommand: Command = this.tryGetCommand('COMMAND_1');
    if (compareOneCommand) {
      // This command should be hidden unless exactly one row is selected.
      compareOneCommand.visible = this.context.listView.selectedRows?.length === 1;
    }

       const compareTwoCommand: Command = this.tryGetCommand('COMMAND_2');
    if (compareTwoCommand) {
      // This command should be hidden unless exactly one row is selected.
      compareTwoCommand.visible = this.context.listView.selectedRows?.length === 2;
    }

    const compareThreeCommand: Command = this.tryGetCommand('COMMAND_3');
    if (compareThreeCommand) {
      // This command should be hidden unless exactly one row is selected.
      const length = this.context.listView.selectedRows?.length ;
      if(length)
      compareThreeCommand.visible = length >1;
    }

    const compareFourCommand: Command = this.tryGetCommand('COMMAND_4');
    if (compareFourCommand) {
      // This command should be hidden unless exactly one row is selected.
      const length = this.context.listView.selectedRows?.length;
      if(length)
      compareFourCommand.visible =  length> 2;
    }

    // TODO: Add your logic here

    // You should call this.raiseOnChage() to update the command bar
    this.raiseOnChange();
  }
}
