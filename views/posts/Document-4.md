<!--title: 梯度下降算法-->
<!--date: 2016-05-22-->
<!--tags: Machine Learning-->
<!--abstract: "机器学习什么的还是要打牢基础，每个算法尽量都自己实现一遍。最近在看斯坦福大牛Andrew Ng的机器学习公开课，这是第一篇——线性回归...-->


%metaEnd%


##梯度下降算法

###理解

线性回归属于监督学习的机器学习算法。给定一些训练数据，为了找到这些数据的规律，就需要通过这些数据来拟合出一条直线，同时也可以对给出的新数据进行预测。
	
>markdown不好编辑公式,没办法，所有的公式只能粘图了
	

线性回归模型可以用公式表示为：
<p style="TEXT-ALIGN: center" contentEditable=true><img src="http://cezrh.img48.wal8.com/img48/544629_20160502104557/146381710162.png" /></p>
其中n是变量的个数

则回归模型与真实值之间的误差损失可以表示为

<p style="TEXT-ALIGN: center" contentEditable=true><img src="http://cezrh.img48.wal8.com/img48/544629_20160502104557/146381710222.png" /><br /></p>
其中m是样本的个数


为了让这个回归模型更加可靠真实，就需要找出theta的值使误差损失最小，这样就有了梯度下降算法(gradient descent algorithm)。

###批梯度下降算法(batch gradient descent)

为了找出合适的theta的值使误差损失最小，首先就要初始化theta，这个初始化是随机的，定它为0还是为1都行。然后通过下面的公式，反复迭代更新theta，直至找出合适的theta。
<p style="TEXT-ALIGN: center" contentEditable=true><img src="http://cezrh.img48.wal8.com/img48/544629_20160502104557/146381889746.png" /><br /></p>
其中alpha为迭代的速度，上式化简可得
<p style="TEXT-ALIGN: center" contentEditable=true><img src="http://cezrh.img48.wal8.com/img48/544629_20160502104557/146381917252.png" /><br /></p>

然后<span id='jump'>梯度下降算法的核心</span>就出现啦（具体的说是批梯度下降算法），
<p style="TEXT-ALIGN: center" contentEditable=true><img src="http://cezrh.img48.wal8.com/img48/544629_20160502104557/146381889877.png" /><br /></p>
上程序(python实现，下同)
	
	# -*- coding: utf-8 -*-
	'''
	Created on 2016年5月21日
	
	@author: Zhangzirui(411489774@qq.com)
	'''
	from numpy import *
	
	class Batch_gradient_descent(object): 
	    def batch(self,x_arr,y_arr):

	        #MINI_ERROR表示系统允许最小误差
	        MINI_ERROR = 0.00001 

	        #alpha表示学习速率
	        alpha = 0.001

	        #j_theta用来装载最后的损失
	        j_theta = 0
	        
	        theta0 = 1
	        theta1 = 1
	        theta0_last = 0
	        theta1_last = 0
	        
	        #num用来装载迭代的次数
	        num = 0
	        m = len(x_arr)
	  
	        while True:
	            num = num + 1
	            j_diff = [0,0]
	            for i in range(m):            
	                j_diff[0] += (y_arr[i][0] - theta0 -theta1*x_arr[i][0]) 
	                j_diff[1] += (y_arr[i][0] - theta0 -theta1*x_arr[i][0]) * x_arr[i][0]
	                        
	            theta0_last = theta0
	            theta1_last = theta1
	            theta0 = theta0 + alpha * j_diff[0]
	            theta1 = theta1 + alpha * j_diff[1]
	            
	            if abs(theta0-theta0_last)<MINI_ERROR and abs(theta1-theta1_last)<MINI_ERROR:
	                for j in range(m):
	                    j_theta += (theta0 + theta1*x_arr[j][0] - y_arr[j][0])**2*(0.5/m) 
	                break
	
	        print "the times of iteration is %d." % num
	        print 'Done: theta0 : %f, theta1 : %f,j_theta: %f.' % (theta0,theta1,j_theta)     
	        
	    def loadData(self,fileName):
	        arr = []
	        fr = open(fileName)
	        for line in fr.readlines():
	            curline = line.strip().split(" ")            
	            curline = map(float,curline)
	            arr.append(curline)
	        return arr    
	    
	if __name__ == "__main__":
	    bat = Batch_gradient_descent()
	    fileName1 =  "F:\\ML\\stanford\\exercise data\\ex2Data\\ex2x.dat"
	    fileName2 =  "F:\\ML\\stanford\\exercise data\\ex2Data\\ex2y.dat"
	    x_arr = bat.loadData(fileName1)
	    y_arr = bat.loadData(fileName2)  
	    bat.batch(x_arr, y_arr) 

