import { IHttpService, IPromise } from 'angular';

import { ISettings } from '../../shared/settings/index';
import { DriverData, Charge, DriverLicenseProcess, Ticket, DriverStatus, Vehicle } from './models/index';


export class DetranApiService {

    public static $inject: string[] = [ '$http', 'settings' ];

    /**
     * Creates an instance of DetranApiService.
     * 
     * @param {IHttpService} $http
     * @param {ISettings} settings
     */
    constructor( private $http: IHttpService,
                 private settings: ISettings ) {
    }


    /**
     * 
     * 
     * @returns {IPromise<DriverData>}
     */
    public getDriverData(): IPromise<DriverData> {
        return this.$http
            .get( `${this.settings.api.detran}/driver` )
            .then(( response: { data: DriverData } ) => response.data );
    }

    /**
     * 
     * 
     * @returns {IPromise<Ticket[]>}
     */
    public getDriverTickets(): IPromise<Ticket[]> {
        return this.$http
            .get( `${this.settings.api.detran}/driver/tickets` )
            .then(( response: { data: Ticket[] } ) => response.data );
    }


    /**
     * 
     * 
     * @param {Vehicle} vehicle
     * @returns {IPromise<Ticket[]>}
     */
    public getVehicleTickets( vehicle: Vehicle ): IPromise<Ticket[]> {
        return this.$http
            .get( `${this.settings.api.detran}/vehicle/tickets`, { params: vehicle } )
            .then(( response: { data: Ticket[] } ) => response.data );
    }
}
