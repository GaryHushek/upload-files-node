## upload

### Desc

 form 文本域提交 + 文件上传

 默认上传文件成功后 以当前的年月日时分秒毫秒.源后缀名 的方式保存

#### How to use

---------------------------------

`npm install upload-fileds-file `

--------------------------

	const upload = require('upload');

	upload.uploadFile({
	
		\* res: Object 利用http创建好的服务器的请求对象res (必填)
	
	   	\* req: Object 利用http穿建好的服务器的响应对象req (必填)
	
	   	\* uploadoptions: Object {
		
	   	\*  encoding: String 文编编码格式 (选填,默认utf-8)
	
	   	\*  uploadDir: String 上传文件保存路径(必填)
	
	  	\*  keepExtensions: Boolean 是否保存后缀名(选填,默认true)
	
	  	\*  maxFieldsSize: Number 提交的文本域的内存大小 单位bit (选填,默认2M)
	
	 	\*  maxFilesSize:  Number 提交的文件的内存大小 单位bit (选填,默认5M)
	
	  	\* }
	
	  	\* fieldsuccess({请求中的文本域eg username:xxx}): Function 拿到每个文件域执行的回调
		
	  	\* filesuccess({请求中的文件}): Function 文件上传成功执行的回调 (选填)
	
	 	\* fail: Function 上传失败执行的回调 (选填)

	})



##### eg:

 	if (pathname.includes("upload") && req.method === "POST") {
	
			upload.uploadFile({
		
			req,
			
			res,
		
			uploadoptions:{
		
				uploadDir:'./upload/'
		
			}

		})
	} 