其中输入的数据来自于[Stanford Exercise 2: Linear Regression](http://openclassroom.stanford.edu/MainFolder/DocumentPage.php?course=MachineLearning&doc=exercises/ex2/ex2.html)，结果图如下：
<p style="TEXT-ALIGN: center" contentEditable=true><img src="http://cezrh.img48.wal8.com/img48/544629_20160502104557/146986987107.png" /><br /></p>

接着我想沿用这个程序试一试多元线性回归，数据来源于[Stanford Exercise 3](http://openclassroom.stanford.edu/MainFolder/DocumentPage.php?course=MachineLearning&doc=exercises/ex3/ex3.html)。该教程提出来数据预处理，因为x矩阵中两列的数据相差太大，会严重影响梯度下降算法的效率。

可是我发现即使迭代的次数都快突破天际，结果还是没有收敛，始终也无法满足到达最小误差。这是个坑啊，浪费了我很多时间查代码。后来我才想到原因，是我自己陷入思维误区了，它根本就是不能收敛到这么小的误差，所以不该设置最小的误差来判断是否收敛，应该设定最大迭代的次数，看看对于多元线性回归它的收敛情况。

程序为

	# -*- coding: utf-8 -*-
	'''
	Created on 2016年5月21日
	
	@author: Zhangzirui(411489774@qq.com)
	'''
	
	from numpy import *
	import matplotlib.pyplot as plt
	
	class Multiple_batch(object):
	    
	    def batch(self,x_arr,y_arr):  
	        
	        #最大迭代次数
	        MAX_ITERATION = 50
	        #alpha表示学习速率
	        alpha = [0.001,0.01]
	        #用来装载最后的误差损失
	        j_all = []
	        
	        m = len(x_arr)
	        
	        #分别用不同收敛速度alpha
	        for a in alpha:
	            
	            theta0 = 1
	            theta1 = 1
	            theta2 = 1
	            #num表示迭代的次数
	            num = 0
	            j_thetas = []
	            while num<MAX_ITERATION:
	                
	                num = num + 1
	                j_theta = 0
	                
	                #计算每次迭代后的损失函数大小
	                for j in range(m):
	                    j_theta += (theta0 + theta1*x_arr[j][0] + theta2*x_arr[j][1] - y_arr[j][0])**2*(0.5/m) 
	                j_thetas.append(j_theta)
	
	                j_diff = [0,0,0]
	                for i in range(m):            
	                    j_diff[0] += (y_arr[i][0] - theta0 -theta1*x_arr[i][0] - theta2*x_arr[i][1]) 
	                    j_diff[1] += (y_arr[i][0] - theta0 -theta1*x_arr[i][0] - theta2*x_arr[i][1]) * x_arr[i][0]
	                    j_diff[2] += (y_arr[i][0] - theta0 -theta1*x_arr[i][0] - theta2*x_arr[i][1]) * x_arr[i][1]
	                
	                theta0 = theta0 + a * j_diff[0]
	                theta1 = theta1 + a * j_diff[1]
	                theta2 = theta2 + a * j_diff[2]          
	             	                
	            j_all.append(j_thetas)        
	
	        mark = ['-r','-g']
	        x = arange(0,MAX_ITERATION,1)
	        for i in range(len(mark)):
	            plt.plot(x,j_all[i],mark[i],linewidth=3)
	        plt.show()
	        
	    def loadData(self,fileName):
	        arr = []
	        fr = open(fileName)
	        for line in fr.readlines():
	            curline = line.strip().split("   ")
	            curline = map(float,curline)
	            arr.append(curline)
	        return arr    
	    
	if __name__ == "__main__":
	    
	    bat = Multiple_batch()
	    fileName1 =  "F:\\ML\\stanford\\exercise data\\ex3Data\\ex3x.dat"
	    fileName2 =  "F:\\ML\\stanford\\exercise data\\ex3Data\\ex3y.dat"
	    x_arr = bat.loadData(fileName1)
	
	    #数据预处理
	    x_arr = (x_arr - mean(x_arr, axis=0))/std(x_arr,axis=0)
	    
	    y_arr = bat.loadData(fileName2)  
	    bat.batch(x_arr, y_arr)   
结果图为：<p style="TEXT-ALIGN: center" contentEditable=true><img src="http://cezrh.img48.wal8.com/img48/544629_20160502104557/146986987042.png" /><br /></p>

###随机梯度下降算法(stochastic gradient descent)

随机梯度下降算法其实是针对批梯度下降算法处理大规模数据计算量过大计算时间过长而做出的小改变。让我们看看随机梯度下降算法执行过程：
<p style="TEXT-ALIGN: center" contentEditable=true><img src="http://cezrh.img48.wal8.com/img48/544629_20160502104557/146987081492.png" /><br /></p>
与[批梯度下降算法的过程](#jump)相比,批梯度算法是把所有的样本计算一遍后再进行一次theta迭代。而随机梯度下降算法是每计算一个训练样本就迭代一次，这样theta的迭代次数明显加快。当然这样也导致了随机梯度下降算法的计算精度不如批梯度算法。

随机梯度下降的程序和批梯度的差不多，在这里就不贴出来了，想参考的童鞋可以到[这里](#)下载。

###梯度下降算法的规范方程（the normal equations）
这里个人觉得就是将梯度下降算法用矩阵的形式推导一遍，然后得出了简化形式。推导过程在Andrew Ng的机器学习第二节课中讲的非常明白，[讲义讲义notes1](http://cs229.stanford.edu/notes/cs229-notes1.pdf)第10页和第11页也给出了详细的推导。
同样运用[Stanford Exercise 2: Linear Regression](http://openclassroom.stanford.edu/MainFolder/DocumentPage.php?course=MachineLearning&doc=exercises/ex2/ex2.html)的数据试着编了程序。
	# -*- coding: utf-8 -*-
	'''
	Created on 2016年5月9日
	
	@author: Zhangzirui(411489774@qq.com)
	'''
	from numpy import * 
	import matplotlib.pyplot as plt
	from mpl_toolkits.mplot3d import Axes3D
	
	class LinearRegression(object):
	    
	    def loadData(self,fileName):
	        dataset = []
	        fr = open(fileName)
	        for line in fr.readlines():
	            curLine = line.strip()
	            fltLine = float(curLine)
	            dataset.append(fltLine)
	        return transpose(mat(dataset))
	    
	    def l_r(self,f1,f2):
	        
			#导入原始数据
	        x = self.loadData(f1)
	        y = self.loadData(f2)
	        
			#画出数据散点图
	        plt.figure("fig1")
	        plt.plot(x,y,'ob')
	        plt.xlabel("height")
	        plt.ylabel("years")
	         
	        m = len(y)
	        x1 = ones((m,2))
	        for i in range(m):
	            x1[i,1] = x[i,0]
	            
	        theta = zeros((2,1))
	        alpha = 0.07
	        MAX_IIR = 1500  #theta最大的迭代次数
	        ERROR = 1e-10   #允许的误差
	        
	        for i in range(MAX_IIR):
	            grad = dot(1.0/m*transpose(x1),dot(x1,theta)-y)  #损失函数 = X'*X*theta - X'*Y 
	            prev_theta = theta
	            theta = theta - alpha*grad
	            if [j for j in abs(prev_theta - theta) if j<ERROR] == abs(prev_theta - theta):
	                break
	 		#画出拟合图像
	        plt.plot(x,dot(x1,theta),label='linear regression')
	        
	        # 为了更好理解batch梯度下降所做的事情，接下来是为了画出J(theta)也就是损失与theta之间的关系
	        j_vals = zeros((100,100))
	        theta0_vals = linspace(-3,3,100)
	        theta1_vals = linspace(-1,1,100)        
	
	        for i in range(len(theta0_vals)):
	            for j in range(len(theta1_vals)):
	                t = array([[theta0_vals[i]],[theta1_vals[j]]])
	                j_vals[i,j] = 0.5/m*sum([val**2 for val in dot(x1,t)-y])   
	
	        fig2 = plt.figure("fig2")
	        ax = Axes3D(fig2)
	        ax.plot_surface(theta0_vals,theta1_vals,j_vals,rstride=5,cstride=5,cmap='hot')
			ax.set_xlabel('theta0')
        	ax.set_ylabel('theta1')
        	ax.set_zlabel('j(theta)')
	        plt.show()

	if __name__ == "__main__":
	    
	    f1 = "F:\ML\stanford\exercise data\ex2Data\ex2x.dat"
	    f2 = "F:\ML\stanford\exercise data\ex2Data\ex2y.dat"
	    m = LinearRegression()
	    m.l_r(f1, f2)

程序图如下：
<p style="TEXT-ALIGN: center" contentEditable=true><img src="http://cezrh.img48.wal8.com/img48/544629_20160502104557/146994974665.png" /><br /></p>
<p style="TEXT-ALIGN: center" contentEditable=true><img src="http://cezrh.img48.wal8.com/img48/544629_20160502104557/146995029106.png" /><br /></p>


(完)