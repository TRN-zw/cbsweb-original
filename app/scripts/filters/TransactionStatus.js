(function (module) {
    mifosX.filters = _.extend(module, {
        TransactionStatus: function () {
        return function (data,Disbursement,Repayment,Accrual) {
          var output = []; // store result in this
      // console.log("Im here" + Pending);
     if (!!Disbursement || !!Repayment || !!Accrual) {
       // output = data;
      if (!!Disbursement) {
         for (var i = 0; i < data.length; i++) {
             if (data[i].type.disbursement) {
                 output.push(data[i]);
             }
         }
     } if (!!Repayment ) {
         for (var i = 0; i < data.length; i++) {
             if (data[i].type.repayment) {
                 output.push(data[i]);
             }
         }
     }
       if (!!Accrual) {
         for (var i = 0; i < data.length; i++) {
             if (data[i].type.accrual) {
                 output.push(data[i]);
             }
         }
     }
   }
    else {
            output = data
     }
       return output; // finally return the result
     }
     }
     });
    mifosX.ng.application.filter('TransactionStatus', [mifosX.filters.TransactionStatus]).run(function ($log) {
        $log.info("Transaction Status filter initialized");
    });
}(mifosX.filters || {}));
