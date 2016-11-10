<!--title: JS面向对象知识点复习查漏补缺-->
<!--date: 2016-06-03-->
<!--tags: javascript-->
<!--abstract: 看了一个js关于面向对象的基础教学视频，发现自己对这部分掌握的真是很不牢固，于是乎做做笔记，加强记忆。.-->

%metaEnd%

##JS面向对象知识点复习查漏补缺

###基本类型，引用类型，包装对象
####1. 基本类型与引用类型

		var a = 1;
		var b = a;
		var c = 1;
		console.log(a == c)	//true
		b = b + 1;
		console.log(a);		//1
		console.log(b);		//2

		var arr1 = [1,2,3]
		var arr2 = arr1;
		var arr3 = [1,2,3]
		console.log(arr1 == arr3)	//false
		arr2[0] = 5;
		console.log(arr1);	//[5,2,3]
		console.log(arr2);	//[5,2,3]

	上面代码反应了基本类型与引用类型的区别，基本类型在赋值的时候只是值的复制，在比较的时候也只是值的比较。而引用类型在赋值的时候不仅仅是值的复制，还有对象的传递，同样在比较的时候也不只是值的比较。

	关于对象的比较再来看看下面的代码：

		function Class(){
			this.st1 = 1;
			this.st2 = [1,2,3];
		}
		Class.prototype.st3 = [3,4,5];
	
		var class1 = new Class(),
			class2 = new Class();
		console.log(class1 == class2)	//false
		console.log(class1.prototype == class2.prototype) 	//true
		console.log(class1.st1 == class2.st1)	//true （基本类型）
		console.log(class1.st2 == class2.st2)	//false（引用类型）
		console.log(class1.st3 == class2.st3)	//true
	
	我们可以看到虽然class1和class2都是通过构造函数Class()实例化出来的对象，可是它们并不相同，但是它们的原型却是共享的。
 

####2. 基本类型与包装对象

		var str = "hello";
		console.log( typeof str); 	// String
		str.charAt(0); 	//h
		console.log( typeof str); 	// String
			
	上面的代码中明明定义的str是一个字符串，可是为什么它却能调用charAt()方法呢，不是只有对象才具有方法吗。
	
	原因是每个基本类型都具有自己的包装对象，在str.charAt()语句中，基本类型会先找到对应的包装对象类型，然后包装对象把所有的方法和属性都给了基本类型，语句结束后包装类型消失。
	
	下面一段代码也能说明这个问题。
		
		var person = new Object();
		person.name = "zhangzirui";
		console.log(person.name); 	//"zhangzirui"
		
		var name = "zhangzirui";
		name.age = 27； 	//语句结束后包装类型消失，所以不被保存
		console.log(name.age); 	//undifine

###构造函数与原型链

####1. 构造函数中的this
	
		function Class(){
			this.st1 = "aa";
		}
		var class1 = new Class();

	这是一个很简单的构造函数，简单到觉得这代码就是理所应当，所以从来没想过其中的含义。这次复习的时候才理解，当new去调用一个构造函数时，函数里面的this就是创建出来的对象，而且函数会有一个隐式返回，返回值就是this。
 
####2. 调用实例化对象属性的优先级

		function Class(){
			this.st1 = "aa";
		}
		Class.prototype.st1 = "bb";
		Class.prototype.st2 = "cc";
		
		var class1 = new Class();
		console.log(class1.st1); 	//"aa"
		console.log(class1.st2); 	//"cc"
	
	
	上面代码中class1为Class()的新实例，在调用实例的属性的时候，先是搜索对象实例本身，如果没有找到的话，再通过原型链去搜索实例的原型对象。 

	所以在调用class1.st1时，在实例class1中找到了st1 = "aa"，所以不再去管它的原型对象。而在调用class1.st2时，在实例class1中没找到了st2，所以再去它的原型对象中查找，所以class1.st2 = "cc"。


####3. 原型链的终点

		function Class(){
			this.st1 = "aa"
		}
		var class1 = Class();
		console.log(class1.hasOwnProperty("st1")); 	//true
	
	看上面的代码，在class1实例中既没有hasOwnProperty()方法，而我们也没有在Class.prototype中创建该方法，那么hasOwnProperty()方法在哪里呢。我们在上述代码中继续添加下面一句代码

		console.log(class1.hasOwnProperty == Object.prototype.hasOwnProperty); 	//true
	可见通过原型链class1指向了Class.prototype，然后再接着再指向Object.prototype。

