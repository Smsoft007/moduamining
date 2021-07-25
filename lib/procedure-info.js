'use strict';
var sql = require('mssql');
var procedureNames = {}

function ProcedureInfo() {};
ProcedureInfo.prototype.setProcedureInfo = function(procedureName, procedureInfo) {
  if (procedureInfo.hasOwnProperty(procedureName)) {
    console.error(procedureName + '은 이미 지정되어 있습니다.');
    return;
  } else {
    this[procedureName] = procedureInfo;
  }
}
var procedureInfo = new ProcedureInfo();

var currentName = 'SP_MEMBER_LOGIN';
var currentInfo = {
  usingCache: false,  params: [{
      name: 'inUser_ID',
      type: sql.NVarChar(20),
      required: true
    },
    {
      name: 'inUser_Pwd',
      type: sql.NVarChar(150),
      required: true
    },
    {
      name: 'inUser_IP',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'sessionID',
      type: sql.NVarChar(50),
      required: true
    }
  ]
};

procedureInfo.setProcedureInfo(currentName, currentInfo);
procedureNames['signin'] = {
  name: currentName,
  returnName: "USERSIGNIN"
}
currentName = 'SP_PHONE_LOGIN';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'D_HP',
      type: sql.NVarChar(20),
      required: true
    },
    {
      name: 'inUser_IP',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'sessionID',
      type: sql.NVarChar(50),
      required: true
    }
  ]
};

procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_NOID_SEARCH';
currentInfo = {
  usingCache: false,
  params: [{
    name: 'D_UID',
    type: sql.NVarChar(30),
    required: true
  }]
};
procedureNames['idcheck'] = {
  name: currentName,
  returnName: "CHECKID"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'A_HP_UPDATE';
currentInfo = {
  usingCache: false,
  params: [{
    name: 'D_UID',
    type: sql.NVarChar(20),
    required: true
  }, {
    name: 'HP',
    type: sql.NVarChar(20),
    required: true
  }]
};
procedureNames['updateHp'] = {
  name: currentName,
  returnName: "HPUPDATE"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SA_BOARD_MAIN_WRITE';
currentInfo = {
  usingCache: false,
  params: [{
    name: 'B_UID',
    type: sql.NVarChar(20),
    required: true
  },{
    name: 'B_GUBUN',
    type: sql.NVarChar(20),
    required: true
  },{
    name: 'B_T_TYPE',
    type: sql.NVarChar(20),
    required: true
  },{
    name: 'B_TITLE',
    type: sql.NVarChar(20),
    required: true
  },{
    name: 'B_CONTENTS',
    type: sql.NVarChar(20),
    required: true
  },{
    name: 'B_NOTI_YN',
    type: sql.NVarChar(20),
    required: true
  },{
    name: 'B_apX',
    type: sql.NVarChar(20),
    required: true
  },{
    name: 'B_apY',
    type: sql.NVarChar(20),
    required: true
  },{
    name: 'B_Level',
    type: sql.NVarChar(20),
    required: true
  },{
    name: 'B_VRPATH',
    type: sql.NVarChar(20),
    required: true
  },{
    name: 'B_ADDRESS',
    type: sql.NVarChar(20),
    required: true
  },{
    name: 'B_COUNTRY',
    type: sql.NVarChar(20),
    required: true
  },{
    name: 'B_FILE_PATH1',
    type: sql.NVarChar(20),
    required: true
  },{
    name: 'B_FILE_PATH2',
    type: sql.NVarChar(20),
    required: true
  },{
    name: 'B_FILE_PATH3',
    type: sql.NVarChar(20),
    required: true
  },{
    name: 'B_FILE_PATH4',
    type: sql.NVarChar(20),
    required: true
  }, {
    name: 'B_FILE_PATH5',
    type: sql.NVarChar(20),
    required: true
  }]
};
procedureNames['updateHp'] = {
  name: currentName,
  returnName: "HPUPDATE"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_BANK';
currentInfo = {
  usingCache: false,
  params: []
};
procedureNames['getBanks'] = {
  name: currentName,
  returnName: "BANK"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_BANK_UPDATE';
currentInfo = {
  usingCache: false,
  params: [{
    name: 'D_UID',
    type: sql.NVarChar(50),
    required: true
  }, {
    name: 'B_CODE',
    type: sql.NVarChar(50),
    required: true
  }, {
    name: 'B_IDNO',
    type: sql.NVarChar(50),
    required: true
  }, {
    name: 'B_OWNER',
    type: sql.NVarChar(50),
    required: true
  }, {
    name: 'SMS_NO',
    type: sql.NVarChar(50),
    required: true
  }, {
    name: 'SMS_KEY',
    type: sql.Int,
    required: true
  }]
};
procedureNames['setBank'] = {
  name: currentName,
  returnName: "BANK"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_COIN_ADDR_OUT_LIST';
currentInfo = {
  usingCache: false,
  params: [{
    name: 'D_UID',
    type: sql.NVarChar(50),
    required: true
  }]
};
procedureNames['getAddrOutList'] = {
  name: currentName,
  returnName: "OUTADDR"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_COIN_ADDR_OUT_DELETE';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'D_UID',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'SNAME',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'IDX',
      type: sql.Int,
      required: true
    }
  ]
};
procedureNames['delOutAddr'] = {
  name: currentName,
  returnName: "DELADDR"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_BUY_OK_DETAIL';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'D_UID',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'SEQ',
      type: sql.Int,
      required: true
    }
  ]
};
procedureNames['getBuyOkDetil'] = {
  name: currentName,
  returnName: "DETAIL"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_ITEM_SEND';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'D_UID',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'SELL_KEY',
      type: sql.Int,
      required: true
    }
  ]
};
procedureNames['sendItem'] = {
  name: currentName,
  returnName: "ITEM"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_SELL_OK_DETAIL';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'D_UID',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'SEQ',
      type: sql.Int,
      required: true
    }
  ]
};
procedureNames['getSellOkDetil'] = {
  name: currentName,
  returnName: "DETAIL"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_COIN_ADDR_OUT';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'D_UID',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'SNAME',
      type: sql.NVarChar(20),
      required: true
    },
    {
      name: 'AD_NAME',
      type: sql.NVarChar(20),
      required: true
    },
    {
      name: 'ADDR',
      type: sql.NVarChar(100),
      required: true
    },
    {
      name: 'D_KEY',
      type: sql.Int,
      required: true
    }
  ]
};
procedureNames['reqAddOutAddr'] = {
  name: currentName,
  returnName: "ADDOUTADDR"
}

procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_ITEM_STATUS';
currentInfo = {
  usingCache: false,
  params: [{
    name: 'D_UID',
    type: sql.NVarChar(50),
    required: true
  }]
};
procedureNames['getMyState'] = {
  name: currentName,
  returnName: "STATUS"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_PRODUCT_D';
currentInfo = {
  usingCache: false,
  params: []
};
procedureNames['getProductD'] = {
  name: currentName,
  returnName: "PRODD"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_FARM_LIST_DT';
currentInfo = {
  usingCache: false,
  params: [{
    name: 'D_UID',
    type: sql.NVarChar(50),
    required: true
  }, {
    name: 'LEVEL',
    type: sql.Int,
    required: true
  }]
};
procedureNames['getFarm'] = {
  name: currentName,
  returnName: "GETFARM"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_USDFARM_SELL';
currentInfo = {
  usingCache: false,
  params: [{
    name: 'D_UID',
    type: sql.NVarChar(50),
    required: true
  }, {
    name: 'LEVEL',
    type: sql.Int,
    required: true
  }]
};
procedureNames['sellFarm'] = {
  name: currentName,
  returnName: "SELLFARM"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_PASS_FORGOT';
currentInfo = {
  usingCache: false,
  params: [{
    name: 'D_UID',
    type: sql.NVarChar(50),
    required: true
  }, {
    name: 'EMAIL',
    type: sql.NVarChar(100),
    required: true
  }]
};
procedureNames['pwdChangeMail'] = {
  name: currentName,
  returnName: "FINDPWD"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_PASS_UPDATE';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'PW_KEY',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'RAN_NUM',
      type: sql.NVarChar(10),
      required: true
    },
    {
      name: 'D_NEW_PASS',
      type: sql.NVarChar(30),
      required: true
    }
  ]
};
procedureNames['chpwd'] = {
  name: currentName,
  returnName: "CHPWD"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_MY_ACCOUNT_LIST';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'D_UID',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'GUBUN',
      type: sql.NVarChar(10),
      required: true
    }
  ]
};
procedureNames['getMyAccountList'] = {
  name: currentName,
  returnName: "ACCLIST"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_MACH_AUTO_CFG';
currentInfo = {
  usingCache: false,
  params: [{
    name: 'D_UID',
    type: sql.NVarChar(50),
    required: true
  }]
};
procedureNames['changeAUTO'] = {
  name: currentName,
  returnName: "CHAUTO"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_FARM_LIST';
currentInfo = {
  usingCache: false,
  params: [{
    name: 'D_UID',
    type: sql.NVarChar(50),
    required: true
  }]
};
procedureNames['getFarmList'] = {
  name: currentName,
  returnName: "FARMLIST"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_ACCOUNT_CREATE';
currentInfo = {
  usingCache: false,
  params: [{
    name: 'D_UID',
    type: sql.NVarChar(50),
    required: true
  }]
};
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_COIN_WITHDRAW';
currentInfo = {
  usingCache: false,
  params: [{
    name: 'D_UID',
    type: sql.NVarChar(50),
    required: true
  }, {
    name: 'TO_ADDR',
    type: sql.VarChar(100),
    required: true
  }, {
    name: 'QTY',
    type: sql.Decimal(18, 2),
    required: true
  }, {
    name: 'RATE',
    type: sql.Decimal(18, 2),
    required: true
  }, {
    name: 'AMT_USD',
    type: sql.Decimal(18, 2),
    required: true
  }, {
    name: 'FEES',
    type: sql.Decimal(18, 2),
    required: true
  }, {
    name: 'GUBUN',
    type: sql.VarChar(10),
    required: true
  }, {
    name: 'SMS_NO',
    type: sql.VarChar(10),
    required: true
  }]
};
procedureNames['reqCoinWithd'] = {
  name: currentName,
  returnName: "REQCOINWITHD"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);
currentName = 'SP_MAIL_CHECK';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'D_UID',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'D_MAIL',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'D_FLAG',
      type: sql.NVarChar(5),
      required: true
    },
    {
      name: 'D_SESSION',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'D_IP',
      type: sql.NVarChar(20),
      required: true
    }
  ]
};
procedureNames['sendMail'] = {
  name: currentName,
  returnName: "SENDMAIL"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_BALANCE';
currentInfo = {
  usingCache: false,
  params: [{
    name: 'D_UID',
    type: sql.NVarChar(50),
    required: true
  }]
};
procedureNames['getBalances'] = {
  name: currentName,
  returnName: "BALANCES"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_COIN_ADDR_CREATE_SALE';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'D_UID',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'RATE',
      type: sql.Decimal(18, 8),
      required: true
    },
    {
      name: 'QTY',
      type: sql.Decimal(18, 8),
      required: true
    },
    {
      name: 'AMOUNT',
      type: sql.Decimal(18, 8),
      required: true
    }
  ]
};

procedureNames['invoice'] = {
  name: currentName,
  returnName: "startInvoice"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);
