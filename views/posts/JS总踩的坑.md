<!--title: 总结自己编写原生JS总踩的坑-->
<!--date: 2016-06-14-->
<!--tags: javascript-->
<!--abstract: 对平时编写原生js总会放的错，或者总会忘记的东西记录下来。这一篇会持续更新。-->

%metaEnd%


##总结自己编写原生JS总踩的坑

> 这一篇会持续更新

###document.compatMode产生的问题

document.compatMode是用来判断当前浏览器的渲染模式，如下：

当`document.compatMode == 'BackCompat'`,是指标准兼容模式关闭。在计算`clientWidth,scrollTop`之类的距离时，要用`document.body`。

而当`document.compatMode == 'CSS1Compat'`,是指标准兼容模式开启。在计算`clientWidth,scrollTop`之类的距离时，要用`document.documentElement`。

就连第3版《Javascript高级程序设计》一书中也写到过这样的代码：
	
	if(document.compatMode == "CSS1Compat"){
		alter(document.documentElement.scrollTop)
	}else{
		alter(document.body.scrollTop)
	}

可是在实际使用过程中，**这段代码在谷歌浏览器下是会出现错误**的。（我自己就好几次被坑在这里了，所以踩坑后一定要总结总结再总结）

在谷歌浏览器下，`document.compatMode=='CSS1Compat'`时，`document.documentElement.scrollTop`是**等于0**的，而`document.body.scrollTop`才是正确的值。同样有这个问题的还有`scrollLeft`。

所以以上代码可以改成

	if(document.compatMode == "CSS1Compat"){
		alter(document.documentElement.scrollTop==0 ? document.body.scrollTop : document.documentElement.scrollTop)
	}else{
		alter(document.body.scrollTop)
	}