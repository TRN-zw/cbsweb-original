(function (module) {
    mifosX.filters = _.extend(module, {
        LoanStatus: function () {
        return function (data,Pending,Approved,Active,Arrears,Closed) {
          var output = []; // store result in this
      // console.log("Im here" + Pending);
     if (!!Pending || !!Approved || !!Active || !!Arrears || !!Closed) {
       // output = data;
      if (!!Pending) {
         for (var i = 0; i < data.length; i++) {
             if (data[i].status.pendingApproval) {
                 output.push(data[i]);
             }
         }
     } if (!!Approved ) {
         for (var i = 0; i < data.length; i++) {
             if (data[i].status.waitingForDisbursal) {
                 output.push(data[i]);
             }
         }
     }
       if (!!Active) {
         for (var i = 0; i < data.length; i++) {
             if (data[i].status.active && !data[i].inArrears) {
                 output.push(data[i]);
             }
         }
     } if (!!Arrears) {
         for (var i = 0; i < data.length; i++) {
             if (data[i].status.active && data[i].inArrears) {
                 output.push(data[i]);
             }
         }
     } if (!!Closed) {
         for (var i = 0; i < data.length; i++) {
           if (data[i].status.closed) {
               output.push(data[i]);
           }
         }
     }
   }
    else {
       for (var i = 0; i < data.length; i++) {
         if (!data[i].status.closed) {
             output.push(data[i]);
         }
       }
     }
       return output; // finally return the result
     }
     }
     });
    mifosX.ng.application.filter('LoanStatus', [mifosX.filters.LoanStatus]).run(function ($log) {
        $log.info("LoanStatus filter initialized");
    });
}(mifosX.filters || {}));
