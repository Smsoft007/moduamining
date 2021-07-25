var Trade = function(){
	transactionSocket.on('tradeSocketExceedingLimit', function() {
		alert(LANG.TRADE_SOCKET_EXCEEDING_LIMIT[NUM]);
		if (navigator.appVersion.indexOf("MSIE 6.0") >= 0) {
			parent.window.close();
		} else {
			parent.window.open('about:blank', '_self').close();
		}
	});
	transactionSocket.on('notifyDealers', function(data) {
		var type = data.EX_TYPE;
		var key = data.EX_KEY;
		var sname = data.SNAME;
		var dealerList = data.DEALERS;

		var uid = D_UID;
		if (uid == '') {
			return;
		}
		var tradeInfo;
		var workOn = false;
		for (var i = 0; i < dealerList.length; i++) {
			if (uid == dealerList[i].EX_UID) {
				tradeInfo = dealerList[i];
				workOn = true;
				break;
			}
		}
		if (!workOn) {
			return;
		}
		var message = '';
		if (type == 'S') {
			if (NUM == 0) {
				message = "나의 " + LANG.COIN_NAME[sname][NUM]  + " 매도신청건이 거래되었습니다.";
			} else {
				message = "My " + LANG.COIN_NAME[sname][NUM] + " sell order application was traded.";
			}
		} else {
			message = LANG.TRADE_OCCURRED_BUY[NUM];
			if (NUM == 0) {
				message = "나의" + LANG.COIN_NAME[sname][NUM]  + " 매수신청건이 거래되었습니다.";
			} else {
				message = "My " + LANG.COIN_NAME[sname][NUM] + "purchase request transaction was done.";
			}
		}
		//Chrome
		if (navigator.appVersion.indexOf("Chrome") >= 0) {
			Push.create('notice', {
				body: message
			});
			//Explorer
		} else {
			setTimeout(function() {
				alert(message);
			}, 100);
		}
	});
}

