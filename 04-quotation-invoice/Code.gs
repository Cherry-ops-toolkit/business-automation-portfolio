// 1. 配置 Zoho API 信息
const ZOHO_CONFIG = {
  CLIENT_ID: "CLIENT_ID",
  CLIENT_SECRET: "CLIENT_SECRET",
  REFRESH_TOKEN: "REFRESH_TOKEN",
  ORGANIZATION_ID: "ORGANIZATION_ID", //
  API_DOMAIN: "https://www.zohoapis.jp" //
};


/// ==========================================
// 🔑 2. Access Token 获取
// ==========================================
function getZohoAccessToken() {
  const props = PropertiesService.getScriptProperties();
  const cachedToken = props.getProperty("ZOHO_ACCESS_TOKEN");
  const expireTime  = props.getProperty("ZOHO_TOKEN_EXPIRE_TIME");
  const now = new Date().getTime();


  if (cachedToken && expireTime && (Number(expireTime) - now > 120000)) {
    return cachedToken;
  }


  if (typeof ZOHO_CONFIG === 'undefined') {
    SpreadsheetApp.getUi().alert("🛑 脚本错误：未找到 ZOHO_CONFIG 全局变量配置！");
    return null;
  }


  // 日本区认证中心
  const url = "https://accounts.zoho.jp/oauth/v2/token";
 
  // 显式拼接
  const payload =
    "refresh_token=" + encodeURIComponent(ZOHO_CONFIG.REFRESH_TOKEN.trim()) +
    "&client_id=" + encodeURIComponent(ZOHO_CONFIG.CLIENT_ID.trim()) +
    "&client_secret=" + encodeURIComponent(ZOHO_CONFIG.CLIENT_SECRET.trim()) +
    "&grant_type=refresh_token";


  try {
    const res = UrlFetchApp.fetch(url, {
      method: "post",
      contentType: "application/x-www-form-urlencoded",
      payload: payload, // 传入纯文本字符串
      muteHttpExceptions: true
    });
   
    const json = JSON.parse(res.getContentText());
   
    if (json.access_token) {
      const expiresInSec = json.expires_in || 3600;
      const newExpireTime = now + (expiresInSec * 1000);
     
      props.setProperty("ZOHO_ACCESS_TOKEN", json.access_token);
      props.setProperty("ZOHO_TOKEN_EXPIRE_TIME", newExpireTime.toString());
      return json.access_token;
    } else {
      SpreadsheetApp.getUi().alert("🛑 Zoho 拒绝颁发 Token，错误原因：\n" + res.getContentText());
      return null;
    }
  } catch(e) {
    SpreadsheetApp.getUi().alert("💥 请求 Token 发生网络或系统崩溃：\n" + e.toString());
    return null;
  }
}


// ==========================================
// 🚀 3. 读取 ORDER_INPUT 并发 Zoho
// ==========================================
function createInvoiceFromOrderInput() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
 
  // 获取授权令牌
  const accessToken = getZohoAccessToken();
  if (!accessToken) {
    ss.toast("🛑 错误：无法获取 Zoho 授权凭证！请查看弹窗提示。", "发票助手", 5);
    return;
  }


  const orderSheet = ss.getSheetByName("ORDER_INPUT");
  if (!orderSheet) {
    ss.toast("🛑 错误：未找到 'ORDER_INPUT' 工作表！", "发票助手", 5);
    return;
  }


  // 1. 读取前端选择的客户名和ID
  const customerName = String(orderSheet.getRange("B1").getValue()).trim();
  let customerId = String(orderSheet.getRange("F1").getValue()).trim();


  if (!customerName) {
    ss.toast("⚠️ 提示：请先在 B1 选择客户名字！", "发票助手", 5);
    return;
  }


  // 🛑 
  if (!customerId || customerId === "" || customerId === "0" || customerId.includes("#N/A") || customerId.includes("ERR")) {
    SpreadsheetApp.getUi().alert(
      `💡 提示：新客户「${customerName}」尚未在 Excel 中绑定 Zoho ID！\n\n` +
      `【请执行最后一次人肉微操】：\n` +
      `1. 去 Zoho 网页端进入该客户详情页。\n` +
      `2. 复制网址最后那一串数字的 Customer ID。\n` +
      `3. 贴进你的『CUSTOMER_LIST』表格对应的 C 列里。\n\n` +
      `贴好后，直接回来再次点击此按钮`
    );
    return;
  }


  // 2. 直接调用下方提取商品数据的通用工具函数
  const lineItems = fetchCommonLineItems("ORDER_INPUT");


  if (!lineItems || lineItems.length === 0) {
    SpreadsheetApp.getUi().alert("⚠️ 提示：未能从表格中筛选出任何有效商品！\n请检查第 4 行及以下的 C 列(QTY)是否填写了大于 0 的数字。");
    return;
  }


  // 3. 组装发票数据包
  const url = `${ZOHO_CONFIG.API_DOMAIN}/invoice/v3/invoices?organization_id=${ZOHO_CONFIG.ORGANIZATION_ID}`;
 
  const payload = {
    customer_id: customerId,
    shipping_address: {
      address: "As per registered address"
    },
    line_items: lineItems
  };


  // 4. 发
  try {
    const response = UrlFetchApp.fetch(url, {
      method: "post",
      contentType: "application/json",
      headers: { "Authorization": "Zoho-oauthtoken " + accessToken },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });
   
    const responseCode = response.getResponseCode();
   
    if (responseCode !== 201) {
      SpreadsheetApp.getUi().alert("🛑 发票被 Zoho 拒收：\n" + response.getContentText());
    } else {
      ss.toast("🎉 发票已成功推送到 Zoho 后台！", "发票助手", 3);
    }
  } catch(e) {
    SpreadsheetApp.getUi().alert("💥 网络超时或脚本崩溃：\n" + e.toString());
  }
}


