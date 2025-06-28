// tslint:disable:max-line-length
import * as React from 'react';
import styles from './Schulungsplanung.module.scss';
import { ISchulungsplanungProps } from './ISchulungsplanungProps';
import { DefaultButton, Label, TextField, DayOfWeek, Checkbox } from 'office-ui-fabric-react';
import { IService } from '../service/IService';
import { Service } from '../service/service';
import { ISchulungsplanungState } from './ISchulungsplanungState';
import { IPlanungsItem } from '../types/IPlanungsItem';
import { DateConvention, DateTimePicker, TimeConvention } from '@pnp/spfx-controls-react';
import { FormValidator } from '../service/validation/FormValidator';
import { ValidationRules } from '../service/validation/ValidationRules';

export default class Schulungsplanung extends React.Component<ISchulungsplanungProps, ISchulungsplanungState> {
  private _service: IService;
  private _validator: FormValidator;

  constructor(props: ISchulungsplanungProps) {
    super(props);

    this._service = new Service(this.props.context);

    this._validator = new FormValidator();

    // Validierungsregeln definieren
    this._validator.addRule('thema', ValidationRules.required('Thema ist ein Pflichtfeld'));
    this._validator.addRule('start', ValidationRules.required('Startdatum ist erforderlich'));
    this._validator.addRule('ende', ValidationRules.required('Enddatum ist erforderlich'));
    this._validator.addRule('ende', ValidationRules.dateAfter('start', 'Enddatum muss nach Startdatum liegen'));
    this._validator.addRule('verpflegungAnzahl', ValidationRules.requiredDependsOn('verpflegung', 'Wenn Verpflegung erforderlich ist, muss auch angegeben werden, wieviele Personen kommen'));

    this.state = {
      caption: 'Initialisierung',
      isError: false,
      errors: {},
      isValid: true,
      item: undefined,
      isLoading: true,
      errorMessage: ''
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
          caption: 'Eintrag bearbeiten',
          isLoading: false,
          isError: false,
          item: item
        });
      } else {
        const item: IPlanungsItem = this._service.getEmptyItem();
        this.setState({
          caption: 'Neuen Eintrag erstellen',
          isLoading: false,
          isError: false,
          item: item
        });
      }
    }
  }

  public render(): React.ReactElement<ISchulungsplanungProps> {
    const { item, caption, isError, errorMessage } = this.state;

    return (
      <div className={styles.schulungsplanung} >
        <h1>{caption}</h1>
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
                    <TextField
                      value={item.thema || ''}
                      label='Thema'
                      onChanged={(newValue?: string) => {
                        this.onStringChange('thema')(undefined as any, newValue);
                      }}
                    />
                  </div>
                </div>
                <div className={styles.row}>
                  <div className={styles.column}>
                    <DateTimePicker
                      label='Beginn'
                      value={item.start as Date}
                      dateConvention={DateConvention.DateTime}
                      timeConvention={TimeConvention.Hours24}
                      firstDayOfWeek={DayOfWeek.Monday}
                      onChange={(date: Date) => this.dateChanged(date, 'start')}
                    />
                  </div>
                </div>
                <div className={styles.row}>
                  <div className={styles.column}>
                    <DateTimePicker
                      label='Ende'
                      value={item.ende as Date}
                      dateConvention={DateConvention.DateTime}
                      timeConvention={TimeConvention.Hours24}
                      firstDayOfWeek={DayOfWeek.Monday}
                      onChange={(date: Date) => this.dateChanged(date, 'ende')}
                    />
                  </div>
                </div>                <div className={styles.row}>
                  <div className={styles.column}>
                    <Checkbox
                      label='Verpflegung erforderlich'
                      checked={item.verpflegung}
                      onChange={this.onBooleanChange('verpflegung')}
                    />
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.column}>
                    <TextField
                      label='Anzahl Personen für Verpflegung'
                      type='number'
                      value={item.verpflegungAnzahl ? item.verpflegungAnzahl.toString() : '0'}
                      onChanged={(newValue?: string) => {
                        this.onNumberChange('verpflegungAnzahl')(undefined as any, newValue);
                      }}
                      disabled={!item.verpflegung}
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
  // Generic event handlers with clean signatures
  private onStringChange = (property: string) => (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void => {
    this.updateStringProperty(property, newValue || '');
  }

  private onBooleanChange = (property: string) => (event?: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean): void => {
    this.updateBooleanProperty(property, checked || false);
  }

  private onNumberChange = (property: string) => (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void => {
    this.updateNumberProperty(property, newValue || '0');
  }

  private dateChanged = (date: Date | undefined, property: string): void => {
    this.updateProperty(property, date);
  }

  // Generic property update methods
  // tslint:disable-next-line:no-any
  private updateProperty = (property: string, value: any): void => {
    this.setState(prevState => {
      if (!prevState.item) {
        return prevState;
      }
      
      const updatedItem: IPlanungsItem = {
        ...prevState.item,
        [property]: value
      };
      return {
        item: updatedItem
      };
    });
  }

  private updateStringProperty = (property: string, value: string): void => {
    this.updateProperty(property, value);
  }

  private updateBooleanProperty = (property: string, value: boolean): void => {
    this.updateProperty(property, value);
  }

  private updateNumberProperty = (property: string, value: string): void => {
    const numericValue: number = parseInt(value, 10);
    this.updateProperty(property, isNaN(numericValue) ? 0 : numericValue);
  }

  private saveItem = async (): Promise<void> => {
    if (await this._service.saveListItem(this.props.listId, this.state.item)) {
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
