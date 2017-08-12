// 1歌曲列表
var str = '';
var n = 0;
var len = data.length;
for (var i=0;i<data.length;i++ )
{
	str += '<p><span>'+data[i].name+'</span><span>'+data[i].singer+'</span></p>';
}
m_list.innerHTML = str;

// 2 点击播放列表 
var aP = m_list.getElementsByTagName('p');
for (var i=0;i<len;i++ )
{
	aP[i].index = i;
	
	aP[i].love = 'love1';  // 灰色的爱心
	aP[i].mark = 'circle0'; // 灰色的小圆点

	aP[i].icon = false;

	aP[i].onclick = function(){
		n =  this.index;
		playing();
	};
}

function playing(){
	
	//点击p播放音乐
	audio.src = data[n].src;
	audio.play();
	
	singerImg.src = data[n].star // 旋转图片
	m_gm.innerHTML = data[n].name; // 歌曲名称
	m_singer.innerHTML = data[n].singer;  // 歌手
	album.innerHTML = data[n].album; // 专辑名称
	
	// 歌曲图片转动
	singerImg.className = 'rotate';

	// 点击p标签 播放变成 暂停图片
	play.style.backgroundImage = 'url(images/pause.png)';
	
	download.href = audio.src + '.zip';

	onOff = false; // 点击P标签 能再点击播放按钮
	
	txt = data[n].lrc;
	//获取歌词
	currentLrc();

	//总时间
	load(); 
	// 获取开始时间
	nowTime();
	// 根据p标签自身的自定义属性是否添加收藏
	love( aP[n].love , aP[n].mark  );

	for (var i=0;i<len;i++ )
	{

		aP[i].style.color = '#000';
		aP[i].style.backgroundColor = 'rgba(139, 143, 135,0)';
	}
	aP[n].style.color = '#fff';
	aP[n].style.backgroundColor = 'rgb(139, 143, 135)';
};

// 3点击收藏
collect.onclick = function(){
	if ( !aP[n].icon ) // 添加红心  收藏 
	{	
		aP[n].love = 'love0';  
		aP[n].mark = 'circle1';
	}else{ //灰色的心 取消
		aP[n].love = 'love1'; 
		aP[n].mark = 'circle0'; 
	}
	love( aP[n].love , aP[n].mark  );
	aP[n].icon = !aP[n].icon;
};

function love( src1,src2 ){
	collect.style.backgroundImage = 'url(images/'+src1+'.png)';
	aP[n].style.backgroundImage = 'url(images/'+src2+'.png)';
	
};

// 4 点击播放按钮 
var onOff = true;
play.onclick = function(){
	if ( onOff )
	{
		audio.play();
		this.style.backgroundImage = 'url(images/pause.png)';
		aP[n].style.color = '#fff';
		singerImg.className = 'rotate';
		aP[n].style.backgroundColor = 'rgb(139, 143, 135)';
	}else{
		audio.pause();
		this.style.backgroundImage = 'url(images/play.png)';
		singerImg.className = '';
		aP[n].style.color = '#000';
		aP[n].style.backgroundColor = 'rgba(139, 143, 135,0)';
	}
	onOff = !onOff;
	allTime.innerHTML = time( audio.duration );  //总时间
};

// 5 点击左右按钮

prev.onclick = function(){
	n--;
	if ( n<0 )n = data.length-1;
	playing();
};
next.onclick = function(){
	n++;
	if ( n==data.length)n =0;
	playing();
};

// 6开始播放时间
audio.addEventListener(
	'timeupdate',
	function(){
		nowTime();
	}
);
// 7总时间
function load(){
	audio.addEventListener(
		'canplay',
		function(){
			allTime.innerHTML = time( audio.duration );  //总时间
		},
		false
	);
};

// 8音量控制
muteBtn.onmousedown = function(e){
	var e = e || event;
	var s = e.clientX - this.offsetLeft;
	document.onmousemove = function(e){
		var e = e || event;
		var w = e.clientX - s;
		if ( w<0 )
		{
			w = 0;
		}else if( w > mutePro.offsetWidth - muteBtn.offsetWidth ){
			w = mutePro.offsetWidth - muteBtn.offsetWidth
		}
		muteBar.style.width = w + 'px';
		var scale = w / (mutePro.offsetWidth - muteBtn.offsetWidth);
		audio.volume = scale;
	};

	document.onmouseup = function(){
		document.onmousemove = document.onmouseup = null;
	};
};

