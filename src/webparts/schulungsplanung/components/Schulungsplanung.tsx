// tslint:disable:max-line-length
import * as React from 'react';
import styles from './Schulungsplanung.module.scss';
import { ISchulungsplanungProps } from './ISchulungsplanungProps';
import { DefaultButton, Label, TextField, DayOfWeek } from 'office-ui-fabric-react';
import { IService } from '../service/IService';
import { Service } from '../service/service';
import { ISchulungsplanungState } from './ISchulungsplanungState';
import { IPlanungsItem } from '../types/IPlanungsItem';
import { DateConvention, DateTimePicker } from '@pnp/spfx-controls-react';

export default class Schulungsplanung extends React.Component<ISchulungsplanungProps, ISchulungsplanungState> {
  private _service: IService;

  constructor(props: ISchulungsplanungProps) {
    super(props);

    this._service = new Service(this.props.context);

    this.state = {
      title: 'Initialisierung',
      isError: false,
      errorMessage: '',
      item: undefined,
      isLoading: true
    };
  }

  public async componentDidMount(): Promise<void> {
    await this.loadDataAndSetState();
  }

  public async loadDataAndSetState(): Promise<void> {
    if (this.props.listId) {
      const queryParams: URLSearchParams = new URLSearchParams(window.location.search);
      const itemIdParm: string | null = queryParams.get('itemId');
      if (itemIdParm) {
        const itemId: number = parseInt(itemIdParm, 10);
        const item: IPlanungsItem = await this._service.readListItem(this.props.listId, itemId);
        this.setState({
          title: 'Eintrag bearbeiten',
          isLoading: false,
          isError: false,
          item: item
        });
      } else {
        this.setState({
          title: 'Neuen Eintrag erstellen',
          isLoading: false,
          isError: false,
          item: this._service.getEmptyItem()
        });
      }
    }
  }

  public render(): React.ReactElement<ISchulungsplanungProps> {
    const { item, title, isError, errorMessage } = this.state;
    return (
      <div className={styles.schulungsplanung} >
        <h1>{title}</h1>
        {this.props.listId &&
          <div>
            {item &&
              <div className={styles.container}>
                <div className={styles.row}>
                  <div className={styles.column}>
                    {isError &&
                      <span className={styles.error}>{errorMessage}</span>
                    }
                  </div>
                </div>
                {item.id &&
                  <div className={styles.row}>
                    <div className={styles.column}>
                      <Label>Id</Label>
                      <span>{item.id}</span>
                    </div>
                  </div>
                }
                <div className={styles.row}>
                  <div className={styles.column}>
                    <Label>Thema</Label>
                    <TextField value={item.thema}
                      onChange={this.textChanged}
                    />
                  </div>
                </div>
                <div className={styles.row}>
                  <div className={styles.column}>
                    <Label>Beginn</Label>
                    <DateTimePicker
                      value={item.start as Date}
                      dateConvention={DateConvention.DateTime}
                      firstDayOfWeek={DayOfWeek.Monday}
                      onChange={(date: Date) => this.dateChanged(date, 'start')}
                    />
                  </div>
                </div>
                <div className={styles.row}>
                  <div className={styles.column}>
                    <Label>Ende</Label>
                    <DateTimePicker
                      value={item.ende as Date}
                      dateConvention={DateConvention.DateTime}
                      firstDayOfWeek={DayOfWeek.Monday}
                      onChange={(date: Date) => this.dateChanged(date, 'ende')}
                    />
                  </div>
                </div>
                <div className={styles.row}>
                  <div className={styles.column}>
                    <div className={styles.row}>
                      <DefaultButton disabled={this.state.item === undefined} className={styles.button} text='Speichern' onClick={this.saveItem} />
                    </div>
                  </div>
                </div >
              </div>
            }
          </div>
        }
        {!this.props.listId &&
          <div>Bitte wählen Sie in den Einstellungen des Web Parts eine Liste aus.</div>
        }
      </div>
    );
  }
  private textChanged = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void => {
    this.setState(prevState => ({
      item: {
        ...prevState.item,
        thema: newValue || ''
      }
    }));
  }

  private dateChanged = (date: Date | undefined, property: string): void => {
    this.setState(prevState => ({
      item: {
        ...prevState.item,
        [property]: date
      }
    }));
  }

  private saveItem = async (): Promise<void> => {
    if (await this._service.writeListItem(this.props.listId, this.state.item)) {
      this.setState({
        isError: false
      });
    } else {
      this.setState({
        isError: true,
        errorMessage: 'Fehler beim Speichern.'
      });
    }
  }
}
