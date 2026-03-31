import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName
} from '@microsoft/sp-application-base';

import * as strings from 'AppCustomizerApplicationCustomizerStrings';
import styles from './ACDemo.module.scss';
const LOG_SOURCE: string = 'AppCustomizerApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IAppCustomizerApplicationCustomizerProperties {
  // This is an example; replace with your own property
  Top :string ;
  Bottom : string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class AppCustomizerApplicationCustomizer
  extends BaseApplicationCustomizer<IAppCustomizerApplicationCustomizerProperties> {


    private _topPlaceholder  : PlaceholderContent | null;
    private _bottomPlaceholder : PlaceholderContent | null;
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

    this.context.placeholderProvider.changedEvent.add(this ,this._renderPlaceholders);

    this._renderPlaceholders();

    return Promise.resolve();
  }


  private _renderPlaceholders() : void {
    
     console.log("Available placeholders are :",
     this.context.placeholderProvider.placeholderNames.map( placeholdername =>{
          console.log(PlaceholderName);
          console.log(PlaceholderName[placeholdername]);
     }
     ));
      
     if(!this._topPlaceholder){
      this._topPlaceholder  = this.context.placeholderProvider.tryCreateContent(
        PlaceholderName.Top,
        {onDispose : this._onDispose}
      ) as PlaceholderContent;
     }

     if(!this._topPlaceholder){
      console.error("The placeholder  Top was not found ");
      return;
     }

     if(this.properties){
      let topString : string = this.properties.Top;
      if(!topString){
        topString = '(Top property was not defined....)';
      }


      if(this._topPlaceholder.domElement){
        this._topPlaceholder.domElement.innerHTML = `
        <div class = "${styles.acdemoapp}
        <div class="${styles.topPlaceholder}">
        <i> ${escape(topString)}</i>
        </div>
        </div>` 
      }
     }


     
     if(!this._bottomPlaceholder){
      this._bottomPlaceholder  = this.context.placeholderProvider.tryCreateContent(
        PlaceholderName.Bottom,
        {onDispose : this._onDispose}
      ) as PlaceholderContent;
     }

     if(!this._bottomPlaceholder){
      console.error("The placeholder Bottom was not found ");
      return;
     }

     if(this.properties){
      let bottomString : string = this.properties.Bottom;
      if(!bottomString){
        bottomString = '(Bottom property was not defined....)';
      }


      if(this._bottomPlaceholder.domElement){
        this._bottomPlaceholder.domElement.innerHTML = `
        <div class = "${styles.acdemoapp}
        <div class="${styles.bottomPlaceholder}">
        <i> ${escape(bottomString)}</i>
        </div>
        </div>` 
      }
     }
  }


  private _onDispose ( ) : void { 
    console.log("Disposed custom top and bottom placehodlers");
  }


}
