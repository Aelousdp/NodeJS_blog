<!--title: 学习心得之indexedDB-->
<!--date: 2016-05-08-->
<!--tags: javascript-->
<!--abstract: 百度前端学院spring中task0003及task0004任务，即构建一个简单的web-app。通过完成这一个任务，发现自己还有好多不懂和欠缺的地方，真是觉得越学习，越发现自己的无知。Web学习之路早已经没有刚开始入门时的那么简单，什么模块化，移动端，工程化，性能优化，安全等等都需要学习，路还有好长好长，我需要不断努力...-->

%metaEnd%

##学习心得之indexedDB


###indexedDB学习总结

关于indexedDB，网上已经有许多的分析与总结，我在这就不仔细阐述它的特性，只是针对自己所学的作出回顾总结。  

####1. indexedDB配置兼容环境

考虑到全局变量indexedDB在不同浏览器中的差异，所以在程序代码之前得考虑一下兼容性，以下是兼容性代码：
	
	//数据库对象
    window.indexedDB = window.indexedDB || window.webikitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
    //数据库事务
    window.IDBTransaction = window.IDBTransaction || window.webikitIDBTransaction || window.mozIDBTransaction || window.msIDBTransaction;
    //数据库查询条件
    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.mozIDBKeyRange || window.msIDBKeyRange;
    //游标
    window.IBDCursor =  window.IBDCursor || window.webkitIBDCursor || window.mozIBDCursor || window.msIBDCursor; 

####2. indexedDB打开数据库
	
	var openDB = indexedDB.open(name,version)
indexedDB.open方法用来打开数据库,接收两个参数，name是数据库名称，version是数据库版本号，版本号不能为0，应该是一个大于0的正整数。
打开数据库后，有可能会触发4种事件。
	
	openDB.onsuccess = function(event){
		console.log("数据库打开成功");
	}
	openDB.onerror = function(event){
		console.log("数据库打开失败");
	}
	openDB.onupgradeneeded = function(event){
		console.log("数据库第一次打开，或者数据库版本发生变化");
	}
	openDB.onblocked = function(event){
		console.log("上一次的数据库连接还未关闭");
	}

当第一次打开数据库时，会先触发upgradeneeded事件，再触发success事件。

一般来说在upgradeneeded事件中，会创建一个存放数据的对象仓库，如下：

	openDB.onupgradeneeded = function(event){
		console.log("upgrading...");
		var db = event.target.result; 	//创建并打开一个数据库
		
		//判断打开的数据库是否存在名为objectStoreName的对象仓库
		if(！db.objectStoreNames.contains(objectStoreName)){

			//若不存在就创建一个名为objectStoreName的对象仓库
			var objStore = db.createObjectStore(objectStoreName,{keyPath:"id"});
			
			//将idIndex作为id的索引名称，方便以后的索引查找
			objStore.createIndex("idIndex","id",{unique: true});
		}
	}

在上面的db.createObjectStore方法中，objectStoreName是你想建立的对象仓库名称，{keyPath:"id"}这个属性是用来设定键名，这个id键名是独一无二的,不允许重复,所以在你存入该对象仓库的数据中，每个数据的id的属性值都必须不一样。
比如:

	var file = {
		id： idValue,
		date:	dateValue,
		fileName: fileNameValue,
		content: contentValue 	
	}	

在每一个file对象中，id的值必须是不同的。而其他属性的值没有这个限制。

如果不用{keyPath:"id"}这个属性，还可以使用{autoIncreament: true}，这样就不需要自己设定键名，系统会自动生成键名，比如第一个数据键名为1，第二个为2，等等。

而在上面的createIndex方法中，idIndex是自己起的一个索引名称，id则是自己选择的索引属性，{unique: true}是表明这个索引属性是独一无二的，用某个id的属性值，只可以找到唯一一个对应的数据。同样{unique: false}表明索引属性不是独一无二的，比如：

	var file1 = {
		id： 1,
		date:	"2016-05-08",
		fileName: fileNameValue,
		content: contentValue 	
	}

	var file2 = {
		id： 2,
		date:	"2016-05-08",
		fileName: fileNameValue,
		content: contentValue 	
	}	

	objStore.createIndex("idIndex","id",{unique: true});
	objStore.createIndex("date","date",{unique: fasle});