Trade.prototype.main = function(){

	var TIMER;
	var FEE_S=0, FEE_B=0,FEE_S_P=0,FEE_B_P=0, S_FEE_TYPE, B_FEE_TYPE;
	var CURRENT_TAB = 'B';
	var TOKEN;
	var KEY, TYPE;
	var NOW_RATE = 0;
	var BE_RATE = 0;

	transactionSocket.on('transactionOccurred', function(data) {
		if (CURRENT_TAB == undefined) {
			return;
		}
		var Params = {};
		Params['TYPE'] = data.TYPE;
		Params['KEY'] = data.KEY;
		Params['STAN_SNAME'] = 'USD';
		Params['SNAME'] = division;

		commonLib.doAjaxWithPromise('trade/getRefreshData', Params).call()
			.then(function(data) {
				console.log(data);
				bindingTopCoinRateArea(data.COIN_REAL_ALLRATE.recordset);
				bindingMarketStatusArea(data.COIN_ORDER_LIST.recordsets);
				bindingRealTimeTradingArea(data.COIN_EXCHANGE_LIST.recordset);
				if (LOGIN) {
					getMyCoinMissionsArea();
					getMyBalance();
				}
			});
	});


	settingCustomScrollbar(".content-ad");
	settingCustomScrollbar(".content-td");
	settingCustomScrollbar(".content-dd");
	settingCustomScrollbar(".content-sd");

	getTopCoinRateArea()
		.then(openTradeTab('B'))
		.then(function() {
			return commonLib.promiseWrapper(function() {
				$("#D_PRICE_B").val(commonLib.getMoneyFormat(NOW_RATE));
				$("#D_PRICE_S").val(commonLib.getMoneyFormat(NOW_RATE));
			})
		})
		.fail(function(err) {
			console.error('init fail err : ' + err);
		});
	if (LOGIN) {
		initFee();
		getMyBalance();
	}
	checkPrice($("#TOTAL_RECEIVED_AMOUNT_B"));
	getRealTimeTradingArea();

	function bindingMyBalance(list) {
		var bindingObject = {};
		for(var i = 0; i < list.length; i++){
			var my = list[i];
			bindingObject['MY_'+my.COIN_GUBUN] = my.POSSESSION_COIN;
			bindingObject['MY_'+my.COIN_GUBUN+'_VALUE'] = my.COIN_TO_USD;
		}
		commonLib.bindData(bindingObject);
	}

	function getMyBalance() {
		commonLib.doAjax('/trade/myCoinBalance', null, true, function(err, data) {
			if (err) {
				window.location.href = "/";
				return;
			}
			//var list = TEST_DATA.myCoinBalance;
			var list = data.data;
			bindingMyBalance(list);
		});
	}


	function openMyCoinMissionPop() {
		$("#popup-bg").css("display", "table");
		$("#popup-bg #pop-detailed").css("display", "block");
	}

	function closeMyCoinMissionPop() {
		$("#popup-bg").css("display", "none");
		$("#popup-bg #pop-detailed").css("display", "none");
	}

	function bindingTopCoinRateArea(list) {
		console.log(2);
		var bindingObject = {};
		for(var i = 0; i < list.length; i++){
			var coinrate = list[i]
			var d = new Date();
			d = (d.getMonth()+1) + "/"  + d.getDate() +" " + d.getHours() +":"+ d.getMinutes();
			bindingObject['S_DATE'] =d;
			if(division == coinrate.C_NAME){
				NOW_RATE = coinrate.NOW_RATE?coinrate.NOW_RATE : 0;
				BE_RATE = coinrate.BE_RATE?coinrate.BE_RATE : 0;
			}
			bindingObject['NOW_RATE_'+coinrate.C_NAME] = coinrate.NOW_RATE?coinrate.NOW_RATE : 0;
			bindingObject['BE_RATE_'+coinrate.C_NAME] = coinrate.BE_RATE?coinrate.BE_RATE : 0;
			bindingObject['END_RATE_'+coinrate.C_NAME] = coinrate.END_RATE?coinrate.END_RATE : 0;
			bindingObject['DIFF_SIGN_'+coinrate.C_NAME] = (coinrate.UDGUBUN  != "D")? "↑" : "↓";
			bindingObject['DIFF_SIGN2_'+coinrate.C_NAME] = (coinrate.UDGUBUN  != "D")? "▲" : "▼";
			bindingObject['DIFF_RATE_'+coinrate.C_NAME] = coinrate.DIF_RATE?coinrate.DIF_RATE : 0;
			bindingObject['DIFF_PERCENT_SIGN_'+coinrate.C_NAME] = (coinrate.UDGUBUN  != "D")? "+" : "-";
			bindingObject['DIFF_PERCENT_'+coinrate.C_NAME] = coinrate.CHAN_RATE?coinrate.CHAN_RATE.toFixed(2) : 0;
			bindingObject['MAX_RATE_'+coinrate.C_NAME] = coinrate.TODAY_MAX_RATE?coinrate.TODAY_MAX_RATE : 0;
			bindingObject['MIN_RATE_'+coinrate.C_NAME] = coinrate.TODAY_MIN_RATE?coinrate.TODAY_MIN_RATE : 0;
			bindingObject['NOW_QUANT_'+coinrate.C_NAME] = coinrate.SERVER_QTY?coinrate.TODAY_VOLUME : 0;

			var rateSplit = coinrate.NOW_RATE.toString().split('.');
			console.log(coinrate.NOW_RATE);
			bindingObject['NOW_RATE_F_'+coinrate.C_NAME] = rateSplit[0] ? rateSplit[0] : "0";
			bindingObject['NOW_RATE_D_'+coinrate.C_NAME] = rateSplit[1] ? rateSplit[1] : "00";
			bindingObject['COIN_SYMBOL_'+coinrate.C_NAME] = coinrate.C_NAME;
			//칼라용
			$('.'+coinrate.C_NAME+'_UD').addClass((coinrate.UDGUBUN  != "D")? "tx-blue" : "tx-red");
		}
		commonLib.bindData(bindingObject);
	}

	function getTopCoinRateArea() {
		var deferred = $.Deferred();
		commonLib.doAjaxWithPromise('/trade/coinRealAllRate', null).call()
			.then(function(data) {
				var list = data.recordset;
				//var list =TEST_DATA.coinRealAllRate;
				console.log(data);
				bindingTopCoinRateArea(list);

				deferred.resolve(data);
			})
			.fail(function(err) {
				deferred.reject(err);
			});
		return deferred.promise();
	}


	function changePrice(parentCell) {
		var cell = $(parentCell).children("[data-class='price']");

		if (cell.length == 0) {
			return;
		}
		cell = cell[0];

		var newPrice = cell.innerHTML;
		if (newPrice == undefined) {
			return;
		}

		newPrice = newPrice.replaceAll(',', '');
		var oldPrice, inputId;
		inputId = '#D_PRICE_' + CURRENT_TAB;
		oldPrice = $(inputId).val();
		if (!commonLib.isNull(oldPrice)) {
			oldPrice = oldPrice.replaceAll(',', '');
		}

		if (newPrice == oldPrice) {
			return;
		}
		MARKET_STATUS_SELECETED_ROW_NUMBER = cell.id;
		$(inputId).val(commonLib.getMoneyFormat(newPrice));

		calculate();
	}

	function calculate() {
		$("#btn-trade-buy").attr('disabled', true);
		$("#btn-trade-sell").attr('disabled', true);


		//
		// FEE_S -- 매도 수수료
		// FEE-B -- 매수 수수료
		// S_FEE_TYPE -- 매도 수수료 타입 (S-선공제 , E --후공제)
		// B_FEE_TYPE -- 매수 수수료 타입 (S-선공제 , E --후공제)
		//
		if (CURRENT_TAB == 'B') {
			var myBalance = $("#AVAILABLE_COIN_USD").val()? $("#AVAILABLE_COIN_USD").val().replaceAll(',', ''): 0;
			var amount = $("#AMOUNT_B").val()?$("#AMOUNT_B").val().replaceAll(',', '') : 0;
			var price = $("#D_PRICE_B").val().replaceAll(',', '');
			var totalReceivedAmout = 0;
			var fee = FEE_B;
			var totalFee = 0;
			var totalPrice = 0;
			if (isNaN(amount)) {
				amount = 0;
			}
			if (isNaN(price)) {
				price = 0;
			}
			totalFee = fee*amount/100;
			totalFee = totalFee.toFixed(8);
			if (B_FEE_TYPE == 'S') {
				totalPrice = amount * price;
				totalReceivedAmout = amount - totalFee;
			} else {
				totalPrice = (amount * price) + FEE_B;
				totalReceivedAmout = amount;
			}
			if(LOGIN){
				if(parseFloat(myBalance) < parseFloat(totalPrice)){
					alert(LANG.LANG_485[NUM]);
					getMax('B');
					return;
				}
			}
			totalReceivedAmout = (totalReceivedAmout * 1).toFixed(8);
			$("#AMOUNT_B").val(commonLib.getNumberFormat(amount));
			$("#TOTAL_INPUT_AMOUNT_B").val(commonLib.getMoneyFormat(amount * price));
			$("#TOTAL_FEE_B").text(commonLib.getCoinFormat(totalFee));
			$("#TOTAL_RECEIVED_AMOUNT_B").text(commonLib.getCoinFormat(totalReceivedAmout));

		} else {
			var myBalance = $("#AVAILABLE_BUY_COIN_"+division).val()? $("#AVAILABLE_BUY_COIN_"+division).val().replaceAll(',', ''): 0;
			var amount = $("#AMOUNT_S").val()?$("#AMOUNT_S").val().replaceAll(',', '') : 0;
			var price = $("#D_PRICE_S").val().replaceAll(',', '');

			var totalReceivedAmout = 0;
			var fee = FEE_S;
			totalReceivedAmout = amount* price;
			totalFee = fee * totalReceivedAmout/100;
			if (S_FEE_TYPE == 'S') {
				totalPrice = parseFloat(totalReceivedAmout - totalFee);
			} else {
				totalPrice = parseFloat(totalReceivedAmout);
			}
			if(LOGIN){
				if(parseFloat(myBalance) < parseFloat(amount)){
					alert(LANG.LANG_485[NUM]);
					getMax();
					return;
				}
			}
			$("#AMOUNT_S").val(commonLib.getNumberFormat(amount));
			$("#TOTAL_INPUT_AMOUNT_S").val(commonLib.getMoneyFormat(totalReceivedAmout));
			$("#TOTAL_FEE_S").text(commonLib.getMoneyFormat(totalFee));
			$("#TOTAL_RECEIVED_AMOUNT_S").text(commonLib.getMoneyFormat(totalPrice));

		}

		// popup param
		if (CURRENT_TAB == 'B') {
			$("#BUY_REQUEST_POP_AMOUNT").text(commonLib.getCoinFormat(amount));
			$("#BUY_REQUEST_POP_AMOUNT_TOP").text(commonLib.getCoinFormat(amount));
			$("#BUY_REQUEST_POP_TOTAL_PRICE").text(commonLib.getMoneyFormat(totalPrice));
			$("#BUY_REQUEST_POP_TOTAL_PRICE_TOP").text(commonLib.getMoneyFormat(totalPrice));
			$("#BUY_REQUEST_POP_PRICE_PER_COIN").text(commonLib.getMoneyFormat(price));
			$("#BUY_REQUEST_POP_FEE").text(commonLib.getMoneyFormat(totalFee));

		} else {
			$("#SELL_REQUEST_POP_AMOUNT").text(commonLib.getMoneyFormat(amount));
			$("#SELL_REQUEST_POP_AMOUNT_TOP").text(commonLib.getMoneyFormat(amount));
			$("#SELL_REQUEST_POP_TOTAL_PRICE").text(commonLib.getMoneyFormat(totalPrice));
			$("#SELL_REQUEST_POP_TOTAL_PRICE_TOP").text(commonLib.getMoneyFormat(totalPrice));
			$("#SELL_REQUEST_POP_PRICE_PER_COIN").text(commonLib.getMoneyFormat(price));
			$("#SELL_REQUEST_POP_FEE").text(commonLib.getMoneyFormat(totalFee));
		}

		$("#btn-trade-buy").attr('disabled', false);
		$("#btn-trade-sell").attr('disabled', false);
		return true;

	}

	function request() {
		if (commonLib.isNull(TOKEN)) {
			return;
		}
		var Params = {};
		if (CURRENT_TAB == 'B') {
			Params['STAN_SNAME'] = 'USD';
			Params['SNAME'] = division;
			Params['D_PRICE'] = $("#D_PRICE_B").val().replaceAll(',', '');
			Params['D_QTY'] = $("#AMOUNT_B").val().replaceAll(',', '');
			Params['W_FEE'] = $("#BUY_REQUEST_POP_FEE").text().replaceAll(',', '');
			Params['TOKEN'] = TOKEN;
			Params['TYPE'] = 'B';
		} else {
			Params['STAN_SNAME'] = 'USD';
			Params['SNAME'] = division;
			Params['D_PRICE'] = $("#D_PRICE_S").val().replaceAll(',', '');
			Params['D_QTY'] = $("#AMOUNT_S").val().replaceAll(',', '');
			Params['W_FEE'] = $("#SELL_REQUEST_POP_FEE").text().replaceAll(',', '');
			Params['TOKEN'] = TOKEN;
			Params['TYPE'] = 'S';
		}
		var type = Params['TYPE'];
		stopTimer();
		commonLib.doAjax('trade/coinTrade', Params, true, function(err, data) {
			if (err) {
				window.location.href = "/";
				return;
			}
			alert(data.message);
			closeRequestConfirmPop();
			getMyBalance();
		});

	}


	function bindingMarketStatusArea(data) {
		//var sellList = data['SELL_LIST'];
		//var buyList =data["BUY_LIST"];
		//var sellAllAmount = data['SELL_SUM'];
		//var buyAllAmount =data['BUY_SUM'];

		var sellList = data[0];
		var buyList = data[1];

		var sellAllAmount = data[2][0].SELL_SUM;
		var buyAllAmount = data[2][0].BUY_SUM;

		var marketStatusAreaDiv = $(".content-dd").find(".mCSB_container");
		var marketStatusAreaTableHtml = '';

		//var viewCnt = 0;
		var item;

		var cumulativeSelling = 0;
		for (var i = 0; i < sellList.length; i++) {
			item = sellList[i];
			cumulativeSelling += item.C_REMAIN_COIN;
		}

		var cumulativeBuying = 0;
		for (var i = 0; i < buyList.length; i++) {
			item = buyList[i];
			cumulativeBuying += item.C_REMAIN_COIN;
		}

		var rowIdx = 0;
		var myOrder = false;
		var graphWidth;
		var currentRowHtml = '';
		var checkratedif = 0;

		for (var i = sellList.length-1; i >= ((sellList.length > 10)? (sellList.length-10) : 0); i--) {
			console.log(i);
			item = sellList[i];
			currentRowHtml = '';
			if (NOW_RATE == item.C_RATE) {
				currentRowHtml += '<div class="TD SELL active">';
			} else {
				if (item.SELL_NOW == 'Y') {
					currentRowHtml += '<div class="TD SELL flash">';
				} else {
					currentRowHtml += '<div class="TD SELL">';
				}
			}

			graphWidth = (item.C_REMAIN_COIN / cumulativeSelling) * 100;
			checkratedif = ((item.C_RATE - BE_RATE)/item.C_RATE * 100).toFixed(2);

			currentRowHtml += '	<p class="fl-l tx-c w10p tx-yellow" data-class="star"><i class="fa '+((item.MY_ORDER == 'Y')? 'fa-star':'')+'"></i></p>';
			currentRowHtml += '	<p class="fl-l tx-r w25p tx-blue">';
			currentRowHtml += '		<span class="price-graph sell-graph" style="width: ${GRAPH_WIDTH};"></span>'.replace('${GRAPH_WIDTH}', parseInt(graphWidth) + '%');
			currentRowHtml += '		<span class="price-text">' + (commonLib.getFourDigitNumber(item.C_REMAIN_COIN))+ '</span>';
			currentRowHtml += '	</p>';
			currentRowHtml += '	<p class="fl-l tx-c w20p" data-class="price" style="cursor: pointer;" id="S_marketStatus_row' + (rowIdx++) + '">' + commonLib.getMoneyFormat(item.C_RATE) + '</p>';
			currentRowHtml += ' <p class="fl-l tx-r w10p tx-grey">' + checkratedif + '%</p>';
			currentRowHtml += '	<p class="fl-l tx-r w25p">&nbsp;</p>';
			currentRowHtml += '	<p class="fl-l tx-c w10p tx-yellow">&nbsp;</p>';
			currentRowHtml += '	<div class="asking-price-box">';
			currentRowHtml += '	<div class="asking-price-box-left"></div>';
			currentRowHtml += '	<div class="asking-price-box-right"></div>';
			currentRowHtml += '	</div>';
			currentRowHtml += '</div>';

			marketStatusAreaTableHtml += currentRowHtml;
		}
		if(buyList.length > 0){
			marketStatusAreaTableHtml += '<div style="border: 1px solid #E0E0E0;"></div>';
		}
		rowIdx = 0;
		for (var i = 0; i < ((buyList.length > 10)? 10 : buyList.length); i++) {

			item = buyList[i];

			currentRowHtml = '';
			//current rate
			if (NOW_RATE == item.C_RATE) {
				currentRowHtml += '<div class="TD BUY active">';
			} else {
				if (item.BUY_NOW == 'Y') {
					currentRowHtml += '<div class="TD BUY flash">';
				} else {
					currentRowHtml += '<div class="TD BUY">';
				}
			}
			graphWidth = (item.C_REMAIN_COIN / cumulativeBuying) * 100;
			checkratedif = ((item.C_RATE - BE_RATE)/item.C_RATE * 100).toFixed(2);
			currentRowHtml += '	<p class="fl-l tx-c w10p tx-yellow">&nbsp;</p>';
			currentRowHtml += '	<p class="fl-l tx-r w25p ">&nbsp;</p>';
			currentRowHtml += '	<p class="fl-l tx-c w20p" data-class="price" id="B_marketStatus_row' + (rowIdx++) + '">' + commonLib.getMoneyFormat(item.C_RATE) + '</p>';
			currentRowHtml += ' <p class="fl-l tx-r w10p tx-grey">' + checkratedif + '%</p>';
			currentRowHtml += '	<p class="fl-l tx-r w25p tx-red">';
			currentRowHtml += '		<span class="price-graph buy-graph" style="width: ${GRAPH_WIDTH};"></span>'.replace('${GRAPH_WIDTH}', parseInt(graphWidth) + '%');
			currentRowHtml += '		<span class="price-text">' + commonLib.getFourDigitNumber(item.C_REMAIN_COIN) + '</span>';
			currentRowHtml += '	</p>';
			currentRowHtml += '	<p class="fl-l tx-c w10p tx-yellow" data-class="star"><i class="fa '+((item.MY_ORDER == 'Y')? 'fa-star':'')+'"></i></p>';
			currentRowHtml += '	<div class="asking-price-box">';
			currentRowHtml += '	<div class="asking-price-box-left"></div>';
			currentRowHtml += '	<div class="asking-price-box-right"></div>';
			currentRowHtml += '</div></div>';
			marketStatusAreaTableHtml += currentRowHtml;
		}
		marketStatusAreaTableHtml += '<div style="border: 1px solid #C0C0C0;"></div>';
		marketStatusAreaTableHtml += '<div class="TD price-sum">';
		marketStatusAreaTableHtml += '	<p class="fl-l tx-c w10p tx-yellow">&nbsp;</p>';
		marketStatusAreaTableHtml += '	<p class="fl-l tx-c w25p tx-blue">';
		marketStatusAreaTableHtml += '		<span class="price-graph sell-graph"></span>';
		marketStatusAreaTableHtml += '		<span class="price-text">' + commonLib.getFourDigitNumber(sellAllAmount) + '</span>';
		marketStatusAreaTableHtml += '	</p>';
		marketStatusAreaTableHtml += '	<p class="fl-l tx-c w30p" rowspan="2">' + LANG.TRADE_LANG1[NUM] + '</p>';
		marketStatusAreaTableHtml += '	<p class="fl-l tx-r w25p tx-red">';
		marketStatusAreaTableHtml += '		<span class="price-graph buy-graph"></span>';
		marketStatusAreaTableHtml += '		<span class="price-text">' + commonLib.getFourDigitNumber(buyAllAmount) + '</span>';
		marketStatusAreaTableHtml += '	</p>';
		marketStatusAreaTableHtml += '	<p class="fl-l tx-c w10p tx-yellow">&nbsp;</p>';
		marketStatusAreaTableHtml += '</div>';

		marketStatusAreaDiv.html(marketStatusAreaTableHtml);
		$(".TD").click(function(){
			changePrice(this);
		});
		var flashRowDiv = marketStatusAreaDiv.children('.flash');
		for (var i = 0; i < flashRowDiv.length; i++) {
			item = $(flashRowDiv[i]);
			item.removeClass('flash');
			item.addClass('active');
			setTimeout(function() {
				item.removeClass('active');
			}, 500);
		}
	}

	function getMarketStatusArea() {
		var deferred = $.Deferred();
		var Params = {};
		Params['STAN_SNAME'] = 'USD';
		Params['SNAME'] = division;
		if (KEY == undefined) {
			Params['EX_KEY'] = '';
		} else {
			Params['EX_KEY'] = key;
		}

		if (TYPE == undefined) {
			Params['EX_TYPE'] = CURRENT_TAB;
		} else {
			Params['EX_TYPE'] = type;
		}

		commonLib.doAjax('trade/getMarketStatusArea', Params, true, function(err, data) {
			if (err) {
				deferred.reject(err);
				window.location.href = "/";
				return;
			}
			var data = data.recordsets;
			//var list = TEST_DATA.coinOrderList;

			bindingMarketStatusArea(data);
			deferred.resolve(data);
		});
		return deferred.promise();
	}

	function bindingRealTimeTradingArea(list) {
		var realTimeTradingTableDiv = $(".content-sd").find(".mCSB_container");
		var html = '';

		var item;
		for (var i = 0; i < list.length; i++) {
			item = list[i];
			html += '<div class="TD">';
			html += '	<p class="fl-l tx-l w33p">' + item.SDATE + '</p>';
			html += '	<p class="fl-l tx-r w33p">' + commonLib.getMoneyFormat(item.C_RATE) + '</p>';
			html += '	<p class="fl-l tx-r w33p '+((item.GUBUN == 'BUY')? 'tx-blue': 'tx-red')+'">' + commonLib.getCoinFormat(item.C_QTY) + '</p>';
			html += '</div>';
		}
		html += '</div>';
		realTimeTradingTableDiv.html(html);
	}

	function getRealTimeTradingArea() {
		var Params = {};
		Params['STAN_SNAME'] = 'USD';
		Params['SNAME'] = division;
		if (KEY == undefined) {
			Params['EX_KEY'] = '';
		} else {
			Params['EX_KEY'] = key;
		}

		if (TYPE == undefined) {
			Params['EX_TYPE'] = CURRENT_TAB;
		} else {
			Params['EX_TYPE'] = type;
		}


		commonLib.doAjax('trade/getRealTimeTradingArea', Params, true, function(err, data) {
			if (err) {
				return;
			}
			//var list = TEST_DATA.coinExchangeList;
			var list = data.recordset;
			bindingRealTimeTradingArea(list);

		});

	}

	function settingCustomScrollbar(selector) {

		$(function() {
			$(selector).mCustomScrollbar({ // on choisit la div "intro"
				verticalScroll: true, // barre verticale
				theme: "minimal-dark", // theme pour la barre, personnalisable
				axis : "y",
				scrollButtons: {
					enable: true // on choisit d'afficher les fleches haut et bas
				},
				advanced:{
					updateOnContentResize: true,
				}
			});
		});
	}

	function checkAmount(obj) {
		if (!calculate()) {

		}
		return true;
	}

	function checkPrice(obj) {
		if (!calculate()) {

		}
		return true;
	}

	function getVariablePrice(division) {
		if (division == 'BTC') {
			return 2000;
		} else if (division == 'TIC') {
			return 0.1;
		}
	}

	function upPrice() {
		var selectedRowNumber;
		var rowIdx = 0;
		var endRow;
		var variablePrice = getVariablePrice(division);
		while (true) {
			if ($("#" + CURRENT_TAB + "_marketStatus_row" + rowIdx).length == 0) {
				rowIdx--;
				endRow = rowIdx;
				break;
			} else {
				rowIdx++;
			}
		}

		for (var i = 0; i <= endRow; i++) {
			if ($("#D_PRICE_" + CURRENT_TAB).val() == $("#" + CURRENT_TAB + "_marketStatus_row" + i).text()) {
				selectedRowNumber = i;
			}
		}

		var currentPrice = parseFloat($("#D_PRICE_" + CURRENT_TAB).val().replaceAll(',', ''));

		var nextPrice;
		if (selectedRowNumber == undefined) {
			if (currentPrice == 0) {
				nextPrice = $("#" + CURRENT_TAB + "_marketStatus_row" + endRow).text().replaceAll(',', '');
			} else {
				nextPrice = currentPrice + variablePrice;

			}
		} else {
			if (selectedRowNumber == 0) {
				nextPrice = currentPrice + variablePrice;
			} else {
				nextPrice = $("#" + CURRENT_TAB + "_marketStatus_row" + (selectedRowNumber - 1)).text().replaceAll(',', '');
			}
		}
		nextPrice = parseFloat(nextPrice).toFixed(2);
		$("#D_PRICE_" + CURRENT_TAB).val(commonLib.getMoneyFormat(nextPrice));
		calculate();
	}

	function downPrice() {
		var selectedRowNumber;
		var rowIdx = 0;
		var endRow;
		var variablePrice = getVariablePrice(division);

		while (true) {
			if ($("#" + CURRENT_TAB + "_marketStatus_row" + rowIdx).length == 0) {
				rowIdx--;
				endRow = rowIdx;
				break;
			} else {
				rowIdx++;
			}
		}

		for (var i = 0; i <= endRow; i++) {
			if ($("#D_PRICE_" + CURRENT_TAB).val() == $("#" + CURRENT_TAB + "_marketStatus_row" + i).text()) {
				selectedRowNumber = i;
			}
		}
		var currentPrice = parseFloat($("#D_PRICE_" + CURRENT_TAB).val().replaceAll(',', ''));


		var nextPrice;
		if (selectedRowNumber == undefined) {
			if (currentPrice == 0) {
				nextPrice = $("#" + CURRENT_TAB + "_marketStatus_row" + 0).text().replaceAll(',', '');
			} else {
				nextPrice = currentPrice - variablePrice;
			}
		} else {
			if (selectedRowNumber == endRow) {
				nextPrice = currentPrice - variablePrice;
			} else {
				nextPrice = $("#" + CURRENT_TAB + "_marketStatus_row" + (selectedRowNumber + 1)).text().replaceAll(',', '');
			}
		}
		nextPrice = nextPrice? parseFloat(nextPrice).toFixed(2) : 0;

		$("#D_PRICE_" + CURRENT_TAB).val(commonLib.getMoneyFormat(nextPrice));
		calculate();

	}
	var MY_COIN_MISSION_LIST;

	function bindingMyCoinMissionsArea(list) {
		var item;
		var myCoinMissionTableDiv = $(".content-td").find(".mCSB_container");

		var myCoinMissionTableHtml = '';
		var currentGubun;

		if (CURRENT_TAB == 'B') {
			currentGubun = 'BUY';
		} else {
			currentGubun = 'SELL';
		}
		for (var i = 0; i < list.length; i++) {
			item = list[i];
			if (item.C_REMAIN_COIN > 0) {
				var qty = item.C_REMAIN_COIN.toString().split('.');
				var dec = String((qty[1]?qty[1]:"0") + '00000000').slice(0,8);
				myCoinMissionTableHtml += '<div class="TD">';
				myCoinMissionTableHtml += '<p class="fl-l tx-c w10p ' + ((item.EX_GUBUN == "BUY")? 'tx-red">'+ lang.COIN_BUY[NUM] : 'tx-blue">'+lang.COIN_SELL[NUM]) +'</p>';
				myCoinMissionTableHtml += '<p class="fl-l tx-r w25p">' + commonLib.getMoneyFormat(item.C_RATE) + '</p>';
				myCoinMissionTableHtml += '<p class="fl-l tx-r w30p tx-red">' + qty[0] +'.<span class="tx-grey">'+dec+'</span></p>';
				myCoinMissionTableHtml += '<p class="fl-l tx-r w25p">' + commonLib.getMoneyFormat(item.C_RATE * item.C_REMAIN_COIN) + '</p>';
				myCoinMissionTableHtml += '<p class="fl-l tx-c w10p"><a class="btn-detailed"><i class="sm sm-multiply"></i></a></p>';
				myCoinMissionTableHtml += '</div>';
			}
		}
		myCoinMissionTableDiv.html(myCoinMissionTableHtml);

		//TOTAL_VOLUME_COIN, TOTAL_VOLUME_USD, TOTAL_CONCLUSION_QUANTITY_COIN, TOTAL_CONCLUSION_QUANTITY_USD, TOTAL_NOT_CONCLUSION_QUANTITY_COIN


		var detailTransactionAreaDiv = $(".content-ad").find(".mCSB_container");

		var detailTransactionAreaHtml = '';
		var total_quant = 0;
		var total_price = 0;
		var total_concluded_val = 0;
		var total_concluded_price = 0;
		var total_unconcluded_val = 0;
		var total_unconcluded_price = 0;

		for (var i = 0; i < list.length; i++) {
			item = list[i];
			if (item.C_REMAIN_COIN > 0) {
				detailTransactionAreaHtml += '<div class="TD">';
				detailTransactionAreaHtml +=	'<p class="fl-l tx-c w15p">' + item.C_IDATE + '</p>';
				detailTransactionAreaHtml +=	'<p class="fl-l tx-r w15p">' + commonLib.getMoneyFormat(item.C_RATE) + '</p>';
				detailTransactionAreaHtml +=	'<p class="fl-l tx-r w20p">' + item.C_REMAIN_COIN + '</p>';
				detailTransactionAreaHtml +=	'<p class="fl-l tx-r w25p">' + commonLib.getMoneyFormat(item.C_RATE*item.C_REMAIN_COIN) + '</p>';
				detailTransactionAreaHtml +=	'<p class="fl-l tx-r w25p"><a class="btn-block btn-s-red tx-c my_order_cancel" data-idx="'+ item.C_IDX+'" data-gubun="'+item.EX_GUBUN+'">'+lang.TRADE_MAIN22[NUM]+'</a></p>';
				total_unconcluded_val += item.C_REMAIN_COIN;
				total_unconcluded_price += item.C_RATE;
				detailTransactionAreaHtml += '</div>';
			}
			else{
				total_concluded_val += item.C_QTY;
				total_concluded_price += item.C_RATE;
			}

		}
		total_quant = total_concluded_val+ total_unconcluded_val;
		total_price = total_concluded_price+ total_unconcluded_price;
		detailTransactionAreaDiv.html(detailTransactionAreaHtml);

		var bindingObject = {};
		bindingObject['TOTAL_QUANT'] = total_quant;
		bindingObject['TOTAL_PRICE'] = total_price;
		bindingObject['TOTAL_CONCLUDED_PRICE'] = total_concluded_price;
		bindingObject['TOTAL_CONCLUDED_VAL'] = total_concluded_val;
		bindingObject['TOTAL_UNCONCLUDED_PRICE'] = total_unconcluded_price;
		bindingObject['TOTAL_UNCONCLUDED_VAL'] = total_unconcluded_val;

		commonLib.bindData(bindingObject);

		$(".my_order_cancel").click(function(){
			var idx = $(this).data("idx");
			var gubun =$(this).data("gubun");
			myCoinOrderCancel(idx,gubun);
		});


		$(".btn-detailed").click(function(){
			openMyCoinMissionPop();
		});
	}

	function getMyCoinMissionsArea() {
		var Params = {};
		Params['STAN_SNAME'] = 'USD';
		Params['SNAME'] = division;
		if (KEY == undefined) {
			Params['EX_KEY'] = '';
		} else {
			Params['EX_KEY'] = key;
		}
		if (TYPE == undefined) {
			Params['EX_TYPE'] = CURRENT_TAB;
		} else {
			Params['EX_TYPE'] = type;
		}

		commonLib.doAjax('trade/myCoinOrderList', Params, true, function(err, data) {
			if (err) {
				window.location.href = "/";
				return;
			}
			//var list = TEST_DATA.myCoinOrderList;
			var list = data.recordset;
			bindingMyCoinMissionsArea(list);


		});
	}

	function myCoinOrderCancel(idx, gubun) {
		if (!confirm(LANG.TRADE_LANG2[NUM])) {
			return;
		}
		var Params = {};
		Params['C_IDX'] = idx;

		Params['C_GUBUN'] = gubun;

		commonLib.doAjax('trade/myCoinOrderCancel', Params, true, function(err, data) {
			if (err) {
				window.location.href = "/";
				return;
			}
			alert(data.message);
			if (data.returnValue == 0) {
				closeMyCoinMissionPop();
				openTradeTab(CURRENT_TAB).call();
			}

		});
	}

	function initFee() {
		var Params = {};
		Params['STAN_COIN'] = division;
		commonLib.doAjax('trade/myCoinFee', Params, true, function(err, data) {
			if (err) {
				window.location.href = "/";
				return;
			}
			//var data = TEST_DATA.myCoinFee;
			var data = data.data;
			FEE_B = data.FEE_B;
			FEE_S = data.FEE_S;
			data['FEE_B_P'] = data.FEE_B;
			data['FEE_S_P'] = data.FEE_S;
			data['FEE_S'] = data.FEE_S*100;
			data['FEE_B'] = data.FEE_B*100;
			S_FEE_TYPE = data.S_FEE_TYPE;
			B_FEE_TYPE = data.B_FEE_TYPE;

			commonLib.bindData(data);
			//
			// FEE_S -- 매도 수수료
			// FEE-B -- 매수 수수료
			// S_FEE_TYPE -- 매도 수수료 타입 (S-선공제 , E --후공제)
			// B_FEE_TYPE -- 매수 수수료 타입 (S-선공제 , E --후공제)
			//
			calculate();
		});
	}

	function openTradeTab(type) {
		return function() {
			var deferred = $.Deferred();
			if (type == 'B') {
				$(".trade-conts").addClass("red");
				$(".trade-conts").removeClass("blue");
				$("#ConTradeSell").stop().fadeOut("100", function() {
					$("#ConTradeBuy").stop().fadeIn("100");
				});
				$(".trade-sell-guide").stop().fadeOut("100", function() {
					$(".trade-buy-guide").stop().fadeIn("100");
				});
				CURRENT_TAB = 'B';
			} else {
				$(".trade-conts").addClass("blue");
				$(".trade-conts").removeClass("red");
				$("#ConTradeBuy").stop().fadeOut("100", function() {
					$("#ConTradeSell").stop().fadeIn("100");
				});
				$(".trade-buy-guide").stop().fadeOut("100", function() {
					$(".trade-sell-guide").stop().fadeIn("100");
				});
				CURRENT_TAB = 'S';
			}
			getMarketStatusArea()
				.then(function() {
					return commonLib.promiseWrapper(function() {

						deferred.resolve();
						if (LOGIN) {
							getMyCoinMissionsArea();
						}
					})
				})
				.fail(function(err) {
					logger.error('openTradeTab fail err : ' + err);
					deferred.reject(err);
				});
				return deferred.promise();
		}
	}

	function openRequestConfirmPop() {
		if (!LOGIN) {
			alert(LANG.TRADE_VALID1[NUM]);
			return;
		}

		var amount = $("#AMOUNT_" + CURRENT_TAB).val();
		var price = $("#D_PRICE_" + CURRENT_TAB).val().replaceAll(',', '');
		var val = $("#TOTAL_INPUT_AMOUNT_" + CURRENT_TAB).val();

		if (amount == 0 || price == 0 || val == 0) {
			alert(LANG.TRADE_VALID5[NUM]);
			return;
		}
		commonLib.doAjaxWithPromise('/trade/getTradeToken', null).call().then(function(data) {

			if (data.returnValue == 0) {
				TOKEN = data.TOKEN.data;
			} else {
				return;
			}
			if (CURRENT_TAB == 'B') {

				$("#popup-bg").css("display", "table");
				$("#popup-bg #pop-trade-buy").css("display", "block");
				$("#popup-bg #pop-consent").css("display", "none");
			} else {
				$("#popup-bg").css("display", "table");
				$("#popup-bg #pop-trade-sell").css("display", "block");
				$("#popup-bg #pop-consent").css("display", "none");
			}
			startTimer(20);

		});
	}



	function closeRequestConfirmPop() {
		if (CURRENT_TAB == 'B') {
			$("#popup-bg").css("display", "none");
			$("#popup-bg #pop-trade-buy").css("display", "none");
		} else {
			$("#popup-bg").css("display", "none");
			$("#popup-bg #pop-trade-sell").css("display", "none");
		}
		stopTimer();
	}

	function openTradeAgreementPop() {
		$("#popup-bg").css("display", "table");
		$("#popup-bg #pop-consent").css("display", "block");
	}

	function closeTradeAgreementPop() {
		$("#popup-bg").css("display", "none");
		$("#popup-bg #pop-consent").css("display", "none");
	}
	//
	// FEE_S -- 매도 수수료
	// FEE-B -- 매수 수수료
	// S_FEE_TYPE -- 매도 수수료 타입 (S-선공제 , E --후공제)
	// B_FEE_TYPE -- 매수 수수료 타입 (S-선공제 , E --후공제)
	//
	function getMax(type) {
		if (!LOGIN) {
			alert(LANG.TRADE_VALID1[NUM]);
			return;
		}
		var amount;
		if (type == 'B') {
			var myBalance = $("#AVAILABLE_COIN_USD").val().replaceAll(',', '');

			if (myBalance == 0) {
				alert(LANG.TRADE_VALID2[NUM]);
				return;
			}
			var price = $("#D_PRICE_B").val().replaceAll(',', '');

			if (price == 0) {
				alert(LANG.TRADE_VALID3[NUM]);
				return;
			}
			amount = (myBalance / price);

			$("#AMOUNT_B").val(commonLib.getCoinFormat(amount));
		} else {
			var myBalance = $("#AVAILABLE_BUY_COIN_"+division).val().replaceAll(',', '');
			if (myBalance == 0) {
				alert(LANG.TRADE_VALID2[NUM]);
				return;
			}
			var price = $("#D_PRICE_S").val().replaceAll(',', '');
			if (price == 0) {
				alert(LANG.TRADE_VALID3[NUM]);
				return;
			}
			var amount = myBalance;

			$("#AMOUNT_S").val(commonLib.getCoinFormat(amount));
		}
		calculate();
	}


	function startTimer(s) {
		$("#trade_timer_" + CURRENT_TAB).text(s);
		var remainTime = s;
		TIMER = setInterval(function() {
			remainTime = remainTime - 1;
			$("#trade_timer_" + CURRENT_TAB).html(remainTime);
			if (remainTime == 0) {
				stopTimer();
				setTimeout(function() {
					alert(LANG.TRADE_TIMEOUT[NUM]);
					closeRequestConfirmPop();
				}, 50);
			}
		}, 1000);
	}

	function stopTimer() {
		TOKEN = null;
		if (TIMER != null) {
			clearInterval(TIMER);
			TIMER = null;
		}
	}

	(function() {
		[].slice.call(document.querySelectorAll('.TradeTab_Area')).forEach(function(menu) {
			var menuItems = menu.querySelectorAll('.menu__link'),
				setCurrent = function(ev) {
					ev.preventDefault();

					var item = ev.target.parentNode; // li

					// return if already current
					if( classie.has(item, 'menu__item--current') ) {
						return false;
					}
					// remove current
					classie.remove(menu.querySelector('.menu__item--current'), 'menu__item--current');
					// set current
					classie.add(item, 'menu__item--current');
				};

			[].slice.call(menuItems).forEach(function(el) {
				el.addEventListener('click', setCurrent);
			});
		});
	})(window);

	$("#ConTradeBuy").fadeIn("100");
	$("#BtnTradeBuy").click(function () {
		$("#ConTradeSell").fadeOut("100", function () {
			$("#ConTradeBuy").fadeIn("100");
		});
		openTradeTab('B').call();
		checkPrice($("#TOTAL_RECEIVED_AMOUNT_B"));
	});
	$("#BtnTradeSell").click(function () {
		$("#ConTradeBuy").fadeOut("100", function () {
			$("#ConTradeSell").fadeIn("100");
		});
		openTradeTab('S').call();
		checkPrice($("#TOTAL_RECEIVED_AMOUNT_S"));
	});
	$("#pop-detailed .close").click(function(){
		$("#popup-bg").css("display","none");
		$("#popup-bg #pop-detailed").css("display","none");
	});

	$("#pop-consent .btn-consent").click(function(){
		$("#popup-exchange-bg").css("display","none");
	});
	$("#pop-consent .close").click(function(){
		$("#popup-bg").css("display","none");
		$("#popup-bg #pop-consent").css("display","none");
	});
	$("#btn-trade-buy").click(function(){
		openRequestConfirmPop();
	});
	$("#btn-trade-sell").click(function(){
		openRequestConfirmPop();
	});
	$("#pop-trade-buy .close").click(function(){
		closeRequestConfirmPop();
	});
	$("#pop-trade-sell .close").click(function(){
		closeRequestConfirmPop();
	});
	$("#pop-trade-buy .btn-poptrade-cancell").click(function(){
		closeRequestConfirmPop();
	});
	$("#pop-trade-sell .btn-poptrade-cancell").click(function(){
		closeRequestConfirmPop();
	});
	$(".btn-poptrade-Postulat").click(function(){
		request();
	});
	$(".BUY_MAX").click(function(){
		getMax("B");
	});
	$(".SELL_MAX").click(function(){
		getMax("S");
	});
	$(".BUY_DOWN").click(function(){
		downPrice();
	});
	$(".BUY_UP").click(function(){
		upPrice();
	});
	$("#AMOUNT_B").keyup(function(){
		checkAmount(this);
	});
	$("#AMOUNT_S").keyup(function(){
		checkAmount(this);
	});
	$("#D_PRICE_B").keyup(function(){
		checkPrice(this);
	});
	$("#D_PRICE_S").keyup(function(){
		checkPrice(this);
	});
}




