sk_datePicker.prototype.target = null;
sk_datePicker.prototype.settings = null;

sk_datePicker.prototype.initDate = null;
sk_datePicker.prototype.initDateObj = null;
sk_datePicker.prototype.language = null;

sk_datePicker.prototype.sk_datepickTable = null;
sk_datePicker.prototype.sk_selectorWrapper = null;

sk_datePicker.prototype.currentMonth = null;
sk_datePicker.prototype.currentYear = null;

sk_datePicker.prototype.currentMonthFirstDate = null;
sk_datePicker.prototype.currentMonthLastDate = null;

sk_datePicker.prototype.currentMonthFirstDate = null;
sk_datePicker.prototype.currentMonthLastDate = null;
sk_datePicker.prototype.monthDisplayArray = null;

sk_datePicker.prototype.currentMonthArray = null;

//click trigger
sk_datePicker.prototype.yearArrowLeft = null;
sk_datePicker.prototype.yearArrowRight = null;
sk_datePicker.prototype.monthArrowLeft = null;
sk_datePicker.prototype.monthArrowRight = null;
sk_datePicker.prototype.weekdayItem = null;

//ajax
sk_datePicker.prototype.ajaxContentArray = null;
sk_datePicker.prototype.ajaxRevisedArray = null;

sk_datePicker.prototype.currentType = null;
sk_datePicker.prototype.isInitCall = true;

sk_datePicker.prototype.selectedDate = true;

sk_datePicker.prototype.languagePack = [{
    "en": {
        "weekdayN": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "weekdaySf": ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
        "monthN": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        "monthSf": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    },
    "tc": {
        "weekdayN": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "weekdaySf": ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
        "monthN": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        "monthSf": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    }
}];

function sk_datePicker(pTarget, config) {
    var _self = this;

    _self.target = pTarget;

    _self.settings = {
        version: '1.0.0',
        developer: 'kon.hui',
        currentDate: "today",
        monthFormat: "N",
        weekFormat: "Sf",
        lang: "en",
        controller: "s1",
        tableStyle: {

        },
        onChangeMonth: function(pTarget) {
            console.log("change month or year");
        }
    };

    $.extend(_self.settings, config);

    _self.init();
}

sk_datePicker.prototype.init = function() {
    var _self = this;

    _self.language = _self.settings.lang;

    //init Date Array
    _self.setInitDateArray();

    //selectorControl ( Customize S1 )
    _self.createSelectController();

    //createTable
    _self.createTable();

    //add Date into cell
    _self.buildCurrentMonthArray();

};

