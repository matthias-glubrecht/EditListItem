import * as React from 'react';
import styles from './Schulungsplanung.module.scss';
import { ISchulungsplanungProps } from './ISchulungsplanungProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { DefaultButton } from 'office-ui-fabric-react';

export default class Schulungsplanung extends React.Component<ISchulungsplanungProps, {}> {

  private saveItem = (): void => {
    // TODO: implement saving logic (e.g. call an API or update state)
    console.log('Save button clicked');
  };

  public render(): React.ReactElement<ISchulungsplanungProps> {
    return (
      <div className={styles.schulungsplanung} >
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.column}>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.column}>
              <div className={styles.row}>
                <DefaultButton text='Speichern' onClick={this.saveItem} />
              </div>
            </div>
          </div >
          <DefaultButton text='Speichern' onClick={this.saveItem} />
        </div>
      </div>
    );
  }
}