Trade.prototype.myorder = function(){
	$(document).ready(function() {
		if (!LOGIN) {
			alert(LANG.MYPAGE_VALID1[NUM]);
			location.replace('/');
			return;
		}
		$(".content-dd").mCustomScrollbar("update");
		$(function () {
			  $(".content-dd").mCustomScrollbar({ // on choisit la div "intro"
				verticalScroll:true, // barre verticale
				theme:"minimal-dark", // thème pour la barre, personnalisable
				scrollButtons:{
				  enable: true // on choisit d'afficher les flèches haut et bas
				}
			  });
		});
		var toDate = new Date();
		var beforeOneMonthDate = new Date();
		beforeOneMonthDate.setDate(beforeOneMonthDate.getDate() - 30);
		var beforeOneMonthDateString = beforeOneMonthDate.yyyymmdd();
		var toDateString = toDate.yyyymmdd()

		$("#datepicker1").val(beforeOneMonthDateString.substring(0, 4) + '.' + beforeOneMonthDateString.substring(4, 6) + '.' + beforeOneMonthDateString.substring(6, 8));
		$("#datepicker2").val(toDateString.substring(0, 4) + '.' + toDateString.substring(4, 6) + '.' + toDateString.substring(6, 8));

		search(1);
		getTopCoinRateArea();
		if (LOGIN) {
			getMyBalance();
		}
		settingCustomScrollbar(".content-ad");
	});
	transactionSocket.on('transactionOccurred', function(data) {
		if (CURRENT_TAB == undefined) {
			return;
		}
		var Params = {};
		Params['TYPE'] = data.TYPE;
		Params['KEY'] = data.KEY;
		Params['STAN_SNAME'] = 'USD';
		Params['SNAME'] = division;

		commonLib.doAjaxWithPromise('trade/getRefreshData', Params).call()
			.then(function(data) {
				console.log(data);
				bindingTopCoinRateArea(data.COIN_REAL_ALLRATE.recordset);
				if (LOGIN) {
					getMyBalance();
					getMyCoinMissionsArea();
				}
			});
	});

	function getTopCoinRateArea() {
		var deferred = $.Deferred();
		commonLib.doAjaxWithPromise('/trade/coinRealAllRate', null).call()
			.then(function(data) {
				var list = data.recordset;
				//var list =TEST_DATA.coinRealAllRate;
				bindingTopCoinRateArea(list);
				deferred.resolve(data);
			})
			.fail(function(err) {
				deferred.reject(err);
			});
		return deferred.promise();
	}
	function bindingTopCoinRateArea(list) {
		console.log(3);
		var bindingObject = {};
		for(var i = 0; i < list.length; i++){
			var coinrate = list[i]
			var d = new Date();
			d = (d.getMonth()+1) + "/"  + d.getDate() +" " + d.getHours() +":"+ d.getMinutes();
			bindingObject['S_DATE'] =d;
			if(division == coinrate.C_NAME){
				NOW_RATE = coinrate.NOW_RATE?coinrate.NOW_RATE : 0;
				BE_RATE = coinrate.BE_RATE?coinrate.BE_RATE : 0;
			}
			bindingObject['NOW_RATE_'+coinrate.C_NAME] = coinrate.NOW_RATE?coinrate.NOW_RATE : 0;
			bindingObject['BE_RATE_'+coinrate.C_NAME] = coinrate.BE_RATE?coinrate.BE_RATE : 0;
			bindingObject['END_RATE_'+coinrate.C_NAME] = coinrate.END_RATE?coinrate.END_RATE : 0;
			bindingObject['DIFF_SIGN_'+coinrate.C_NAME] = (coinrate.UDGUBUN  != "D")? "↑" : "↓";
			bindingObject['DIFF_SIGN2_'+coinrate.C_NAME] = (coinrate.UDGUBUN  != "D")? "▲" : "▼";
			bindingObject['DIFF_RATE_'+coinrate.C_NAME] = coinrate.DIF_RATE?coinrate.DIF_RATE : 0;
			bindingObject['DIFF_PERCENT_SIGN_'+coinrate.C_NAME] = (coinrate.UDGUBUN  != "D")? "+" : "-";
			bindingObject['DIFF_PERCENT_'+coinrate.C_NAME] = coinrate.CHAN_RATE?coinrate.CHAN_RATE.toFixed(2) : 0;
			bindingObject['MAX_RATE_'+coinrate.C_NAME] = coinrate.TODAY_MAX_RATE?coinrate.TODAY_MAX_RATE : 0;
			bindingObject['MIN_RATE_'+coinrate.C_NAME] = coinrate.TODAY_MIN_RATE?coinrate.TODAY_MIN_RATE : 0;
			bindingObject['NOW_QUANT_'+coinrate.C_NAME] = coinrate.SERVER_QTY?coinrate.TODAY_VOLUME : 0;

			var rateSplit = coinrate.NOW_RATE.toString().split('.');
			bindingObject['NOW_RATE_F_'+coinrate.C_NAME] = rateSplit[0] ? rateSplit[0] : "0";
			bindingObject['NOW_RATE_D_'+coinrate.C_NAME] = rateSplit[1] ? rateSplit[1] : "00";
			bindingObject['COIN_SYMBOL_'+coinrate.C_NAME] = coinrate.C_NAME;
			//칼라용
			$('.'+coinrate.C_NAME+'_UD').addClass((coinrate.UDGUBUN  != "D")? "tx-blue" : "tx-red");
		}
		commonLib.bindData(bindingObject);
	}

	function bindingMyBalance(list) {
		var bindingObject = {};
		for(var i = 0; i < list.length; i++){
			var my = list[i];
			bindingObject['MY_'+my.COIN_GUBUN] = my.POSSESSION_COIN;
			bindingObject['MY_'+my.COIN_GUBUN+'_VALUE'] = my.COIN_TO_USD;
		}
		commonLib.bindData(bindingObject);
	}

	function getMyBalance() {
		commonLib.doAjax('/trade/myCoinBalance', null, true, function(err, data) {
			if (err) {
				window.location.href = "/";
				return;
			}
			//var list = TEST_DATA.myCoinBalance;
			var list = data.data;
			bindingMyBalance(list);
		});
	}

	$(function() {
		$("#datepicker1, #datepicker2").datepicker({
			dateFormat: 'yy.mm.dd',
		  showOn: "button",
		  buttonImage: "views/images/calendar-5.png",
		  buttonImageOnly: true,
		  buttonText: "Select date"
		});
	});

	$("#view-details .close").click(function(){
		$("#popup-bg").css("display","none");
		$("#popup-bg #view-details").css("display","none");
	});

	var CNT_PER_PAGE = 10;

	function search(curPage) {
		if (curPage == undefined) {
			curPage = 1;
		}

		var sDate = $("#datepicker1").val().replaceAll('.', '');
		var eDate = $("#datepicker2").val().replaceAll('.', '');
		if (sDate > eDate) {
			alert(LANG.DATE_RANGE_FAIL1[NUM]);
			return;
		}
		var Params = {};
		Params['SNAME'] = division;
		Params['D_GUBUN'] = $("#D_GUBUN").val();
		Params['S_DATE'] = sDate;
		Params['E_DATE'] = eDate;
		Params['CUR_PAGING'] = curPage;
		Params['PAGING_NO'] = CNT_PER_PAGE;
		Params['EX_KEY'] = '';
		Params['EX_TYPE'] = '';

		commonLib.doAjax('/trade/myCoinTradeHistory', Params, true, function(err, data) {
			if (err) {
				window.location.href = "/";
				return;
			}

			var summary = data.summary[0];
			var num = summary["EVEN_PRICE"].toString().split(".");

			var zero = (num[1]?"":".");
			for (var j = 0; j < 8 - (num[1]?num[1].length:0); j++) {
				zero += '0';
			}
			summary['EVEN_PRICE_D']  = zero;
			commonLib.bindData(summary);
			var tableDiv = $("#myorders-history").children(".card-box").children('#Wrap_Table').children(".Table");

			tableDiv.html('');
			var list = data.list;

			var item;
			var tableDivHtml = '<div class="TH">';
			tableDivHtml += '	<p class="fl-l tx-c w10p">'+LANG.LANG_72[NUM]+'</p>';
			tableDivHtml += '	<p class="fl-l tx-r w15p">'+LANG.LANG_472[NUM]+'(USD)</p>';
			tableDivHtml += '	<p class="fl-l tx-r w15p">'+LANG.LANG_336[NUM]+'('+coinname+')</p>';
			tableDivHtml += '	<p class="fl-l tx-r w15p">'+LANG.LANG_168[NUM]+'('+coinname+')</p>';
			tableDivHtml += '	<p class="fl-l tx-r w15p">'+LANG.LANG_333[NUM]+'(USD)</p>';
			tableDivHtml += '	<p class="fl-l tx-r w15p">'+LANG.LANG_216[NUM]+'(USD)</p>';
			tableDivHtml += '	<p class="fl-l tx-c w15p">'+LANG.LANG_74[NUM]+'</p>';
			tableDivHtml += '</div>';

			for (var i = 0; i < list.length; i++) {
				item = list[i];
				var comp = item.COMPLETE.toString().split(".");
				var comp_d ='';
				var comp_check = comp[1]?"":".";
				for (var j = 0; j < 8 - (comp[1]?comp[1].length:0); j++) {
					comp_d += '0';
				}
				var incomp = item.REMAIN_COIN.toString().split(".");
				var incomp_d = "";
				var incomp_check = incomp[1]?"":".";
				for (var j = 0; j < 8 - (incomp[1]?incomp[1].length:0); j++) {
					incomp_d += '0';
				}
				var state = '';

				if(item.SGUBUN == 'BUY'){
					state = LANG.LANG_104[NUM];
				}
				else {
					state = LANG.LANG_473[NUM];
				}
				if(item.C_STATE == 'Y'){
					state += LANG.LANG_474[NUM];
				}
				else{
					state += LANG.LANG_476[NUM];
				}
				tableDivHtml += '<div class="TD">';
				tableDivHtml += '<a class="view-details-btn" data-idx="'+item.IDX+' data-gubun="'+item.SGUBUN+'">';
				if (item.SGUBUN == 'BUY') {
					tableDivHtml += '<p class="fl-l tx-c w10p tx-red">';
				} else {
					tableDivHtml += '<p class="fl-l tx-c w10p tx-blue">';
				}
				tableDivHtml += '	<i class="icon icon-Search"></i>'+state+'</p>';
				tableDivHtml += '	<p class="fl-l tx-r w15p">'+item.RATE.toFixed(2)+'</p>';
				tableDivHtml += '	<p class="fl-l tx-r w15p">'+commonLib.getNumberFormat(item.COMPLETE)+comp_check+'<span class="tx-grey">'+comp_d+'</span></p>';
				tableDivHtml += '	<p class="fl-l tx-r w15p">'+incomp[0]+incomp_check+'<span class="tx-grey">'+incomp_d+'</span></p>';
				tableDivHtml += '	<p class="fl-l tx-r w15p">'+commonLib.getMoneyFormat(item.RESULT_USD)+'</p>';
				tableDivHtml += '	<p class="fl-l tx-r w15p">'+item.FEE.toFixed(2)+'</p>';
				tableDivHtml += '	<p class="fl-l tx-c w15p">'+item.IDATE+'</p>';
				tableDivHtml += '</a>';
				tableDivHtml += '</div>';
			}
			tableDiv.html(tableDivHtml);

			var totalCnt = data.cnt;
			var pagingDiv = $(".paging-box").find('.row');
			var pagingDivHtml = commonLib.paging(totalCnt, CNT_PER_PAGE, 10, curPage, 'search');
			pagingDiv.html(pagingDivHtml);

			paginglength = $(".paging-box li").length;
			$(".paging-box div").css("width",15*paginglength);
			$(".paging-box ul").css("margin-left",-15*paginglength/2);
			$(".paging-box > div").css("margin-left","50%");


			$(".view-details-btn").click(function(){
				getMyCoinMissionsArea();
				$("#popup-bg").css("display","table");
				$("#popup-bg #view-details").css("display","block");
			});
			pagingDiv.find("li").click(function(){
				search($(this).data("idx"));
			});
		});
	}

	$(".search-btn").click(function(){
		search(1);
	});
	function getMyCoinMissionsArea() {
		var Params = {};
		Params['STAN_SNAME'] = 'USD';
		Params['SNAME'] = division;
		Params['EX_KEY'] = '';
		Params['EX_TYPE'] = '';

		commonLib.doAjax('trade/myCoinOrderList', Params, true, function(err, data) {
			if (err) {
				window.location.href = "/";
				return;
			}
			//var list = TEST_DATA.myCoinOrderList;
			var list = data.recordset;
			bindingMyCoinMissionsArea(list);


		});
	}
	function bindingMyCoinMissionsArea(list) {
		var item;

		var detailTransactionAreaDiv = $(".content-ad").find(".mCSB_container");

		var detailTransactionAreaHtml = '';
		var total_quant = 0;
		var total_price = 0;
		var total_concluded_val = 0;
		var total_concluded_price = 0;
		var total_unconcluded_val = 0;
		var total_unconcluded_price = 0;

		for (var i = 0; i < list.length; i++) {
			item = list[i];
			detailTransactionAreaHtml += '<div class="TD">';
			if (item.C_REMAIN_COIN > 0) {
				detailTransactionAreaHtml +=	'<p class="fl-l tx-c w10p tx-red">' + lang.UNFINISH_TABLE_TYPE2[NUM] + '</p>';
				detailTransactionAreaHtml +=	'<p class="fl-l tx-r w20p">' + commonLib.getMoneyFormat(item.C_RATE) + '</p>';
				detailTransactionAreaHtml +=	'<p class="fl-l tx-r w20p">' + commonLib.getNumberFormat(item.C_REMAIN_COIN) + '</p>';
				detailTransactionAreaHtml +=	'<p class="fl-l tx-r w40p"><a class="btn-block btn-s-red tx-c my_order_cancel" data-idx="'+ item.C_IDX+'" data-gubun="'+item.EX_GUBUN+'">'+lang.TRADE_MAIN22[NUM]+'</a></p>';
				total_unconcluded_val += item.C_REMAIN_COIN;
				total_unconcluded_price += item.C_RATE;
			}
			else
			{
				detailTransactionAreaHtml += '<p class="fl-l tx-c w10p tx-blue">' + lang.UNFINISH_TABLE_TYPE[NUM] + '</p>';
				detailTransactionAreaHtml += '<p class="fl-l tx-r w20p">' + commonLib.getMoneyFormat(item.C_RATE) + '</p>';
				detailTransactionAreaHtml += '<p class="fl-l tx-r w20p">' +  commonLib.getNumberFormat(item.C_QTY) + '</p>';
				detailTransactionAreaHtml += '<p class="fl-l tx-r w20p">' + commonLib.getMoneyFormat(item.C_REMAIN_FEE) + '</p>';
				detailTransactionAreaHtml += '<p class="fl-l tx-c w30p">' + item.C_IDATE + '</p>';
				total_concluded_val += item.C_QTY;
				total_concluded_price += item.C_RATE;
			}

			detailTransactionAreaHtml += '</div>';
		}
		total_quant = total_concluded_val+ total_unconcluded_val;
		total_price = total_concluded_price+ total_unconcluded_price;
		detailTransactionAreaDiv.html(detailTransactionAreaHtml);

		var bindingObject = {};
		bindingObject['TOTAL_QUANT'] = total_quant;
		bindingObject['TOTAL_PRICE'] = total_price;
		bindingObject['TOTAL_CONCLUDED_PRICE'] = total_concluded_price;
		bindingObject['TOTAL_CONCLUDED_VAL'] = total_concluded_val;
		bindingObject['TOTAL_UNCONCLUDED_PRICE'] = total_unconcluded_price;
		bindingObject['TOTAL_UNCONCLUDED_VAL'] = total_unconcluded_val;

		commonLib.bindData(bindingObject);

		$(".my_order_cancel").click(function(){
			var idx = $(this).data("idx");
			var gubun =$(this).data("gubun");
			myCoinOrderCancel(idx,gubun);
		});
	}
	function settingCustomScrollbar(selector) {

		$(function() {
			$(selector).mCustomScrollbar({ // on choisit la div "intro"
				verticalScroll: true, // barre verticale
				theme: "minimal-dark", // theme pour la barre, personnalisable
				axis : "y",
				scrollButtons: {
					enable: true // on choisit d'afficher les fleches haut et bas
				},
				advanced:{
					updateOnContentResize: true,
				}
			});
		});
	}
	function myCoinOrderCancel(idx, gubun) {
		if (!confirm(LANG.TRADE_LANG2[NUM])) {
			return;
		}
		var Params = {};
		Params['C_IDX'] = idx;

		Params['C_GUBUN'] = gubun;

		commonLib.doAjax('trade/myCoinOrderCancel', Params, true, function(err, data) {
			if (err) {
				window.location.href = "/";
				return;
			}
			alert(data.message);
			if (data.returnValue == 0) {
				$("#popup-bg").css("display", "none");
				$("#popup-bg #pop-detailed").css("display", "none");
				search(1);
			}

		});
	}
}



