sk_datePicker.prototype.createSelectController = function() {
    var _self = this;

    //initControllerTable
    _self.target.append('<div class="sk_selectorWrapper ' + _self.settings.controller + '"></div>');
    _self.sk_selectorWrapper = $('.sk_selectorWrapper', _self.target);

    _self.sk_selectorWrapper.append(createSelectorHTML());

    //console.log(_self.currentMonth, _self.currentYear, _self.monthDisplayArray);

    _self.yearArrowLeft = $('.selectorItem.year .datepickerArrow.left', _self.target);
    _self.yearArrowRight = $('.selectorItem.year .datepickerArrow.right', _self.target);

    _self.monthArrowLeft = $('.selectorItem.month .datepickerArrow.left', _self.target);
    _self.monthArrowRight = $('.selectorItem.month .datepickerArrow.right', _self.target);

    bindSelectorArrow();

    function createSelectorHTML() {
        var _html = null;

        _html = '';

        _html += '<div class="monthSelectWrapper coGrid-1-2 np">';
        _html += '	<div class="selectorItem month">';
        _html += '		<a href="javascript:void(0);" class="datepickerArrow left">';
        _html += '			<span class="ghost"></span><span class="icon-arrowRight"></span>';
        _html += '		</a><span class="displayValue">' + _self.monthDisplayArray[_self.currentMonth];
        _html += '		</span><a href="javascript:void(0);" class="datepickerArrow right">';
        _html += '			<span class="ghost"></span><span class="icon-arrowLeft"></span>';
        _html += '		</a>';
        _html += '	</div>';
        _html += '</div><div class="yearSelectWrapper coGrid-1-2 np">';
        _html += '	<div class="selectorItem year">';
        _html += '		<a href="javascript:void(0);" class="datepickerArrow left">';
        _html += '			<span class="ghost"></span><span class="icon-arrowRight"></span>';
        _html += '		</a><span class="displayValue">' + _self.currentYear;
        _html += '		</span><a href="javascript:void(0);" class="datepickerArrow right">';
        _html += '			<span class="ghost"></span><span class="icon-arrowLeft"></span>';
        _html += '		</a>';
        _html += '	</div>';


        return _html;
    }

    function bindSelectorArrow() {
        _self.yearArrowRight.on('click', function() {
            _self.currentYear++;
            $('.selectorItem.year', _self.target).find('.displayValue').html(_self.currentYear);
            logCurrentData();
        });

        _self.yearArrowLeft.on('click', function() {
            _self.currentYear--;
            $('.selectorItem.year', _self.target).find('.displayValue').html(_self.currentYear);
            logCurrentData();
        });

        _self.monthArrowRight.on('click', function() {
            _self.currentMonth = (_self.currentMonth + 1) % 12;
            $('.selectorItem.month', _self.target).find('.displayValue').html(_self.monthDisplayArray[_self.currentMonth]);
            logCurrentData();
        });

        _self.monthArrowLeft.on('click', function() {
            _self.currentMonth = (_self.currentMonth - 1 < 0) ? _self.currentMonth = 11 : _self.currentMonth - 1;
            $('.selectorItem.month', _self.target).find('.displayValue').html(_self.monthDisplayArray[_self.currentMonth]);
            logCurrentData();
        });
    }

    function logCurrentData() {
        // unbind date
        _self.weekdayItem.off('click');

        _self.buildCurrentMonthArray();
    }
};

sk_datePicker.prototype.setInitDateArray = function() {
    var _self = this;

    //default Today
    if (_self.settings.currentDate == "today") {
        _self.initDate = new Date();

        _self.initDateObj = {};

        _self.initDateObj.day = _self.initDate.getDate();
        _self.initDateObj.month = _self.initDate.getMonth();
        _self.initDateObj.year = _self.initDate.getFullYear();
        _self.initDateObj.week = _self.initDate.getDay();

        _self.initDateObj.format = _self.returnDateFormat([_self.initDateObj.day, _self.initDateObj.month, _self.initDateObj.year]);

        _self.initDateObj.obj = moment(_self.initDateObj.format, "dd-mm-yyyy");

    }

    _self.currentMonth = _self.initDateObj.month;
    _self.currentYear = _self.initDateObj.year;

    _self.monthDisplayArray = _self.languagePack[0][_self.language]["month" + _self.settings.monthFormat];
};

sk_datePicker.prototype.buildCurrentMonthArray = function() {
    var _self = this;

    _self.currentMonthFirstDate = new Date(_self.currentYear, _self.currentMonth, 1);
    _self.currentMonthLastDate = new Date(_self.currentYear, _self.currentMonth + 1, 1);

    //console.log(_self.currentMonthFirstDate, _self.currentMonthLastDate);

    _self.currentMonthArray = [];

    var _different = moment(_self.currentMonthLastDate).diff(moment(_self.currentMonthFirstDate), 'days');

    var _counter = 0;

    for (_i = 0; _i < _different; _i++) {
        var _tempDate = moment(_self.currentMonthFirstDate).add(_i, "d");

        var _tempObj = {};

        _tempObj.momentObj = _tempDate;
        _tempObj.date = _tempDate.date();
        _tempObj.cellNum = _tempDate.day();

        if (_i !== 0) {
            if (_tempObj.cellNum === 0) _counter++;
        }

        _tempObj.rowNum = _counter;

        _self.currentMonthArray.push(_tempObj);
    }

    console.log(_self.currentMonthArray);

    _self.addDateItem();

    _self.weekdayItem = $('.weekdayItem', _self.target);

    if (_self.settings.onChangeDate != "undefinded") {
        _self.settings.onChangeDate(_self);
    }
};