// 9静音
m_mute.onclick = function(){
	audio.volume = 0;
	muteBar.style.width = 0 + 'px';
};

// 10歌词同步
var txt = data[0].lrc;
currentLrc();
function currentLrc(){
	var lrcArr = txt.split('[');
	var str = '';
	for (var i=0;i<lrcArr.length;i++ )
	{
		var arr = lrcArr[i].split(']');
		var time = arr[0].split('.');
		var timer = time[0].split(':');
		var ms = timer[0]*60 + timer[1]*1;
		var text = arr[1];// 歌词内容
		if( text )
		{
			str += '<p id="gc'+ms+'">'+text+'</p>';
		}
	};
	//把歌词放进去
	lrcCon.innerHTML = str;
	
	var sum = 0;
	var curTime = 0;

	var p =lrcCon.getElementsByTagName('p');
	audio.addEventListener(
		'timeupdate', // 在音频/视频的播放位置发生改变时触发
		function(){
			curTime = parseInt(this.currentTime);
			if ( document.getElementById('gc'+curTime) )
			{
				for (var i=0;i<p.length;i++ )
				{
					p[i].style.cssText = 'color:#fff;font-size: 16px; font-weight: 500;';
				}
				document.getElementById('gc'+curTime).style.cssText = 'color:#0f0; font-size: 20px; font-weight: 700;';
				if ( p[8+sum] && p[8+sum].id == 'gc'+curTime )
				{
					lrcCon.style.marginTop = 30 - sum*30 + 'px';
					sum++;
				}
			}
		}
	);
};

// 11 音频

// 1创建一个音乐对象
var actx = new AudioContext();
// 2创建分析机

var analyser = actx.createAnalyser();
// 3 创建媒体源

var audioSrc = actx.createMediaElementSource(audio);

// 4 将媒体源与分析机连接
audioSrc.connect( analyser ); 
// 5 将分析机与目标点连接（扬声器）
analyser.connect( actx.destination );

//canvas画布自适应
var w = window.innerWidth,h=110;
canvas.width = w;
canvas.height = h;

window.onresize = function(){
	var w = window.innerWidth;
	canvas.width = w;
};

// 绘制canvas
var oCG = canvas.getContext('2d');
color = oCG.createLinearGradient(canvas.width/2,0,canvas.width/2,h);
color.addColorStop(0,'#00f');
color.addColorStop(0.5,'#f00');
color.addColorStop(1,'#0f0');

var count = 100;
draw();
function draw(){
	// 创建一个与音频频次等长的数组
	var voicehigh = new Uint8Array(analyser.frequencyBinCount);
	
	//将分析出来的音频数据添加到数组里面 
	analyser.getByteFrequencyData(voicehigh);
	
	var step = Math.round(voicehigh.length/count);
	
	oCG.clearRect(0,0,canvas.width,canvas.height);
	oCG.beginPath();
	for (var i=0;i<count;i++ )
	{
		var iH = (voicehigh[step*i])/3;
		oCG.fillStyle = color;
		oCG.fillRect(i*10+canvas.width/2,h,7,-iH);  //右边
		oCG.fillRect(canvas.width/2 -(i-1)*10,h,7,-iH); // 左边
	}
	requestAnimationFrame( draw );
};



function nowTime(){
	curTime.innerHTML = time(audio.currentTime);  //开始时间
	var sca = audio.currentTime / audio.duration;
	processBar.style.width = sca * (proBar.offsetWidth - processBtn.offsetWidth) + 'px';
};

function time( changeTime ){  //把这种格式的时间26.091728  转换成 00:00
	changeTime = parseInt( changeTime );
	//var h = Math.floor( changeTime/3600 );  //时
	var m = zero(Math.floor(changeTime%3600/60)); //分
	var s = zero(Math.floor(changeTime%60)); //秒
	return m+':'+s;
};

function zero( num ){  // 小于10，补0
	if( num <10){
		return '0'+num;
	}else{
		return ''+num;
	}
};

/* 时间原理
	var n = 125
	alert( parseInt( n/60 )+"分" + n%60+"秒"  )
	//3700秒 是多少时 多少分 多少秒
	var str = 3700;
	alert( Math.floor(str/60/60)+"个小时"+Math.floor(str%3600/60)+'分' + Math.floor(str%60) + '秒' );
*/