这样配置的话，以id=1为索引查找只能将file1查找出来,以date="2016-05-08"为索引查找就可以将file1与file2都查找出来。具体的查找过程在后面会总结到。

一般来说在success事件中，会加载数据到对象仓库中，如下：

	openDB.onsuccess = function(event){
		console.log("数据库打开成功");
		db = event.target.result;

		//在upgradeneeded事件中已经创建了objectStoreName对象仓库，如果创建成功的话，就向该仓库中添加数据
		if(db.objectStoreNames.contains(objectStoreName)){
			
			//添加数据到objectStore中
		}
	}

####3. indexedDB操作数据库
在操作数据库之间，还有一个东西必须得创建，那就是数据库事务。

	var transaction = db.transaction(objectStoreName,"readwrite");
	//操作类型只有两种	readWrite 读写操作	readonly 只读
	
	 var store = transaction.objectStore(objectStoreName);
	//transaction方法返回一个事务对象，该对象的objectStore方法用于获取指定的对象仓库。

创建事务后可能会触发3种事件

	transaction.onerror = function(e){
            console.dir(e);
			console.log("事务出错");
    	};
    transaction.oncomplete = function(){
            console.log("事务完成");
        };
    transaction.onabort = function(){
            console.log("事务中断");
        };
在创建好事务，获取了对象仓库后就可以进行数据库操作了。

#####(1) 添加数据
	
	var transaction = db.transaction(objectStoreName,"readwrite");
	var store = transaction.objectStore(objectStoreName);
	var request = store.add(obj) 

添加数据add方法是异步的，可能会触发两种事件

	request.onerror = function(e){
                console.log("Error", e.target.error.name)
            };
	request.onsuccess = function(e){
                console.log("数据添加成功！");
            }

#####(2) 读取数据

	var transaction = db.transaction(objectStoreName,"readwrite");
	var store = transaction.objectStore(objectStoreName);	
	var request = store.get(obj)

和add方法一样，也是异步的，会触发两种事件

#####(3) 索引，查找与遍历

在之前，我们提到了createIndex方法
	
	objStore.createIndex("idIndex","id",{unique: true});

上面的createIndex方法将idIndex作为了id属性的索引名

	var transaction = db.transaction(objectStoreName,"readwrite");
	var store = transaction.objectStore(objectStoreName);
	
	//查找id值为idValue的数据
	var index = store.index("idIndex");
	var request = index.get(idValue)
	
	request.onsuccess = function(e){
        var res = e.target.result;
		console.log("res就是想要查找的对象")
    }
	
	//遍历对象仓库中所有的数据
	var cursor = store.openCursor();

	cursor.onsuccess = function(e) {
		
		//res为一个数据对象
    	var res = e.target.result;
		
		//res.continue()表示接着下一个，直达查找完所有的数据
		res.continue();
	}

索引查找中,get是异步的，读取成功后获得的数据，只能在success事件的回调函数中进行操作。openCursor同样也是异步的，也有success和error事件

#####(4) 删除数据

	var transaction = db.transaction(objectStoreName,"readwrite");
	var store = transaction.objectStore(objectStoreName);		
	var request = store.delete(obj)

#####(5) 更新数据
	
	var transaction = db.transaction(objectStoreName,"readwrite");
	var store = transaction.objectStore(objectStoreName);	
	var request = store.get(key) //通过键名获得想要更新的数据
	request.onsuccess = function(event){
            var res = event.target.result;
            res = newValue; //更新数据
            store.put(res);	//更新对象仓库
        }

####4.参考
我的总结到这就基本上结束了，以上所有方法，我在完成百度前端学院task0003及task0004的时候都有用到，具体代码大家可以[点击进入](https://github.com/Zhangzirui/learn-from-baidu-ife/blob/master/spring/task0003/src/indexedDB.js)。
当然，还有大神关于indexedDB的[讲解](http://javascript.ruanyifeng.com/bom/indexeddb.html)。

>本人是菜鸟，如果发有错误你可以在评论或者邮箱(411489774@qq.com)中告诉我，别骂我就行╰(￣▽￣)╭。

>如果你想转载这篇文章到你博客中，希望你能注明一下此文的博客链接[http://zhangzirui.github.io/pages/Document-1](http://zhangzirui.github.io/pages/Document-1)，谢谢！

