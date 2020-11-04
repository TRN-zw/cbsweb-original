(function (module) {
    mifosX.controllers = _.extend(module, {
        RichDashboard: function (scope, resourceFactory, localStorageService, $rootScope, location,moment) {

        	  scope.recent = [];
            scope.recent = localStorageService.getFromLocalStorage('Location');
            scope.recentEight = [];
            scope.frequent = [];
            scope.recentArray = [];
            scope.uniqueArray = [];
            scope.searchParams = [];
            scope.recents = [];
            scope.dashModel = 'rich-dashboard';
            scope.totalClients = 0;
            scope.totalGroups = 0;
            scope.totalLoans = 0;
            scope.var = 0;
            scope.par = 0;
            scope.disbursements = 0;
            scope.disbursementsMonth = 0;
            scope.pending = 0;
            scope.submitted = 0;
            scope.grossLoanBook =0;
            scope.depositBalance = 0;
            scope.officeIdDisbursed = 1;
            scope.officeId = 1;
            scope.officeIdCollection = 1;
            scope.inArrearsCount =0;
            scope.pendingCollection = 0;
            scope.collected = 0;
            scope.audit = [];
            scope.var1 = 0;
            scope.var7 = 0;
            scope.var30 = 0;
            scope.var90 = 0 ;
            scope.var180 = 0;
            scope.var360 = 0;
            scope.show_activity =false;


            scope.switch = function() {
	        	location.path('/richdashboard');
			}

            scope.$on("UserAuthenticationSuccessEvent", function (event, data) {
	            if (sessionManager.get(data)) {
	                scope.currentSession = sessionManager.get(data);
	            }
            });

            //to retrieve last 8 recent activities
            for (var rev = scope.recent.length - 1; rev > 0; rev--) {
                scope.recentArray.push(scope.recent[rev]);
            }
            scope.unique = function (array) {
                array.forEach(function (value) {
                    if (scope.uniqueArray.indexOf(value) === -1) {
                    	if (value) {
                            if (value != '/' && value != '/home' && value != '/richdashboard') {
                            	scope.uniqueArray.push(value);
                            }
                    	}
                    }
                });
            }
            scope.unique(scope.recentArray);
            //recent activities retrieved

            //retrieve last 8 recent activities
            for (var l = 0; l < 8; l++) {
                scope.recents.push(scope.uniqueArray[l]);
            }
            // 8 recent activities retrieved

            //count duplicates
            var i = scope.recent.length;
            var obj = {};
            while (i) {
                obj[scope.recent[--i]] = (obj[scope.recent[i]] || 0) + 1;
            }
            //count ends here

            //to sort based on counts
            var sortable = [];
            for (var i in obj) {
                sortable.push([i, obj[i]]);
            }
            sortable.sort(function (a, b) {
                return a[1] - b[1]
            });
            //sort end here

            //to retrieve the locations from sorted array
            var sortedArray = [];
            for (var key in sortable) {
                sortedArray.push(sortable[key][0]);
            }
            //retrieving ends here

            //retrieve last 8 frequent actions
            for (var freq = sortedArray.length - 1; freq > sortedArray.length - 11; freq--) {
                if (sortedArray[freq]) {
                    if (sortedArray[freq] != '/') {
                        if (sortedArray[freq] != '/home') {
                            scope.frequent.push(sortedArray[freq]);
                        }
                    }
                }
            }
            // retrieved 8 frequent actions

            scope.client = [];
            scope.offices = [];
            scope.cOfficeName = 'Head Office';
            scope.dOfficeName = 'Head Office';
            scope.bOfficeName = 'Head Office';
            scope.chartType = 'Days';
            scope.collectionPieData = [];

            scope.switch = function() {
	        	location.path('/home');
			}

      scope.initPage = function () {

        //get recent activities
        var acts = resourceFactory.auditResource.get({
            offset: 0,
            limit: scope.groupsPerPage,
            paged: 'true'
          }, function (data) {
             //console.log(data);
             for (var l = 0; l < 10; l++) {
                 scope.audit.push(data.pageItems[l]);
             }
              scope.show_activity = true;
          });

        //get Groups
          var items = resourceFactory.groupResource.get({
              offset: 0,
              limit: scope.groupsPerPage,
              paged: 'true',
              orderBy: 'name',
              sortOrder: 'ASC'
          }, function (data) {
              scope.totalGroups = data.totalFilteredRecords;
              scope.groups = data.pageItems;
          });

          //get Clients
          var items_ = resourceFactory.clientResource.getAllClients({
              offset: 0,
              limit: scope.clientsPerPage
          }, function (data) {
              scope.totalClients = data.totalFilteredRecords;
              scope.clients = data.pageItems;
          });

          //get Deposits
          var items_ = resourceFactory.savingsResource.get({
              offset: 0,
              limit: scope.savingsPerPage
          }, function (data) {
              //scope.totalLoans = data.totalFilteredRecords;
              scope.deposits = data.pageItems;
              for(var i = 0; i < data.pageItems.length; i++)
              {
                 var p = data.pageItems[i];
                 if (p.status.active) {
                 // scope.totalLoans +=1;
                 scope.depositBalance += (p.summary.accountBalance);
               }
             }
             });

          //get loans
          var itemloans = resourceFactory.loanResource.getAllLoans({
              offset: 0,
              limit: scope.loansPerPage
          }, function (data) {
              //scope.totalLoans = data.totalFilteredRecords;
              scope.loans = data.pageItems;
              for(var i = 0; i < data.pageItems.length; i++)
              {
                 var p = data.pageItems[i];
                 if (p.status.active) {
                 scope.totalLoans +=1;
                 scope.grossLoanBook += (p.summary.principalOutstanding);
               }
              }

              for(var i = 0; i < data.pageItems.length; i++)
              {
                 var p = data.pageItems[i];
                 //var now = moment();
                 if (p.inArrears) {
                   scope.inArrearsCount +=1;
                   scope.var += (p.summary.principalOutstanding);

                   var today = new Date();
                   var dd = today.getDate();
                   var arrearDate = new Date(p.summary.overdueSinceDate);
                   var timeDiff = Math.abs(today.getTime() - arrearDate.getTime());
                   var days = Math.floor(timeDiff / (1000 * 3600 * 24));

                  // console.log(days);

                   if(days == 1)
                   {
                   scope.var1 += (p.summary.principalOutstanding);
                   }
                   if(days >1 && days <= 7){
                    scope.var7 += (p.summary.principalOutstanding);
                   }
                   if(days >7 && days <= 30){
                    scope.var30 += (p.summary.principalOutstanding);
                   }
                   if(days >30 && days <= 90){
                    scope.var90 += (p.summary.principalOutstanding);
                   }
                   if(days >90 && days <= 180){
                    scope.var180 += (p.summary.principalOutstanding);
                   }
                   if(days >180 ){
                   scope.var360 += (p.summary.principalOutstanding);
                   }
                 }
              }

              for(var i = 0; i < data.pageItems.length; i++)
              {
                 var p = data.pageItems[i];
                 //console.log(p.inArrears);
                 if (p.status.pendingApproval) {
                   scope.submitted += (p.principal);
                 }
              }

              for(var i = 0; i < data.pageItems.length; i++)
              {
                 var p = data.pageItems[i];
                 //console.log(p.inArrears);
                 if (p.status.waitingForDisbursal) {
                   scope.pending += (p.principal);
                 }
              }

              for(var i = 0; i < data.pageItems.length; i++)
              {
                 var p = data.pageItems[i];
                 var dt = new Date();
                 // console.log(p.timeline.actualDisbursementDate[0]);
                 // console.log(p.timeline.actualDisbursementDate[1]);
                 // console.log(dt.getFullYear());
                 // console.log(dt.getMonth()+1);
                 if (p.status.active && p.timeline.actualDisbursementDate[0]==dt.getFullYear() && p.timeline.actualDisbursementDate[1] == dt.getMonth()+1) {
                   scope.disbursementsMonth += (p.principal);
                 }
              }

              scope.par = (scope.var/scope.grossLoanBook)*100;
          });
      }


      scope.initPage();

            scope.formatdate = function () {
                var bardate = new Date();
                scope.formattedDate = [];
                for (var i = 0; i < 12; i++) {
                    var temp_date = bardate.getDate();
                    bardate.setDate(temp_date - 1);
                    var curr_date = bardate.getDate();
                    var curr_month = bardate.getMonth() + 1;
                    scope.formattedDate[i] = curr_date + "/" + curr_month;
                }

               var mdate = new Date();
               scope.today_date  = mdate.getDate() + "/" + (mdate.getMonth()+1);
            };



            scope.formatdate();

            scope.getWeek = function () {
                scope.formattedWeek = [];
                var checkDate = new Date();
                checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));
                var time = checkDate.getTime();
                checkDate.setMonth(0);
                checkDate.setDate(1);
                var week = Math.floor(Math.round((time - checkDate) / 86400000) / 7);
                for (var i = 0; i < 12; i++) {
                    if (week == 0) {
                        week = 52;
                    }
                    scope.formattedWeek[i] = week - i;

                }
            };
            scope.getWeek();

            scope.getMonth = function () {
                var today = new Date();
                var aMonth = today.getMonth();
                scope.formattedMonth = [];
                var month = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
                for (var i = 0; i < 12; i++) {
                    scope.formattedMonth.push(month[aMonth]);
                    aMonth--;
                    if (aMonth < 0) {
                        aMonth = 11;
                    }
                }
            };
            scope.getMonth();

            scope.getBarData = function (firstData, secondClientData, secondLoanData) {
                scope.BarData = [

                    {
                        "key": "New Client Joining",
                        "values": [
                            [ firstData[11] , secondClientData[11]] ,
                            [ firstData[10] , secondClientData[10]] ,
                            [ firstData[9] , secondClientData[9]] ,
                            [ firstData[8] , secondClientData[8]] ,
                            [ firstData[7] , secondClientData[7]] ,
                            [ firstData[6] , secondClientData[6]] ,
                            [ firstData[5] , secondClientData[5]] ,
                            [ firstData[4] , secondClientData[4]] ,
                            [ firstData[3] , secondClientData[3]] ,
                            [ firstData[2] , secondClientData[2]] ,
                            [ firstData[1] , secondClientData[1]] ,
                            [ firstData[0] , secondClientData[0]]
                        ]
                    },
                    {
                        "key": "Loans Disbursed",
                        "values": [
                            [ firstData[11] , secondLoanData[11]] ,
                            [ firstData[10] , secondLoanData[10]] ,
                            [ firstData[9] , secondLoanData[9]] ,
                            [ firstData[8] , secondLoanData[8]] ,
                            [ firstData[7] , secondLoanData[7]] ,
                            [ firstData[6] , secondLoanData[6]] ,
                            [ firstData[5] , secondLoanData[5]] ,
                            [ firstData[4] , secondLoanData[4]] ,
                            [ firstData[3] , secondLoanData[3]] ,
                            [ firstData[2] , secondLoanData[2]] ,
                            [ firstData[1] , secondLoanData[1]] ,
                            [ firstData[0] , secondLoanData[0]]
                        ]
                    }
                ];
            };

            scope.getBarDataCollections = function (firstData, secondClientData, secondLoanData) {
                scope.BarDataCollections = [

                    {
                        "key": "Collected",
                        "values": [
                            [ firstData , secondClientData]
                        ]
                    },
                    {
                        "key": "Amount Due",
                        "values": [
                            [ firstData , secondLoanData]
                        ]
                    }
                ];
            };

            scope.getFcount = function (dateData, retrievedDateData, responseData) {
                for (var i in dateData) {
                    scope.fcount[i] = 0;
                    for (var j in retrievedDateData) {
                        if (dateData[i] == retrievedDateData[j]) {
                            scope.fcount[i] = responseData[j].count;

                        }
                    }
                }
            };
            scope.getLcount = function (dateData, retrievedDateData, responseData) {
                for (var i in dateData) {
                    scope.lcount[i] = 0;
                    for (var j in retrievedDateData) {
                        if (dateData[i] == retrievedDateData[j]) {
                            scope.lcount[i] = responseData[j].lcount;

                        }
                    }
                }
            };

            resourceFactory.runReportsResource.get({reportSource: 'ClientTrendsByDay', R_officeId: 1, genericResultSet: false}, function (clientData) {
                scope.client = clientData;
                scope.days = [];
                scope.tempDate = [];
                scope.fcount = [];
                for (var i in scope.client) {
                    scope.days[i] = scope.client[i].days;
                }
                for (var i in scope.days) {
                    if (scope.days[i] && scope.days[i].length > 2) {
                        var tday = scope.days[i][2];
                        var tmonth = scope.days[i][1];
                        var tyear = scope.days[i][0];
                        scope.tempDate[i] = tday + "/" + tmonth;
                    }
                }




                scope.getFcount(scope.formattedDate, scope.tempDate, scope.client);
                resourceFactory.runReportsResource.get({reportSource: 'LoanTrendsByDay', R_officeId: 1, genericResultSet: false}, function (loanData) {
                    scope.ldays = [];
                    scope.ltempDate = [];
                    scope.lcount = [];
                    for (var i in loanData) {
                        scope.ldays[i] = loanData[i].days;
                    }
                    for (var i in scope.ldays) {
                        if (scope.ldays[i] && scope.ldays[i].length > 2) {
                            var tday = scope.ldays[i][2];
                            var tmonth = scope.ldays[i][1];
                            var tyear = scope.ldays[i][0];
                            scope.ltempDate[i] = tday + "/" + tmonth;
                        }
                    };
                    scope.getLcount(scope.formattedDate, scope.ltempDate, loanData);
                    scope.getBarData(scope.formattedDate, scope.fcount, scope.lcount);
                });
            });

            resourceFactory.groupTemplateResource.get(function (data) {
                scope.offices = data.officeOptions;
            });

            resourceFactory.runReportsResource.get({reportSource: 'Demand_Vs_Collection', R_officeId: 1, genericResultSet: false}, function (data) {
                if (data && data.length > 0) {
                    scope.collectionPieData = data[0];
                    scope.showCollectionerror = false;
                    if (data[0].AmountPaid == 0 && data[0].AmountDue == 0) {
                        scope.showCollectionerror = true;
                    }

                    scope.getBarDataCollections(scope.today_date, scope.collectionPieData.AmountPaid, scope.collectionPieData.AmountDue);
                    console.log(scope.collectionPieData.AmountPaid);
                    console.log(scope.collectionPieData.AmountDue);
                    scope.collectedData = [
                        {key: "1 Day", y: scope.var1},
                        {key: "7 Days", y: scope.var7},
                        {key: "30 Days", y: scope.var30},
                        {key: "90 Days", y: scope.var90},
                        {key: "180 Days", y: scope.var180},
                        {key: "180+", y: scope.var360},
                    ];
                    scope.collected = scope.collectionPieData.AmountPaid;
                    scope.pendingCollection = scope.collectionPieData.AmountDue;
                } else{
                    scope.showCollectionerror = true;
                };
            });
            resourceFactory.runReportsResource.get({reportSource: 'Disbursal_Vs_Awaitingdisbursal', R_officeId: 1, genericResultSet: false}, function (data) {
                if (data && data.length > 0) {
                    scope.disbursedPieData = data[0];
                    scope.showDisbursementerror = false;
                    if (data[0].disbursedAmount == 0 && data[0].amountToBeDisburse == 0) {
                        scope.showDisbursementerror = true;
                    }
                    scope.disbursedData = [
                        {key: "Disbursed", y: scope.disbursedPieData.disbursedAmount},
                        {key: "Pending", y: scope.disbursedPieData.amountToBeDisburse}
                    ];
                     scope.disbursements = scope.disbursedPieData.disbursedAmount;
                     //scope.pending = scope.disbursedPieData.amountToBeDisburse;

                } else{
                    scope.showDisbursementerror = true;
                };
            });

            scope.getDailyData = function () {
                scope.chartType = 'Days';
                scope.id = this.officeId || 1;
                resourceFactory.runReportsResource.get({reportSource: 'ClientTrendsByDay', R_officeId: scope.id, genericResultSet: false}, function (data) {
                    scope.client = data;
                    scope.days = [];
                    scope.tempDate = [];
                    scope.fcount = [];
                    for (var i in scope.offices) {
                        if (scope.offices[i].id == scope.id) {
                            scope.bOfficeName = scope.offices[i].name;
                        }
                    }
                    for (var i in scope.client) {
                        scope.days[i] = scope.client[i].days;
                    }
                    for (var i in scope.days) {
                        if (scope.days[i] && scope.days[i].length > 2) {
                            var tday = scope.days[i][2];
                            var tmonth = scope.days[i][1];
                            var tyear = scope.days[i][0];
                            scope.tempDate[i] = tday + "/" + tmonth;
                        }
                    }
                    scope.getFcount(scope.formattedDate, scope.tempDate, scope.client);
                    resourceFactory.runReportsResource.get({reportSource: 'LoanTrendsByDay', R_officeId: scope.id, genericResultSet: false}, function (data) {
                        scope.ldays = [];
                        scope.ltempDate = [];
                        scope.lcount = [];
                        for (var i in data) {
                            scope.ldays[i] = data[i].days;
                        }
                        for (var i in scope.ldays) {
                            if (scope.ldays[i] && scope.ldays[i].length > 2) {
                                var tday = scope.ldays[i][2];
                                var tmonth = scope.ldays[i][1];
                                var tyear = scope.ldays[i][0];
                                scope.ltempDate[i] = tday + "/" + tmonth;
                            }
                        }
                        scope.getLcount(scope.formattedDate, scope.ltempDate, data);
                        scope.getBarData(scope.formattedDate, scope.fcount, scope.lcount);
                    });
                });
            };

            scope.getWeeklyData = function () {
                scope.chartType = 'Weeks';
                scope.id = this.officeId || 1;
                resourceFactory.runReportsResource.get({reportSource: 'ClientTrendsByWeek', R_officeId: scope.id, genericResultSet: false}, function (data) {
                    scope.client = data;
                    scope.weeks = [];
                    scope.fcount = [];

                    for (var i in scope.offices) {
                        if (scope.offices[i].id == scope.id) {
                            scope.bOfficeName = scope.offices[i].name;
                        }
                    }
                    for (var i in scope.client) {
                        scope.weeks[i] = scope.client[i].Weeks;
                    }

                    scope.getFcount(scope.formattedWeek, scope.weeks, scope.client);
                    resourceFactory.runReportsResource.get({reportSource: 'LoanTrendsByWeek', R_officeId: scope.id, genericResultSet: false}, function (data) {
                        scope.lweeks = [];
                        scope.lcount = [];
                        for (var i in data) {
                            scope.lweeks[i] = data[i].Weeks;
                        }
                        scope.getLcount(scope.formattedWeek, scope.lweeks, data);
                        scope.getBarData(scope.formattedWeek, scope.fcount, scope.lcount);
                    });
                });
            };

            scope.getMonthlyData = function () {
                scope.chartType = 'Months';
                scope.id = this.officeId || 1;
                scope.formattedSMonth = [];
                var monthArray = new Array('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec');
                var today = new Date();
                var aMonth = today.getMonth();
                for (var i = 0; i < 12; i++) {
                    scope.formattedSMonth.push(monthArray[aMonth]);
                    aMonth--;
                    if (aMonth < 0) {
                        aMonth = 11;
                    }
                }
                resourceFactory.runReportsResource.get({reportSource: 'ClientTrendsByMonth', R_officeId: scope.id, genericResultSet: false}, function (data) {
                    scope.client = data;
                    scope.months = [];
                    scope.fcount = [];

                    for (var i in scope.offices) {
                        if (scope.offices[i].id == scope.id) {
                            scope.bOfficeName = scope.offices[i].name;
                        }
                    }
                    for (var i in scope.client) {
                        scope.months[i] = scope.client[i].Months;
                    }
                    scope.getFcount(scope.formattedMonth, scope.months, scope.client);
                    resourceFactory.runReportsResource.get({reportSource: 'LoanTrendsByMonth', R_officeId: scope.id, genericResultSet: false}, function (data) {
                        scope.lmonths = [];
                        scope.lcount = [];

                        for (var i in data) {
                            scope.lmonths[i] = data[i].Months;
                        }
                        scope.getLcount(scope.formattedMonth, scope.lmonths, data);
                        scope.getBarData(scope.formattedSMonth, scope.fcount, scope.lcount);
                    });
                });
            };
            scope.getCollectionOffice = function () {
                var id = this.officeIdCollection || 1;
                for (var i in scope.offices) {
                    if (scope.offices[i].id == id) {
                        scope.cOfficeName = scope.offices[i].name;
                    }
                }
                resourceFactory.runReportsResource.get({reportSource: 'Demand_Vs_Collection', R_officeId: this.officeIdCollection, genericResultSet: false}, function (data) {
                    scope.showCollectionerror = false;
                    scope.collectionPieData = data[0];
                    if (data[0].AmountPaid == 0 && data[0].AmountDue == 0) {
                        scope.showCollectionerror = true;
                    }
                    scope.getBarDataCollections(scope.today_date, scope.collectionPieData.AmountPaid, scope.collectionPieData.AmountDue);
                    //console.log(scope.collectionPieData.AmountPaid);
                    //console.log(scope.collectionPieData.AmountDue);

                      scope.collectedData = [
                          {key: "1 Day", y: scope.var1},
                          {key: "7 Days", y: scope.var7},
                          {key: "30 Days", y: scope.var30},
                          {key: "90 Days", y: scope.var90},
                          {key: "180 Days", y: scope.var180},
                          {key: "180+", y: scope.var360},
                      ];
                });

            };
            scope.getDisbursementOffice = function () {
                var id = this.officeIdDisbursed || 1;
                for (var i in scope.offices) {
                    if (scope.offices[i].id == id) {
                        scope.dOfficeName = scope.offices[i].name;
                    }
                }

                resourceFactory.runReportsResource.get({reportSource: 'Disbursal_Vs_Awaitingdisbursal', R_officeId: this.officeIdDisbursed, genericResultSet: false}, function (data) {
                    scope.disbursedPieData = data[0];
                    scope.showDisbursementerror = false;
                    if (data[0].disbursedAmount == 0 && data[0].amountToBeDisburse == 0) {
                        scope.showDisbursementerror = true;
                    }
                    scope.disbursedData = [
                        {key: "Disbursed", y: scope.disbursedPieData.disbursedAmount},
                        {key: "Pending", y: scope.disbursedPieData.amountToBeDisburse}
                    ];
                });
            };

            scope.xFunction = function () {
                return function (d) {
                    return d.key;
                };
            };
            scope.yFunction = function () {
                return function (d) {
                    return d.y;
                };
            };
            var colorArray = ['#0f82f5', '#008000', '#808080', '#000000', '#FFE6E6'];
            var colorArrayPie = ['#0f82f5', '#FF5733', '#800000', '#32CD32','#0000FF', '#800080', '#FFE6E6'];
            scope.colorFunction = function () {
                return function (d, i) {
                    return colorArray[i];
                };
            };
            scope.colorFunctionPie = function () {
                return function (d, i) {
                    return colorArrayPie[i];
                };
            };

        }
    });
    mifosX.ng.application.controller('RichDashboard', ['$scope', 'ResourceFactory', 'localStorageService', '$rootScope', '$location', mifosX.controllers.RichDashboard]).run(function ($log) {
        $log.info("RichDashboard initialized");
    });
}(mifosX.controllers || {}));