####4. constructor
	
		function Class(){}
		var class1 = new Class();
		console.log(class1.constructor) // function Class(){}

	通过构造函数实例化一个对象之后，在原型对象中会自动生成constructor属性。例如在上述代码中就自动生成了Class.prototype.constructor = Class。

	虽然在原型中生成了constructor属性，但是我们却无法通过for-in循环得到该属性，我们可以通过下面代码试验一下。

		function Class(){}
		Class.prototype.st1 = "aa";
		for(var attr in Class.prototype){
			console.log(attr);
		}
		//发现只输出st1,而constructor输不出来
		
		Class.prototype.constructor = Class; 	//自己手动添加一下
		for(var attr in Class.prototype){
			console.log(attr);
		}
		//还是只输出st1
	
	那么怎么样能把constructor输出来呢，可以用Object.getOwnPropertyNames()方法。在上面的代码上接着写
	
		var keys = Object.getOwnPropertyName(Class.prototype)
		//["constructor","st1"]
	
	>小疑问：
	>
	>为什么for-in枚举不到constructor呢，我开始以为是enumerable数据属性设定为false的原因才让其不能枚举，可是我改了enumerable属性之后发现还是枚举不到，所以就成疑问了，希望在以后的学习中能知道这个问题的答案。

####5. 类型判断
	
	最简单的当然是typeof操作符，但是typeof有自己的缺点，如下：
	
	>注：这些都不是错误，只是容易让人迷惑，不易区分
		
		//1.不能区分object的具体类型
		//
		//判断数组
		console.log(typeof []); 	//object
		//判断null
		console.log(typeof null);	//object
		//判断正则
		console.log(typeof /reg/);	//object
		
		//2.无法判断被检测的变量到底是未声明还是未初始化
		//	
		//判断未初始化变量
		var class1;
		console.log(typeof class1); //undefined
		//判断未声明变量
		console.log(typeof class2);	//undefined

	然而通过原型链就有了instanceof(判断对象与构造函数在原型链上是否有关系），表达式为 A instanceof B，如果A是B的实例则返回true,否则返回false。
		
		console.log([] instanceof Array); 	//true
		//constructor其实也可以
		console.log([].constructor === Array); 	//true


	缺点： 适用于一个全局执行环境。
	>小疑问：
	>
	>这个缺点是在Javascript高级程序设计这本书上看到的，但具体的包含多个框架，不同的执行环境还没遇到过，所以现在不是很了解，只知道在iframe中判断数组会失效。
	
	当然最好的还是object原生的toString()方法，因为它会返回一个[object NativeConstructorName]格式的字符串。
		
		console.log(Object.prototype.toString.call([]) === "[object Array]");		//true
		console.log(Object.prototype.toString.call(/reg/) === "[object RegExp]");		//true
		console.log(Object.prototype.toString.call(null) === "[object Null]");		//true
	
	
	
###继承

在书中看到继承有好多种方法：借用构造函数（经典继承），组合继承，原型式继承，寄生式继承，寄生组合式继承等等。后来仔细想想，其实所有的方法都是殊途同归：让对象的属性，方法用各种办法复制出来，尽量高效率不重复。

先看看最常用的组合继承模式：
	
	//父类
	function SuperType(name){
		this.name = name;
		this.color = ["blue","red"];
	}
	SuperType.prototype.showName = function(){
		console.log(this.name);
	}

	//子类
	function SubType(name){
		//继承属性
		SuperType.call(this,name);
	}

	//继承方法（所有）
	SubType.prototype = new SuperType();
	SubType.prototype.constructor = SubType;

	var ex1 = new SubType("zhang");
	ex1.colors.push("green");
	console.log(ex1.colors); 	//"blue","red","green"
	ex1.showName();		//"zhang"	

	var ex2 = new SubType("tang");
	ex2.colors.push("black");
	console.log(ex2.colors); 	//"blue","red","black"
	ex2.showName();		//"tang"
	
	
在这个例子中，在子类构造函数中，利用call()方法继承了父类构造函数中的属性。然后只需要继承父类的方法了，上面例子用了SubType.prototype = new SuperType()这句话意图继承父类的方法，可其实这句话不仅仅是继承了父类中原型的方法，同样也再次继承了父类的属性，只是这个属性写在了子类的原型中，但总归来说还是重复了一遍。

要解决这个问题其实就是要让继承方法的时候只继承方法，即不将父类的构造函数直接赋给子类的原型，而是只将父类的原型赋给子类的原型，所谓的寄生组合式继承也就是这个道理，所以寄生组合式继承也被普遍认为是最理想的继承范式。

	//父类
	function SuperType(name){
		this.name = name;
		this.color = ["blue","red"];
	}
	SuperType.prototype.showName = function(){
		console.log(this.name);
	}

	//子类
	function SubType(name){
		//继承属性
		SuperType.call(this,name);
	}

	//继承方法 (让父类的原型赋给子类的原型)
	function inheritPrototype(subType,superType){
		var prototype = Object(superType.prototype);
		prototype.constructor = subType;
		subType.prototype = prototype;
	}

	inheritPrototype(SubType,SuperType);


(完)