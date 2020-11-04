(function (module) {
    mifosX.controllers = _.extend(module, {
        LoanController: function (scope, routeParams, route, location, resourceFactory,DTOptionsBuilder, DTColumnBuilder,DTColumnDefBuilder, $uibModal) {
            scope.loans = [];
            scope.filterData = [];
            scope.searchText = "";
            scope.searchResults = [];
            scope.showClosed = false;
            scope.loansPerPage = 15;
            scope.currentPage = 1;

            scope.routeToLoan = function (id) {
                location.path('/viewloanaccount/' + id);
            };

            scope.vm = {};
            scope.vm.dtInstance = {};
            scope.vm.dtColumnDefs = [
              DTColumnDefBuilder.newColumnDef(9).notVisible(),
              DTColumnDefBuilder.newColumnDef(10).notVisible(),
              DTColumnDefBuilder.newColumnDef(11).notVisible(),
              DTColumnDefBuilder.newColumnDef(12).notVisible(),
              DTColumnDefBuilder.newColumnDef(13).notVisible(),
              DTColumnDefBuilder.newColumnDef(14).notVisible(),
              DTColumnDefBuilder.newColumnDef(15).notVisible(),
              DTColumnDefBuilder.newColumnDef(16).notVisible(),
              DTColumnDefBuilder.newColumnDef(17).notVisible(),
              DTColumnDefBuilder.newColumnDef(18).notVisible(),
              DTColumnDefBuilder.newColumnDef(19).notVisible(),
              DTColumnDefBuilder.newColumnDef(20).notVisible(),
              DTColumnDefBuilder.newColumnDef(21).notVisible(),
              DTColumnDefBuilder.newColumnDef(22).notVisible(),
              DTColumnDefBuilder.newColumnDef(23).notVisible(),
              DTColumnDefBuilder.newColumnDef(24).notVisible(),
              DTColumnDefBuilder.newColumnDef(25).notVisible(),
              DTColumnDefBuilder.newColumnDef(26).notVisible(),
              DTColumnDefBuilder.newColumnDef(27).notVisible(),
              DTColumnDefBuilder.newColumnDef(28).notVisible(),
              DTColumnDefBuilder.newColumnDef(29).notVisible(),
              DTColumnDefBuilder.newColumnDef(30).notVisible(),
              DTColumnDefBuilder.newColumnDef(31).notVisible(),
              DTColumnDefBuilder.newColumnDef(32).notVisible(),
              DTColumnDefBuilder.newColumnDef(33).notVisible(),
              DTColumnDefBuilder.newColumnDef(34).notVisible()
            ];
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


            scope.initPage = function () {

                var items = resourceFactory.loanResource.getAllLoans({
                    offset: 0
                  //  limit: scope.loansPerPage
                }, function (data) {
                    scope.totalLoans = data.totalFilteredRecords;
                    scope.loans = data.pageItems;
                });
      }
            scope.initPage();

            scope.uploadPic = function () {
                $uibModal.open({
                    templateUrl: 'uploadpic.html',
                    controller: UploadPicCtrl
                });
            };
            var UploadPicCtrl = function ($scope, $uibModalInstance) {
                $scope.upload = function (file) {
                    if (file) {
                        Upload.upload({
                            url: $rootScope.hostUrl + API_VERSION + '/clients/' + routeParams.id + '/images',
                            data: {},
                            file: file
                        }).then(function (imageData) {
                            // to fix IE not refreshing the model
                            if (!scope.$$phase) {
                                scope.$apply();
                            }
                            $uibModalInstance.close('upload');
                            route.reload();
                        });
                    }
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };

        }
    });

    mifosX.ng.application.controller('LoanController', ['$scope', '$routeParams', '$route', '$location', 'ResourceFactory', 'DTOptionsBuilder','DTColumnBuilder','DTColumnDefBuilder', '$uibModal', 'API_VERSION', '$rootScope', 'Upload',mifosX.controllers.LoanController]).run(function ($log) {
        $log.info("LoanController initialized");
    });
}(mifosX.controllers || {}));
