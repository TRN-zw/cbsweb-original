(function (module) {
    mifosX.controllers = _.extend(module, {
        TransactionsController: function (scope, routeParams, route, location, resourceFactory,DTOptionsBuilder, DTColumnBuilder,DTColumnDefBuilder) {
            scope.loans = [];
            scope.actualLoans = [];
            scope.searchText = "";
            scope.searchResults = [];
            scope.showClosed = false;
            scope.tranPerPage = 15;
            scope.transactions = [];

            scope.routeToLoan = function (id) {
                location.path('/viewloanaccount/' + id);
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
               titleAttr: 'Excel',
               title: 'loan_transactions_'+ (new Date()).toISOString().slice(0, 19).replace(/-/g, "/").replace("T", " ")
            },
            {
                extend:    'csv',
                text:      '<i class="fa fa-file-text-o"></i> Csv',
               titleAttr: 'Csv',
               title: 'loan_transactions_'+ (new Date()).toISOString().slice(0, 19).replace(/-/g, "/").replace("T", " ")
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
                    var startPosition = (pageNumber - 1) * scope.tranPerPage;
                    scope.clients = scope.actualLoans.slice(startPosition, startPosition + scope.tranPerPage);
                    return;
                }

                var transactions = resourceFactory.transactionResource.getAllTransactions({
                    offset: ((pageNumber - 1) * scope.tranPerPage),
                    limit: scope.tranPerPage
                }, function (data) {
                    scope.transactions = data.pageItems;
                });
            }
            scope.initPage = function () {
                var transactions = resourceFactory.transactionResource.getAllTransactions({
                    offset: 0
                    //limit: scope.tranPerPage
                }, function (data) {
                  scope.totalTransactions = data.totalFilteredRecords;
                  scope.transactions = data.pageItems;
                });
            }
            scope.initPage();
        }
    });
    mifosX.ng.application.controller('TransactionsController', ['$scope', '$routeParams', '$route', '$location', 'ResourceFactory', 'DTOptionsBuilder','DTColumnBuilder','DTColumnDefBuilder', mifosX.controllers.TransactionsController]).run(function ($log) {
        $log.info("Transactions Controller initialized");
    });
}(mifosX.controllers || {}));
