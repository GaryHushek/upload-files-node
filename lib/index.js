/**
 * form 文本域提交 + 文件上传
 * 默认上传文件成功后 以当前的年月日时分秒毫秒.源后缀名 的方式保存
 */

// 导入需要的模块
// 内置模块
const fs = require("fs");
const path = require("path");
const util = require("util");
// 文件上传第三方包
const multiparty = require("multiparty");
// 格式化时间第三方包
const format = require("date-format");

let upload = {
  /**
   * @param {*} options
   * res: Object 利用http创建好的服务器的请求对象res (必填)
   * req: Object 利用http穿建好的服务器的响应对象req (必填)
   * uploadoptions: Object {
   *  encoding: String 文编编码格式 (选填,默认utf-8)
   *  uploadDir: String 上传文件保存路径(必填)
   *  keepExtensions: Boolean 是否保存后缀名(选填,默认true)
   *  maxFieldsSize: Number 提交的文本域的内存大小 单位bit (选填,默认2M)
   *  maxFilesSize:  Number 提交的文件的内存大小 单位bit (选填,默认5M)
   * }
   * fieldsuccess({请求中的文本域eg username:xxx}): Function 拿到每个文件域执行的回调
   * filesuccess({请求中的文件}): Function 文件上传成功执行的回调 (选填)
   * fail: Function 上传失败执行的回调 (选填)
   */
  uploadFile: options => {
    // 获取到传入的参数
    // 利用第三方multiparty模块中的form带着用户传入的参数实例化对象,解析上传文件
    let form = new multiparty.Form({
      encoding: options.uploadoptions.encoding || "utf-8",
      uploadDir: options.uploadoptions.uploadDir,
      keepExtensions: options.uploadoptions.keepExtensions || true,
      maxFieldsSize: options.uploadoptions.maxFieldsSize || 2 * 1024 * 1024,
      maxFilesSize: options.uploadoptions.maxFilesSize || 5 * 1024 * 1024
    });
    // 检测上传的目录是否存在
    fs.exists(options.uploadoptions.uploadDir, exists => {
      if (!exists) {
        // 不存在
        // 新建文件夹
        let err = fs.mkdirSync(options.uploadoptions.uploadDir);
        if (err) {
          if (!options.fail) {
            console.log("upload fail");
            console.log(err);
            return;
          }
          // 执行用户传入的失败时执行的回调
          options.fail();
        } else {
          // 新建上传目录成功
          // 解析上传的文件
          form.parse(options.req, (err, fields, files) => {
            if (err) {
              console.log(err);
              options.res.writeHead(200, {
                "content-type": "application/json;charset=utf-8"
              });
              options.res.end(
                JSON.stringify({ status: 0, message: "上传出错了!" })
              );
              return false;
            }
            if (!options.fieldsuccess) {
              // 获取请求中的文本字段的内容(除文件以外的请求数据)
              Object.keys(fields).forEach(name => {
                console.log(fields[name]);
              });
            }
            if (!options.filesuccess) {
              // 获取请求中的文件内容
              Object.keys(files).forEach(name => {
                // 文件上传到服务器后的原路径
                let oldpath = files[name][0].path;
                // 源文件的格式
                extname = path.extname(oldpath);
                // 动态生成格式化当前时间,拼接后缀名得到新文件名
                let newpath = format("yymmddhhmmssSSS", new Date());
                // 文件名替换
                fs.renameSync(
                  oldpath,
                  options.uploadoptions.uploadDir + newpath + extname
                );
              });
            }
            // 设置响应头
            options.res.writeHead(200, {
              "content-type": "application/json;charset=utf-8"
            });
            // 结束响应
            options.res.end(
              JSON.stringify({ status: 0, message: "上传成功!" })
            );
          });
        }
      } else {
        // 上传目录存在
        // 解析上传的文件
        form.parse(options.req, (err, fields, files) => {
          if (err) {
            console.log(err);
            options.res.writeHead(200, {
              "content-type": "application/json;charset=utf-8"
            });
            options.res.end(
              JSON.stringify({ status: 0, message: "上传出错了!" })
            );
            return false;
          }
          if (!options.fieldsuccess) {
            // 获取请求中的文本字段的内容(除文件以外的请求数据)
            Object.keys(fields).forEach(name => {
              console.log(fields[name]);
            });
          }
          if (!options.filesuccess) {
            // 获取请求中的文件内容
            Object.keys(files).forEach(name => {
              // 文件上传到服务器后的原路径
              let oldpath = files[name][0].path;
              // 源文件的格式
              extname = path.extname(oldpath);
              // 动态生成格式化当前时间,拼接后缀名得到新文件名
              let newpath = format("yymmddhhmmssSSS", new Date());
              // 文件名替换
              fs.renameSync(
                oldpath,
                options.uploadoptions.uploadDir + newpath + extname
              );
            });
          }
          // 设置响应头
          options.res.writeHead(200, {
            "content-type": "application/json;charset=utf-8"
          });
          // 结束响应
          options.res.end(JSON.stringify({ status: 1, message: "上传成功!" }));
        });
      }
    });
  }
};

// 导出模块
module.exports = upload;
