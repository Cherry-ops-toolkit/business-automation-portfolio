function sendCustomEmails() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
  const rows = sheet.getDataRange().getValues();


  // 1. 锁定文件夹
  const folderId = "YOUR_GOOGLE_DRIVE_FOLDER_ID";
  const parentFolder = DriveApp.getFolderById(folderId);


  // 2. 从文件夹内安全读取 HTML 文件
  const htmlFiles = parentFolder.getFilesByName("email.html");
  if (!htmlFiles.hasNext()) {
    throw new Error("❌ 错误：在文件夹里没找到 'email.html'，请检查文件名！");
  }
  const htmlFile = htmlFiles.next();
  let htmlTemplate = htmlFile.getBlob().getDataAsString();


  // 3. 从文件夹内安全读取 TXT 文件
  const txtFiles = parentFolder.getFilesByName("email.txt");
  if (!txtFiles.hasNext()) {
    throw new Error("❌ 错误：在文件夹里没找到 'email.txt'，请检查文件名！");
  }
  const txtFile = txtFiles.next();
  const textTemplate = txtFile.getBlob().getDataAsString();


  // 4. 捕捉 Canva 的图片路径并建立永久内嵌映射
  const inlineImagesObj = {};
 
  // 匹配所有 src="..." 里面的图片文件名
  const imgRegex = /src=["']([^"']*\.(?:png|jpg|jpeg|gif|webp))["']/gi;
  let match;
  let imgCounter = 1;
  const replacements = [];


  while ((match = imgRegex.exec(htmlTemplate)) !== null) {
    const rawSrc = match[1]; // 获取完整的 src 路径，例如 "images/image1.png"
    const fileName = rawSrc.split('/').pop(); // 提取纯文件名，例如 "image1.png"
    const cidName = "canva_img_" + imgCounter;


    // 直接在文件夹内搜索对应的图片文件名
    const imageFiles = parentFolder.getFilesByName(fileName);
   
    if (imageFiles.hasNext()) {
      const imageBlob = imageFiles.next().getBlob();
      inlineImagesObj[cidName] = imageBlob;
     
      // 记录替换规则
      replacements.push({ oldSrc: rawSrc, newSrc: "cid:" + cidName });
      imgCounter++;
    } else {
      Logger.log("⚠️ 提示：在文件夹中未找到 HTML 引用的图片: " + fileName);
    }
  }


  // 执行 HTML 源码中的图片路径替换
  replacements.forEach(r => {
    htmlTemplate = htmlTemplate.split(r.oldSrc).join(r.newSrc);
  });




  // 5. 开始群发循环
  for (let i = 1; i < rows.length; i++) {
    const email = rows[i][0];
    const firstName = rows[i][1];
    if (!email) continue; // 如果邮箱为空，跳过


    // 默认基本模板替换
    let htmlContent = htmlTemplate.replace(/{{FirstName}}/g, firstName);
    let textContent = textTemplate.replace(/{{FirstName}}/g, firstName);


    // 智能判断拦截：如果 Canva 导出的 HTML 没写占位符，自动识别常规问候语并插入名字
    if (htmlContent.includes("Hi,")) {
      htmlContent = htmlContent.replace("Hi,", "Hi " + firstName + ",");
    } else if (htmlContent.includes("Hi ")) {
      htmlContent = htmlContent.replace("Hi ", "Hi " + firstName + " ");
    } else if (htmlContent.includes("Hello,")) {
      htmlContent = htmlContent.replace("Hello,", "Hello " + firstName + ",");
    } else if (htmlContent.includes("Hello ")) {
      htmlContent = htmlContent.replace("Hello ", "Hello " + firstName + " ");
    } else if (!htmlContent.includes(firstName)) {
      // 如果整篇 HTML 里完全没有出现过用户的名字，强行在邮件正文最开头塞一个问候语
      htmlContent = htmlContent.replace("<body>", "<body><p style='font-family: sans-serif;'>Hi " + firstName + ",</p>");
    }


    // Include the customer's name in the subject to personalize the email.
    const subject = `${firstName}, any subject`;


    // 6. 发送邮件
    GmailApp.sendEmail(email, subject, textContent, {
      htmlBody: htmlContent,
      inlineImages: inlineImagesObj,
      from: "sender@example.com",  
      name: "Example Company"
    });
  }
 
  Logger.log("✅ 群发任务已结束！");
}