currentName = 'SP_COIN_NOTI_MINING';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'SENDADDR',
      type: sql.VarChar(100),
      required: true
    },
    {
      name: 'RECEIVEADDR',
      type: sql.VarChar(100),
      required: true
    },
    {
      name: 'QTY',
      type: sql.Decimal(18, 8),
      required: true
    },
    {
      name: 'RATE',
      type: sql.Decimal(18, 8),
      required: true
    },
    {
      name: 'REAL_FEE',
      type: sql.Decimal(18, 8),
      required: true
    },
    {
      name: 'GUBUN',
      type: sql.VarChar(10),
      required: true
    },
    {
      name: 'TXID',
      type: sql.VarChar(200),
      required: true
    },
    {
      name: 'CATEGORY',
      type: sql.VarChar(50),
      required: true
    }
  ]
};
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_COIN_NOTI';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'SENDADDR',
      type: sql.VarChar(100),
      required: true
    },
    {
      name: 'RECEIVEADDR',
      type: sql.VarChar(100),
      required: true
    },
    {
      name: 'QTY',
      type: sql.Decimal(18, 8),
      required: true
    },
    {
      name: 'RATE',
      type: sql.Decimal(18, 8),
      required: true
    },
    {
      name: 'REAL_FEE',
      type: sql.Decimal(18, 8),
      required: true
    },
    {
      name: 'GUBUN',
      type: sql.VarChar(10),
      required: true
    },
    {
      name: 'TXID',
      type: sql.VarChar(200),
      required: true
    },
    {
      name: 'CATEGORY',
      type: sql.VarChar(50),
      required: true
    }
  ]
};
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_COIN_NOTI_COMPLETE';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'OUTKEY',
      type: sql.Int,
      required: true
    },
    {
      name: 'TXID',
      type: sql.VarChar(100),
      required: true
    },
    {
      name: 'RESULT',
      type: sql.Int,
      required: true
    },
    {
      name: 'FEE',
      type: sql.Decimal(18, 8),
      required: true
    }
  ]
};
procedureInfo.setProcedureInfo(currentName, currentInfo);
currentName = 'SP_COIN_WAITING';
currentInfo = {
  usingCache: false,
  params: []
};
procedureInfo.setProcedureInfo(currentName, currentInfo);
currentName = 'SP_ID_SEARCH_P';
currentInfo = {
  usingCache: false,
  params: [{
    name: 'SEARCH_ID',
    type: sql.NVarChar(10),
    required: true
  }]
};
procedureNames['findID'] = {
  name: currentName,
  returnName: "FINDID"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_MAIL_CONFIRM';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'D_UID',
      type: sql.NVarChar(30),
      required: true
    },
    {
      name: 'D_FLAG',
      type: sql.NVarChar(30),
      required: true
    },
    {
      name: 'D_SMSNO',
      type: sql.Int,
      required: true
    },
    {
      name: 'D_IDX',
      type: sql.Int,
      required: true
    }
  ]
};
procedureNames['mailConfirm'] = {
  name: currentName,
  returnName: "MAILCONF"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_COIN_DEPOSIT_STATE';
currentInfo = {
  usingCache: false,
  params: [{
    name: 'D_UID',
    type: sql.NVarChar(30),
    required: true
  }]
};
procedureNames['getDepositState'] = {
  name: currentName,
  returnName: "DEPSTATE"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_GETGP_POINT';
currentInfo = {
  usingCache: false,
  params: [{
    name: 'D_UID',
    type: sql.NVarChar(30),
    required: true
  }]
};
procedureNames['getGamePoint'] = {
  name: currentName,
  returnName: "GAMEPOINT"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_COIN_DEPOSIT_LIST';
currentInfo = {
  usingCache: false,
  params: []
};
procedureNames['getDepositList'] = {
  name: currentName,
  returnName: "DEPLIST"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_COIN_SALE_LIST_DEL';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'D_UID',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'MS_KEY',
      type: sql.BigInt,
      required: true
    }
  ]
};
procedureNames['saleDelete'] = {
  name: currentName,
  returnName: "DELSEAL"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_SALE_ADD';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'D_UID',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'D_CODE',
      type: sql.NVarChar(10),
      required: true
    }
    //,
    // {
    //   name: 'D_SMSNO',
    //   type: sql.Int,
    //   required: true
    // },
    // {
    //   name: 'D_IDX',
    //   type: sql.Int,
    //   required: true
    // }
  ]
};
procedureNames['purch'] = {
  name: currentName,
  returnName: "PURCH"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_MAIL_NCHECK';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'D_UID',
      type: sql.NVarChar(30),
      required: true
    },
    {
      name: 'D_FLAG',
      type: sql.NVarChar(30),
      required: true
    },
    {
      name: 'D_SESSION',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'D_IP',
      type: sql.NVarChar(20),
      required: true
    }
  ]
};
procedureNames['purchSendMail'] = {
  name: currentName,
  returnName: "NMAIL"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_COIN_TR_WBALANCE';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'D_UID',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'AD_UID',
      type: sql.NVarChar(50),
      required: true
    }
  ]
};
procedureNames['withdrawInit'] = {
  name: currentName,
  returnName: "WITHINIT"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'WEB_SPONSOR_AUTO';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'WB_PID',
      type: sql.NVarChar(20),
      required: true
    },
    {
      name: 'WB_LINE',
      type: sql.NVarChar(1),
      required: true
    }
  ]
};
procedureNames['getSponse'] = {
  name: currentName,
  returnName: "SPONSE"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_GAME_GETUSERID';
currentInfo = {
  usingCache: false,
  params: [{
    name: 'D_UID',
    type: sql.NVarChar(50),
    required: true
  }]
};
procedureNames['getGameUser'] = {
  name: currentName,
  returnName: "GEAMUSER"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_GAME_USERID_CREATE';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'D_UID',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'D_GUID',
      type: sql.NVarChar(50),
      required: true
    }
  ]
};
procedureNames['setGameUser'] = {
  name: currentName,
  returnName: "CGEAMUSER"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_GAMT_POINT_CONVERT';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'D_UID',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'D_GUID',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'D_AMT',
      type: sql.Decimal(18, 8),
      required: true
    }
  ]
};
procedureNames['convertPoint'] = {
  name: currentName,
  returnName: "CONPOINT"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_COIN_TRANSFER';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'D_UID',
      type: sql.NVarChar(30),
      required: true
    },
    {
      name: 'TO_ADDR',
      type: sql.NVarChar(100),
      required: true
    },
    {
      name: 'AMOUNT',
      type: sql.Decimal(18, 8),
      required: true
    },
    {
      name: 'FEE',
      type: sql.Decimal(18, 8),
      required: true
    },
    {
      name: 'GUBUN',
      type: sql.NVarChar(10),
      required: true
    },
    {
      name: 'RATE',
      type: sql.Decimal(18, 8),
      required: true
    },
    {
      name: 'D_QTY',
      type: sql.Decimal(18, 8),
      required: true
    },
    {
      name: 'D_SMSNO',
      type: sql.Int,
      required: true
    },
    {
      name: 'D_IDX',
      type: sql.Int,
      required: true
    }
  ]
};
procedureNames['withdraw'] = {
  name: currentName,
  returnName: "WITHDRAW"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);