sk_datePicker.prototype.addDateItem = function() {
    var _self = this;

    var _counter = 0;

    if (_counter === 0) {
        changeContent();

        if (_self.settings.onChangeMonth != "undefinded") {
            _self.settings.onChangeMonth(_self);
        }

        $('.weekdayItem', _self.target).off('click').on('click', function() {
            if ($(this).hasClass('withEvent')) {
                var _date = $(this).data('date');

                $('.weekdayItem', _self.target).removeClass('selected');
                $(this).addClass('selected');


                if (typeof _self.ajaxRevisedArray[0][_date] != "undefined") {
                    _self.selectedDate = _date;

                    if (_self.currentType == "whatsOn") {
                        _self.destroyDisplayContentWO();
                        _self.initWhatsOn(_self.ajaxRevisedArray[0][_date]);
                    }
                }
            }
        });
    }

    _counter++;

    function changeContent() {
        //clear
        $('.dateRow td', _self.target).find('.item').html('');
        $('.weekdayItem', _self.target).removeClass('current');
        $('.weekdayItem', _self.target).removeClass('selected');
        $('.weekdayItem', _self.target).attr('data-date', '');

        for (_i = 0; _i < _self.currentMonthArray.length; _i++) {
            var _element = _self.currentMonthArray[_i];
            var _string = _self.returnDateFormat([_element.momentObj.date(), _element.momentObj.month(), _element.momentObj.year()]);
            var _currentDate = _self.initDateObj.format;

            $('.dateRow[data-rownum="' + _element.rowNum + '"] td[data-cellnum="' + _element.cellNum + '"]', _self.target).find('.item').html(_element.date);
            $('.dateRow[data-rownum="' + _element.rowNum + '"] td[data-cellnum="' + _element.cellNum + '"]', _self.target).find('.weekdayItem').attr('data-date', _string);

            if (_string == _currentDate) {
                $('.weekdayItem[data-date="' + _currentDate + '"]', _self.target).addClass('current');
            }
        }

        $('.weekdayItem[data-date="' + _self.selectedDate + '"]', _self.target).addClass('selected');
    }
};

sk_datePicker.prototype.returnDateFormat = function(pArray) {
    var _self = this;

    var _day = (pArray[0] < 10) ? '0' + pArray[0] : pArray[0];
    var _month = ((pArray[1] + 1) < 10) ? '0' + (pArray[1] + 1) : (pArray[1] + 1);
    var _year = pArray[2];

    return _day + '-' + _month + '-' + _year;
};