// ==========================================
// 📦 4. 核心通用：从指定表格提取标准 Zoho 商品包
// ==========================================
function fetchCommonLineItems(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    SpreadsheetApp.getUi().alert(`🛑 错误：未找到「${sheetName}」工作表！`);
    return null;
  }


  const lastRow = sheet.getLastRow();
  if (lastRow < 4) return []; // 表头在 A3，第 4 行起没数据


  // 抓取从第 4 行开始，A列 到 E列 的数据（一共 5 列）
  const orderData = sheet.getRange(4, 1, lastRow - 3, 5).getValues();
  const lineItems = [];


  for (let i = 0; i < orderData.length; i++) {
    const row = orderData[i];
   
    const productName = row[0] ? String(row[0]).trim() : "";  // A 列：Product_Name
    const description = row[1] ? String(row[1]).trim() : "";  // B 列：Description
    const qty         = row[2];                               // C 列：QTY
    const unit        = row[3] ? String(row[3]).trim() : "";  // D 列：Unit
    const unitPrice   = row[4];                               // E 列：UNIT_PRICE


    // 只有当商品名不为空，且数量大于 0 时才加入发票
    if (productName !== "" && Number(qty) > 0) {
      lineItems.push({
        name: productName,
        description: description,     // 🎯 成功塞入描述
        quantity: Number(qty),
        unit: unit,                   // 🎯 成功塞入单位（如 pcs）
        rate: Number(unitPrice)
      });
    }
  }
  return lineItems;
}


// ==========================================
// 📄 报价单
// ==========================================
function createQuoteFromOrderInput() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
 
  // 1. 获取授权令牌
  const accessToken = getZohoAccessToken();
  if (!accessToken) {
    ss.toast("🛑 错误：无法获取 Zoho 授权凭证！", "报价单助手", 5);
    return;
  }


  const orderSheet = ss.getSheetByName("ORDER_INPUT");
  if (!orderSheet) {
    ss.toast("🛑 错误：未找到 'ORDER_INPUT' 工作表！", "报价单助手", 5);
    return;
  }


  // 2. 读取前端选择的客户名和ID
  const customerName = String(orderSheet.getRange("B1").getValue()).trim();
  let customerId = String(orderSheet.getRange("F1").getValue()).trim();


  if (!customerName) {
    ss.toast("⚠️ 提示：请先在 B1 选择客户名字！", "报价单助手", 5);
    return;
  }


  // 🛑 
  if (!customerId || customerId === "" || customerId === "0" || customerId.includes("#N/A") || customerId.includes("ERR")) {
    SpreadsheetApp.getUi().alert(
      `💡 提示：新客户「${customerName}」尚未绑定 Zoho ID！\n\n` +
      `请贴好后，再回来点击报价单生成。`
    );
    return;
  }


  // 3. 直接调用你写好的提取商品数据的函数
  const lineItems = fetchCommonLineItems("ORDER_INPUT");


  if (!lineItems || lineItems.length === 0) {
    SpreadsheetApp.getUi().alert("⚠️ 提示：未能从表格中筛选出任何有效商品！\n请检查第 4 行及以下的 C 列(QTY)是否填写了大于 0 的数字。");
    return;
  }


 
  const url = `${ZOHO_CONFIG.API_DOMAIN}/invoice/v3/estimates?organization_id=${ZOHO_CONFIG.ORGANIZATION_ID}`;
 
  // 4. 组装报价单数据包
  const payload = {
    customer_id: customerId,
    line_items: lineItems
  };


  // 5. 正式发到 Quotes 
  try {
    const response = UrlFetchApp.fetch(url, {
      method: "post",
      contentType: "application/json",
      headers: { "Authorization": "Zoho-oauthtoken " + accessToken },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });
   
    const responseCode = response.getResponseCode();
   
    if (responseCode !== 201) {
      SpreadsheetApp.getUi().alert("🛑 报价单被 Zoho 拒收：\n" + response.getContentText());
    } else {
      ss.toast("🎉 报价单已成功推送到 Zoho 报价单后台！", "报价单助手", 3);
    }
  } catch(e) {
    SpreadsheetApp.getUi().alert("💥 网络超时或脚本崩溃：\n" + e.toString());
  }
}


function clearTokenCache() {
  PropertiesService.getScriptProperties().deleteProperty("ZOHO_ACCESS_TOKEN");
  PropertiesService.getScriptProperties().deleteProperty("ZOHO_TOKEN_EXPIRE_TIME");
  Logger.log("Token 缓存已成功清空！");
}

