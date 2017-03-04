<!--title: 总结自己编写原生JS总踩的坑-->
<!--date: 2016-08-14-->
<!--tags: javascript-->
<!--abstract: 对平时编写原生js总会放的错，或者总会忘记的东西记录下来。-->

%metaEnd%


##总结自己编写原生JS总踩的坑


对平时编写原生js总会放的错或者总会忘记的东西，记录下来。
> 这一系列会持续更新

###document.compatMode

document.compatMode是用来判断当前浏览器的渲染模式，如下：

当`document.compatMode == 'BackCompat'`,是指标准兼容模式关闭。在计算`clientWidth,scrollTop`之类的距离时，要用`document.body`。

而当`document.compatMode == 'CSS1Compat'`,是指标准兼容模式开启。在计算`clientWidth,scrollTop`之类的距离时，要用`document.documentElement`。

就连第3版《Javascript高级程序设计》一书中也写到过这样的代码：
	
	if(document.compatMode == "CSS1Compat"){
		alter(document.documentElement.scrollTop)
	}else{
		alter(document.body.scrollTop)
	}

####产生的问题和解决办法

可是在实际使用过程中，**这段代码在谷歌浏览器下是会出现错误**的。（我自己就好几次被坑在这里了，所以踩坑后一定要总结总结再总结）

在谷歌浏览器下，`document.compatMode=='CSS1Compat'`时，`document.documentElement.scrollTop`是**等于0**的，而`document.body.scrollTop`才是正确的值。同样有这个问题的还有`scrollLeft`。

所以以上代码可以改成

	if(document.compatMode == "CSS1Compat"){
		alter(document.documentElement.scrollTop==0 ? document.body.scrollTop : document.documentElement.scrollTop)
	}else{
		alter(document.body.scrollTop)
	}


### mouseover与mouseout事件

####产生的问题
在原生使用```mouseover```与```mouseout```事件的时候很容易出错，因为很容易出现重复触发的问题。
如以下代码：
		
	//css部分：
	.box {
		position: relative;
		width: 400px;
		height: 400px;
		background-color: blue;
	}
	
	.content{
		position: absolute;
		left: 100px;
		top: 100px;
		width: 200px;
		height: 200px;	
		background-color: red;
	}
	

	//html部分：
	<div class="box">
		<p class="content"></p>
	</div>
	
	
	//js部分：
	var box = document.getElementsByClassName("box")[0];

	box.addEventListener("mouseover", function () {
		console.log("box_mouseover");
	}, false) 
	box.addEventListener("mouseout", function () {
		console.log("box_mouseout");
	}, false)

那么在鼠标移入绿色区域，也就是box区域的时候，```Console```弹出```box_mouseover```，可是当鼠标继续移入红色区域的时候，接着弹出```box_mouseout```和```box_mouseover```。同样当鼠标从红色区域又移入绿色区域的时候，```Console```弹出```box_mouseout```和```box_mouseover```。这样就出现了重复触发的现象。


####原因

这个现象出现的原因，我的理解是这样的，当鼠标从绿色移入红色的时候，虽然红色区域被绿色包裹着，但是浏览器默认鼠标已经移除了绿色区域，所以触发弹出```box_mouseout```。可是与此同时鼠标也移入了红色区域，虽然红色区域，也就是content区域没有绑定```mouseover```事件，但是系统认为存在这个```mouseover```过程，只是由于该事件没有绑定任何函数，所以没有任何现象。但是红色区域的父级，也就是绿色区域绑定了```mouseover```事件，所以这个对红色区域的```mouseover```事件过程，冒泡到了父级，使得```Console```又弹出```box_mouseover```。


####解决办法

解决办法就是对症下药，在绑定```mouseover```与```mouseout```事件的函数里面，判断一下是否是当前触发事件的是否是冒泡来的，即判断事件绑定对象是不是事件触发对象。

>解释一下： 比如说鼠标从绿色区域移到红色区域，红色区域触发了```mouseover```,该事件冒泡到了绿色区域，由于绿色区域绑定了该事件函数，所以执行函数。这个过程中，事件绑定的对象为绿色区域，而事件触发对象是红色区域。

**实际上要阻止的不仅仅是冒泡**。当鼠标从外界移入绿色区域时，我们往往要求只触发一次```box_mouseover```，之后无论鼠标在绿色区域还是红色区域中移动，只要不出去，那么就什么都不触发。可是我们发现当从绿色移入红色时，会触发```box_mouseout```，这个是正常出现的，不是冒泡什么的，但是我们仍然需要去阻止。

这里用到两个知识点，感觉我平常用的很少。

1. ```relatedTarget```，```fromElement```和```toElement```

	对于```mouseover```事件来说，该属性是鼠标指针移到目标节点上时所离开的那个节点。

	对于```mouseout```事件来说，该属性是离开目标时，鼠标指针进入的节点。

	对于```mouseover```和```mouseout```，```fromElement```表示移出鼠标的元素，```toElement```表示移入鼠标的元素。

2. ```compareDocumentPostion()```

	该方法用来判断节点间的关系，具体参考[W3school](http://www.w3school.com.cn/jsref/met_node_comparedocumentposition.asp)。
	
	通过```compareDocumentPosition()```和```contains()```两个方法来构建函数：

		/**
		 * 判断所检测的节点是不是参考节点的子节点
		 * @ refNode  参考节点
		 * @ testNode  参考节点
		 */
		function contains(refNode, testNode) {
			if (refNode.contains) {
				return refNode.contains(testNode) && (refNode !== testNode);
				// 同一个节点使用contains会返回true，比如 node1.contains(node1) 为真
				// 所以要逻辑与上一个refNode !== testNode
	
			}else if (refNode.compareDocumentPosition) {
				return !!(refNode.compareDocumentPosition(testNode) & 16);
				// 若待测节点是参考节点的子节点，那么compareDocumentPostion()返回16
				// 16与自身按位与返回一个非零数字，而两个逻辑非会将其操作值转换成布尔值。
		
			}else {
				var node = testNode.parentNode;
				do{
					if (refNode === node) {
						return true;
					}else {
						node = node.parentNode;
					}
				}while(node !== null)
				return false;
			}
		}

那么检测函数可以写成：

	/**
     * 检测事件触发对象是不是事件绑定对象
     * (只针对mouseover与mouseout)
	 * e 事件
	 * target 事件绑定对象
	 */
		
	function check(e, target) {
		var e = e || window.e;
		if (e.type === "mouseover") {
			return !(contains(target, e.relatedTarget||e.fromElement)) && !((e.relatedTarget||e.fromElement) === target)
			// 其中前半部分!(contains(target, e.relatedTarget||e.fromElement))阻止的是正常触发
			// 比如从红色移入绿色，正常触发mouseover，这个时候contains为真，加一个逻辑非就为假。
			// 其中后半部分!((e.relatedTarget||e.fromElement) === target)阻止的是冒泡
			
		}else if (e.type === "mouseout") {
			return !(contains(target, e.relatedTarget||e.toElement)) && !((e.relatedTarget||e.toElement) === target)
		}
		
	}

那么最上面，也就是**产生问题**里面的js代码可以写成如下形式

	//js部分：
	var box = document.getElementsByClassName("box")[0];

	box.addEventListener("mouseover", function (e) {
		if (check(e, this)) {
			console.log("box_mouseover");
		}
	}, false) 
	box.addEventListener("mouseout", function (e) {
		if (check(e, this)) {
			console.log("box_mouseout");
		}
	}, false)