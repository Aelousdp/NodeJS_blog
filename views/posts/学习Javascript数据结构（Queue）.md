<!--title: 学习Javascript数据结构（二）-->
<!--date: 2016-11-24-->
<!--tags: 数据结构, javascript-->
<!--abstract: 对《学习Javascript数据结构与算法》的阅读笔记——队列（queue）-->

%metaEnd%


## 学习Javascript数据结构（二）

### 队列的创建
同样构造函数的方法，和栈很类似。

	function Queue() {
		var items = [];

		/*创建方法*/

		this.enqueue = function(element) {
			items.push(element);
		}
		
		this.dequeue = function() {
			return items.shift();
		}

		this.front = function() {
			return items[0];
		}

		this.isEmpty = function() {
			return items.length == 0;
		} 
		
		this.clear = function() {
			items = [];
		}

		this.size = function() {
			return items.length;
		}

		this.print = function() {
			console.log(items.toString());
		}
	}

### 优先队列

优先队列其实是在队列里面给加了一个优先级序列，这样只需要对上面构建的队列里面的enqueue方法更改一下就可以了。
	
	function PriorityQueue() {
		var items = [];
		
		function Queue(element, priority) {
			this.element = element;
			this.priority = priority;
		} 

		this.enqueue = function(element, priority) {
			var queueELement = new Queue(element, priority);
			
			if (this.isEmpty) {
				items.push(queueElement);
			} else {
				var index = -1;
				for (var i=0; i<this.size; i++) {
					if (queueELement.priority < items[i].priority) {
						index = i;
						break;
					}
				}
				if (index === -1) {
					items.push(queueELement);
				} else {
					items.splice(index, 0, queueElement;	
				}
			}
		}

		//this....其他方法不变
	}