//
// currentName = 'SP_INVOICE_KEY';
// currentInfo = {
//   usingCache: false,
//   params: [{
//       name: 'D_UID',
//       type: sql.NVarChar(50),
//       required: true
//     },
//     {
//       name: 'QTY',
//       type: sql.Decimal(18, 8),
//       required: true
//     }
//   ]
// };
// procedureNames['inVoice'] = {
//   name: currentName,
//   returnName: "INVOICE"
// }
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_COIN_PANDING';
currentInfo = {
  usingCache: false,
  params: [{
    name: 'D_UID',
    type: sql.NVarChar(50),
    required: true
  }]
};
procedureNames['delReq'] = {
  name: currentName,
  returnName: "DELREQ"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_MY_DASHBOARD';
currentInfo = {
  usingCache: false,
  params: [{
    name: 'D_UID',
    type: sql.NVarChar(50),
    required: true
  }]
};
procedureNames['getDashTop'] = {
  name: currentName,
  returnName: "DASHTOP"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_MY_DASHBOARD_CHAT';
currentInfo = {
  usingCache: false,
  params: [{
    name: 'D_UID',
    type: sql.NVarChar(50),
    required: true
  }]
};
procedureNames['getDashListData'] = {
  name: currentName,
  returnName: "DASHLIST"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_PWSERCH_CHANGE';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'D_UID',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'D_EMAIL',
      type: sql.NVarChar(100),
      required: true
    }
  ]
};
procedureNames['resetPwd'] = {
  name: currentName,
  returnName: "RESETPWD"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_COIN_TRANSFER_TXID';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'OUTKEY',
      type: sql.Int,
      required: true
    },
    {
      name: 'TXID',
      type: sql.NVarChar(100),
      required: true
    },
    {
      name: 'RESULT',
      type: sql.Int,
      required: true
    },
    {
      name: 'ER_CODE',
      type: sql.NVarChar(10),
      required: true
    },
    {
      name: 'FEE',
      type: sql.Int,
      required: true
    },
    {
      name: 'FEE_TXID',
      type: sql.NVarChar(100),
      required: true
    },
    {
      name: 'AD_FEE',
      type: sql.Decimal(18, 8),
      required: true
    }
  ]
};
procedureInfo.setProcedureInfo(currentName, currentInfo);
currentName = 'SP_PW_CHAGNE';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'D_UID',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'CUR_PW',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'NEW_PW',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'D_IDX',
      type: sql.Int,
      required: true
    },
    {
      name: 'D_SMSNO',
      type: sql.NVarChar(10),
      required: true
    }
  ]
};
procedureNames['changePwd'] = {
  name: currentName,
  returnName: "CHPWD"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_RECOMMENDED_SET';
currentInfo = {
  usingCache: false,
  params: [{
    name: 'D_UID',
    type: sql.NVarChar(50),
    required: true
  }]
};
procedureNames['myPartner'] = {
  name: currentName,
  returnName: "PARTNER"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_COIN_LIST';
currentInfo = {
  usingCache: false,
  params: []
};
procedureNames['getUsingCoinList'] = {
  name: currentName,
  returnName: "UCOINLIST"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_COIN_TRANSFER_COMPLETE';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'OUTKEY',
      type: sql.Int,
      required: true
    },
    {
      name: 'TXID',
      type: sql.NVarChar(100),
      required: true
    },
    {
      name: 'RESULT',
      type: sql.Int,
      required: true
    },
    {
      name: 'FEE',
      type: sql.Decimal(18, 8),
      required: true
    }
  ]
};
procedureNames['adminReq'] = {
  name: currentName,
  returnName: "ADMINREQ"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_HP_REJULT';
currentInfo = {
  usingCache: false,
  params: [{
    name: 'D_HP',
    type: sql.NVarChar(100),
    required: true
  }]
};
procedureNames['checkHp'] = {
  name: currentName,
  returnName: "HP"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_DISTRIBU_ADD';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'D_UID',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'D_EMAIL',
      type: sql.NVarChar(30),
      required: true
    },
    {
      name: 'D_HP',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'CONTRY',
      type: sql.NVarChar(3),
      required: true
    },
    {
      name: 'CONTRY_NAME',
      type: sql.NVarChar(3),
      required: true
    },
    {
      name: 'CONTRY_HP',
      type: sql.NVarChar(10),
      required: true
    },
    {
      name: 'D_PASS',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'D_SMSTYPE',
      type: sql.NVarChar(10),
      required: true
    },
    {
      name: 'D_SMSNO',
      type: sql.NVarChar(10),
      required: true
    },
    {
      name: 'D_IDX',
      type: sql.Int,
      required: true
    }
  ]
};
procedureNames['signup'] = {
  name: currentName,
  returnName: "ADDDIS"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_WALLET_DETAILS';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'D_UID',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'D_SDATE',
      type: sql.NVarChar(10),
      required: true
    },
    {
      name: 'D_EDATE',
      type: sql.NVarChar(10),
      required: true
    },
    {
      name: 'TYPE',
      type: sql.NVarChar(2),
      required: true
    },
    {
      name: 'CUR_PAGING',
      type: sql.Int,
      required: true
    },
    {
      name: 'PAGING_NO',
      type: sql.Int,
      required: true
    }
  ]
};
procedureNames['getAsset'] = {
  name: currentName,
  returnName: "ASSETLIST"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_BOARD_MAIN_VIEW';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'B_UID',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'B_GUBUN',
      type: sql.NVarChar(10),
      required: true
    },
    {
      name: 'B_IDX',
      type: sql.BigInt,
      required: true
    }
  ]
};
procedureNames['getBoardDetail'] = {
  name: currentName,
  returnName: "BOARD"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SA_COIN_DELETE';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'D_UID',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'MS_KEY',
      type: sql.BigInt,
      required: true
    }
  ]
};
procedureNames['saleDelete'] = {
  name: currentName,
  returnName: "DELSEAL"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_WALLET_DETAILS_CNT';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'D_UID',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'D_SDATE',
      type: sql.NVarChar(10),
      required: true
    },
    {
      name: 'D_EDATE',
      type: sql.NVarChar(10),
      required: true
    },
    {
      name: 'TYPE',
      type: sql.NVarChar(2),
      required: true
    }
  ]
};
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_BOARD_MAIN_LIST';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'B_UID',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'B_GUBUN',
      type: sql.NVarChar(100),
      required: true
    },
    {
      name: 'IP_NO',
      type: sql.NVarChar(20),
      required: true
    },
    {
      name: 'D_SDATE',
      type: sql.NVarChar(10),
      required: true
    },
    {
      name: 'D_EDATE',
      type: sql.NVarChar(10),
      required: true
    },
    {
      name: 'CUR_PAGING',
      type: sql.Int,
      required: true
    },
    {
      name: 'PAGING_NO',
      type: sql.Int,
      required: true
    },
    {
      name: 'MY_NOTICE',
      type: sql.NVarChar(1),
      required: true
    }
  ]
};
procedureNames['getInquire'] = {
  name: currentName,
  returnName: "INQUIRE"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_BOARD_MAIN_LIST_CNT';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'B_UID',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'B_GUBUN',
      type: sql.NVarChar(100),
      required: true
    },
    {
      name: 'IP_NO',
      type: sql.NVarChar(20),
      required: true
    },
    {
      name: 'MY_NOTICE',
      type: sql.NVarChar(1),
      required: true
    },
    {
      name: 'D_SDATE',
      type: sql.NVarChar(10),
      required: true
    },
    {
      name: 'D_EDATE',
      type: sql.NVarChar(10),
      required: true
    }

  ]
};
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_TRADE_LIST';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'D_UID',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'D_STATUS',
      type: sql.VarChar(1),
      required: true
    },
    {
      name: 'D_SDATE',
      type: sql.NVarChar(10),
      required: true
    },
    {
      name: 'D_EDATE',
      type: sql.NVarChar(10),
      required: true
    },
    {
      name: 'CUR_PAGING',
      type: sql.Int,
      required: true
    },
    {
      name: 'PAGING_NO',
      type: sql.Int,
      required: true
    }
  ]
};
procedureNames['getTradList'] = {
  name: currentName,
  returnName: "LISTDATA"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_TRADE_LIST_CNT';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'D_UID',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'D_STATUS',
      type: sql.VarChar(1),
      required: true
    },
    {
      name: 'D_SDATE',
      type: sql.NVarChar(10),
      required: true
    },
    {
      name: 'D_EDATE',
      type: sql.NVarChar(10),
      required: true
    }
  ]
};
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_MY_PONDHIS';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'D_UID',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'GUBUN',
      type: sql.VarChar(1),
      required: true
    },
    {
      name: 'D_SDATE',
      type: sql.NVarChar(10),
      required: true
    },
    {
      name: 'D_EDATE',
      type: sql.NVarChar(10),
      required: true
    },
    {
      name: 'CUR_PAGING',
      type: sql.Int,
      required: true
    },
    {
      name: 'PAGING_NO',
      type: sql.Int,
      required: true
    }
  ]
};
procedureNames['getPondHis'] = {
  name: currentName,
  returnName: "LISTDATA"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_MY_PONDHIS_CNT';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'D_UID',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'GUBUN',
      type: sql.VarChar(1),
      required: true
    },
    {
      name: 'D_SDATE',
      type: sql.NVarChar(10),
      required: true
    },
    {
      name: 'D_EDATE',
      type: sql.NVarChar(10),
      required: true
    }
  ]
};
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_COIN_INPUT_LIST';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'D_UID',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'GUBUN',
      type: sql.VarChar(1),
      required: true
    },
    {
      name: 'D_SDATE',
      type: sql.NVarChar(10),
      required: true
    },
    {
      name: 'D_EDATE',
      type: sql.NVarChar(10),
      required: true
    },
    {
      name: 'CUR_PAGING',
      type: sql.Int,
      required: true
    },
    {
      name: 'PAGING_NO',
      type: sql.Int,
      required: true
    }
  ]
};
procedureNames['getInputList'] = {
  name: currentName,
  returnName: "LISTDATA"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_COIN_INPUT_LIST_CNT';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'D_UID',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'GUBUN',
      type: sql.VarChar(1),
      required: true
    },
    {
      name: 'D_SDATE',
      type: sql.NVarChar(10),
      required: true
    },
    {
      name: 'D_EDATE',
      type: sql.NVarChar(10),
      required: true
    }
  ]
};
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_COIN_OUT_LIST';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'D_UID',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'GUBUN',
      type: sql.VarChar(1),
      required: true
    },
    {
      name: 'D_SDATE',
      type: sql.NVarChar(10),
      required: true
    },
    {
      name: 'D_EDATE',
      type: sql.NVarChar(10),
      required: true
    },
    {
      name: 'CUR_PAGING',
      type: sql.Int,
      required: true
    },
    {
      name: 'PAGING_NO',
      type: sql.Int,
      required: true
    }
  ]
};
procedureNames['getOutList'] = {
  name: currentName,
  returnName: "LISTDATA"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_COIN_OUT_LIST_CNT';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'D_UID',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'GUBUN',
      type: sql.VarChar(1),
      required: true
    },
    {
      name: 'D_SDATE',
      type: sql.NVarChar(10),
      required: true
    },
    {
      name: 'D_EDATE',
      type: sql.NVarChar(10),
      required: true
    }
  ]
};
procedureInfo.setProcedureInfo(currentName, currentInfo);
currentName = 'SA_COIN_WITHDRAWAL_LIST';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'SECHER1_TITLE',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'SECHER_TEXT',
      type: sql.NVarChar(100),
      required: true
    },
    {
      name: 'D_EDATE',
      type: sql.NVarChar(10),
      required: true
    },
    {
      name: 'D_SDATE',
      type: sql.NVarChar(10),
      required: true
    },
    {
      name: 'GUBUN',
      type: sql.NVarChar(10),
      required: true
    },
    {
      name: 'CUR_PAGING',
      type: sql.Int,
      required: true
    },
    {
      name: 'PAGING_NO',
      type: sql.Int,
      required: true
    }
  ]
};
procedureNames['getAdminReqList'] = {
  name: currentName,
  returnName: "ADMINREQLIST"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_BOARD_MAIN_WRITE';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'B_UID',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'B_GUBUN',
      type: sql.NVarChar(100),
      required: true
    },
    {
      name: 'B_TITLE',
      type: sql.NVarChar(400),
      required: true
    },
    {
      name: 'B_CONTENTS',
      type: sql.NText,
      required: true
    },
    {
      name: 'IP_NO',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'Q_CONTENTS',
      type: sql.NText,
      required: true
    },
    {
      name: 'Q_TITLE',
      type: sql.NVarChar(400),
      required: true
    },
    {
      name: 'B_FILE_PATH1',
      type: sql.NVarChar(100),
      required: true
    },
    {
      name: 'B_FILE_PATH2',
      type: sql.NVarChar(100),
      required: true
    },
    {
      name: 'B_FILE_PATH3',
      type: sql.NVarChar(100),
      required: true
    },
    {
      name: 'B_FILE_PATH4',
      type: sql.NVarChar(100),
      required: true
    },
    {
      name: 'B_FILE_PATH5',
      type: sql.NVarChar(100),
      required: true
    },
    {
      name: 'B_PASSWORD',
      type: sql.NVarChar(100),
      required: true
    }
  ]
};
procedureNames['writeBoard'] = {
  name: currentName,
  returnName: "BOARD"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SA_COIN_WITHDRAWAL_LIST_CNT';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'SECHER1_TITLE',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'SECHER_TEXT',
      type: sql.NVarChar(100),
      required: true
    },
    {
      name: 'D_EDATE',
      type: sql.NVarChar(10),
      required: true
    },
    {
      name: 'D_SDATE',
      type: sql.NVarChar(10),
      required: true
    },
    {
      name: 'GUBUN',
      type: sql.NVarChar(10),
      required: true
    }
  ]
};
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_USDWITHDRAWAL_HISTORY';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'D_UID',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'D_SDATE',
      type: sql.NVarChar(10),
      required: true
    },
    {
      name: 'D_EDATE',
      type: sql.NVarChar(10),
      required: true
    },
    {
      name: 'WGUBUN',
      type: sql.NVarChar(2),
      required: true
    },
    {
      name: 'CUR_PAGING',
      type: sql.Int,
      required: true
    },
    {
      name: 'PAGING_NO',
      type: sql.Int,
      required: true
    }
  ]
};
procedureNames['getWithHis'] = {
  name: currentName,
  returnName: "INQUIRE"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_USDWITHDRAWAL_HISTORY_CNT';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'D_UID',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'D_SDATE',
      type: sql.NVarChar(10),
      required: true
    },
    {
      name: 'WGUBUN',
      type: sql.NVarChar(2),
      required: true
    },
    {
      name: 'D_EDATE',
      type: sql.NVarChar(10),
      required: true
    }
  ]
};
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_SALEWITHDRAWAL_HISTORY';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'D_UID',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'D_SDATE',
      type: sql.NVarChar(10),
      required: true
    },
    {
      name: 'D_EDATE',
      type: sql.NVarChar(10),
      required: true
    },
    {
      name: 'WGUBUN',
      type: sql.NVarChar(2),
      required: true
    },
    {
      name: 'CUR_PAGING',
      type: sql.Int,
      required: true
    },
    {
      name: 'PAGING_NO',
      type: sql.Int,
      required: true
    }
  ]
};
procedureNames['getSWithHis'] = {
  name: currentName,
  returnName: "INQUIRE"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_SALEWITHDRAWAL_HISTORY_CNT';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'D_UID',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'D_SDATE',
      type: sql.NVarChar(10),
      required: true
    },
    {
      name: 'WGUBUN',
      type: sql.NVarChar(2),
      required: true
    },
    {
      name: 'D_EDATE',
      type: sql.NVarChar(10),
      required: true
    }
  ]
};
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_FEESWITHDRAWAL_HISTORY';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'D_UID',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'D_SDATE',
      type: sql.NVarChar(10),
      required: true
    },
    {
      name: 'D_EDATE',
      type: sql.NVarChar(10),
      required: true
    },
    {
      name: 'WGUBUN',
      type: sql.NVarChar(2),
      required: true
    },
    {
      name: 'CUR_PAGING',
      type: sql.Int,
      required: true
    },
    {
      name: 'PAGING_NO',
      type: sql.Int,
      required: true
    }
  ]
};
procedureNames['getFWithHis'] = {
  name: currentName,
  returnName: "INQUIRE"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_FEESWITHDRAWAL_HISTORY_CNT';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'D_UID',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'D_SDATE',
      type: sql.NVarChar(10),
      required: true
    },
    {
      name: 'WGUBUN',
      type: sql.NVarChar(2),
      required: true
    },
    {
      name: 'D_EDATE',
      type: sql.NVarChar(10),
      required: true
    }
  ]
};
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SA_RVN_WITHDRAWAL_COMPLET';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'D_UID',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'D_EDATE',
      type: sql.NVarChar(10),
      required: true
    },
    {
      name: 'D_SDATE',
      type: sql.NVarChar(10),
      required: true
    },
    {
      name: 'CUR_PAGING',
      type: sql.Int,
      required: true
    },
    {
      name: 'PAGING_NO',
      type: sql.Int,
      required: true
    }
  ]
};
procedureNames['adminReqCompList'] = {
  name: currentName,
  returnName: "ADMINCOMLIST"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SA_RVN_WITHDRAWAL_COMPLET_CNT';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'D_UID',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'D_SDATE',
      type: sql.NVarChar(10),
      required: true
    },
    {
      name: 'D_EDATE',
      type: sql.NVarChar(10),
      required: true
    }
  ]
};
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SA_COIN_WITHDRAWAL_LIST_CNT';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'SECHER1_TITLE',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'SECHER_TEXT',
      type: sql.NVarChar(100),
      required: true
    },
    {
      name: 'D_EDATE',
      type: sql.NVarChar(10),
      required: true
    },
    {
      name: 'D_SDATE',
      type: sql.NVarChar(10),
      required: true
    },
    {
      name: 'GUBUN',
      type: sql.NVarChar(10),
      required: true
    }
  ]
};
procedureInfo.setProcedureInfo(currentName, currentInfo);


