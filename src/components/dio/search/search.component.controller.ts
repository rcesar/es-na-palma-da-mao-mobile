import { IScope, IPromise, IWindowService } from 'angular';
import { SocialSharing } from 'ionic-native';

import filterTemplate from './filter/filter.html';
import { FilterController } from './filter/filter.controller';
import {
    SearchFilter,
    SearchResult,
    Hit,
    DioApiService
} from '../shared/index';


export class SearchController {

    public static $inject: string[] = [
        '$scope',
        '$window',
        '$mdDialog',
        'dioApiService'
    ];

    public lastQuery: string | undefined;
    public hits: Hit[] | undefined;
    public searched = false;
    public hasMoreHits = false;
    public totalHits: number = 0;
    public filter: SearchFilter = {
        pageNumber: 0,
        sort: 'date'
    };


    /**
     * Creates an instance of SearchController.
     * 
     * @param {IScope} $scope
     * @param {IWindowService} $window
     * @param {angular.material.IDialogService} $mdDialog
     * @param {DioApiService} dioApiService
     */
    constructor( private $scope: IScope,
        private $window: IWindowService,
        private $mdDialog: angular.material.IDialogService,
        private dioApiService: DioApiService ) {
        this.$scope.$on( '$ionicView.beforeEnter', () => this.activate() );
    }


    /**
     * Ativa o controller
     */
    public activate(): void {
        angular.element( document.querySelectorAll( 'ion-header-bar' ) ).removeClass( 'espm-header-tabs' );
    }

    /**
    * 
    * 
    * @param {string} link
    * 
    * @memberOf NewsDetailController
    */
    public share( hit: Hit ): void {
        SocialSharing.shareWithOptions( {
            message: `DIO ES - ${hit.date} - Pág. ${hit.pageNumber}`,
            subject: `DIO ES - ${hit.date} - Pág. ${hit.pageNumber}`,
            url: hit.pageUrl
        });
    }

    /**
     * 
     * 
     * @param {SearchFilter} options
     * @returns {IPromise<SearchResult[]>}
     */
    public search( filter: SearchFilter ): IPromise<SearchResult> {
        angular.extend( this.filter, filter || {}); // atualiza o filtro

        return this.dioApiService.search( this.filter )
            .then(( nextResults: SearchResult ) => this.onSearchSuccess( nextResults ), () => this.onSearchError() )
            .finally(() => {
                this.searched = true;
                this.$scope.$broadcast( 'scroll.infiniteScrollComplete' );
            });
    }

    /**
     * 
     * 
     * @private
     * @param {SearchResult} nextResults
     * @returns
     * 
     * @memberOf SearchController
     */
    private onSearchSuccess( nextResults: SearchResult ) {
        if ( this.filter.pageNumber === 0 ) {
            this.hits = [];
        }
        this.totalHits = nextResults.totalHits;
        this.hits = this.hits!.concat( nextResults.hits );
        this.hasMoreHits = nextResults.hits && nextResults.hits.length > 0;
        this.lastQuery = angular.copy( this.filter.query );
        return nextResults;
    };

    /**
     * 
     * 
     * @private
     * 
     * @memberOf SearchController
     */
    private onSearchError() {
        this.hits = undefined;
        this.hasMoreHits = false;
        this.lastQuery = undefined;
        this.totalHits = 0;
    };

    /**
     * Abre o filtro (popup) por data
     */
    public openFilter(): void {
        this.$mdDialog.show( {
            controller: FilterController,
            template: filterTemplate,
            bindToController: true,
            controllerAs: 'vm',
            locals: this.filter
        })
            .then( filter => {
                filter.pageNumber = 0;
                this.search( filter );
            });
    }



    /**
    * 
    * 
    * @param {string} url
    */
    public open( url: string ): void {
        this.$window.open( url, '_system' );
    }
}