sk_datePicker.prototype.postAjaxContent = function(pData, pType) {
    var _self = this;

    _self.ajaxContentArray = []; //clear in destroy
    _self.ajaxContentArray = pData;
    // console.log(pData);
    _self.currentType = pType;

    var _mStartDate = moment([_self.currentYear, _self.currentMonth, 1]);
    var _mEndDate = moment([_self.currentYear, _self.currentMonth + 1, 1]).subtract(1, 'd');

    $('.eventBorder', _self.target).remove();
    $('.weekdayItem', _self.target).removeClass('withEvent');
    $('.weekdayItem', _self.target).removeClass('firstDay');

    $.each(_self.ajaxContentArray[0].items, function(_i, _el) {

        _el.startDate = moment(_el.startDate, "DD-MM-YYYY");
        _el.endDate = moment(_el.endDate, "DD-MM-YYYY");
    });

    var _currentMonth = (_self.currentMonth + 1 < 10) ? '0' + (_self.currentMonth + 1) : _self.currentMonth + 1;
    var _getMonthYear = _currentMonth + '-' + _self.currentYear;

    var _length = moment(_getMonthYear, "MM-YYYY").daysInMonth();

    //check Every day in the month
    var _tempObj = {};

    for (_i = 1; _i <= _length; _i++) {
        var _currentDay = (_i < 10) ? '0' + _i : _i;
        var _currentDate = moment(_currentDay + '-' + _getMonthYear, "DD-MM-YYYY");

        var _dateName = _currentDay + '-' + _getMonthYear;

        _tempObj[_dateName] = [];

        $.each(_self.ajaxContentArray[0].items, function(_i, _el) {
            var _start = _el.startDate._i;
            _start = moment(_start, "DD-MM-YYYY").subtract(1, 'days');

            var _end = _el.endDate._i;
            _end = moment(_end, "DD-MM-YYYY").add(1, 'days');

            if (moment(_currentDate).isBetween(_start, _end)) {
                var _itemObj = {};

                _itemObj.id = _el.id;
                _itemObj.img = _el.img;
                _itemObj.alt = _el.alt;
                _itemObj.title = _el.title;
                _itemObj.startDate = _el.startDate;
                _itemObj.endDate = _el.endDate;
                _itemObj.tag = _el.tag;
                _itemObj.link = _el.link;
                _itemObj.message = _el.message;
                _itemObj.displayDateFormat = dateFormatConvert(_itemObj.startDate, _itemObj.endDate);
                _itemObj.firstChar = _el.message.charAt(0);
                _itemObj.updatedMessage = _el.message.slice(1);

                //console.log(_currentDate._i, _el.startDate._i);


                if (_currentDate._i == _el.startDate._i) {
                    _itemObj.isFirstDay = true;
                    $('.weekdayItem[data-date="' + _currentDate._i + '"]', _self.target).addClass('firstDay');

                } else {
                    _itemObj.isFirstDay = false;
                }

                $('.weekdayItem[data-date="' + _currentDate._i + '"]', _self.target).addClass('withEvent');

                _tempObj[_dateName].push(_itemObj);
            }
        });

        //console.log(_tempObj);

        _self.ajaxRevisedArray = []; //clear in destroy
        _self.ajaxRevisedArray.push(_tempObj);
    }

    for (var _i in _self.ajaxRevisedArray[0]) {
        if (_self.ajaxRevisedArray[0][_i].length > 0) {
            $('<span class="eventBorder"></span>').insertBefore($('.weekdayItem[data-date="' + _i + '"]', _self.target).find('.cover'));
        }
    }

    if (_self.isInitCall) {
        //check init date, do it once only
        if (_self.ajaxRevisedArray[0][_self.initDateObj.format].length > 0) {
            $('.weekdayItem[data-date="' + _self.initDateObj.format + '"]', _self.target).addClass('selected');

            _self.selectedDate = _self.initDateObj.format;

            if (_self.currentType == "whatsOn") {
                _self.initWhatsOn(_self.ajaxRevisedArray[0][_self.initDateObj.format]);
            }

        } else {
            var _end = moment().add('months', 1).date(0);
            var _diff = _end.diff(_self.initDateObj.obj, 'days');
            var _counter = 1;

            for (_i = 1; _i < _diff + 1; _i++) {
                var _tempDate = _self.initDateObj.obj.clone().add(_i, 'days');
                var _string = _self.returnDateFormat([_tempDate.date(), _tempDate.month(), _tempDate.year()]);
                var _length2 = _self.ajaxRevisedArray[0][_string].length;

                if (_length2 > 0) {
                    if (_self.currentType == "whatsOn") {
                        _self.initWhatsOn(_self.ajaxRevisedArray[0][_string]);
                    }

                    $('.weekdayItem[data-date="' + _string + '"]', _self.target).addClass('selected');
                    _self.selectedDate = _string;

                    break;

                } else {
                    _counter++;
                }
            }

            if (_counter == _diff) {
                //console.log("display no result");
            }
        }
        _self.isInitCall = false;
    }

    function dateFormatConvert(pStartDay, pEndDay) {
        var _sDay = pStartDay.date();
        var _sMonth = _self.languagePack[0][_self.language]["monthSf"][pStartDay.month()];
        var _sYear = pStartDay.year();

        var _startDayString = _sDay + ' ' + _sMonth + ' ' + _sYear;

        if (pStartDay._i == pEndDay._i) {
            return _startDayString;
        } else {
            var _eDay = pEndDay.date();
            var _eMonth = _self.languagePack[0][_self.language]["monthSf"][pEndDay.month()];
            var _eYear = pEndDay.year();

            var _endDayString = _eDay + ' ' + _eMonth + ' ' + _eYear;

            return _startDayString + ' - ' + _endDayStringcover
        }
    }
};

