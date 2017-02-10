'use strict'

var Milhao = (function() {
    var init = function() {
        Controls.init();
    }

    var Controls = (function() {
        var calcControls = '.calc-controls';
        var materialInputs = '.calc-controls__input';

        var initialValue = '#initial-value',
            cashFlow = '#cash-flow',
            desiredIncome = '#desired-income';
        
        var conservativeAmountYears = '#conservative-amount-years',
            moderateAmountYears = '#moderate-amount-years',
            conservativeObjectiveYears = '#conservative-objective-years',
            moderateObjectiveYears = '#moderate-objective-years';

        var changeInputs = function(e) {
            var results = Calc.futureValue(get());

            if (results === null) {
                $(conservativeAmountYears).text('0');
                $(moderateAmountYears).text('0');
                $(conservativeObjectiveYears).text('0');
                $(moderateObjectiveYears).text('0');
            }
            else {
                $(conservativeAmountYears).text(Math.ceil(results.conservativeAmountMonths / 12));
                $(moderateAmountYears).text(Math.ceil(results.moderateAmountMonths / 12));
                $(conservativeObjectiveYears).text(Math.ceil(results.conservativeObjectiveMonths / 12));
                $(moderateObjectiveYears).text(Math.ceil(results.moderateObjectiveMonths / 12));
            }
        }

        var init = function() {
            $(calcControls).append( '<label class="calc-controls__item">' +
                                        '<span class="calc-controls__label">Investimento inicial</span>' +
                                        '<input id="initial-value" class="calc-controls__input text-center" type="number" min="0" step="1" placeholder="0,00" />' +
                                    '</label>' +
                                    '<label class="calc-controls__item">' +
                                        '<span class="calc-controls__label">Investimento mensal</span>' +
                                        '<input id="cash-flow" class="calc-controls__input text-center" type="number" min="0" step="1" placeholder="0,00" />' +
                                    '</label>' +
                                    '<label class="calc-controls__item">' +
                                        '<span class="calc-controls__label">Renda desejada</span>' +
                                        '<input id="desired-income" class="calc-controls__input text-center" type="number" min="0" step="1" placeholder="0,00" />' +
                                    '</label>');

            $(materialInputs).on('change', changeInputs);
        }

        var get = function() {
            return {
                initialValue: +$(initialValue).val(),
                cashFlow: +$(cashFlow).val(),
                desiredIncome: +$(desiredIncome).val(),
            }
        }

        return {
            init: init
        }
    })();

    var Calc = (function() {
        var defaultValues = {
            initialValue: 0,
            cashFlow: 0,
            desiredIncome: 0,
        }

        var conservativeInterest = 1.003675,
            moderateInterest = 1.004868;
        
        var desiredAmount = 1000000;

        var futureValue = function(params) {
            params = $.extend(defaultValues, params);

            if ((params.initialValue + params.cashFlow) === 0) return null;

            var conservativeAmount = params.initialValue,
                moderateAmount = params.initialValue;
            var months = 0;

            var results = {
                conservativeAmountMonths: null,
                moderateAmountMonths: null,
                conservativeObjectiveMonths: null,
                moderateObjectiveMonths: null,
            };

            var totalIncome = params.desiredIncome * 200;

            while ( (conservativeAmount < desiredAmount) ||
                    (moderateAmount < desiredAmount) ||
                    (conservativeAmount < totalIncome) ||
                    (moderateAmount < totalIncome)) {
                conservativeAmount = conservativeAmount * conservativeInterest + params.cashFlow;
                moderateAmount = moderateAmount * moderateInterest + params.cashFlow;

                if (conservativeAmount >= desiredAmount && results.conservativeAmountMonths === null) results.conservativeAmountMonths = months;
                if (moderateAmount >= desiredAmount && results.moderateAmountMonths === null) results.moderateAmountMonths = months;

                if (conservativeAmount >= totalIncome && results.conservativeObjectiveMonths === null) results.conservativeObjectiveMonths = months;
                if (moderateAmount >= totalIncome && results.moderateObjectiveMonths === null) results.moderateObjectiveMonths = months;

                months++;

                // console.log('Mês ' + months + ': C - ' + conservativeAmount + ' | M - ' + moderateAmount);
            }

            return results;
        }

        return {
            futureValue: futureValue
        }
    })();

    return {
        init: init
    }
})();

$(document).ready(Milhao.init);