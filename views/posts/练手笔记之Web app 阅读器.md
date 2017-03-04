<!--title: 练手笔记之Web app阅读器-->
<!--date: 2017-02-21-->
<!--tags: javascript-->
<!--abstract: 对慕课网实战视频中Web app阅读器进行编程练习后的总结笔记-->

%metaEnd%


##练手笔记之Web app阅读器

> 记录自己以前不熟或者不了解的知识点

### 1. meta 部分：

	<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no, minimal-ui">
	// 其中minimal-ui是自动隐藏浏览器中的顶部地址栏和尾部导航栏

	<meta name="format" content="telephone=no">
	// 一连串的数字默认为高亮显示，这里telephone=no是取消高亮显示

### 2. ```vertical-align```

```vertical-align```（垂直对齐）应用于```display```属性为```inline和inline-block```的元素，其用法可参考[张鑫旭博客](http://www.zhangxinxu.com/wordpress/2010/05/%E6%88%91%E5%AF%B9css-vertical-align%E7%9A%84%E4%B8%80%E4%BA%9B%E7%90%86%E8%A7%A3%E4%B8%8E%E8%AE%A4%E8%AF%86%EF%BC%88%E4%B8%80%EF%BC%89/)

#### 3. base64格式的图片
	
一般来说，定义一个图片可以通过```background: url()```来实现，其中```url()```里面写着图片的地址。

不同于上，base64格式的图片定义为
	
	background: url(data:image/png;base64,string)
	// 其中string为base64图片的字符串内容

由于base64格式的图片未经压缩，所以一般体积较大。优点是利于页面直接加载，减少请求。

关于base64格式图片的详细优缺点及应用场景介绍可以参考：[张鑫旭的博客](http://www.zhangxinxu.com/wordpress/2012/04/base64-url-image-%E5%9B%BE%E7%89%87-%E9%A1%B5%E9%9D%A2%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96/)。

#### 4. 移动端性能陷阱
- 减少或回避```repaint```（页面重绘）, ```reflow```（页面回流），简单来说就是减少或回避DOM样式与结构的变化。

- 尽量缓存所有可以缓存的信息。

- 使用CSS3 ```transform``` 来代替DOM操作。

	- 不要给非static定位的元素增加css3动画
	- 适当使用硬件加速，如canvas，translate3d


### 5. jsonp跨域
	
**解释**： jsonp 是 json 的一种使用模式，可以让网页从别的域名获取信息，即跨域读取数据。

*那么为什么要用 jsonp 来跨域呢？*

因为受到浏览器同源策略的限制，JavaScript 代码无法访问其他域下的内容，即只能访问同源页面的内容（可以参考： [浏览器的同源策略](https://developer.mozilla.org/zh-CN/docs/Web/Security/Same-origin_policy)，里面介绍了一些跨域的方法，比如```<script>```，```<link>```等）。 所以想要获得非同源页面的内容时，就需要跨域。

*至于用 jsonp 来跨域，我的理解是 jsonp 其实只是一个格式而已，所谓用 jsonp 来跨域就是用一些跨域的方法来获得 jsonp 格式里面的内容。*

比如要获取非同源[网页](http://html.read.duokan.com/mfsv2/secure/s010/60009/file?nonce=87e8e80bd9a84314badbd9230ff521b4&token=89GiFGpK01J7WSSnxHnjoefpgNPv-zrNCurl0z1EkRx4OZm4-aB36_TllcymXfewETa58Q9VLD9jJcC4MS7oa0uRTgC6JG9Poed648pU41U&sig=FxmsSqJuj3BM0pQ07XKq13UGJLY)中的内容，若直接用 ajax 方法去 get 该网页里面的内容，就会报错，代码如下：

	var createXHR = function() {
        if (typeof XMLHttpRequest !== undefined) {
            return new XMLHttpRequest();
        } else if (typeof ActiveXObject !== undefined) {
            try {
                return new ActiveXObject("MSXML2.XMLHttp");
            } catch(e) {
                try {
                    return new ActiveXObject("Microsoft.XMLHttp");
                } catch(e) {
                    throw new Error("you can try 'MSXML2.XMLHttp.3.0' or 'MSXML2.XMLHttp.6.0'");
                }
            }
        } else {
            throw new Error("No XHR object available");
        }
    };

	var xhr = createXHR();

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if ((xhr.status >= 200 & xhr.status < 300) || xhr.status === 304) {
                console.log(xhr.responseText);
            } else {
                alert("Request was unsuccessful: " + xhr.status);
            }
        }
    };

    xhr.open("get", "http://html.read.duokan.com/mfsv2/secure/s010/60009/file?nonce=87e8e80bd9a84314badbd9230ff521b4&token=89GiFGpK01J7WSSnxHnjoefpgNPv-zrNCurl0z1EkRx4OZm4-aB36_TllcymXfewETa58Q9VLD9jJcC4MS7oa0uRTgC6JG9Poed648pU41U&sig=FxmsSqJuj3BM0pQ07XKq13UGJLY", true);
    xhr.send(null);

![](http://cezrh.img48.wal8.com/img48/544629_20160502104557/14880973471.png)

但是如果是获取同源的页面内容，就毫无问题了，比如同样是 http://localhost:63342/ 下的页面

xhr.open("get", "http://localhost:63342/test/web%20app/zzr_reader.html", true);
xhr.send(null);

因此为了成功跨域，可以使用一些其他方法，比如```<script>```标签，代码如下：

	var createScript = function(src) {
	    var scriptNode = document.createElement("script");
	    scriptNode.src = src;
	    document.body.appendChild(scriptNode);
	};
	
	var duokan_fiction_chapter = function(json) {
	    console.log(json);
	};
	
	createScript("http://html.read.duokan.com/mfsv2/secure/s010/60009/file?nonce=87e8e80bd9a84314badbd9230ff521b4&token=89GiFGpK01J7WSSnxHnjoefpgNPv-zrNCurl0z1EkRx4OZm4-aB36_TllcymXfewETa58Q9VLD9jJcC4MS7oa0uRTgC6JG9Poed648pU41U&sig=FxmsSqJuj3BM0pQ07XKq13UGJLY")

至于上面代码中为什么要建立```duokan_fiction_chapter```方法，这个问题也是 jsonp 和 json 的写法区别。 json 的写法就不用多说，jsonp 是将想要取得的数据信息放入函数方法名中。比如：

	functionName({"name": "zzr", "age": "24+"}) //括号里面可以是json,也可以是其他传参形式

而```duokan_fiction_chapter```也就是想要获取的那个非同源[网页](http://html.read.duokan.com/mfsv2/secure/s010/60009/file?nonce=87e8e80bd9a84314badbd9230ff521b4&token=89GiFGpK01J7WSSnxHnjoefpgNPv-zrNCurl0z1EkRx4OZm4-aB36_TllcymXfewETa58Q9VLD9jJcC4MS7oa0uRTgC6JG9Poed648pU41U&sig=FxmsSqJuj3BM0pQ07XKq13UGJLY)中的 functionName ，而```duokan_fiction_chapter```后面括号里面包裹的就是想要拿到的信息。

*为什么要将 jsonp 设计成这个形式？*

因为引用```<script>```标签来获取这个页面，会将页面中的内容直接作为 JavaScript 代码来使用，如果直接用json形式是无法解析的。**说直白一点，就是将想要拿到的其他域的页面信息当做 JavaScript 代码用```<script>```标签传进来，而那些信息是写成 jsonp 形式是为了满足 JavaScript 格式。**