/********** What's On **********/
sk_datePicker.prototype.indexWO = 0;
sk_datePicker.prototype.currentWOArray = null;

sk_datePicker.prototype.initWhatsOn = function(pArray) {
    var _self = this;
    var _localTarget = $('.whatonDisplayWrapper');

    _self.currentWOArray = pArray;

    //console.log(_self.currentWOArray, _self.indexWO);

    _self.showHideArrowWO();

    _self.emptyDisplayContentWO();
    _self.loadDisplayContentWO(_self.currentWOArray[_self.indexWO]);

    //console.log(_self.currentWOArray[_self.indexWO]);

    _self.bindArrowWO();
};

sk_datePicker.prototype.destroyDisplayContentWO = function() {
    var _self = this;
    var _localTarget = $('.whatonDisplayWrapper');

    $('.whatsonArrow.left', _localTarget).off('click');
    $('.whatsonArrow.right', _localTarget).off('click');

    _self.emptyDisplayContentWO();
    _self.indexWO = 0;
    _self.currentWOArray = null;
};

sk_datePicker.prototype.bindArrowWO = function() {
    var _self = this;
    var _localTarget = $('.whatonDisplayWrapper');

    $('.whatsonArrow.left', _localTarget).on('click', function() {
        _self.indexWO--;
        _self.showHideArrowWO();

        _self.emptyDisplayContentWO();
        _self.loadDisplayContentWO(_self.currentWOArray[_self.indexWO]);
    });

    $('.whatsonArrow.right', _localTarget).on('click', function() {
        _self.indexWO++;
        _self.showHideArrowWO();

        _self.emptyDisplayContentWO();
        _self.loadDisplayContentWO(_self.currentWOArray[_self.indexWO]);
    });

};

sk_datePicker.prototype.showHideArrowWO = function() {
    var _self = this;
    var _localTarget = $('.whatonDisplayWrapper');

    //console.log(_self.currentWOArray);

    if (_self.currentWOArray.length > 1) {
        $('.whatsOnArrowWrapper', _localTarget).show();
    } else {
        $('.whatsOnArrowWrapper', _localTarget).hide();
    }

    $('.whatsonArrow.left', _localTarget).show();
    $('.whatsonArrow.right', _localTarget).show();

    if (_self.indexWO === 0) {
        $('.whatsonArrow.left', _localTarget).hide();
    }

    if (_self.indexWO == 1) {
        $('.whatsonArrow.right', _localTarget).hide();
    }
};

sk_datePicker.prototype.emptyDisplayContentWO = function() {
    var _self = this;
    var _localTarget = $('.whatonDisplayWrapper');

    $('.displayContent', _localTarget).html('');
    $('.displayImage', _localTarget).html('');
};

