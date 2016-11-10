<!--title: 继承里面的坑-->
<!--date: 2016-10-20-->
<!--tags: javascript-->
<!--abstract: 在练习写组件的时候发现了一个有关继承的坑，准确的来说也是我的理解不透彻，没把组合继承和寄生式继承的真正区别弄明白-->

%metaEnd%

##继承里面的坑

>在练习写组件的时候发现了一个有关继承的坑，准确的来说也是我的理解不透彻，没把**组合继承和寄生式组合继承**的真正区别弄明白，因而在此记录一下。

###组合继承

在《Javascript高级程序设计》一书中组合继承表述的是这样的意思：
		
		//父
        function SuperType(name) {
            this.name = name;
            this.color = ["red", "blue", "green"];
        }

        SuperType.prototype.sayName = function () {
            alert(this.name);
        };

		//子
        function SubType(name, age) {
            SuperType.call(this, name);	//标记为(1)
            this.age = age;
        }

        SubType.prototype = new SuperType();	//标记为(2)
        SubType.prototype.constructor = SubType;
        SubType.prototype.sayAge = function () {
            alert(this.age);
        }

这种方法主要就是两步，也就是我在上面程序中的标记```(1)```和```(2)```。```(1)```的作用是让子函数继承了父构造函数的属性，```(2)```的作用是将父构造函数实例化传给了子构造函数的原型。

所以会有

    var t1 = new SubType();
	console.log(t1.color);	//["red", "blue", "green"]
    console.log(t1.hasOwnProperty("name"))	//true
    console.log(t1.hasOwnProperty("color"))	//true
    console.log(t1.hasOwnProperty("age"))	//true

而去掉```(1)```，其实也继承成功了，只是父构造函数里面的属性全部继承到了子构造函数的原型中，而不是像上面一样也继承到了属性中，如：
	
	//去掉了(1)
    var t1 = new SubType("zzr", "23");
	console.log(t1.color);	//["red", "blue", "green"]
    console.log(t1.hasOwnProperty("name"))	//false
    console.log(t1.hasOwnProperty("color"))	//false
    console.log(t1.hasOwnProperty("age"))	//true


现在回到没去掉```(1)```的时候
	
	console.log(SuperType.prototype)
	console.log(SubType.prototype)
		
在chome浏览器下出现下面的结果：

![](http://cezrh.img48.wal8.com/img48/544629_20160502104557/147701827316.png)

结果很正常，为什么我要拿出来说明呢，其实是为了和接下来要说的对比。

###寄生式组合继承

寄生式组合继承与组合继承有一点不同，那就是寄生式组合继承把组合继承中的```(2)```换成了如下的程序。

	//(2)变成了如下
	inheritPrototype(SubType, SuperType)

	//其中inheritPrototype函数为
	function inheritPrototype(subType, superType) {
		var prototype = Object(superType.prototype);
		prototype.constructor = subType;
		subType.prototype = prototype;
	}

这样继承的好处是，父构造函数的属性不会再子构造函数里面在继承一遍了。

同样进行如下的测试：
	
	console.log(SuperType.prototype)
	console.log(SubType.prototype)
		
在chome浏览器下出现下面的结果：

![](http://cezrh.img48.wal8.com/img48/544629_20160502104557/147701827445.png)

在这样继承后，发现父构造函数和子构造函数的原型共用了。所以无论更改哪一个，另一个也同样变化。

##总结
在《Javascript高级程序设计》书中关于寄生式组合继承的评价有这么一句话：**“开发人员普遍认为寄生组合式继承是引用类型最理想的继承范式”**。我当初也是看到了这句话，但却看的不仔细，单纯的理解成了寄生式组合继承就是最好的继承，所以凡是继承就应该用这个，结果在练习组件编写的时候让所有的组件都共用了同一个原型，全部乱套了。现在一看，书上明明说的是**引用类型**最理想的继承，还是自己当初没理解好。