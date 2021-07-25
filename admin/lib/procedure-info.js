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

var currentName = 'SA_LOGIN_PROCESS';
var currentInfo = {
  usingCache: false,
  params: [{
      name: 'D_UID',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'D_PASS',
      type: sql.NVarChar(50),
      required: true
    },
    {
      name: 'D_IP',
      type: sql.VarChar(20),
      required: true
    },
    {
      name: 'D_BROWSER',
      type: sql.VarChar(50),
      required: true
    },
    {
      name: 'D_OS',
      type: sql.VarChar(50),
      required: true
    },
    {
      name: 'D_COUNTRY',
      type: sql.VarChar(50),
      required: true
    }
  ]
};
procedureNames['adminLogin'] = {
  name: currentName,
  returnName: "ADSIGNIN"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SA_COIN_LIST';
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
      name: 'COIN_GUBUN',
      type: sql.NVarChar(10),
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
procedureNames['AgetCoinList'] = {
  name: currentName,
  returnName: "COINLIST"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SA_COIN_LIST_CNT';
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
      name: 'COIN_GUBUN',
      type: sql.NVarChar(10),
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

currentName = 'SA_COINSOTP_LIST';
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
procedureNames['AgetCoinStopList'] = {
  name: currentName,
  returnName: "COINLIST"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SA_COINSOTP_LIST_CNT';
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

currentName = 'SA_MEMBER_LIST';
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
procedureNames['AgetMemberList'] = {
  name: currentName,
  returnName: "MEMBERLIST"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SA_USD_INPUT';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'A_UID',
      type: sql.NVarChar(50),
      required: true
    },
    {
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
      name: 'AMOUNT',
      type: sql.Decimal(18,8),
      required: true
    },
    {
      name: 'MESSAGE',
      type: sql.NText,
      required: true
    }
  ]
};
procedureNames['usdInput'] = {
  name: currentName,
  returnName: "USDIN"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SA_MEMBER_DETAIL';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'DNO',
      type: sql.Int,
      required: true
    }
  ]
};
procedureNames['getMemberDetail'] = {
  name: currentName,
  returnName: "MEMBER"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SA_SERCH_ETH';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'SERCH_TEXT',
      type: sql.NVarChar(100),
      required: true
    }
  ]
};
procedureNames['getSearchETH'] = {
  name: currentName,
  returnName: "ADDRESSINFO"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SA_SERCH_ICK';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'SERCH_TEXT',
      type: sql.NVarChar(100),
      required: true
    }
  ]
};
procedureNames['getSearchICK'] = {
  name: currentName,
  returnName: "ADDRESSINFO"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SA_WALLET_GUBUN';
currentInfo = {
  usingCache: false,
  params: [
  ]
};
procedureNames['getWalletGubun'] = {
  name: currentName,
  returnName: "WALLETGUBUN"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SA_MEMBER_LIST_CNT';
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

currentName = 'SA_MEMBER_DELETE_DETAIL';
currentInfo = {
  usingCache: false,
  params: [{
    name: 'DNO',
    type: sql.Int,
    required: true
  }]
};
procedureNames['AgetMemberDetail'] = {
  name: currentName,
  returnName: "MEMBERD"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SA_MEMBER_STOP';
currentInfo = {
  usingCache: false,
  params: [{
    name: 'DNO',
    type: sql.Int,
    required: true
  },{
    name: 'CUR_STATUS',
    type: sql.NVarChar(1),
    required: true
  }]
};
procedureNames['chagneStop'] = {
  name: currentName,
  returnName: "STOP"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SA_MEMBER_UPDATE';
currentInfo = {
  usingCache: false,
  params: [{
    name: 'DNO',
    type: sql.Int,
    required: true
  }, {
    name: 'D_NAME_H',
    type: sql.VarChar(50),
    required: true
  }, {
    name: 'D_HP',
    type: sql.VarChar(50),
    required: true
  }, {
    name: 'D_EMAIL',
    type: sql.VarChar(50),
    required: true
  }, {
    name: 'D_PASS',
    type: sql.VarChar(50),
    required: true
  }]
};
procedureNames['AupdateMember'] = {
  name: currentName,
  returnName: "UPDATEMEMBER"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SA_BOARD_MAIN_UPDATE';
currentInfo = {
  usingCache: false,
  params: [{
    name: 'BIDX',
    type: sql.Int,
    required: true
  }, {
    name: 'B_GUBUN',
    type: sql.VarChar(100),
    required: true
  }, {
    name: 'B_TITLE',
    type: sql.NVarChar(400),
    required: true
  }, {
    name: 'B_CONTENTS',
    type: sql.NText,
    required: true
  }, {
    name: 'B_FILE_PATH1',
    type: sql.VarChar(100),
    required: true
  }, {
    name: 'B_FILE_PATH2',
    type: sql.VarChar(100),
    required: true
  }, {
    name: 'B_FILE_PATH3',
    type: sql.VarChar(100),
    required: true
  }, {
    name: 'B_FILE_PATH4',
    type: sql.VarChar(100),
    required: true
  }, {
    name: 'B_FILE_PATH5',
    type: sql.VarChar(100),
    required: true
  }]
};
procedureNames['boardUpdate'] = {
  name: currentName,
  returnName: "BOARDWRITE"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SA_BOARD_MAIN_WRITE';
currentInfo = {
  usingCache: false,
  params: [{
    name: 'B_UID',
    type: sql.NVarChar(50),
    required: true
  }, {
    name: 'B_GUBUN',
    type: sql.NVarChar(100),
    required: true
  }, {
    name: 'B_TITLE',
    type: sql.NVarChar(400),
    required: true
  }, {
    name: 'B_CONTENTS',
    type: sql.NText,
    required: true
  }, {
    name: 'B_COUNTRY',
    type: sql.NVarChar(2),
    required: true
  }, {
    name: 'B_FILE_PATH1',
    type: sql.NVarChar(100),
    required: true
  }, {
    name: 'B_FILE_PATH2',
    type: sql.NVarChar(100),
    required: true
  }, {
    name: 'B_FILE_PATH3',
    type: sql.NVarChar(100),
    required: true
  }, {
    name: 'B_FILE_PATH4',
    type: sql.NVarChar(100),
    required: true
  }, {
    name: 'B_FILE_PATH5',
    type: sql.NVarChar(100),
    required: true
  }]
};
procedureNames['boardWrite'] = {
  name: currentName,
  returnName: "BOARDWRITE"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SA_BOARD_REPLY_WRITE';
currentInfo = {
  usingCache: false,
  params: [{
    name: 'B_UID',
    type: sql.NVarChar(50),
    required: true
  }, {
    name: 'B_GUBUN',
    type: sql.NVarChar(100),
    required: true
  }, {
    name: 'B_IDX',
    type: sql.BigInt,
    required: true
  }, {
    name: 'B_TITLE',
    type: sql.NVarChar(400),
    required: true
  }, {
    name: 'B_CONTENTS',
    type: sql.NText,
    required: true
  }, {
    name: 'B_FILE_PATH1',
    type: sql.NVarChar(100),
    required: true
  }, {
    name: 'B_FILE_PATH2',
    type: sql.NVarChar(100),
    required: true
  }, {
    name: 'B_FILE_PATH3',
    type: sql.NVarChar(100),
    required: true
  }, {
    name: 'B_FILE_PATH4',
    type: sql.NVarChar(100),
    required: true
  }, {
    name: 'B_FILE_PATH5',
    type: sql.NVarChar(100),
    required: true
  }, {
    name: 'B_AID',
    type: sql.NVarChar(100),
    required: true
  }, {
    name: 'B_ANAME',
    type: sql.NVarChar(100),
    required: true
  }, {
    name: 'B_COUNTRY',
    type: sql.NVarChar(100),
    required: true
  }]
};
procedureNames['repBoard'] = {
  name: currentName,
  returnName: "REPBOARD"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SA_BOARD_MAIN_VIEW';
currentInfo = {
  usingCache: false,
  params: [{
    name: 'B_UID',
    type: sql.NVarChar(50),
    required: true
  }, {
    name: 'B_GUBUN',
    type: sql.NVarChar(100),
    required: true
  }, {
    name: 'B_IDX',
    type: sql.BigInt,
    required: true
  }]
};
procedureNames['getBoardView'] = {
  name: currentName,
  returnName: "BOARDVIEW"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SA_TRADE_HIS_DETAIL';
currentInfo = {
  usingCache: false,
  params: [{
    name: 'M_UID',
    type: sql.NVarChar(50),
    required: true
  }, {
    name: 'IDX',
    type: sql.BigInt,
    required: true
  }]
};
procedureNames['getTRDDet'] = {
  name: currentName,
  returnName: "TRDDET"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SA_BOARD_USER_VIEW';
currentInfo = {
  usingCache: false,
  params: [{
    name: 'B_GUBUN',
    type: sql.NVarChar(100),
    required: true
  }, {
    name: 'B_IDX',
    type: sql.BigInt,
    required: true
  }]
};
procedureNames['getBoardUserView'] = {
  name: currentName,
  returnName: "BOARDVIEW"
}
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
procedureNames['getOrgData'] = {
  name: currentName,
  returnName: "ORGLIST"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SA_COIN_WITHDRAWAL_LIST_DETAIL';
currentInfo = {
  usingCache: false,
  params: [{
    name: 'IDX',
    type: sql.BigInt,
    required: true
  }]
};
procedureNames['getWithDetil'] = {
  name: currentName,
  returnName: "DETAIL"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SA_BOARD_MAIN_DELETE';
currentInfo = {
  usingCache: false,
  params: [{
    name: 'B_IDX',
    type: sql.Int,
    required: true
  }]
};
procedureNames['delBoard'] = {
  name: currentName,
  returnName: "DELBOARD"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SA_COIN_WALLET_CANCEL';
currentInfo = {
  usingCache: false,
  params: [{
    name: 'IDX',
    type: sql.BigInt,
    required: true
  }, {
    name: 'MESSAGE',
    type: sql.NVarChar(500),
    required: true
  }]
};
procedureNames['cancelWith'] = {
  name: currentName,
  returnName: "CANCELWITH"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SA_COIN_INFO';
currentInfo = {
  usingCache: false,
  params: []
};
procedureNames['AgetCoinInfo'] = {
  name: currentName,
  returnName: "COININFO"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SA_SITE_LIST';
currentInfo = {
  usingCache: false,
  params: []
};
procedureNames['AgetSiteList'] = {
  name: currentName,
  returnName: "SITELIST"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_PRODUCT';
currentInfo = {
  usingCache: false,
  params: [{
    name: 'D_UID',
    type: sql.VarChar(50),
    required: true
  }]
};
procedureNames['getProduct'] = {
  name: currentName,
  returnName: "PRODUCT"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SA_TRADE_HIS_DETAIL';
currentInfo = {
  usingCache: false,
  params: [{
    name: 'T_UID',
    type: sql.VarChar(50),
    required: true
  }, {
    name: 'T_IDX',
    type: sql.BigInt,
    required: true
  }]
};
procedureNames['getHisDetail'] = {
  name: currentName,
  returnName: "HSID"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SA_USD_INOUT_LIST';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'SECHER1_TITLE',
      type: sql.VarChar(50),
      required: true
    }, {
      name: 'SECHER_TEXT',
      type: sql.VarChar(100),
      required: true
    }, {
      name: 'GUBUN',
      type: sql.VarChar(1),
      required: true
    },
    {
      name: 'D_SDATE',
      type: sql.VarChar(10),
      required: true
    },
    {
      name: 'D_EDATE',
      type: sql.VarChar(10),
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
procedureNames['AgetUSDIOList'] = {
  name: currentName,
  returnName: "AIOULIST"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SA_USD_INOUT_LIST_CNT';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'SECHER1_TITLE',
      type: sql.VarChar(50),
      required: true
    }, {
      name: 'SECHER_TEXT',
      type: sql.VarChar(100),
      required: true
    }, {
      name: 'GUBUN',
      type: sql.VarChar(1),
      required: true
    },
    {
      name: 'D_SDATE',
      type: sql.VarChar(10),
      required: true
    },
    {
      name: 'D_EDATE',
      type: sql.VarChar(10),
      required: true
    }
  ]
};
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SA_BOARD_MAIN_LIST';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'SECHER_TEXT',
      type: sql.VarChar(50),
      required: true
    }, {
      name: 'SEARCH1_TITLE',
      type: sql.VarChar(1),
      required: true
    }, {
      name: 'B_GUBUN',
      type: sql.VarChar(1),
      required: true
    },
    {
      name: 'D_SDATE',
      type: sql.VarChar(10),
      required: true
    },
    {
      name: 'D_EDATE',
      type: sql.VarChar(10),
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
procedureNames['getBoardMain'] = {
  name: currentName,
  returnName: "BOARDMAIN"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SA_BOARD_MAIN_LIST_CNT';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'SECHER_TEXT',
      type: sql.VarChar(50),
      required: true
    }, {
      name: 'SEARCH1_TITLE',
      type: sql.VarChar(1),
      required: true
    }, {
      name: 'B_GUBUN',
      type: sql.VarChar(1),
      required: true
    },
    {
      name: 'D_SDATE',
      type: sql.VarChar(10),
      required: true
    },
    {
      name: 'D_EDATE',
      type: sql.VarChar(10),
      required: true
    }
  ]
};
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SA_BOARD_USER_LIST';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'SECHER_TEXT',
      type: sql.VarChar(50),
      required: true
    }, {
      name: 'SECHER1_TITLE',
      type: sql.VarChar(1),
      required: true
    }, {
      name: 'B_GUBUN',
      type: sql.VarChar(1),
      required: true
    },
    {
      name: 'IP_NO',
      type: sql.Float,
      required: true
    },
    {
      name: 'D_SDATE',
      type: sql.VarChar(10),
      required: true
    },
    {
      name: 'D_EDATE',
      type: sql.VarChar(10),
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
procedureNames['getBoardUser'] = {
  name: currentName,
  returnName: "BOARDUSER"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SA_BOARD_USER_LIST_CNT';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'SECHER_TEXT',
      type: sql.VarChar(50),
      required: true
    }, {
      name: 'SECHER1_TITLE',
      type: sql.VarChar(1),
      required: true
    }, {
      name: 'B_GUBUN',
      type: sql.VarChar(1),
      required: true
    },
    {
      name: 'IP_NO',
      type: sql.Float,
      required: true
    },
    {
      name: 'D_SDATE',
      type: sql.VarChar(10),
      required: true
    },
    {
      name: 'D_EDATE',
      type: sql.VarChar(10),
      required: true
    }
  ]
};
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SA_TRADE_HIS';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'S_DUID',
      type: sql.VarChar(50),
      required: true
    }, {
      name: 'S_HP',
      type: sql.NVarChar(100),
      required: true
    }, {
      name: 'TRADE_GUBUN',
      type: sql.VarChar(2),
      required: true
    },
    {
      name: 'GUBUN',
      type: sql.VarChar(10),
      required: true
    },
    {
      name: 'CGUBUN',
      type: sql.VarChar(10),
      required: true
    },
    {
      name: 'TRADE_TYPE',
      type: sql.VarChar(1),
      required: true
    },
    {
      name: 'D_SDATE',
      type: sql.VarChar(10),
      required: true
    },
    {
      name: 'D_EDATE',
      type: sql.VarChar(10),
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
procedureNames['getTradHis'] = {
  name: currentName,
  returnName: "TRADHIS"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SA_TRADE_HIS_CNT';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'S_DUID',
      type: sql.VarChar(50),
      required: true
    }, {
      name: 'S_HP',
      type: sql.NVarChar(100),
      required: true
    }, {
      name: 'TRADE_GUBUN',
      type: sql.VarChar(2),
      required: true
    },
    {
      name: 'GUBUN',
      type: sql.VarChar(10),
      required: true
    },
    {
      name: 'CGUBUN',
      type: sql.VarChar(10),
      required: true
    },
    {
      name: 'TRADE_TYPE',
      type: sql.VarChar(1),
      required: true
    },
    {
      name: 'D_SDATE',
      type: sql.VarChar(10),
      required: true
    },
    {
      name: 'D_EDATE',
      type: sql.VarChar(10),
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
      type: sql.VarChar(50),
      required: true
    }, {
      name: 'SECHER_TEXT',
      type: sql.VarChar(100),
      required: true
    }, {
      name: 'GUBUN',
      type: sql.VarChar(1),
      required: true
    }, {
      name: 'SITE_CODE',
      type: sql.VarChar(10),
      required: true
    },
    {
      name: 'D_SDATE',
      type: sql.VarChar(10),
      required: true
    },
    {
      name: 'D_EDATE',
      type: sql.VarChar(10),
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
procedureNames['AgetWithdList'] = {
  name: currentName,
  returnName: "AWITHLIST"
}
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SA_COIN_WITHDRAWAL_LIST_CNT';
currentInfo = {
  usingCache: false,
  params: [{
      name: 'SECHER1_TITLE',
      type: sql.VarChar(50),
      required: true
    }, {
      name: 'SECHER_TEXT',
      type: sql.VarChar(100),
      required: true
    }, {
      name: 'GUBUN',
      type: sql.VarChar(1),
      required: true
    }, {
      name: 'SITE_CODE',
      type: sql.VarChar(10),
      required: true
    },
    {
      name: 'D_SDATE',
      type: sql.VarChar(10),
      required: true
    },
    {
      name: 'D_EDATE',
      type: sql.VarChar(10),
      required: true
    }
  ]
};
procedureInfo.setProcedureInfo(currentName, currentInfo);

exports.procedureInfo = procedureInfo;
exports.procedureNames = procedureNames;
//procedureNames['adminSignin']=currentName
