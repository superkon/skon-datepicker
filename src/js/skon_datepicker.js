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
sk_datePicker.prototype.arrowPrevious = null;
sk_datePicker.prototype.arrowNext = null;
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
        dataList : "",
        tableStyle: {

        },
        onChangeMonth: function(pTarget) {
            //console.log("change month or year");
        },
        onChangeDate: function(pTarget)
        {
            //console.log("change date");
        }
    };

    $.extend(_self.settings, config);

    _self.init();
}

sk_datePicker.prototype.listInfo = null; 

sk_datePicker.prototype.init = function() {
    var _self = this;

    _self.language = _self.settings.lang;

    //init Date Array
    _self.setInitDateArray();

    //dataPicker with listing case
    if(_self.settings.dataList !== ""){

        var _path = _self.settings.dataList;

        _self.listInfo = {};

        _self.listInfo.listStartDate = _path.basicInfo.startDate;
        _self.listInfo.listEndDate = _path.basicInfo.endDate;
        _self.listInfo.isRangeBound = _path.basicInfo.isRangeBound;
        _self.listInfo.listArray = _path.items;
        
        //console.log(_self.listInfo.listArray[0].date);
    }

    //selectorControl ( Customize S1 )
    _self.createSelectController();

    _self.listShowHideFn();

    //createTable
    _self.createTable();

    //add Date into cell
    _self.buildCurrentMonthArray();

};

sk_datePicker.prototype.listShowHideFn = function() {
    var _self = this;

    _self.listInfo.listStartDate = moment(_self.listInfo.listStartDate, "DD-MM-YYYY");
    _self.listInfo.listEndDate = moment(_self.listInfo.listEndDate, "DD-MM-YYYY");

    var _startYear = _self.listInfo.listStartDate.year();
    var _startMonth = _self.listInfo.listStartDate.month();

    var _endYear = _self.listInfo.listEndDate.year();
    var _endMonth = _self.listInfo.listEndDate.month();

    if(_self.listInfo.isRangeBound)
    {
        _self.arrowPrevious.show();
        _self.arrowNext.show();

        if((_self.currentYear === _endYear)&&(_self.currentMonth === _endMonth))
        {
            _self.arrowNext.hide();
        }

        if((_self.currentYear === _startYear)&&(_self.currentMonth === _startMonth))
        {
            _self.arrowPrevious.hide();
        }
    }
};

sk_datePicker.prototype.createSelectController = function() {
    var _self = this;

    //initControllerTable
    _self.target.append('<div class="sk_selectorWrapper ' + _self.settings.controller + '"></div>');
    _self.sk_selectorWrapper = $('.sk_selectorWrapper', _self.target);

    _self.sk_selectorWrapper.append(createSelectorHTML());

    _self.arrowPrevious = $('.selectorItem .datepickerArrow.left', _self.target);
    _self.arrowNext = $('.selectorItem .datepickerArrow.right', _self.target);

    bindSelectorArrow();

    function createSelectorHTML() {
        var _html = null;

        _html = '';

        _html += '<div class="monthSelectWrapper">';
        _html += '   <div class="selectorItem">';
        _html += '       <a href="javascript:void(0);" class="datepickerArrow left">';
        _html += '           <span class="ghost"></span><span class="icon-arrowRight"></span>';
        _html += '       </a><span class="displayValue"><span class="month">'+_self.monthDisplayArray[_self.currentMonth]+'</span><span class="year"> '+_self.currentYear+'</span>';
        _html += '       </span><a href="javascript:void(0);" class="datepickerArrow right">';
        _html += '           <span class="ghost"></span><span class="icon-arrowLeft"></span>';
        _html += '       </a>';
        _html += '   </div>';
        _html += '</div>';

        return _html;
    }

    function bindSelectorArrow() {

        _self.arrowNext.on('click', function(){

            _self.currentMonth = (_self.currentMonth + 1) % 12;

            if(_self.currentMonth === 0)
            {
                _self.currentYear++;
            }

            _self.listShowHideFn();

            $('.displayValue', _self.target)
                .html('<span class="month">'+_self.monthDisplayArray[_self.currentMonth]+'</span><span class="year"> '+_self.currentYear+'</span>');

            logCurrentData();
        });

        _self.arrowPrevious.on('click', function(){

            _self.currentMonth = (_self.currentMonth - 1 < 0) ? _self.currentMonth = 11 : _self.currentMonth - 1;

            if(_self.currentMonth === 11)
            {
                _self.currentYear--;
            }

            _self.listShowHideFn();

            $('.displayValue', _self.target)
                .html('<span class="month">'+_self.monthDisplayArray[_self.currentMonth]+'</span><span class="year"> '+_self.currentYear+'</span>');

            logCurrentData();
        });
    }

    function logCurrentData() {
        // unbind date
        _self.weekdayItem.off('click');

        $('.displayDateText', _self.target).remove();
        $('.weekdayItem', _self.target).removeClass('selected');
        _self.selectedDate = null;

        _self.buildCurrentMonthArray();
    }
};