Trade.prototype.myfund = function(){
	var NOW_RATE;
	var ASSETS_WITHDRAW;
	transactionSocket.on('transactionOccurred', function(data) {
		if (CURRENT_TAB == undefined) {
			return;
		}
		var Params = {};
		Params['TYPE'] = data.TYPE;
		Params['KEY'] = data.KEY;
		Params['STAN_SNAME'] = 'USD';
		Params['SNAME'] = division;

		commonLib.doAjaxWithPromise('trade/getRefreshData', Params).call()
			.then(function(data) {
				console.log(data);
				bindingTopCoinRateArea(data.COIN_REAL_ALLRATE.recordset);
				initWithdrawalConfig()
				if (LOGIN) {
					getMyBalance();
				}
			});
	});


	$(document).ready(function() {
		if (!LOGIN) {
			alert(LANG.MYPAGE_VALID1[NUM]);
			location.replace('/');
			return;
		}
		var toDate = new Date();
		var beforeOneMonthDate = new Date();
		beforeOneMonthDate.setDate(beforeOneMonthDate.getDate() - 30);
		var beforeOneMonthDateString = beforeOneMonthDate.yyyymmdd();
		var toDateString = toDate.yyyymmdd()

		$("#datepicker1").val(beforeOneMonthDateString.substring(0, 4) + '.' + beforeOneMonthDateString.substring(4, 6) + '.' + beforeOneMonthDateString.substring(6, 8));
		$("#datepicker2").val(toDateString.substring(0, 4) + '.' + toDateString.substring(4, 6) + '.' + toDateString.substring(6, 8));
		search(1);
		getTopCoinRateArea();
		if (LOGIN) {
			getMyBalance();
		}
		initWithdrawalConfig();
		initCoinAddrOutList();

	});

	function getTopCoinRateArea() {
		var deferred = $.Deferred();
		commonLib.doAjaxWithPromise('/trade/coinRealAllRate', null).call()
			.then(function(data) {
				var list = data.recordset;
				//var list =TEST_DATA.coinRealAllRate;
				bindingTopCoinRateArea(list);
				deferred.resolve(data);
			})
			.fail(function(err) {
				deferred.reject(err);
			});
		return deferred.promise();
	}
	function bindingTopCoinRateArea(list) {
		console.log(4);
		var bindingObject = {};
		for(var i = 0; i < list.length; i++){
			var coinrate = list[i]
			var d = new Date();
			d = (d.getMonth()+1) + "/"  + d.getDate() +" " + d.getHours() +":"+ d.getMinutes();
			bindingObject['S_DATE'] =d;
			if(division == coinrate.C_NAME){
				NOW_RATE = coinrate.NOW_RATE?coinrate.NOW_RATE : 0;
				BE_RATE = coinrate.BE_RATE?coinrate.BE_RATE : 0;
			}
			bindingObject['NOW_RATE_'+coinrate.C_NAME] = coinrate.NOW_RATE?coinrate.NOW_RATE : 0;
			bindingObject['BE_RATE_'+coinrate.C_NAME] = coinrate.BE_RATE?coinrate.BE_RATE : 0;
			bindingObject['END_RATE_'+coinrate.C_NAME] = coinrate.END_RATE?coinrate.END_RATE : 0;
			bindingObject['DIFF_SIGN_'+coinrate.C_NAME] = (coinrate.UDGUBUN  != "D")? "↑" : "↓";
			bindingObject['DIFF_SIGN2_'+coinrate.C_NAME] = (coinrate.UDGUBUN  != "D")? "▲" : "▼";
			bindingObject['DIFF_RATE_'+coinrate.C_NAME] = coinrate.DIF_RATE?coinrate.DIF_RATE : 0;
			bindingObject['DIFF_PERCENT_SIGN_'+coinrate.C_NAME] = (coinrate.UDGUBUN  != "D")? "+" : "-";
			bindingObject['DIFF_PERCENT_'+coinrate.C_NAME] = coinrate.CHAN_RATE?coinrate.CHAN_RATE.toFixed(2) : 0;
			bindingObject['MAX_RATE_'+coinrate.C_NAME] = coinrate.TODAY_MAX_RATE?coinrate.TODAY_MAX_RATE : 0;
			bindingObject['MIN_RATE_'+coinrate.C_NAME] = coinrate.TODAY_MIN_RATE?coinrate.TODAY_MIN_RATE : 0;
			bindingObject['NOW_QUANT_'+coinrate.C_NAME] = coinrate.SERVER_QTY?coinrate.TODAY_VOLUME : 0;

			var rateSplit = coinrate.NOW_RATE.toString().split('.');
			bindingObject['NOW_RATE_F_'+coinrate.C_NAME] = rateSplit[0] ? rateSplit[0] : "0";
			bindingObject['NOW_RATE_D_'+coinrate.C_NAME] = rateSplit[1] ? rateSplit[1] : "00";
			bindingObject['COIN_SYMBOL_'+coinrate.C_NAME] = coinrate.C_NAME;
			//칼라용
			$('.'+coinrate.C_NAME+'_UD').addClass((coinrate.UDGUBUN  != "D")? "tx-blue" : "tx-red");
		}
		commonLib.bindData(bindingObject);
	}
	function getMyBalance() {
		commonLib.doAjax('/trade/myCoinBalance', null, true, function(err, data) {
			if (err) {
				window.location.href = "/";
				return;
			}
			//var list = TEST_DATA.myCoinBalance;
			var list = data.data;
			bindingMyBalance(list);
		});
	}
	function bindingMyBalance(list) {
		var bindingObject = {};
		for(var i = 0; i < list.length; i++){
			var my = list[i];
			bindingObject['MY_'+my.COIN_GUBUN] = my.POSSESSION_COIN;
			bindingObject['MY_'+my.COIN_GUBUN+'_VALUE'] = my.COIN_TO_USD;
		}
		commonLib.bindData(bindingObject);
	}

	var MAX_WITHDRAWAL_AMOUNT_AT_ONCE = 0, MAX_WITHDRAWAL_AMOUNT = 0, WITHDRAWAL_FEE = 0, MY_BALANCE =0;
	var MAX_DEPOSIT_AMOUNT_AT_ONCE = 0, MAX_DEPOSIT_AMOUNT = 0, DEPOSIT_FEE = 0;
	var MY_MEMBER_INFO;

	function initWithdrawalConfig() {
		var Params = {};
		Params['COIN'] = division;
		commonLib.doAjax('/myfunds/withdrawalConfig', Params, true, function(err, result) {
			if (err) {
				window.location.href = "/";
				return;
			}
			var fee_w = result.fee_w;
			var fee_d = result.fee_d;
			MY_BALANCE = fee_w.COIN_AMOUNT;
			MY_MEMBER_INFO = result.MY_MEMBER_INFO;
			ASSETS_WITHDRAW = fee_w.COIN_USE;
			var addressQrCode = result.addressQrCode;
			var address = fee_w.ADDRESS;
			var coinRateList = result.COIN_RATE;

			var coinRate;
			for (var i = 0; i < coinRateList.length; i++) {
				if (coinRateList[i].C_NAME == division) {
					coinRate = coinRateList[i];
					break;
				}
			}

			if (coinRate == undefined) {
				alert(LANG.WITHDRAWAL_LANG2[NUM].replace("${DIVISION}", division));
				return;
			}
			var currentRateForCoin = coinRate.NOW_RATE;

			MAX_WITHDRAWAL_AMOUNT_AT_ONCE = fee_w.COUNT1_MAX_AMT;
			MAX_WITHDRAWAL_AMOUNT= fee_w.IN_MAX;
			WITHDRAWAL_FEE = fee_w.FEE/100;

			DEPOSIT_FEE = fee_d.FEE/100;
			MAX_DEPOSIT_AMOUNT_AT_ONCE = fee_d.COUNT1_MAX_AMT;
			MAX_DEPOSIT_AMOUNT= fee_d.IN_MAX;

			$("#WITHDRAWAL_FEE").html(commonLib.getCoinFormat(DEPOSIT_FEE));
			$("#WITHDRAW_MAX").html(commonLib.getCoinFormat(MAX_DEPOSIT_AMOUNT));
			$("#WITHDRAW_MAX_AMT").html(commonLib.getCoinFormat(MAX_DEPOSIT_AMOUNT_AT_ONCE));
			$("#COIN_ASSETS").val(commonLib.getCoinFormat(MY_BALANCE));
			$("#COIN_ASSETS_WITHDRAW").val(commonLib.getCoinFormat(ASSETS_WITHDRAW));

			$("#EXCHANGE_WALLET_ADDRESS").text(address);
			if (address == '') {
				$("#none-address").show();
			} else {
				$("#exists-address").show();

				if (commonLib.isNull(addressQrCode)) {
					alert(LANG.GENERATE_QRCODE_FAIL1[NUM]);
				} else {
					$("#addressQrCode").attr("src", addressQrCode);
				}

			}
		});
	}

	function copyAddress() {
		var t = document.createElement("input");
		document.body.appendChild(t);
		t.value = $("#EXCHANGE_WALLET_ADDRESS").text();
		t.select();

		document.execCommand('copy');
		document.body.removeChild(t);

		var message = LANG.COPY_LANG1[NUM].replace("${DIVISION}", LANG.COIN_SHORT[DIVISION][NUM]);
		alert(message);
	}

	var ADDR_LIST;

	function initCoinAddrOutList() {
		var param = {};
		param["CUR_PAGING"]=CUR_PAGE;
		param["PAGING_NO"] = CNT_PER_PAGE;
		commonLib.doAjax('/mypage/coinAddrOutList', param, true, function(err, data) {
			if (err) {
				return;
			}

			var list = data.data;
			var bindingList = [];
			var item;
			var str = {ADDR : "", "D_CNAME" : LANG.LANG_384[NUM]};
			bindingList.push(str);
			for (var i = 0; i < list.length; i++) {
				item = list[i];

				if (item.D_GUBUN == division) {
					bindingList.push(item);
				}
			}
			commonLib.bindCombo("ADDRESS_LIST", bindingList, 'ADDR', 'D_CNAME');
		});
	}

	function onWithdrawalAmountChange(obj) {
		var newVal = commonLib.toNumber(obj.value);
		if (isNaN(newVal)) {
			alert(LANG.NUMBER_FAIL1[NUM]);
			obj.value = 0;
			$("#AMOUNT").val("0.00000000");
			$("#FEE_AMOUNT").val("0.00000000");
			return;
		}
		if (newVal < 0) {
			alert(LANG.NUMBER_FAIL2[NUM]);
			obj.value = 0;
			return;
		}

		//한도초과 설정되면 주석  삭제 해야함..
		// if (newVal > MAX_WITHDRAWAL_AMOUNT_AT_ONCE) {
		// 	alert(LANG.WITHDRAWAL_FAIL4[NUM]);
		// 	return;
		// }

		var withdraw_fee = newVal * WITHDRAWAL_FEE;
		var withdraw = newVal - withdraw_fee;
		if(ASSETS_WITHDRAW < withdraw){
			alert(LANG.LANG_477[NUM]);
			obj.value = 0;
			$("#WITHDRAW_AMOUNT").val(ASSETS_WITHDRAW);
			$("#AMOUNT").text(commonLib.getCoinFormat(ASSETS_WITHDRAW - (ASSETS_WITHDRAW * WITHDRAWAL_FEE)));
			$("#FEE_AMOUNT").text(commonLib.getCoinFormat(ASSETS_WITHDRAW * WITHDRAWAL_FEE));
			return;
		}
		$("#AMOUNT").val(withdraw.toFixed(8));
		$("#FEE_AMOUNT").val(withdraw_fee.toFixed(8));
	}


	var SMS_ON = false;
	var D_IDX = '';
	var D_FLAG = '001';
	var CURRENT_TAB = 'W';

	function authentication() {

		if (SMS_ON) {
			alert(LANG.SMS_CHECK_VALID2[NUM]);
			return;
		}

		var hp = MY_MEMBER_INFO.D_HP;
		if (commonLib.isNull(hp)) {
			alert(LANG.PASS_CHANGE_VALID1[NUM]);
			return;
		}
		var Params = {};
		Params['D_HP'] = hp;
		Params['D_FLAG'] = D_FLAG;

		commonLib.doAjax('/mypage/smsCheck', Params, true, function(err, data) {
			if (err) {
				window.location.href = "/";
				return;
			}

			var returnValue = data.returnValue;
			var message = data.message;
			alert(message);
			if (returnValue == 0) {
				$("#btnAuthentication").removeClass('btn-s-darkgrey');
				$("#btnAuthentication").addClass('btn-s-green');
				D_IDX = new String(data.D_IDX);
				SMS_ON = true;
				$("#D_SMSNO").focus();
				setTimeout(function() {
					SMS_ON = false;
				}, 15000);
			} else {
				SMS_ON = false;
			}
		});
	}

	function openWithdrawalPop() {
		if ($("#ADDRESS_LIST").val() == '') {
			alert(LANG.WITHDRAWAL_LANG3[NUM].replace("${DIVISION}", division));
			return;
		}

		if (D_IDX == '') {
			alert(LANG.SMS_CHECK_VALID1[NUM]);
			return;
		}


		$("#WITHDRAWAL_POP_TOTAL_AMOUNT").text(commonLib.getCoinFormat($("#AMOUNT").val()));
		$("#WITHDRAWAL_POP_ADDRESS").text($("#ADDRESS_LIST").val());

		$("#popup-bg").css("display","table");
		$("#popup-bg #pop-withdrawal-btc").css("display","block");
		startTimer(20);
	}

	function closeWithdrawalPop() {
		$("#popup-bg").css("display", "none");
		$("#popup-bg #pop-withdrawal-btc").css("display", "none");
		stopTimer();
	}

	function startTimer(s) {
		$("#trade_timer").text(s);
		var remainTime = s;
		TIMER = setInterval(function() {
			remainTime = remainTime - 1;
			$("#trade_timer").html(remainTime);
			if (remainTime == 0) {
				stopTimer();
				setTimeout(function() {
					alert(LANG.TRADE_TIMEOUT[NUM]);
					closeWithdrawalPop();
				}, 50);
			}
		}, 1000);
	}

	function stopTimer() {
		TOKEN = null;
		if (TIMER != null) {
			clearInterval(TIMER);
			TIMER = null;
		}
	}
	function withdrawalRequest() {
		var publicKey;
		var Params = {};

		var amount = $("#WITHDRAW_AMOUNT").val();
		amount = amount.replace(/,/gi,"");
		if(CURRENT_TAB == 'D'){
			if (amount < MAX_DEPOSIT_AMOUNT){
				alert(LANG.LANG_486[NUM]);
				return;
			}
		}
		if(CURRENT_TAB == 'W'){
			if (amount < MAX_WITHDRAWAL_AMOUNT){
				alert(LANG.LANG_490[NUM]);
				return;
			}
		}
		if(!$("#D_SMSNO").val()){
			alert(LANG.SMS_CHECK_FAIL5[NUM]);
			return;
		}
		commonLib.showLoadingBar();
		commonLib.generateRSAKey()
			.then(function(data) {
				publicKey = data.PUBLICKEY;
				return commonLib.promiseWrapper(function() {
					Params['D_FLAG'] = D_FLAG;
					Params['D_SMSNO'] = commonLib.RSAEncrypt(publicKey, $("#D_SMSNO").val());
					Params['D_IDX'] = commonLib.RSAEncrypt(publicKey, D_IDX);
				});
			})
			.then(commonLib.doAjaxWithPromise('/mypage/smsConfirm', Params))
			.then(function(data) {

				var returnValue = data.returnValue;
				var message = data.message;

				return commonLib.promiseWrapper(function() {
					if (returnValue != 0) {
						alert(message);
						throw new Error('smsConfirm fail..');
					} else {
						Params['TO_ADDR'] = commonLib.RSAEncrypt(publicKey, $("#ADDRESS_LIST").val());
						Params['AMOUNT'] = commonLib.RSAEncrypt(publicKey, amount);
						Params['GUBUN'] = 'W';
						Params['COIN'] = division;

					}

				});
			})
			.then(commonLib.doAjaxWithPromise('/myfunds/requestCoinTransfer', Params))
			.then(function(data) {
				commonLib.hideLoadingBar();
				var returnValue = data.returnValue;
				var message = data.message;

				alert(data.message);
				closeWithdrawalPop();
				if (returnValue == 0) {
					search(1);
					getTopCoinRateArea();
					getMyBalance();
				}

			})
			.fail(function(err) {
				commonLib.hideLoadingBar();
				console.error('withdrawalRequest failed by error : ' + err);
				closeWithdrawalPop();
			});
	}

	function getMax() {
		var myBalance = MY_BALANCE;
		// if (MAX_WITHDRAWAL_AMOUNT_AT_ONCE == 0) {
		// 	MAX_WITHDRAWAL_AMOUNT_AT_ONCE = 5;
		// }

		//나중에 고쳐야함..
		//var withdrawFee = WITHDRAWAL_FEE;
		//var amountOfWithDrawal = 0;

		//if ((myBalance + WITHDRAWAL_FEE) > MAX_WITHDRAWAL_AMOUNT_AT_ONCE) {
		//	amountOfWithDrawal = MAX_WITHDRAWAL_AMOUNT_AT_ONCE;
		//} else {
		//	amountOfWithDrawal = myBalance - WITHDRAWAL_FEE;
		//}
		$("#WITHDRAW_AMOUNT").val(commonLib.getCoinFormat(ASSETS_WITHDRAW));
		$("#AMOUNT").val(commonLib.getCoinFormat(ASSETS_WITHDRAW));
		$("#FEE_AMOUNT").val(commonLib.getCoinFormat(WITHDRAWAL_FEE * ASSETS_WITHDRAW));

	}

	var CNT_PER_PAGE = 10;
	var CUR_PAGE = 1;
	function search(curPage) {
		if (curPage == undefined) {
			curPage = 1;
		}


		var sDate = $("#datepicker1").val().replaceAll('.', '');
		var eDate = $("#datepicker2").val().replaceAll('.', '');
		if (sDate > eDate) {
			alert(LANG.DATE_RANGE_FAIL1[NUM]);
			return;
		}
		var Params = {};
		Params['SNAME'] = division;
		Params['D_GUBUN'] = $("#D_GUBUN").val();
		Params['S_DATE'] = sDate;
		Params['E_DATE'] = eDate;
		Params['CUR_PAGING'] = curPage;
		CUR_PAGE = curPage;
		Params['PAGING_NO'] = CNT_PER_PAGE;
		Params['EX_KEY'] = '';
		Params['EX_TYPE'] = '';

		commonLib.doAjax('/trade/myCoinInOutHistory', Params, true, function(err, data) {
			if (err) {
				window.location.href = "/";
				return;
			}
			var tableDiv = $("#myfunds-history").children(".card-box").children('#Wrap_Table').children(".Table");

			tableDiv.html('');
			var list = data.list;

			var item;
			var tableDivHtml = '<div class="TH">';
			tableDivHtml += '<p class="fl-l tx-c w10p">'+LANG.LANG_72[NUM]+'</p>';
			tableDivHtml += '<p class="fl-l tx-l w50p">'+LANG.LANG_323[NUM]+'</p>';
			tableDivHtml += '<p class="fl-l tx-r w15p">'+LANG.LANG_67[NUM]+'</p>';
			tableDivHtml += '<p class="fl-l tx-c w25p">'+LANG.LANG_74[NUM]+'</p>';
			tableDivHtml += '</div>';


			for (var i = 0; i < list.length; i++) {
				item = list[i];
				console.log(item);
				var coin = item.COIN_QTY.toString().split(".");
				var coin_d =coin[1]? coin[1] : "";
				for (var j = 0; j < 8 - (coin[1]?coin[1].length:0); j++) {
					coin_d += '0';
				}
				var state = '';
				if(item.GUBUN == 'WITHDRAWAL'){
					state = LANG.LANG_443[NUM];
				}
				else if(item.GUBUN == 'DEPOSIT'){
					state = LANG.LANG_442[NUM];
				}

				if(item.MS_YN == 'N'){
					state += LANG.LANG_478[NUM];
				}
				else if(item.MS_YN == 'Y'){
					state += LANG.LANG_474[NUM];
				}
				else {
					state += LANG.LANG_476[NUM];;
				}

				tableDivHtml += '<div class="TD">';
				tableDivHtml += '<a class="view-details-btn">';
				if (item.GUBUN == 'DEPOSIT') {
					tableDivHtml += '<p class="fl-l tx-c w10p tx-red">';
				} else {
					tableDivHtml += '<p class="fl-l tx-c w10p tx-blue">';
				}
				tableDivHtml += state+'</p>';
				tableDivHtml += '<p class="fl-l tx-l w50p">';
				if (item.GUBUN == 'DEPOSIT') {
					tableDivHtml += '<span class="tx-red adress">';
				} else {
					tableDivHtml += '<span class="tx-blue adress">';
				}
				tableDivHtml += item.ADDRESS+'</span><br>'+item.TXID;
				tableDivHtml += '</p>';
				tableDivHtml += '<p class="fl-l tx-r w15p">'+coin[0]+'.<span class="tx-grey">'+coin_d+'</span></p>';
				tableDivHtml += '<p class="fl-l tx-c w25p">';
				tableDivHtml += LANG.LANG_254[NUM]+' : '+item.COIN_DATE+'<br>';
				if(item.MS_YN == 'Y'){
					tableDivHtml += '<span>'+LANG.LANG_250[NUM]+' :'+item.OK_DATE+'</span>';
				}
				else if(item.CON_GUBUN == 'c'){
					tableDivHtml += '<span>'+LANG.LANG_483[NUM]+'('+item.CONFIRM+')</span>';
				}
				else {
					tableDivHtml += '<span>&nbsp</span>';
				}
				tableDivHtml += '</p>';
                tableDivHtml += '</div>';
			}
			tableDiv.html(tableDivHtml);

			var totalCnt = data.cnt;
			var pagingDiv = $(".paging-box").find('.row');
			var pagingDivHtml = commonLib.paging(totalCnt, CNT_PER_PAGE, 10, curPage, 'search');
			pagingDiv.html(pagingDivHtml);

			paginglength = $(".paging-box li").length;
			$(".paging-box div").css("width",15*paginglength);
			$(".paging-box ul").css("margin-left",-15*paginglength/2);
			$(".paging-box > div").css("margin-left","50%");


			pagingDiv.find("li").click(function(){
				search($(this).data("idx"));
			});
		});
	}

	paginglength = $(".paging-box li").length;
	$(".paging-box div").css("width",15*paginglength);
	$(".paging-box ul").css("margin-left",-15*paginglength/2);
	$(".paging-box > div").css("margin-left","50%");

	$("#btn-myfunds-sell").click(function(){
		openWithdrawalPop();
	});
	$("#pop-withdrawal-btc .close").click(function(){
		closeWithdrawalPop();
	});
	$("#ConmyfundsBuy").fadeIn("100");
	$("#BtnmyfundsBuy").click(function () {
		$(".guide-type").text(LANG.LANG_463[NUM]);
		$("#WITHDRAWAL_FEE").html(commonLib.getCoinFormat(DEPOSIT_FEE));
		$("#WITHDRAW_MAX").html(commonLib.getCoinFormat(MAX_DEPOSIT_AMOUNT));
		$("#WITHDRAW_MAX_AMT").html(commonLib.getCoinFormat(MAX_DEPOSIT_AMOUNT_AT_ONCE));
		$("#ConmyfundsSell").fadeOut("100", function () {
			$("#ConmyfundsBuy").fadeIn("100");
		});

	});

	$("#BtnmyfundsSell").click(function () {
		$(".guide-type").text(LANG.LANG_443[NUM]);
		$("#WITHDRAWAL_FEE").text(commonLib.getCoinFormat(WITHDRAWAL_FEE));
		$("#WITHDRAW_MAX").text(commonLib.getCoinFormat(MAX_WITHDRAWAL_AMOUNT));
		$("#WITHDRAW_MAX_AMT").text(commonLib.getCoinFormat(MAX_WITHDRAWAL_AMOUNT_AT_ONCE));
		$("#ConmyfundsBuy").fadeOut("100", function () {
			$("#ConmyfundsSell").fadeIn("100");
		});

	});
	$(function() {
		$("#datepicker1, #datepicker2").datepicker({
			dateFormat: 'yy.mm.dd',
		  showOn: "button",
		  buttonImage: "views/images/calendar-5.png",
		  buttonImageOnly: true,
		  buttonText: "Select date"
		});
	});
	(function() {
		[].slice.call(document.querySelectorAll('.myfundsTab_Area')).forEach(function(menu) {
			var menuItems = menu.querySelectorAll('.menu__link'),
				setCurrent = function(ev) {
					ev.preventDefault();

					var item = ev.target.parentNode; // li

					// return if already current
					if( classie.has(item, 'menu__item--current') ) {
						return false;
					}
					// remove current
					classie.remove(menu.querySelector('.menu__item--current'), 'menu__item--current');
					// set current
					classie.add(item, 'menu__item--current');
				};

			[].slice.call(menuItems).forEach(function(el) {
				el.addEventListener('click', setCurrent);
			});
		});
	})(window);
	$("#qrcopy").click(function(){
		copyAddress();
	});
	$("#getmax").click(function(){
		getMax();
	});
	$("#getauth").click(function(){
		authentication();
	});
	$("#getaddress").click(function() {
		var Params = {};
		commonLib.showLoadingBar();
		commonLib.generateRSAKey()
			.then(function(data) {
				var publicKey = data.PUBLICKEY;
				return commonLib.promiseWrapper(function() {
					var gubun = division;
					Params['GUBUN'] = commonLib.RSAEncrypt(publicKey, gubun);
				})
			})
			.then(commonLib.doAjaxWithPromise('/rpcgateway/createAddress', Params))
			.then(function(data) {
				commonLib.hideLoadingBar();
				var returnValue = data.returnValue;
				var message = data.message;
				alert(message);
				if (returnValue == 0) {
					location.reload();
				}

			})
			.fail(function(err) {
				commonLib.hideLoadingBar();
				console.error('createAddress failed by error : ' + err);
			});
	})
	$("#WITHDRAW_AMOUNT").keyup(function(){
		onWithdrawalAmountChange(this);
	});

	$(".search-btn").click(function(){
		search(1);
	});
	$("#widthdraw-btn").click(function(){
		withdrawalRequest();
	});
	$("#btn-myfunds-sell-admin").click(function(){
		var publicKey;
		var amount = $("#WITHDRAW_AMOUNT").val();
		amount = amount.replace(/,/gi,"");
		var Params = {};
		commonLib.generateRSAKey()
			.then(function(data) {
				publicKey = data.PUBLICKEY;
				return commonLib.promiseWrapper(function() {
					Params['TO_ADDR'] = commonLib.RSAEncrypt(publicKey, $("#ADDRESS_LIST").val());
					Params['AMOUNT'] = commonLib.RSAEncrypt(publicKey, amount);
					Params['GUBUN'] = 'W';
					Params['COIN'] = division;
				});
			})
			.then(commonLib.doAjaxWithPromise('/myfunds/requestCoinTransfer', Params))
			.then(function(data) {
				commonLib.hideLoadingBar();
				var returnValue = data.returnValue;
				var message = data.message;

				alert(data.message);
				if (returnValue == 0) {
					search(1);
					getTopCoinRateArea();
					getMyBalance();
				}
			})
	});
}


























