currentName = 'SP_WALLET_TOP_DETAILS';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'D_UID',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'TYPE',
      type: sql.NVarChar(1),
      required: true
    }
  ]
};
procedureNames['getAssetTop'] = {
  name: currentName,
  returnName: "ASSETTOP"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_INVOKE_VIEW';
currentInfo = {
  usingCache: false,
  params: [{
    name: 'BUY_KEY',
    type: sql.Int,
    required: true
  }]
};
procedureNames['getInvokeImg'] = {
  name: currentName,
  returnName: "IMG"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_INVOKE_IMAGE';
currentInfo = {
  usingCache: false,
  params: [{
    name: 'IMG_PATH',
    type: sql.NVarChar(200),
    required: true
  }, {
    name: 'BUY_KEY',
    type: sql.Int,
    required: true
  }]
};
procedureNames['setInvokeImg'] = {
  name: currentName,
  returnName: "IMG"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_REPORT';
currentInfo = {
  usingCache: false,
  params: [{
    name: 'D_UID',
    type: sql.NVarChar(200),
    required: true
  }, {
    name: 'S_KEY',
    type: sql.Int,
    required: true
  }, {
    name: 'RENAME',
    type: sql.NVarChar(200),
    required: true
  }, {
    name: 'GUBUN',
    type: sql.NVarChar(10),
    required: true
  }]
};
procedureNames['sendReport'] = {
  name: currentName,
  returnName: "REPORT"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_TOP_WITHDRAWAL_HISTORY';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'D_UID',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'D_EDATE',
      type: sql.NVarChar(10),
      required: true
    },
    {
      name: 'W_GUBUN',
      type: sql.NVarChar(10),
      required: true
    },
    {
      name: 'D_SDATE',
      type: sql.NVarChar(10),
      required: true
    }
  ]
};
procedureNames['getWithTop'] = {
  name: currentName,
  returnName: "WITHTOP"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_TOP_USDWITHDRAWAL_HISTORY';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'D_UID',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'D_EDATE',
      type: sql.NVarChar(10),
      required: true
    },
    {
      name: 'D_SDATE',
      type: sql.NVarChar(10),
      required: true
    }
  ]
};
procedureNames['getWalletTop'] = {
  name: currentName,
  returnName: "WALLETTOP"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_TOP_SALEWITHDRAWAL_HISTORY';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'D_UID',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'D_EDATE',
      type: sql.NVarChar(10),
      required: true
    },
    {
      name: 'D_SDATE',
      type: sql.NVarChar(10),
      required: true
    }
  ]
};
procedureNames['getSWalletTop'] = {
  name: currentName,
  returnName: "WALLETTOP"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_MY_ACCOUNT_BUY';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'D_UID',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'D_SEQ',
      type: sql.Int,
      required: true
    }, {
      name: 'D_GUBUN',
      type: sql.NVarChar(2),
      required: true
    },
    {
      name: 'D_QTY',
      type: sql.Int,
      required: true
    }
  ]
};
procedureNames['accountBuy'] = {
  name: currentName,
  returnName: "ACCBUY"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);