sk_datePicker.prototype.setInitDateArray = function() {
    var _self = this;

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

    //console.log(_self.currentMonthArray);

    _self.addDateItem();

    _self.weekdayItem = $('.weekdayItem', _self.target);

    if (_self.settings.onChangeDate != "undefinded") {
        _self.settings.onChangeDate(_self);
    }
};

sk_datePicker.prototype.selectedDate = null;

sk_datePicker.prototype.addDateItem = function() {
    var _self = this;

    var _counter = 0;

    if (_counter === 0) {
        changeContent();

        if (_self.settings.onChangeMonth != "undefinded") {
            _self.settings.onChangeMonth(_self);
        }

        $('.weekdayItem', _self.target).off('click').on('click', function() {

            if(($(this).hasClass('wEvent'))&&(!$(this).hasClass('selected')))
            {
                var _date = $(this).data('date');

                //console.log(_date);

                //Load Ajax Or one list
                $('.weekdayItem', _self.target).removeClass('selected');
                
                $(this).addClass('selected');

                //console.log(_self.listInfo.listArray[0][_date].time);

                $('.displayDateText', _self.target).remove();

                var _htmlContent = null;
                _htmlContent = '';

                _htmlContent += '<div class="displayDateText">';

                for(var _i=0; _i<_self.listInfo.listArray[0][_date].time.length; _i++ )
                {
                    _htmlContent += '<a href="#" class="timeItem"><span class="text">'+_self.listInfo.listArray[0][_date].time[_i]+'</span></a>';
                }

                _htmlContent += '</div>';

                $(_htmlContent).insertAfter($('.sk_datepickTable', _self.target));

                _self.selectedDate = _date;

                $('.timeItem', _self.target).off('click').on('click', function()
                {
                    var _time = $(this).find('.text').html();
                    console.log(_date, _time);
                });
            }
        });
    }

    _counter++;

    function changeContent() {
        //clear
        $('.dateRow td', _self.target).find('.item').html('');
        $('.weekdayItem', _self.target).removeClass('current');
        $('.weekdayItem', _self.target).removeClass('wEvent');
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

            //var len = $.map(_self.listInfo.listArray[0], function(n, i) { return i; }).length;
            //special case
            $.each(_self.listInfo.listArray[0], function(_k, _el)
            {
                if(_k === _string)
                {
                    $('.weekdayItem[data-date="' + _k + '"]', _self.target).addClass('wEvent');
                }
            });
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
    _htmlContent += '   <p class="text-content">';
    _htmlContent += '       <span class="fc-text-' + pArray.tag[0] + '">' + pArray.firstChar + '</span>' + pArray.updatedMessage;
    _htmlContent += '       <a href="' + pArray.link + '" class="readmore"> more&raquo;</a>';
    _htmlContent += '   </p>';
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
                _html += '  <td>';
                //_html += '        <span class="outerCellFrame">';
                _html += '          <span class="weekdayItem">';
                _html += '              <span class="dateText"><span class="item">' + pArray[_i] + '</span></span>';
                _html += '          </span>';
                //_html += '        </span>';
                _html += '  </td>';
            } else {
                _html += '  <td data-cellnum="' + _i + '">';
                //_html += '        <span class="outerCellFrame">';
                _html += '          <a href="javascript:void(0);" class="weekdayItem">';
                _html += '              <span class="dateText"><span class="item"></span></span>';
                // _html += '               <span class="firstDayIco"></span>';
                // _html += '               <span class="cover"></span>';
                _html += '          </a>';
                //_html += '        </span>';
                _html += '  </td>';
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

    _self.arrowPrevious.off('click');
    _self.arrowNext.off('click');
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

//# sourceMappingURL=../maps/skon_datepicker.min.map