Trade.prototype.myfundusd = function(){
	transactionSocket.on('transactionOccurred', function(data) {
		if (CURRENT_TAB == undefined) {
			return;
		}
		var Params = {};
		Params['TYPE'] = data.TYPE;
		Params['KEY'] = data.KEY;
		Params['STAN_SNAME'] = 'USD';

		commonLib.doAjaxWithPromise('trade/getRefreshData', Params).call()
			.then(function(data) {
				console.log(data);
				bindingTopCoinRateArea(data.COIN_REAL_ALLRATE.recordset);
				initWithdrawalConfig();
				if (LOGIN) {
					getMyBalance();
				}
			});
	});

	function getTopCoinRateArea() {
		var deferred = $.Deferred();
		commonLib.doAjaxWithPromise('/trade/coinRealAllRate', null).call()
			.then(function(data) {
				var list = data.recordset;
				//var list =TEST_DATA.coinRealAllRate;
				bindingTopCoinRateArea(list);
				deferred.resolve(data);
			})
			.fail(function(err) {
				deferred.reject(err);
			});
		return deferred.promise();
	}
	function bindingTopCoinRateArea(list) {
		console.log(1);
		var bindingObject = {};
		for(var i = 0; i < list.length; i++){
			var coinrate = list[i]
			var d = new Date();
			d = (d.getMonth()+1) + "/"  + d.getDate() +" " + d.getHours() +":"+ d.getMinutes();
			bindingObject['S_DATE'] =d;
			bindingObject['NOW_RATE_'+coinrate.C_NAME] = coinrate.NOW_RATE?coinrate.NOW_RATE : 0;
			bindingObject['BE_RATE_'+coinrate.C_NAME] = coinrate.BE_RATE?coinrate.BE_RATE : 0;
			bindingObject['END_RATE_'+coinrate.C_NAME] = coinrate.END_RATE?coinrate.END_RATE : 0;
			bindingObject['DIFF_SIGN_'+coinrate.C_NAME] = (coinrate.UDGUBUN  != "D")? "↑" : "↓";
			bindingObject['DIFF_SIGN2_'+coinrate.C_NAME] = (coinrate.UDGUBUN  != "D")? "▲" : "▼";
			bindingObject['DIFF_RATE_'+coinrate.C_NAME] = coinrate.DIF_RATE?coinrate.DIF_RATE : 0;
			bindingObject['DIFF_PERCENT_SIGN_'+coinrate.C_NAME] = (coinrate.UDGUBUN  != "D")? "+" : "-";
			bindingObject['DIFF_PERCENT_'+coinrate.C_NAME] = coinrate.CHAN_RATE?coinrate.CHAN_RATE.toFixed(2) : 0;
			bindingObject['MAX_RATE_'+coinrate.C_NAME] = coinrate.TODAY_MAX_RATE?coinrate.TODAY_MAX_RATE : 0;
			bindingObject['MIN_RATE_'+coinrate.C_NAME] = coinrate.TODAY_MIN_RATE?coinrate.TODAY_MIN_RATE : 0;
			bindingObject['NOW_QUANT_'+coinrate.C_NAME] = coinrate.SERVER_QTY?coinrate.TODAY_VOLUME : 0;

			var rateSplit = coinrate.NOW_RATE.toString().split('.');
			bindingObject['NOW_RATE_F_'+coinrate.C_NAME] = rateSplit[0] ? rateSplit[0] : "0";
			bindingObject['NOW_RATE_D_'+coinrate.C_NAME] = rateSplit[1] ? rateSplit[1] : "00";
			bindingObject['COIN_SYMBOL_'+coinrate.C_NAME] = coinrate.C_NAME;
			//칼라용
			$('.'+coinrate.C_NAME+'_UD').addClass((coinrate.UDGUBUN  != "D")? "tx-blue" : "tx-red");
		}
		commonLib.bindData(bindingObject);
	}
	function getMyBalance() {
		commonLib.doAjax('/trade/myCoinBalance', null, true, function(err, data) {
			if (err) {
				window.location.href = "/";
				return;
			}
			//var list = TEST_DATA.myCoinBalance;
			var list = data.data;
			bindingMyBalance(list);
		});
	}
	function bindingMyBalance(list) {
		var bindingObject = {};
		for(var i = 0; i < list.length; i++){
			var my = list[i];
			bindingObject['MY_'+my.COIN_GUBUN] = my.POSSESSION_COIN;
			bindingObject['MY_'+my.COIN_GUBUN+'_VALUE'] = my.COIN_TO_USD;
		}
		commonLib.bindData(bindingObject);
	}


	$(document).ready(function() {
		if (!LOGIN) {
			alert(LANG.MYPAGE_VALID1[NUM]);
			location.replace('/');
			return;
		}
		var toDate = new Date();
		var beforeOneMonthDate = new Date();
		beforeOneMonthDate.setDate(beforeOneMonthDate.getDate() - 30);
		var beforeOneMonthDateString = beforeOneMonthDate.yyyymmdd();
		var toDateString = toDate.yyyymmdd()

		$("#datepicker1").val(beforeOneMonthDateString.substring(0, 4) + '.' + beforeOneMonthDateString.substring(4, 6) + '.' + beforeOneMonthDateString.substring(6, 8));
		$("#datepicker2").val(toDateString.substring(0, 4) + '.' + toDateString.substring(4, 6) + '.' + toDateString.substring(6, 8));

		getTopCoinRateArea();
		if (LOGIN) {
			initBankChange();
			getMyBalance();
			//initMyBankList();
			//initWithdrawalConfig();
		}
		openTab('D');
		search(1);
	});

	(function() {
		[].slice.call(document.querySelectorAll('.myfundsTab_Area')).forEach(function(menu) {
			var menuItems = menu.querySelectorAll('.menu__link'),
				setCurrent = function(ev) {
					ev.preventDefault();

					var item = ev.target.parentNode; // li

					// return if already current
					if( classie.has(item, 'menu__item--current') ) {
						return false;
					}
					// remove current
					classie.remove(menu.querySelector('.menu__item--current'), 'menu__item--current');
					// set current
					classie.add(item, 'menu__item--current');
				};

			[].slice.call(menuItems).forEach(function(el) {
				el.addEventListener('click', setCurrent);
			});
		});
	})(window);
	$(function() {
		$("#datepicker1, #datepicker2").datepicker({
			dateFormat: 'yy.mm.dd',
		  showOn: "button",
		  buttonImage: "views/images/calendar-5.png",
		  buttonImageOnly: true,
		  buttonText: "Select date"
		});
	});
	paginglength = $(".paging-box li").length;
	$(".paging-box div").css("width",15*paginglength);
	$(".paging-box ul").css("margin-left",-15*paginglength/2);
	$(".paging-box > div").css("margin-left","50%");


	$("#ConmyfundsBuy").fadeIn("100");
	$("#BtnmyfundsBuy").click(function () {
		openTab("D");
	});

	$("#BtnmyfundsSell").click(function () {
		openTab("W");
	});
	var CURRENT_TAB;

	function openTab(division) {
		if (division == 'W') {
			$(".guide-type").text(LANG.LANG_443[NUM]);
			$("#WITHDRAW_FEE").html(commonLib.getMoneyFormat(WITHDRAWAL_FEE));
			$("#WITHDRAW_MAX").html(commonLib.getMoneyFormat(MAX_WITHDRAWAL_AMOUNT));
			$("#WITHDRAW_MAX_AMT").html(commonLib.getMoneyFormat(MAX_WITHDRAWAL_AMOUNT_AT_ONCE));
			$("#ConmyfundsBuy").fadeOut("100", function () {
				$(".myfunds-tab-cont2").fadeIn("100");
			});
		} else {
			$(".guide-type").text(LANG.LANG_442[NUM]);
			$("#WITHDRAW_FEE").html(commonLib.getMoneyFormat(DEPOSIT_FEE));
			$("#WITHDRAW_MAX").html(commonLib.getMoneyFormat(MAX_DEPOSIT_AMOUNT));
			$("#WITHDRAW_MAX_AMT").html(commonLib.getMoneyFormat(MAX_DEPOSIT_AMOUNT_AT_ONCE));
			$(".myfunds-tab-cont2").fadeOut("100", function () {
				$("#ConmyfundsBuy").fadeIn("100");
			});
		}
		CURRENT_TAB = division;
	}
	var BANK_LIST;
	var MY_BANK;
	var WITHDRAWAL_FEE= 0,MAX_WITHDRAWAL_AMOUNT = 0,MAX_WITHDRAWAL_AMOUNT_AT_ONCE = 0;
	var DEPOSIT_FEE= 0,MAX_DEPOSIT_AMOUNT = 0,MAX_DEPOSIT_AMOUNT_AT_ONCE = 0;
	var MY_BALANCE;
	function initBankChange() {
		commonLib.doAjax('/mypage/initBankChange', null, true, function(err, data) {
			if (err) {
				window.location.href = "/";
				return;
			}

			if (data.MY_BANK_INFO[0] == undefined) {
				$("#have-account").empty();
				$("#have-account").removeClass("myfunds-tab-cont2");
			}
			else {
				$("#none-account").empty();
				$("#none-account").removeClass("myfunds-tab-cont2");
			}

			BANK_LIST = data.COUNTRY_BANK_LIST;
			MY_BANK = data.MY_BANK_INFO[0];
			commonLib.bindCombo("DEPOSIT_BNAME", data.COUNTRY_BANK_LIST, 'B_CODE', 'B_NAME');

			RAND_KEY = data.BANK_RANDKEY[0].BANK_KEY;
			MY_DATA_W = data.MY_FEE_W[0];
			MY_DATA_D = data.MY_FEE_D[0];
			WITHDRAWAL_FEE = MY_DATA_W.FEE/100;
			MAX_WITHDRAWAL_AMOUNT_AT_ONCE = MY_DATA_W.COUNT1_MAX_AMT;
			MAX_WITHDRAWAL_AMOUNT= MY_DATA_W.IN_MAX;
			DEPOSIT_FEE = MY_DATA_D.FEE/100;
			MAX_DEPOSIT_AMOUNT_AT_ONCE = MY_DATA_D.COUNT1_MAX_AMT;
			MAX_DEPOSIT_AMOUNT= MY_DATA_D.IN_MAX;
			MY_BALANCE = MY_DATA_W.COIN_USE;
			$("#RAND_BANK_KEY").val(RAND_KEY);
			$(".RAND_BANK_KEY").html(RAND_KEY);
			$("#B_NAME").html(MY_BANK?MY_BANK.B_NAME : "");
			$("#B_IDNO").html(MY_BANK?MY_BANK.B_IDNO:"000-00-000");
			$("#B_OWNER").html(MY_BANK? MY_BANK.B_OWNER : "");
			$("#USD_AVAILABLE").val(MY_DATA_W.COIN_AMOUNT);
			$("#USD_USE").val(MY_DATA_W.COIN_USE);
			$("#WITHDRAW_FEE").html(commonLib.getMoneyFormat(DEPOSIT_FEE));
			$("#WITHDRAW_MAX").html(commonLib.getMoneyFormat(MAX_DEPOSIT_AMOUNT));
			$("#WITHDRAW_MAX_AMT").html(commonLib.getMoneyFormat(MAX_DEPOSIT_AMOUNT_AT_ONCE));
			bankSelected($("#DEPOSIT_BNAME")[0]);
			$("#DEPOSIT_BNAME").change(function(){
				bankSelected(this);
			});
		});
	}
	var CNT_PER_PAGE = 10;
	function search(curPage) {
		if (curPage == undefined) {
			curPage = 1;
		}


		var sDate = $("#datepicker1").val().replaceAll('.', '');
		var eDate = $("#datepicker2").val().replaceAll('.', '');
		if (sDate > eDate) {
			alert(LANG.DATE_RANGE_FAIL1[NUM]);
			return;
		}
		var Params = {};
		Params['D_GUBUN'] = $("#D_GUBUN").val();
		Params['D_SDATE'] = sDate;
		Params['D_EDATE'] = eDate;
		Params['CUR_PAGING'] = curPage;
		Params['PAGING_NO'] = CNT_PER_PAGE;
		Params['EX_KEY'] = '';
		Params['EX_TYPE'] = '';

		commonLib.doAjax('/myfunds/myInOutList', Params, true, function(err, data) {
			if (err) {
				window.location.href = "/";
				return;
			}

			var tableDiv = $("#myfunds-history").children(".card-box").children('#Wrap_Table').children(".Table");

			tableDiv.html('');
			var list = data.list;

			var item;
			var tableDivHtml = '<div class="TH">';
			tableDivHtml += '<p class="fl-l tx-c w10p">'+LANG.LANG_72[NUM]+'</p>';
			tableDivHtml += '<p class="fl-l tx-c w10p">'+LANG.LANG_73[NUM]+'</p>';
			tableDivHtml += '<p class="fl-l tx-c w30p">'+LANG.LANG_84[NUM]+'</p>';
			tableDivHtml += '<p class="fl-l tx-c w10p">'+LANG.LANG_248[NUM]+'</p>';
			tableDivHtml += '<p class="fl-l tx-r w15p">'+LANG.LANG_67[NUM]+'</p>';
			tableDivHtml += '<p class="fl-l tx-c w25p">'+LANG.LANG_74[NUM]+'</p>';
			tableDivHtml += '</div>';

			for (var i = 0; i < list.length; i++) {
				item = list[i];
				console.log(item);
				var state = '';
				var status = '';
				if(item.GUBUN == 'WITHDRAWAL'){
					state = LANG.LANG_443[NUM];
					status = LANG.LANG_443[NUM];
				}
				else {
					state = LANG.LANG_442[NUM];
					status = LANG.LANG_442[NUM];
				}
				if(item.OKDATE){
					state += LANG.LANG_474[NUM];
				}
				else if(item.CENCEL_DATE){
					state += LANG.LANG_475[NUM];
				}
				else if(item.CENCEL_YN == 'N' || item.CENCEL_YN == null){
					state +=  LANG.LANG_476[NUM];
				}
				else if(item.CENCEL_YN == 'Y'){
					state += LANG.LANG_475[NUM];
				}
				else{
					state += LANG.LANG_478[NUM];
				}

				tableDivHtml += '<div class="TD">';
				if (item.GUBUN == 'WITHDRAWAL') {
					tableDivHtml += '<p class="fl-l tx-c w10p tx-blue">';
				} else {
					tableDivHtml += '<p class="fl-l tx-c w10p tx-red">';
				}
				tableDivHtml += state+'</p>';
				tableDivHtml += '<p class="fl-l tx-c w10p">'+item.BNAME+' ' +LANG.LANG_258[NUM]+'</p>';
				tableDivHtml += '<p class="fl-l tx-c w30p">'+item.BIDNO+'</p>';
				tableDivHtml += '<p class="fl-l tx-c w10p">'+item.BOWNER+'</p>';
				tableDivHtml += '<p class="fl-l tx-r w15p">'+commonLib.getMoneyFormat(item.USDAMT)+'</p>';
				tableDivHtml += '<p class="fl-l tx-c w25p">';
				tableDivHtml += '<span>'+LANG.LANG_254[NUM]+' : '+item.IDATE+'</span><br>';
				if(item.OKDATE){
					tableDivHtml += '<span>'+LANG.LANG_250[NUM]+' : '+item.OKDATE+'</span>';
				}
				else if(item.CENCEL_YN == 'Y' || item.CENCEL_DATE) {
					if(item.CENCEL_ADMIN == '0') {
						tableDivHtml += '<span>'+LANG.LANG_385[NUM]+' : '+item.CENCEL_DATE+'</span>';
					}
					else
						tableDivHtml += '<span>'+LANG.LANG_385[NUM]+' : '+item.CENCEL_DATE+'</span><a class="btn-s-blue ml-5 btn-myfund-reason" data.idx="' + item.IDX + '"><span>'+LANG.LANG_491[NUM]+'</span></a>';
				}
				else if(item.CENCEL_YN == 'P'){
					tableDivHtml += '<span>'+status+' ' +LANG.LANG_480[NUM]+'</span>';
				}
				else {
					tableDivHtml += '<span>'+status+' ' +LANG.LANG_480[NUM]+' <a data-idx="' + item.IDX + '" data-gubun="' + item.GUBUN + '" class="CANCEL_REQUEST btn-s-red ml-5">'+LANG.LANG_481[NUM]+'</a></span>';
				}
				tableDivHtml += '</p>';
				tableDivHtml += '</div>';
			}
			tableDiv.html(tableDivHtml);

			var totalCnt = data.cnt;
			var pagingDiv = $(".paging-box").find('.row');
			var pagingDivHtml = commonLib.paging(totalCnt, CNT_PER_PAGE, 10, curPage, 'search');
			pagingDiv.html(pagingDivHtml);

			paginglength = $(".paging-box li").length;
			$(".paging-box div").css("width",15*paginglength);
			$(".paging-box ul").css("margin-left",-15*paginglength/2);
			$(".paging-box > div").css("margin-left","50%");


			pagingDiv.find("li").click(function(){
				search($(this).data("idx"));
			});

			$(".btn-myfund-reason").click(function(){
				$("#popup-bg").css("display","table");
				$("#popup-bg #pop-reason").css("display","block");
			});

			$(".CANCEL_REQUEST").click(function(){
				cancelRequest($(this).data("idx"), $(this).data("gubun"));
			});
		});
	}

	$(".search-btn").click(function(){
		search(1);
	});

	$("#getmax").click(function(){
		getMax();
	});
	$("#WITHDRAW_AMOUNT").keyup(function(){
		onWithdrawalAmountChange(this);
	});

	$("#DEPOSIT_AMOUNT").keyup(function(){
		onDepositAmountChange(this);
	});
	$("#pop-reason .close").click(function(){
		$("#popup-bg").css("display","none");
		$("#popup-bg #pop-reason").css("display","none");
	});
	function bankSelected(objSelect) {
		var bankCode = objSelect.value;
		if (bankCode == undefined) {
			return;
		}
		var item;
		for (var i = 0; i < BANK_LIST.length; i++) {
			item = BANK_LIST[i];

			if (bankCode == item.B_CODE) {
				break;
			}
		}
		$("#DEPOSIT_BIDNO").val(item.B_IDNO);
		$("#DEPOSIT_B_OWNER").val(item.B_OWNER);
	}
	function onWithdrawalAmountChange(obj) {
		var newVal = commonLib.toNumber(obj.value);
		if (isNaN(newVal)) {
			alert(LANG.NUMBER_FAIL1[NUM]);
			obj.value = 0;
			return;
		}

		if (newVal < 0) {
			alert(LANG.NUMBER_FAIL2[NUM]);
			obj.value = 0;
			return;
		}

		var actualWithdrawalAmount = newVal - (WITHDRAWAL_FEE*newVal);
		if(MY_BALANCE < actualWithdrawalAmount){
			alert(LANG.LANG_477[NUM]);
			obj.value = 0;
			$("#AMOUNT").val("0.00000000");
			$("#FEE_AMOUNT").val("0.00000000");
			return;
		}
		$("#WITHDRAWAL_ACTUAL_KRW").text(commonLib.getMoneyFormat(actualWithdrawalAmount * USER_PER_USD));
		$("#WITHDRAWAL_ACTUAL_USD").text(commonLib.getMoneyFormat(actualWithdrawalAmount));
	}
	function onDepositAmountChange(obj) {
		var newVal = commonLib.toNumber(obj.value);
		if (isNaN(newVal)) {
			alert(LANG.NUMBER_FAIL1[NUM]);
			obj.value = 0;
			return;
		}

		if (newVal < 0) {
			alert(LANG.NUMBER_FAIL2[NUM]);
			obj.value = 0;
			return;
		}

		$("#DEPOSIT_ACTUAL_KRW").text(commonLib.getMoneyFormat(newVal * USER_PER_USD));
		$("#DEPOSIT_ACTUAL_USD").text(commonLib.getMoneyFormat(newVal));
	}
	function getMax() {
		var myBalance = MY_BALANCE;
		// if (MAX_WITHDRAWAL_AMOUNT_AT_ONCE == 0) {
		// 	MAX_WITHDRAWAL_AMOUNT_AT_ONCE = 5;
		// }

		//나중에 고쳐야함..
		//var withdrawFee = WITHDRAWAL_FEE;
		//var amountOfWithDrawal = 0;

		//if ((myBalance + WITHDRAWAL_FEE) > MAX_WITHDRAWAL_AMOUNT_AT_ONCE) {
		//	amountOfWithDrawal = MAX_WITHDRAWAL_AMOUNT_AT_ONCE;
		//} else {
		//	amountOfWithDrawal = myBalance - WITHDRAWAL_FEE;
		//}
		$("#WITHDRAW_AMOUNT").val(commonLib.getMoneyFormat(myBalance));
		$("#WITHDRAWAL_ACTUAL_KRW").text(commonLib.getMoneyFormat((myBalance - WITHDRAWAL_FEE) * USER_PER_USD));
		$("#WITHDRAWAL_ACTUAL_USD").text(commonLib.getMoneyFormat(myBalance - WITHDRAWAL_FEE));

	}
	var TIMER;
	function startTimer(s) {
		var obj;
		if(CURRENT_TAB == 'D'){
			obj = "deposit";
		}
		else obj = "withdraw";
		$("#"+ obj+"_timer").text(s);
		var remainTime = s;
		TIMER = setInterval(function() {
			remainTime = remainTime - 1;
			$("#"+ obj+"_timer").html(remainTime);
			if (remainTime == 0) {
				stopTimer();
				setTimeout(function() {
					alert(LANG.TRADE_TIMEOUT[NUM]);
					closeRequestConfirmPop();
				}, 50);
			}
		}, 1000);
	}
	function stopTimer() {
		TOKEN = null;
		if (TIMER != null) {
			clearInterval(TIMER);
			TIMER = null;
		}
	}

	var D_FLAG = '001';
	var SMS_ON = false;
	var D_IDX = '';

	function closeRequestConfirmPop(){
		SMS_ON = false;
		if(CURRENT_TAB == 'D'){
			$("#popup-bg").css("display","none");
			$("#popup-bg #pop-deposit").css("display","none");
		}
		else{
			$("#popup-bg").css("display","none");
			$("#popup-bg #pop-withdrawal").css("display","none");
		}
		stopTimer();
	}
	$(".usd_fund_btn").click(function(){
		openRequestConfirmPop();
	});
	$(".popup-in-box .close").click(function(){
		closeRequestConfirmPop();
	});
	function openRequestConfirmPop() {
		if (!LOGIN) {
			alert(LANG.TRADE_VALID1[NUM]);
			return;
		}
		var obj;
		if(CURRENT_TAB == 'D'){
			obj = "DEPOSIT";
		}
		else obj = "WITHDRAW";

		var amount = $("#"+obj+"_AMOUNT").val();
		if(CURRENT_TAB == 'D'){
			if (amount < MAX_DEPOSIT_AMOUNT){
				alert(LANG.LANG_486[NUM]);
				return;
			}
		}
		if(CURRENT_TAB == 'W'){
			if (amount < MAX_WITHDRAWAL_AMOUNT){
				alert(LANG.LANG_490[NUM]);
				return;
			}
		}
		if (amount == 0 || amount == undefined) {
			alert(LANG.TRADE_VALID5[NUM]);
			return;
		}
		if(!SMS_ON){
			alert(LANG.SMS_CHECK_VALID1[NUM]);
			return;
		}
		if(!$("#"+obj+"_D_SMSNO").val()){
			alert(LANG.SMS_CHECK_FAIL5[NUM]);
			return;
		}
		if (CURRENT_TAB == 'D') {
			$("#popup-bg").css("display","table");
			$("#popup-bg #pop-deposit").css("display","block");
			$("#DEPOSIT_POP_AMOUNT").html(commonLib.getMoneyFormat($("#DEPOSIT_AMOUNT").val()));
			$("#DEPOSIT_POP_ACT_AMOUNT").html(commonLib.getMoneyFormat($("#DEPOSIT_AMOUNT").val() * USER_PER_USD));
			$("#DEPOSIT_POP_BNAME").html($("#DEPOSIT_BNAME option:selected").text());
			$("#DEPOSIT_POP_BIDNO").html($("#DEPOSIT_BIDNO").val());
			$("#DEPOSIT_POP_B_OWNER").html($("#DEPOSIT_B_OWNER").val());
			$("#DEPOSIT_POP_RAND_BANK_KEY").html($("#RAND_BANK_KEY").val());
		} else {
			$("#popup-bg").css("display","table");
			$("#popup-bg #pop-withdrawal").css("display","block");
			$("#WITHDRAW_POP_AMOUNT").html($("#WITHDRAW_AMOUNT").val());
			$("#WITHDRAW_POP_ACT_AMOUNT").html($("#WITHDRAWAL_ACTUAL_KRW").text());
			$("#WITHDRAW_POP_BNAME").html($("#B_NAME").text());
			$("#WITHDRAW_POP_BIDNO").html($("#B_IDNO").text());
			$("#WITHDRAW_POP_B_OWNER").html($("#B_OWNER").text());
		}
		startTimer(20);
	}
	$("#withdraw_request").click(function(){
		var publicKey;
		var Params = {};
		commonLib.showLoadingBar();
		commonLib.generateRSAKey()
			.then(function(data) {
				publicKey = data.PUBLICKEY;
				return commonLib.promiseWrapper(function() {
					Params['D_FLAG'] = D_FLAG;
					Params['D_SMSNO'] = commonLib.RSAEncrypt(publicKey, $("#WITHDRAW_D_SMSNO").val());
					Params['D_IDX'] = commonLib.RSAEncrypt(publicKey, D_IDX);
				});
			})
			.then(commonLib.doAjaxWithPromise('/mypage/smsConfirm', Params))
			.then(function(data) {
				var returnValue = data.returnValue;
				var message = data.message;


				return commonLib.promiseWrapper(function() {
					if (returnValue != 0) {
						alert(message);
						throw new Error('smsConfirm fail..');
					}
					Params['BNAME'] = $("#WITHDRAW_POP_BNAME").text();
					Params['BIDNO'] = $("#WITHDRAW_POP_BIDNO").text();
					Params['BOWNER'] = $("#WITHDRAW_POP_B_OWNER").text();;
					Params['USDAMT'] = commonLib.toNumber($("#WITHDRAW_POP_AMOUNT").text())
					Params['USDRATE'] = USER_PER_USD;
					Params['KRWRATE'] = KRW_PER_USD;
					Params['CURAMT'] = commonLib.toNumber($("#WITHDRAW_POP_AMOUNT").text()) * USER_PER_USD;
					Params['GUBUN'] = "USD";
				});
			})
			.then(commonLib.doAjaxWithPromise('/myfunds/withdrawalRequest', Params))
			.then(function(data) {
				commonLib.hideLoadingBar();
				var returnValue = data.returnValue;
				var message = data.message;

				alert(data.message);
				closeRequestConfirmPop();
				if (returnValue == 0) {
					search(1);
					getTopCoinRateArea();
					getMyBalance();
					initBankChange();
				}

			})
			.fail(function(err) {
				commonLib.hideLoadingBar();
				closeRequestConfirmPop();
				console.error('withdrawalRequest failed by error : ' + err);
			});
	});

	$(".btnAuthentication").click(function(){
		authentication();
	});
	function authentication() {
		var param = {};
		param['D_FLAG'] = D_FLAG;
		commonLib.doAjax('/sendVertificationOnLogin', param, true, function(err, data) {
			if (err) {
				return;
			}
			var returnValue = data.returnValue;
			var message = data.message;
			D_IDX = new String(data.D_IDX);
			SMS_ON = true;
			alert(message);
		});
	}
	$("#deposit_request").click(function(){
		var Params = {};
		commonLib.showLoadingBar();
		commonLib.generateRSAKey()
			.then(function(data) {
				var publicKey = data.PUBLICKEY;
				return commonLib.promiseWrapper(function() {

					Params['D_FLAG'] = D_FLAG;
					Params['D_SMSNO'] = commonLib.RSAEncrypt(publicKey, $("#DEPOSIT_D_SMSNO").val());
					Params['D_IDX'] = commonLib.RSAEncrypt(publicKey, D_IDX);

				});
			})
			.then(commonLib.doAjaxWithPromise('/mypage/smsConfirm', Params))
			.then(function(data) {
				var returnValue = data.returnValue;
				var message = data.message;

				return commonLib.promiseWrapper(function() {
					if (returnValue != 0) {
						alert(message);
						throw new Error('smsConfirm fail..');
					} else {
						Params['BNAME'] = $("#DEPOSIT_POP_BNAME").text();
						Params['BIDNO'] = $("#DEPOSIT_POP_BIDNO").text();
						Params['BOWNER'] = $("#DEPOSIT_POP_B_OWNER").text();
						Params['AMT'] = commonLib.toNumber($("#DEPOSIT_POP_AMOUNT").text());
						Params['USD_RATE'] = USER_PER_USD;
						Params['KRW_RATE'] = KRW_PER_USD;
						Params['CUR_AMT'] = commonLib.toNumber($("#DEPOSIT_POP_ACT_AMOUNT").text());
						Params['CURRENCY'] = "USD";
					}

				});
			})
			.then(commonLib.doAjaxWithPromise('/myfunds/depositRequest', Params))
			.then(function(data) {

				var returnValue = data.returnValue;
				var message = data.message;

				commonLib.hideLoadingBar();
				alert(data.message);
				closeRequestConfirmPop();

				if (returnValue == 0) {
					search(1);
				}

			})
			.fail(function(err) {
				commonLib.hideLoadingBar();
				closeRequestConfirmPop();
				console.error('depositRequest failed by error : ' + err);
			});
	});
	function cancelRequest(idx, gubun){
		if(confirm(LANG.LANG_482[NUM])){
			var param = {};
			param['idx'] = idx;
			param['gubun'] = gubun;
			commonLib.doAjax('/myfunds/requestUSDCancel', param, true, function(err, data) {
				if (err) {
					return;
				}
				alert(data.message);
				search(1);
				getTopCoinRateArea();
				getMyBalance();
				initBankChange();
			});
		}
	}
}

Trade.prototype.removeEvents = function(){
}