//
// currentName = 'SP_COIN_ADDR_CREATE_SALE';
// currentInfo = {
//   usingCache: false,
//   params: [{
//       name: 'D_UID',
//       type: sql.NVarChar(50),
//       required: true
//     },
//     {
//       name: 'GUBUN',
//       type: sql.NVarChar(10),
//       required: true
//     },
//     {
//       name: 'QTY',
//       type: sql.Decimal(18, 8),
//       required: true
//     },
//     {
//       name: 'RATE',
//       type: sql.Decimal(18, 8),
//       required: true
//     },
//     {
//       name: 'KEY',
//       type: sql.Int,
//       required: true
//     },
//     {
//       name: 'COIN_TYPE',
//       type: sql.Int,
//       required: true
//     }
//   ]
// };
// procedureInfo.setProcedureInfo(currentName, currentInfo);
// procedureNames['reqPurch'] = {
//   name: currentName,
//   returnName: "PURCHRESULT"
// }

procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_C_IPCHECK';
currentInfo = {
  usingCache: false,
  params: [{
    name: 'IPNO',
    type: sql.Float,
    required: true
  }]
};

procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_COIN_SALEWAITING';
currentInfo = {
  usingCache: false,
  params: []
};
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_COMPANY_NOTY';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'D_TXID',
      type: sql.NVarChar(200),
      required: true
    },
    {
      name: 'D_TRANSACTION',
      type: sql.NVarChar(10),
      required: true
    },
    {
      name: 'D_SADDRESS',
      type: sql.NVarChar(200),
      required: true
    },
    {
      name: 'D_RADDRESS',
      type: sql.NVarChar(200),
      required: true
    },
    {
      name: 'GUBUN',
      type: sql.NVarChar(10),
      required: true
    },
    {
      name: 'D_AMOUNT',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'D_REATE',
      type: sql.NVarChar(50),
      required: true
    }
  ]
};
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_COIN_ADDR_CREATE';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'D_UID',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'GUBUN',
      type: sql.NVarChar(10),
      required: true
    },
    {
      name: 'ADDR',
      type: sql.NVarChar(200),
      required: true
    },
    {
      name: 'PASS',
      type: sql.NVarChar(100),
      required: true
    }
  ]
};
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_COIN_ADDR_STATE';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'D_UID',
      type: sql.NVarChar(100),
      required: true
    },
    {
      name: 'GUBUN',
      type: sql.NVarChar(50),
      required: true
    }
  ]
};
procedureNames['createAddrTypebit'] = {
  name: currentName,
  returnName: "COINSTATUS"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_MY_COIN_WAITING';
currentInfo = {
  usingCache: false,
  params: [{
    name: 'D_UID',
    type: sql.NVarChar(100),
    required: true
  }]
};
procedureNames['getPendinglist'] = {
  name: currentName,
  returnName: "PENDINGLIST"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_COIN_BALANCE';
currentInfo = {
  usingCache: false,
  params: [{
    name: 'D_UID',
    type: sql.NVarChar(50),
    required: true
  }]
};
procedureNames['getCoinBal'] = {
  name: currentName,
  returnName: "COINBAL"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_MY_INFO';
currentInfo = {
  usingCache: false,
  params: [{
    name: 'D_UID',
    type: sql.NVarChar(50),
    required: true
  }]
};
procedureNames['getMyInfo'] = {
  name: currentName,
  returnName: "MYINFO"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_PRODUCT_CODE';
currentInfo = {
  usingCache: false,
  params: [{
    name: 'D_UID',
    type: sql.NVarChar(50),
    required: true
  }]
};
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_BONUS_BALANCE';
currentInfo = {
  usingCache: false,
  params: [{
    name: 'D_UID',
    type: sql.NVarChar(50),
    required: true
  }]
};
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_PRODUCT';
currentInfo = {
  usingCache: false,
  params: [{
    name: 'D_UID',
    type: sql.NVarChar(50),
    required: true
  }]
};
procedureNames['getProducts'] = {
  name: currentName,
  returnName: "PRODUCTS"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_BUY_LIST';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'D_UID',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'D_STATUS',
      type: sql.VarChar(3),
      required: true
    },
    {
      name: 'CUR_PAGING',
      type: sql.Int,
      required: true
    },
    {
      name: 'PAGING_NO',
      type: sql.Int,
      required: true
    }
  ]
};
procedureNames['getBuyList'] = {
  name: currentName,
  returnName: "LISTDATA"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_BUY_LIST_CNT';
currentInfo = {
  usingCache: false,
  params: [{
    name: 'D_UID',
    type: sql.NVarChar(50),
    required: true
  }, {
    name: 'D_STATUS',
    type: sql.VarChar(1),
    required: true
  }]
};
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_MY_BUY_LIST_CNT';
currentInfo = {
  usingCache: false,
  params: [{
    name: 'D_UID',
    type: sql.NVarChar(50),
    required: true
  }, {
    name: 'D_STATUS',
    type: sql.VarChar(1),
    required: true
  }]
};
procedureNames['getMyBuyListCnt'] = {
  name: currentName,
  returnName: "CNT"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_MY_BUY_CANCEL';
currentInfo = {
  usingCache: false,
  params: [{
    name: 'D_UID',
    type: sql.NVarChar(50),
    required: true
  }, {
    name: 'D_SEQ',
    type: sql.BigInt,
    required: true
  }]
};
procedureNames['buyCancel'] = {
  name: currentName,
  returnName: "CANCEL"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_SELL_LIST';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'D_UID',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'D_STATUS',
      type: sql.VarChar(1),
      required: true
    },
    {
      name: 'CUR_PAGING',
      type: sql.Int,
      required: true
    },
    {
      name: 'PAGING_NO',
      type: sql.Int,
      required: true
    }
  ]
};
procedureNames['getSellList'] = {
  name: currentName,
  returnName: "LISTDATA"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_SELL_LIST_CNT';
currentInfo = {
  usingCache: false,
  params: [{
    name: 'D_UID',
    type: sql.NVarChar(50),
    required: true
  }, {
    name: 'D_STATUS',
    type: sql.VarChar(1),
    required: true
  }]
};
procedureInfo.setProcedureInfo(currentName, currentInfo);
currentName = 'SP_COIN_ADDR_LIST';
currentInfo = {
  usingCache: false,
  params: [{
    name: 'D_UID',
    type: sql.NVarChar(50),
    required: true
  }]
};
procedureNames['getCoinAddrs'] = {
  name: currentName,
  returnName: "ADDRESIES"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_COIN_PENDING_LIST';
currentInfo = {
  usingCache: false,
  params: []
};
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_ORG_CHART';
currentInfo = {
  usingCache: false,
  params: [{
    name: 'D_UID',
    type: sql.NVarChar(50),
    required: true
  }]
};
procedureNames['getOrgData'] = {
  name: currentName,
  returnName: "ORGLIST"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_TREE_VIEW';
currentInfo = {
  usingCache: false,
  params: [{
    name: 'D_UID',
    type: sql.NVarChar(50),
    required: true
  }]
};
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_LEVEL_DT';
currentInfo = {
  usingCache: false,
  params: [{
    name: 'D_UID',
    type: sql.NVarChar(50),
    required: true
  }, {
    name: 'P_LEVEL',
    type: sql.Int,
    required: true
  }]
};
procedureNames['getLevelDt'] = {
  name: currentName,
  returnName: "LEVELDT"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);
currentName = 'SP_ORG_CHART_S';
currentInfo = {
  usingCache: false,
  params: [{
    name: 'D_UID',
    type: sql.NVarChar(50),
    required: true
  }]
};
procedureInfo.setProcedureInfo(currentName, currentInfo);
currentName = 'SP_ORG_CHART_P';
currentInfo = {
  usingCache: false,
  params: [{
    name: 'D_UID',
    type: sql.NVarChar(50),
    required: true
  }]
};
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SA_COIN_WITHDRAWAL_DETAIL';
currentInfo = {
  usingCache: false,
  params: [{
    name: 'IDX',
    type: sql.Int,
    required: true
  }]
};
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_MACHING_TIME';

currentInfo = {
  usingCache: false,
  params: []
};
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_TODAY_TIME';
currentInfo = {
  usingCache: false,
  params: []
};
procedureNames['getMaching'] = {
  name: currentName,
  returnName: "MACHING"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_STAUTO';
currentInfo = {
  usingCache: false,
  params: [{
    name: 'ROUND',
    type: sql.Int,
    required: true
  }]
};
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_END_AUTO';
currentInfo = {
  usingCache: false,
  params: [{
    name: 'ROUND',
    type: sql.Int,
    required: true
  }]
};
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_CHECK_ADDRESS';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'D_UID',
      type: sql.NVarChar(100),
      required: true
    },
    {
      name: 'D_GUBUN',
      type: sql.NVarChar(50),
      required: true
    }
  ]
};
procedureInfo.setProcedureInfo(currentName, currentInfo);

exports.procedureInfo = procedureInfo;
exports.procedureNames = procedureNames;
