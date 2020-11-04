(function (module) {
    mifosX.controllers = _.extend(module, {
        ClientController: function (scope, resourceFactory, location,DTOptionsBuilder, DTColumnBuilder,DTColumnDefBuilder) {
            scope.clients = [];
            scope.actualClients = [];
            scope.searchText = "";
            scope.searchResults = [];
            scope.showClosed = false;
            scope.routeTo = function (id) {
                location.path('/viewclient/' + id);
            };

            scope.clientsPerPage = 15;
            scope.vm = {};
            scope.vm.dtInstance = {};
            scope.vm.dtColumnDefs = [
              DTColumnDefBuilder.newColumnDef(6).notVisible(),
              DTColumnDefBuilder.newColumnDef(7).notVisible(),
              DTColumnDefBuilder.newColumnDef(8).notVisible(),
              DTColumnDefBuilder.newColumnDef(9).notVisible(),
              DTColumnDefBuilder.newColumnDef(10).notVisible(),
              DTColumnDefBuilder.newColumnDef(11).notVisible(),
              DTColumnDefBuilder.newColumnDef(12).notVisible(),
              DTColumnDefBuilder.newColumnDef(13).notVisible(),
              DTColumnDefBuilder.newColumnDef(14).notVisible()
            ];
            scope.vm.dtOptions = DTOptionsBuilder.newOptions()
          .withOption('paging', true)
          .withOption('searching', true)
          .withOption('info', true)
          .withButtons([
        {
          extend:    'colvis',
          text:      'Show/Hide Columns'
        },

            {
                extend:    'excel',
                text:      '<i class="fa fa-file-text-o"></i> Excel',
               titleAttr: 'Excel',
               title: 'loan_accounts_'+ (new Date()).toISOString().slice(0, 19).replace(/-/g, "/").replace("T", " ")
            },
            {
                extend:    'csv',
                text:      '<i class="fa fa-file-text-o"></i> Csv',
               titleAttr: 'Csv',
               title: 'loan_accounts_'+ (new Date()).toISOString().slice(0, 19).replace(/-/g, "/").replace("T", " ")
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
                    var startPosition = (pageNumber - 1) * scope.clientsPerPage;
                    scope.clients = scope.actualClients.slice(startPosition, startPosition + scope.clientsPerPage);
                    return;
                }
                var items = resourceFactory.clientResource.getAllClients({
                    offset: ((pageNumber - 1) * scope.clientsPerPage)
                    //limit: scope.clientsPerPage
                }, function (data) {
                    scope.clients = data.pageItems;
                });
            }
            scope.initPage = function () {

                var items = resourceFactory.clientResource.getAllClients({
                    offset: 0
                    //limit: scope.clientsPerPage
                }, function (data) {
                    scope.totalClients = data.totalFilteredRecords;
                    scope.clients = data.pageItems;
                });
            }
            scope.initPage();

            scope.search = function () {
                scope.actualClients = [];
                scope.searchResults = [];
                scope.filterText = "";
                var searchString = scope.searchText;
                searchString = searchString.replace(/(^"|"$)/g, '');
                var exactMatch=false;
                var n = searchString.localeCompare(scope.searchText);
                if(n!=0)
                {
                    exactMatch=true;
                }

                if(!scope.searchText){
                    scope.initPage();
                } else {
                    resourceFactory.globalSearch.search({query: searchString , resource: "clients,clientIdentifiers",exactMatch: exactMatch}, function (data) {
                        var arrayLength = data.length;
                        for (var i = 0; i < arrayLength; i++) {
                            var result = data[i];
                            var client = {};
                            client.status = {};
                            client.subStatus = {};
                            client.status.value = result.entityStatus.value;
                            client.status.code  = result.entityStatus.code;
                            if(result.entityType  == 'CLIENT'){

                                client.displayName = result.entityName;
                                client.accountNo = result.entityAccountNo;
                                client.id = result.entityId;
                                client.externalId = result.entityExternalId;
                                client.officeName = result.parentName;
                            }else if (result.entityType  == 'CLIENTIDENTIFIER'){
                                numberOfClients = numberOfClients + 1;
                                client.displayName = result.parentName;
                                client.id = result.parentId;
                                client.externalId = result.parentExternalId;

                            }
                            scope.actualClients.push(client);
                        }
                        var numberOfClients = scope.actualClients.length;
                        scope.totalClients = numberOfClients;
                        scope.clients = scope.actualClients.slice(0, scope.clientsPerPage);
                    });
                }
            }

        }
    });



    mifosX.ng.application.controller('ClientController', ['$scope', 'ResourceFactory', '$location', 'DTOptionsBuilder','DTColumnBuilder','DTColumnDefBuilder', mifosX.controllers.ClientController]).run(function ($log) {
        $log.info("ClientController initialized");
    });
}(mifosX.controllers || {}));
