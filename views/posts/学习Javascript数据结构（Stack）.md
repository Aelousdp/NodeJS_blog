<!--title: 学习Javascript数据结构（一）-->
<!--date: 2016-11-19-->
<!--tags: 数据结构, javascript-->
<!--abstract: 对《学习Javascript数据结构与算法》的阅读笔记——栈（stact）-->

%metaEnd%

##学习Javascript数据结构（一）

###前言
>双十一买的书都到了，看着这些宝贝心里很是激动啊，但还有发愁，书好像买多了，哈哈。

先开始看《学习Javascript数据结构与算法》，翻了前两章，发现这本书真的好基础呀，本来就挺薄的。从第三章才开始讲数据结构，虽然很简单，但是本科时候学的数据结构感觉都忘的差不多了，现在换一种语言还是感觉很不错的。感觉javascript先写数据结构比C简单多了。

废话不多说，代码看着简单，自己敲出来才是学到。

###栈

####1. 栈的创建

书上构建的栈是以构造函数的形式写的

	function Stack() {
            var items = [];

            /*创建方法*/

            //出栈
            this.pop = function () {
                return items.pop();
            };

            //入栈
            this.push = function (element) {
                items.push(element);
            };

            //返回栈顶元素
            this.peek = function () {
                return items[items.length-1];
            };

            //判断是否为空
            this.isEmpty = function () {
                return items.length === 0;
            };

            //清空栈
            this.clear = function () {
                items = [];
            };

            //返回栈里面的元素的个数
            this.size = function () {
                return items.length;
            }

			//打印栈
			this.print = function () {
				console.log(items.toString());
			}

			//toString
			this.toString = function () {
				return items.toString();
			}
        }

####2. 应用

书上给出的是一个十进制自由转换的

	/**
	 * @params decNumber    待转换的十进制数
	 * @params base    要转换的进制
	 * @return result    转换的结果	 
	 */
	function baseConverter(decNumber, base) {
		var stack = new Stack(),
			remainder,
			result = "",
			digits = "0123456789ABCDEF";

		while (decNumber > 0) {
			remainder = Math.floor(decNumber % base);
			stack.push(remainder);
			decNumber = Math.floor(decNumber / base);
		}

		while (!stack.isEmpty()) {
			result += digits[stack.pop()];
		}

		return result;
	}




然后这一章就没了，没了，没了，好快。。。。

还好，小提示里面说网上有其他例子代码，那就那个汉诺塔吧。

	#汉诺塔的精髓就是一个递归

	function hanoi(n, from, to, helper) {
		if (n > 0) {
			hanoi(n-1, from, helper, to);
			to.push(from.pop());

			console.log("————————————————");
			console.log("from:  " + from.toString());
			console.log("to:  " + to.toString());
			console.log("helper:  " + helper.toString());
			console.log("————————————————");

			hanoi(n-1, helper, to, from);
		}		
	}

	
(完)