sk_datePicker.prototype.loadDisplayContentWO = function(pArray) {
    var _self = this;

    var _localTarget = $('.whatonDisplayWrapper');

    var _htmlContent = null;
    _htmlContent = '';

    _htmlContent += '<h3 class="title whatsOnAniIn">' + pArray.title + '</h3>';
    _htmlContent += '<p class="date whatsOnAniIn">' + pArray.displayDateFormat + '</p>';
    _htmlContent += '<div class="tagWrapper">';

    for (_i = 0; _i < pArray.tag.length; _i++) {
        _htmlContent += '<a href="javascript:void(0);" class="tagItem color-bg-' + pArray.tag[_i] + ' whatsOnAniIn">' + pArray.tag[_i] + '</a>';
    }

    _htmlContent += '</div>';
    _htmlContent += '<div class="mainMessage whatsOnAniIn">';
    _htmlContent += '	<p class="text-content">';
    _htmlContent += '		<span class="fc-text-' + pArray.tag[0] + '">' + pArray.firstChar + '</span>' + pArray.updatedMessage;
    _htmlContent += '		<a href="' + pArray.link + '" class="readmore"> more&raquo;</a>';
    _htmlContent += '	</p>';
    _htmlContent += '</div>';

    $('.displayContent', _localTarget).append(_htmlContent);
    $('.displayImage', _localTarget).append('<a href="' + pArray.link + '"><img class="img100" src="' + pArray.img + '" alt="' + pArray.alt + '"/></a>');

    colorSetting();
};







sk_datePicker.prototype.createTable = function() {
    var _self = this;

    //initTable
    _self.target.append('<table class="sk_datepickTable"></table>');
    _self.sk_datepickTable = $('.sk_datepickTable', _self.target);

    //weekSetting
    var weekDisplayArray = _self.languagePack[0][_self.language]["weekday" + _self.settings.weekFormat];
    _self.sk_datepickTable.append(createTableRowHTML("weekdayRow", 0, weekDisplayArray));

    //buildFrame
    for (_j = 0; _j < 6; _j++) {
        _self.sk_datepickTable.append(createTableRowHTML("dateRow", _j));
    }

    function createTableRowHTML(pClass, pNum, pArray) {
        var _html = null;

        _html = '';
        _html += '';

        if (pClass == "weekdayRow") {
            _html += '<tr class="' + pClass + '">';
        } else {
            _html += '<tr class="' + pClass + '" data-rownum="' + pNum + '">';
        }

        for (_i = 0; _i < 7; _i++) {
            if (pClass == "weekdayRow") {
                _html += '	<td>';
                //_html += '		<span class="outerCellFrame">';
                _html += '			<span class="weekdayItem">';
                _html += '				<span class="dateText"><span class="item">' + pArray[_i] + '</span></span>';
                _html += '			</span>';
                //_html += '		</span>';
                _html += '	</td>';
            } else {
                _html += '	<td data-cellnum="' + _i + '">';
                //_html += '		<span class="outerCellFrame">';
                _html += '			<a href="javascript:void(0);" class="weekdayItem">';
                _html += '				<span class="dateText"><span class="item"></span></span>';
                // _html += '				<span class="firstDayIco"></span>';
                // _html += '				<span class="cover"></span>';
                _html += '			</a>';
                //_html += '		</span>';
                _html += '	</td>';
            }
        }

        _html += '</tr>';
        return _html;
    }
};

sk_datePicker.prototype.destroy = function() {
    var _self = this;

    if (_self.currentType == "whatsOn") {
        _self.destroyDisplayContentWO();
    }

    _self.yearArrowLeft.off('click');
    _self.yearArrowRight.off('click');
    _self.monthArrowLeft.off('click');
    _self.monthArrowRight.off('click');

    _self.sk_selectorWrapper.remove();
    _self.sk_datepickTable.remove();

    _self.currentMonthArray = null;

    _self.target = null;
    _self.settings = null;

    _self.initDate = null;
    _self.initDateObj = null;
    _self.language = null;

    _self.sk_selectorWrapper = null;
    _self.sk_datepickTable = null;

    _self.currentMonth = null;
    _self.currentYear = null;

    _self.currentMonthFirstDate = null;
    _self.currentMonthLastDate = null;

    _self.currentMonthArray = null;

    //console.log(_self.currentMonthArray, _self.sk_datepickTable);
};
