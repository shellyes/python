/*! LPS4.0 2016-11-04
*/
function is_login(){return"True"==$(".topRight").attr("login")}function interlocutionParised(){var e=$(".personalInterlocutionQues .time .like");e.unbind(),e.each(function(){$(this).click(function(e){if(!is_login())return login_popup(),!1;e.stopPropagation();var t=$(this),a=t.attr("data-discuss-id");$.ajax({url:"/home/s/ajax_praise/",method:"POST",dataType:"json",data:{problem_id:a},success:function(e){if(e.success){var a=e.data.action,n=e.data.praise_count;"mark"==a?(t.html(n),t.addClass("parised")):"cancel"==a&&(t.html(n),t.removeClass("parised"))}else if(401==e.code)return login_popup("登录状态已过期！"),!1}})})})}function addonclick(){$("#main>div.cur>ul>li").click(function(){var e=$(this).attr("discuss_id");window.location.href=window.location+"?p_id="+e})}function stopthebubble(){eleArr=[$(".toUserCenter"),$(".interact"),$(".objectHref"),$(".answer .img"),$(".answerToUserCenter")];for(var e=0;eleArr.length>e;e++)eleArr[e].on("click",function(e){e.stopPropagation()})}function contentEmpty(e){var t="";return t=0==e|-1==e?"我的提问"==$(".teacherCenterMenu>a.aH").text()?'<div class="textC nulldata"><p class="marginB29"><img src="/images/no_answer2.png"></p><p class="font22 color33 marginB10">我的提问记录空空</p><p class="font14 color66">暂时还没有提出过疑问</p><p class="font14 color66 marginB10">赶快去课程视频下提问吧</p></div>':"我的回答"==$(".teacherCenterMenu>a.aH").text()?'<div class="textC nulldata"><p class="marginB29"><img src="/images/no_answer2.png"></p><p class="font22 color33 marginB10">我的回答记录空空</p><p class="font14 color66">暂时还没有回答过问题</p><p class="font14 color66 marginB10">赶快去课程视频下回答吧</p></div>':"TA的提问"==$(".teacherCenterMenu>a.aH").text()?'<div class="textC nulldata"><p class="marginB29"><img src="/images/no_answer2.png"></p><p class="font22 color33 marginB10">TA的提问记录空空</p><p class="font14 color66">TA暂时还没有提出过疑问</p></div>':"TA的问答"==$(".teacherCenterMenu>a.aH").text()?'<div class="textC nulldata"><p class="marginB29"><img src="/images/no_answer2.png"></p><p class="font22 color33 marginB10">TA的回答记录空空</p><p class="font14 color66">TA暂时还没有回答过问题</p></div>':"优质解答"==$(".teacherCenterMenu>a.aH").text()?'<div class="textC nulldata"><p class="marginB29"><img src="/images/no_answer2.png"></p><p class="font22 color33 marginB10">优质解答记录空空</p><p class="font14 color66">暂时还没有人向老师提问</p><p class="font14 color66 marginB10">赶快去老师的课程下提问吧</p></div>':'<div class="textC nulldata"><p class="marginB29"><img src="/images/no_answer2.png"></p><p class="font22 color33 marginB10">记录空空</p><p class="font14 color66">暂时还没有问答记录</p></div>':'<div class="textC nulldata"><p class="marginB29"><img src="/images/no_answer2.png"></p><p class="font22 color33 marginB10">记录空空</p><p class="font14 color66">暂时还没有问答记录</p></div>'}var eleArr,teaStates,handler;$.ajaxSetup({cache:!0}),teaStates=null,handler=null;var options={autoResize:!0,container:$("#main"),offset:2,itemWidth:420},init=function(){function e(){$(".personalInterlocutionQues>div>ul>li").hover(function(){$(this).find(".interact").show()},function(){$(this).find(".interact").hide()})}function t(){var e=$(".personalInterlocutionTeaState").height()+15;15==e&&(e=-20);var t=$(".personalInterlocutionQues>div.cur>ul>li");t.each(function(){var a=parseInt($(this).css("left"));if(440==a){var n=$(this).attr("data-wookmark-id"),s=parseInt(t.eq(n).css("top"))+e;$(window).scrollTop()>s&&($(".personalInterlocutionCardTime strong").html(t.eq(n).find(".time span").html()),$(".personalInterlocutionCardTime em").html(t.eq(n).find(".time em").html()))}});var a=$(window).scrollTop()+$(window).height()>$(document).height()-100;a&&s(!1)}function a(){handler=$("#main>div.cur>ul"),handler.wookmark(options)}function n(){var e=$(".personalInterlocutionQues>div.cur>ul>li");e.length>0?$(".personalInterlocutionCardTime").show():$(".personalInterlocutionCardTime").hide();var t=e.eq(1);$(".personalInterlocutionCardTime strong").html(t.find(".time span").html()),$(".personalInterlocutionCardTime em").html(t.find(".time em").html())}function s(s){var i=$(".teacherCenterMenu>a.aH").attr("url"),r=$("#main>div.cur>ul>li:last").attr("discuss_id"),o=$(".personalInterlocutionTeaState>span.aH").index(),l=[];r&&l.push("end_id="+r),o&&l.push("status="+o);var c=l.join("&");$.ajax({url:i+"?"+c,dataType:"html",beforeSend:function(){$(document).off("scroll")},success:function(t){1==s?0>t.indexOf("div")?$("#main>div.cur").html(contentEmpty(o)):($("#main>div.cur").html("<ul></ul>"),$("#main>div.cur>ul").html(t)):$("#main>div.cur>ul").append(t),a(),interlocutionParised(),n(),addonclick(),e(),stopthebubble(),interlocutionParised()},complete:function(){$(document).on("scroll",t)}})}$(".personalCTop .font .personalCico").hover(function(){layer.tips($(this).attr("title"),$(this),{tips:[1,"#333333"]})},function(){}),interlocutionParised(),addonclick(),stopthebubble();var i=$(".personalInterlocutionTeaState>span.aH").index();teaStates=[],$(".personalInterlocutionTeaState>span").each(function(){teaStates.push(i)}),$(".personalInterlocutionTeaState span").click(function(){$(this).addClass("aH").siblings().removeClass("aH"),teaStates[$(".teacherCenterMenu>a.aH").index()]=$(this).index(),$("#main>div.cur>ul").empty(),s(!0)}),$(".teacherCenterMenu>a").click(function(){$(this).addClass("aH").siblings().removeClass("aH"),$(".teacherCenterTabContent>div").eq($(this).index()).addClass("cur").siblings().removeClass("cur"),$(".personalInterlocutionTeaState>span").eq(teaStates[$(this).index()]).addClass("aH").siblings().removeClass("aH"),a(),n(),addonclick()}),e(),$(document).scroll(t),a(),n()};init();