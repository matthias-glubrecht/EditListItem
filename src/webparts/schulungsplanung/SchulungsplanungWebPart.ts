import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration
} from '@microsoft/sp-webpart-base';

import * as strings from 'SchulungsplanungWebPartStrings';
import Schulungsplanung from './components/Schulungsplanung';
import { ISchulungsplanungProps } from './components/ISchulungsplanungProps';
import { PropertyFieldListPicker } from '@pnp/spfx-property-controls';

export interface ISchulungsplanungWebPartProps {
  listId: string;
}

export default class SchulungsplanungWebPart extends BaseClientSideWebPart<ISchulungsplanungWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ISchulungsplanungProps > = React.createElement(
      Schulungsplanung,
      {
        context: this.context,
        listId: this.properties.listId
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  // @ts-ignore
  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyFieldListPicker('listId', {
                  label: strings.ListFieldLabel,
                  selectedList: this.properties.listId,
                  includeHidden: false,
                  context: this.context,
                  properties: this.properties,
                  baseTemplate: 100,
                  deferredValidationTime: 500,
                  onPropertyChange: (propertyPath, oldValue, newValue) => {
                    this.render();
                  },
                  key: 'listId'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
