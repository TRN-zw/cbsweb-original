(function (module) {
    mifosX.controllers = _.extend(module, {
        SavingsController: function (scope, routeParams, route, location, resourceFactory,DTOptionsBuilder, DTColumnBuilder,DTColumnDefBuilder) {
            scope.loans = [];
            scope.loansPerPage = 15;

            scope.routeToSaving = function (id, depositTypeCode) {
                if (depositTypeCode === "depositAccountType.savingsDeposit") {
                    location.path('/viewsavingaccount/' + id);
                } else if (depositTypeCode === "depositAccountType.fixedDeposit") {
                    location.path('/viewfixeddepositaccount/' + id);
                } else if (depositTypeCode === "depositAccountType.recurringDeposit") {
                    location.path('/viewrecurringdepositaccount/' + id);
                }
            };

            scope.vm = {};
            scope.vm.dtInstance = {};
            //scope.vm.dtColumnDefs = [DTColumnDefBuilder.newColumnDef(2).notSortable()];
            scope.vm.dtOptions = DTOptionsBuilder.newOptions()
            .withOption('paging', true)
            .withOption('searching', true)
            .withOption('info', true)
            //           .withColumnFilter({
            //     aoColumns: [{
            //         type: 'number'
            //     }, {
            //         type: 'text',
            //         bRegex: true,
            //         bSmart: true
            //     }, {
            //         type: 'select',
            //         bRegex: false,
            //         values: ['Yoda', 'Titi', 'Kyle', 'Bar', 'Whateveryournameis']
            //     }]
            // })
            .withButtons([
            {
                extend:    'excel',
                text:      '<i class="fa fa-file-text-o"></i> Excel',
               titleAttr: 'Excel'
            },
            {
                extend:    'csv',
                text:      '<i class="fa fa-file-text-o"></i> Csv',
               titleAttr: 'Csv',
               title: 'deposit_accounts_'+ (new Date()).toISOString().slice(0, 19).replace(/-/g, "/").replace("T", " ")

            },
                                        {
                                            extend:    'copy',
                                            text:      '<i class="fa fa-files-o"></i> Copy',
                                            titleAttr: 'Copy'
                                        },
                                        {
                                            extend:    'print',
                                            text:      '<i class="fa fa-print" aria-hidden="true"></i> Print',
                                            titleAttr: 'Print'
                                        }

                                    ]);


            scope.getResultsPage = function (pageNumber) {
                if(scope.searchText){
                    var startPosition = (pageNumber - 1) * scope.loansPerPage;
                    scope.clients = scope.actualLoans.slice(startPosition, startPosition + scope.loansPerPage);
                    return;
                }
                var items = resourceFactory.savingsResource.get({
                    offset: ((pageNumber - 1) * scope.loansPerPage),
                    limit: scope.loansPerPage
                }, function (data) {
                    scope.loans = data.pageItems;
                });
            }
            scope.initPage = function () {

                var items = resourceFactory.savingsResource.get({
                    offset: 0,
                    limit: scope.loansPerPage
                }, function (data) {
                    scope.totalLoans = data.totalFilteredRecords;
                    scope.loans = data.pageItems;
                });
            }
            scope.initPage();

        }
    });
    mifosX.ng.application.controller('SavingsController', ['$scope', '$routeParams', '$route', '$location',  'ResourceFactory' , 'DTOptionsBuilder','DTColumnBuilder','DTColumnDefBuilder', mifosX.controllers.SavingsController]).run(function ($log) {
        $log.info("SavingsController initialized");
    });
}(mifosX.controllers || {}));
