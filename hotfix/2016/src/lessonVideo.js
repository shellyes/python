/*! LPS4.0 2016-12-27
*/
var init=function(){function t(){return $("ul.video_part_lists li").index($("ul.video_part_lists li.liH"))+1}function e(t){$.cookie("pop_career_no_longer_remind_flag",t,{expires:365,path:"/course/"})}function i(){return $.cookie("pop_career_no_longer_remind_flag")}function n(){var t=$.cookie("lesson_"+$lessonId);"null"!=t&&t||(t=0);var e=y("t"),i=0;if(e){var n=e.split(":");try{i=60*parseInt(n[0])+parseInt(n[1])}catch(s){i=0}}return i&&$videoLength>i?i:t}function s(){var t=Math.ceil(z.currentTime);if($.cookie("lesson_"+$lessonId,t),t&&"True"==$thisUser){var e=$videoLength;1==A&&$classId.length>0&&t/e>$videoExamComplete&&(A=!1,$.get("/lps3/student/ajax/item_lesson/update/"+$userItem))}}function o(){var t=$(".video_part_lists li.liH").next();return Boolean(t.length)}function a(){var t=$(".video_part_lists li.liH").next();window.location=t.children().get(0).href}function l(t,e){$(t).jScrollPane({mouseWheelSpeed:e})}function r(){if(!(document.fullscreenElement||document.mozFullScreenElement||document.webkitFullscreenElement||document.msFullscreenElement)&&($(".zvideo").height($(window).height()-164),$(".playlist").height($(window).height()-108),$(".playlist2").height($(window).height()-123),$(".playlist3").height($(window).height()-123),$(".all-questions, .my-questions").height($(window).height()-158),$(".one-question-view").height($(window).height()-117),l(".playlist, .playlist2, .playlist3, .all-questions, .my-questions, .one-question-view",100),J)){var t=parseInt($(".zvrightSreen").css("right"),10);0==t?$(".zvideo_index").width($(window).width()-480):$(".zvideo_index").width($(window).width()-138),L=$(window).width()-138}}function c(){R.val(""),oe=""}function d(t,e,i){var n="";return n+="<li>",n+='<i id="'+i+'" class="remove-img"></i>',n+='<img _src="'+t+'" src="'+e+'" height="120" width="120"/>',n+="</li>"}function u(t){for(var e="",i=0;t.length>i;i++)e+=d(t[i][1],t[i][0],i);Q.html(""),Q.append(e),Q.append(W),Q.find("li").length>4&&Q.find("li.last").hide().prev().css("margin-right",0),$(".remove-img").on("click",function(){$(this).parent().remove();var t=$(this).attr("id");4>=Q.find("li").length&&Q.find("li.last").show().prev().css("margin-right","20px"),ne.splice(t,1)}),$("#uploadPreview").fileupload({url:"/common/img/upload/",dataType:"json",autoUpload:!0,add:function(t,e){var i=[],n=/^(png|jpg|jpeg)$/i,s=e.originalFiles[0].size/1024;Ntype=e.originalFiles[0].name.split("."),Ntype=Ntype[Ntype.length-1],n.test(Ntype)||(te.text("图片格式不正确！").css({color:"#F01400"}),i.push("Not an accepted file type"),setTimeout(function(){te.html(ie).css({color:"#666"})},2e3)),parseInt(s)>500&&(te.text("文件超过500KB大小！").css({color:"#F01400"}),i.push("Filesize is too big"),setTimeout(function(){te.html(ie).css({color:"#666"})},2e3)),0==i.length&&e.submit()},done:function(t,e){void 0!=e.result.data.result.img_url&&void 0!=e.result.data.small_result.img_url&&ne.push([e.result.data.small_result.img_url,e.result.data.result.img_url]),u(ne)}})}function p(t){return(t+"").replace(/[^\x00-\xff]/g,"aa").length}function h(){var t=changeTime($videoLength),e=$(".progressTime .current");return e.length?e.text():t}function f(){return $lesson_name+" "+h()}function m(){return JSON.stringify({lps:fe.split("_").concat([$courseId,$lessonId])})}function g(){return"学习互动"==$("ul.option li.selected").attr("title")}function v(){var t=$(".editor-con");return"none"!=t.css("display")?g()?R:t:$(".focus")}function _(){Y.on("click",function(t){if("False"==$thisUser)!$("#loginModal").hasClass("in")&&0>=$(".modal-backdrop").length&&login_popup("请先登录");else{for(var e=$("#insert-img-list img"),i=[],n=[],s=0;e.length>s;s++){var o=e.eq(s).attr("_src"),a=e.eq(s).attr("src");o&&a&&(o=o.split("/uploads/")[1],a=a.split("/uploads/")[1],i.push(o),n.push(a))}var l="",r={},d="";if(g())l="/common/question_post/",d=R.val(),r={discuss_location:fe,object_id:he,object_name:$e,comment:d,object_content:$(".message-wrap .current-time").text(),material_arr:i,small_material_arr:n};else{if("请输入你的问题"==Ee.getContentTxt())return layer.tips("请输入您的问题。",v(),{tips:[1,"#5ECFBA"],time:2e3}),!1;l="/lps4/student_coach/"+$career_id+"/",d=Ee.getContent(),r={content:d,source:f(),source_location:m(),source_type:$CoachUserType_STUDENT_VIDEO}}var u=Math.ceil(p(d));""==d?layer.tips("请输入您的问题。",v(),{tips:[1,"#5ECFBA"],time:2e3}):u>1e3?layer.tips("输入超过1000字，请重新输入。",v(),{tips:[1,"#5ECFBA"],time:2e3}):"teacher"==$groupName?layer.tips("对不起，老师不能提问。",v(),{tips:[1,"#5ECFBA"],time:2e3}):g()?(w(t),$.ajax({url:l,data:r,dataType:"json",type:"POST",beforeSend:function(){Y.unbind()},success:function(t){var e=$(".all-questions, .my-questions");"success"==t.status&&($(".off").click(),R.val(""),e.each(function(t,e){0==$(e).find("ul").length&&($(e).find(".no-answer").remove(),$(e).children().children().html('<ul></ul><a class="load-more">加载更多</a>'))}),e.find("ul").prepend(t.html),Q.html(""),Q.append(W),je(),b()),oe="",_()},error:function(){_(),layer.msg("服务器开小差了, 请稍后重试",{time:1e3,icon:5})}}),c(),se=[],ne=[],D.removeClass("pin")):$.ajax({url:l,data:r,dataType:"json",type:"POST",beforeSend:function(){Y.unbind()},success:function(t){t.success?(Ee.setContent("请输入你的问题"),$(".off").click(),layer.alert("提交成功，请到辅导页面跟踪查看！",{skin:"layui-layer-molv",closeBtn:0})):layer.alert(t.message,{skin:"layui-layer-molv",closeBtn:0}),_()},error:function(){_(),layer.msg("服务器开小差了, 请稍后重试",{time:1e3,icon:5})}})}})}function w(t){var e=$("#target").offset(),i=$('<div id="boll" class="boll"></div>');i.fly({start:{left:t.pageX,top:t.pageY},end:{left:e.left+10,top:e.top+10},onEnd:function(){this.destory()}})}function y(t){var e=null;return window.location.search.length>0&&window.location.search.split("&").forEach(function(i){if(-1!==i.indexOf(t)){var n=i.split("=");e=n[n.length-1]}}),e}function b(){if("True"!=$thisUser)return!$("#loginModal").hasClass("in")&&0>=$(".modal-backdrop").length&&login_popup("请先登录"),!1;var t=$(".reply-total");t.unbind(),t.on({click:function(){ue.css("margin-left","-360px"),be.css("bottom",0),xe=$(this).parents("li").find(".last_id").val(),ke=xe,Ce=$(this).parents("li").find(".answer_user_id").val(),qe=$(this).parents("li").find(".answer_nick_name").val(),Te="回复"+$.trim(qe)+":",be.find("textarea").attr({placeholder:Te})}})}function x(){we.on("click",function(){var t=$(".reply-msg textarea").val();$(this).off(),Me(he,xe,ke,t,Ce,qe)})}function k(){if("True"!=$thisUser)return!$("#loginModal").hasClass("in")&&0>=$(".modal-backdrop").length&&login_popup("请先登录"),!1;var t=$(this).text();t=t.split(":");for(var e=0,i=0;t.length>i;i++)e+=parseInt(t[i])*Math.pow(60,t.length-1-i);z.currentTime=e}function C(){var t=$(".zyleve1>li,.zvrightSreen .d-task-list li.last");t.each(function(e,i){if($(i).hasClass("liH")){var n=t.eq(e+1);if(n.find("a").attr("href")){var s=n.find("a").attr("hid_href");s&&(location.href=s)}else n.find("a").trigger("click")}})}function q(){return function(){var t=0;return $(window).resize(function(){t=$(".wrap").width()}),t}}function T(t){return UE.getEditor(t,{toolbars:[["simpleupload"]],autoClearinitialContent:!0,autoFloatEnabled:!1,wordCount:!1,elementPathEnabled:!1,initialFrameHeight:150,initialFrameWidth:q(),initialContent:"请输入你的问题",autoClearEmptyNode:!0,wordCount:!1,autoHeightEnabled:!1,initialStyle:"p{color: #c3c3c3;font-size: 14px;line-height:1em;font-family: Microsoft Yahei;}img{max-width:100%;}"})}function M(){var t=$(".placeholder"),e=$(".wrap"),i=$(".selector"),n=$(".option"),s=$(".focus"),o=$(".off"),a=$(".editor-con > div"),l=t.text();s.on("click",function(i){i.stopPropagation(),e.addClass("focusin"),n.attr("index",2),t.text("提问时间 "+h()),a.parent().show()}),i.on("click",function(){1!=n.attr("index")?n.addClass("show-down"):""}),o.on("click",function(i){i.stopPropagation(),e.removeClass("focusin"),n.removeClass("show-down"),n.attr("index",1),t.text(l),a.parent().hide()}),n.mouseleave(function(){n.removeClass("show-down")}),n.find("li").on("click",function(){var t=$(this).index();$(this).addClass("selected").siblings().removeClass("selected"),i.text($(this).text()),i.attr("title",$(this).attr("title")),a.eq(t).show().siblings().hide()})}var j,P,S=$("video"),z=S[0];$(".ldFeedback a").mouseover(function(){$(".feedboxTip").fadeIn("fast",function(){$(".feedboxTip").on("click",function(t){var t=t||event;t.stopPropagation()})})}),$(".feedboxTip .closed, body").click(function(){$(".feedboxTip").fadeOut("fast")}),"False"==$thisUser&&!$("#loginModal").hasClass("in")&&0>=$(".modal-backdrop").length&&login_popup("请先登录");var E=$(".check_box"),F=$(".video_part_lists li"),I=$("#check_lesson_lists"),H=$("#just_pay"),N=0,O=$needPay,U=$isPaid,B=i()||!1,A=!0;F.each(function(){return N++,$(this).hasClass("need_pay")?!1:void 0}),I.on("click",".close",function(){I.modal("hide")}),H.on("click",".close",function(){H.modal("hide")}),E.on("click",function(){$(this).hasClass("in")?(e(!1),$(this).removeClass("in")):(e(!0),$(this).addClass("in"))}),setInterval(function(){z.paused||$.get("/v4/append_study_info?course_id="+$courseId+"&lesson_id="+$lessonId)},6e4),$(".vjs-error-display").html('<div><img src="/images/refresh.png">&nbsp;&nbsp;视频加载失败，请<a onclick="location.reload();" style="cursor: pointer;">刷新重试</a></div>'),$("#microohvideo").append($(".videoStopMeg"));var V=$.cookie("lesson_"+$lessonId);"null"!=V&&V||(V=0),S.ready(function(){z.currentTime=n(),setInterval(function(){s()},1e3),S.on("play",function(){if(U=!0,"False"==$thisUser)startPause(),!$("#loginModal").hasClass("in")&&0>=$(".modal-backdrop").length&&login_popup("请先登录");else{if(3==t()&&$needPay&&!$isPaid&&$ifHaveCareerCourse)return z.currentTime>60&&O&&U&&(U=!1,startPause(),pop_pay()),setInterval(function(){z.currentTime>60&&O&&U&&(U=!1,startPause(),pop_pay())},1e3),!1;if(t()>3&&$needPay&&!$isPaid&&$ifHaveCareerCourse)return O&&U&&(U=!1,startPause(),pop_pay()),!1}}),S.on("ended",function(){B||$ad||$isPaid||!I.hasClass("in")&&0>=$(".modal-backdrop").length&&I.modal("show"),$.cookie("lesson_"+$lessonId,null)})}),$(".VSMbtn1").on("click",function(){"True"==$thisUser?(z.pause(),z.paused&&(startPause(),A=!0)):!$("#loginModal").hasClass("in")&&0>=$(".modal-backdrop").length&&login_popup("请先登录")}),$(".d-task-list>li>div").unbind().on("click",function(){$(this).parent().hasClass("activeH")?$(this).parent().removeClass("activeH"):$(this).parent().addClass("activeH"),r()}),r(),$(".zvright a").on("click",function(){J=!1,$(this).hasClass("aH")?($(this).removeClass("aH"),$(".zvrightSreen").css("right","-360px"),$(".zvideo_index").width(L),$(this).parent().css("right",0)):(0==$(".zvright a.aH").length&&($(".zvrightSreen").css("right",0),$(".zvideo_index").width(L-360),$(this).parent().css("right","360px")),$(this).addClass("aH").siblings().removeClass("aH")),$(".zvrightSreen > div").hide(),$(".zvrightSreen"+$(this).attr("num")).show(),r(),setTimeout(function(){J=!0},600)}),$(window).resize(function(){r()}),$(".VSMbtn").on("click",".VSMbtn2",function(){if(o())a();else{z&&z.cancelFullScreen();var t=$(".zvright a").eq(0);t.hasClass("aH")||t.trigger("click")}}),"False"==$thisUser&&$(".zvrightSreen3 a").each(function(){$(this).on("click",function(){!$("#loginModal").hasClass("in")&&0>=$(".modal-backdrop").length&&login_popup("请先登录")})}),j=$(".video_part_lists li.liH a").find(".col_l").text(),P=$(".zyleve1 li.liH a").attr("title"),$(".zyNewVideo_top .s").html(j||P);var J=!0,L=$(".zvideo_index").width(),W="<li class='last'><span class='font14 color66 uploadPreview'><i class='add-screenshot-img'></i><input type='file' name='image' accept='image/*' multiple id='uploadPreview'><span class='add-img-msg font14 color66'>添加图片</span></span></li>",G=($(".bottom-module"),$(".tiwen-con")),R=($(".user"),$(".share"),$(".down-load"),$(".message-wrap"),$(".text-msg")),Y=($(".alt-ta"),$(".btn-box"),$(".tiwen-btn")),D=($(".cancel-btn"),$(".current"),$(".current-time"),$(".upload-con"),$(".upload-img")),K=$("#insert-img"),Q=$("#insert-img-list"),X=$(".cancel-insert-btn"),Z=$(".insert-img-btn"),te=($(".upload-con"),$(".msg")),ee=[G,K,$(".questions-top a"),$(".questions-bottom .share"),$(".question-current span")],ie=te.html(),ne=[],se=[],oe="";R.keyup(function(t){t.stopPropagation()});for(var ae=0;ee.length>ae;ae++)ee[ae].on("click",function(t){t.stopPropagation()});_(),D.on("click",function(){te.html(ie).css({color:"#666"}),Q.html(""),ne=se,u(ne),K.modal("show")}),Z.on("click",function(){K.modal("hide"),se=ne,ne=[],D.removeClass("pin"),se.length>0&&D.addClass("pin")}),X.on("click",function(){te.html(ie).css({color:"#666"}),K.modal("hide"),ne=[],0==se.length&&D.removeClass("pin")});var le=$(".tab-nav li"),re=$(".tab-box > div"),ce=$(".all-questions"),de=$(".my-questions"),ue=($(".all-questions-lists"),$(".questions-box")),pe=$("#back-questions"),he=($(".reply-total"),$(".object_id").val()),$e=($(".class_id").val(),$(".object_name").val()),fe=$(".discuss_location").val(),me=!1;le.on("click",function(){if("True"!=$thisUser)return!$("#loginModal").hasClass("in")&&0>=$(".modal-backdrop").length&&login_popup("请先登录"),!1;var t=$(this).index();$(this).addClass("active").siblings().removeClass("active"),re.eq(t).show().siblings().hide(),l(".all-questions, .my-questions",100)});var ge=function(t){return"True"!=$thisUser?(!$("#loginModal").hasClass("in")&&0>=$(".modal-backdrop").length&&login_popup("请先登录"),!1):(l(".one-question-view",100),ue.css("margin-left","-360px"),ce.css("opacity",0),de.css("opacity",0),t=isNaN(t)?$(this).find(".last_id").val():t,Se(t),void 0)};$(function(){var t=y("p_id");t&&($(".zvright a").eq(1).trigger("click"),me=!0,ge(t))}),$(".all-questions, .my-questions").on({click:ge},"li"),pe.on("click",function(){ue.css("margin-left","0"),ce.css("opacity",1),de.css("opacity",1)});var ve=null;$(".one-question-view").on({click:function(t){t.stopPropagation(),ve=$(this).attr("_src"),imgPopup(ve)}},".questions-img img");var _e,we,ye,be,xe,ke,Ce,qe,Te;_e=$(".reply-btn"),we=$(".submit-reply-btn"),ye=$(".reply-msg"),be=$(".reply-textarea"),xe=null,ke=null,Ce=null,qe=null,Te=null,be.find("textarea").keyup(function(t){t.stopPropagation()}),$(document).on("click",".reply-btn",function(){$(".reply-textarea").css("bottom",0),$(this).parent().hasClass("reply-date")?(xe=$(this).parents(".right").siblings(".left").find(".last_id").val(),ke=$(this).parents(".right").siblings(".left").find(".problem_id").val(),Ce=$(this).parent().parent().parent().siblings(".left").find(".answer_user_id").val(),qe=$(this).parent().parent().parent().siblings(".left").find(".answer_nick_name").val(),Te="回复"+$.trim(qe)+":"):(xe=$(this).parent().siblings(".last_id").val(),ke=xe,Ce=$(this).parent().siblings(".answer_user_id").val(),qe=$(this).parent().siblings(".answer_nick_name").val(),Te="回复"+$.trim(qe)+":"),be.find("textarea").attr({placeholder:Te})}),b(),x();var Me=function(t,e,i,n,s,o){var a="";""==n?(a=$("<span>请输入回复内容！</span>"),$(".submit-reply-btn").before(a),setTimeout(function(){a.remove()},2e3)):$.ajax({url:"/common/answer_post/",data:{object_id:t,parent_id:e,problem_id:i,comment:n,answer_user_id:s,answer_nick_name:o},dataType:"json",type:"POST",success:function(t){"success"==t.status?(t.parent_id==t.problem_id?$(".question-lists").prepend(t.html):$("#answer_"+t.parent_id).after(t.html),$(".reply-textarea").css("bottom","-180px").find("textarea").val(""),$(".one-question-view .load-more").text("没有更多"),$(".one-question-view").jScrollPane({mouseWheelSpeed:100})):(a=$("<span>"+t.msg+"</span>"),$(".submit-reply-btn").before(a),setTimeout(function(){a.remove()},2e3)),x()}})},je=function(){var t=$(".good");t.unbind(),t.on({click:function(t){if("True"!=$thisUser)return!$("#loginModal").hasClass("in")&&0>=$(".modal-backdrop").length&&login_popup("请先登录"),!1;t.stopPropagation();var e=$(this),i=e.parent().siblings(".last_id").val();e.children("small"),$.ajax({url:"/home/s/ajax_praise/",method:"POST",dataType:"json",data:{problem_id:i},success:function(t){if(t.success){var e=t.data.action,n=t.data.praise_count;$(".last_id").each(function(){var t=$(this),s=t.parent().find(".good");if(t.val()==i){var o=$(s).children("small");"mark"==e?(o.html(n),s.addClass("jia-good")):"cancel"==e&&(o.html(n),s.removeClass("jia-good"))}})}else if(401==t.code)return!$("#loginModal").hasClass("in")&&0>=$(".modal-backdrop").length&&login_popup("登录状态已过期！"),!1}})}})};je(),$(".reply-cancel").on("click",function(){$(".reply-textarea").css("bottom","-180px")}),$(".load-more").on("click",function(){var t=null,e=null,i=null;$(this).parents(".scroll-pane").hasClass("one-question-view")?(t=$(this).siblings().find(".questions-reply").last().find(".last_id").val(),i=$(this).siblings().find(".questions-reply").last().find(".problem_id").val(),e=$(this).siblings().find(".question-lists")):(t=$(this).siblings().children().last().find(".last_id").val(),i=$(this).siblings().children().last().find(".object_id").val(),e=$(this).siblings());var n=$(this).parents(".scroll-pane").attr("class").split(" ")[0],s=n.split("-")[0];Pe(i,t,n,s,e)});var Pe=function(t,e,i,n,s){return"True"!=$thisUser?(!$("#loginModal").hasClass("in")&&0>=$(".modal-backdrop").length&&login_popup("请先登录"),!1):($.ajax({url:"/common/"+n+"_more/"+t+"/"+e+"/",dataType:"html",type:"GET",success:function(t){"failed"==$.parseJSON(t).status?$("."+i+" .load-more").text("没有更多").off("click"):s.append($.parseJSON(t).html),$(".all-questions, .my-questions, .one-question-view").jScrollPane({mouseWheelSpeed:100}),je()}}),void 0)},Se=function(t){$.ajax({url:"/common/one_more/"+t+"/0/",dataType:"html",type:"GET",success:function(e){$(".one-question-view li").empty().append($.parseJSON(e).html),0==$.parseJSON(e).has_answer?$(".one-question-view .load-more").text("暂无回答"):$(".one-question-view .load-more").text("加载更多"),$(".one-question-view").jScrollPane({mouseWheelSpeed:100}),je(),1==me&&($(".one-question-view .question-current span").trigger("click"),me=!1),$.getScript("http://v3.jiathis.com/code/jia.js?uid=1680508"),jiathis_config={data_track_clickback:!0,shortUrl:!1,hideMore:!1,url:window.location.origin+"/u/"+$(".answer_user_id").val()+"/discuss/?p_id="+t,summary:"我正在麦子学院学习"+$(document).attr("title")+",赶快和我一起来感受神奇的在线学习方式吧！——麦子学院，在线学习好工作。",title:$(".one-question-view .question-title").text()}}})};$(".one-question-view").on({click:k},".question-current span"),$(".question-current span").on({click:k}),$(".play-next-control,.VSMbtn2").on("click",function(){var t=$(".zvright a").eq(0);if(t.hasClass("aH")||t.trigger("click"),$classId.length>0)C();else{var e=$(".video_part_lists .liH").next().children().attr("href");e?window.location.href=e:alert("没有下一节")}});var ze={};$(".show-remark").on({click:function(){$.ajax({type:"GET",url:$("#questionnaire_url").val(),dataType:"json",success:function(t){1==t.success?window.location.href=$("#next_url").val():($("#satisfy-examen").html(t.data.html).modal({show:!0,keyboard:!1,backdrop:"static"}),$(".satisfy-list li").each(function(){$(this).find("label").click(function(){$(this).parent().addClass("now").siblings().removeClass("now"),$(this).addClass("select").parent().siblings().children().removeClass("select");var t=$(this).parent().parent().siblings().attr("id"),e=$(this).attr("value"),i=$(this).text();ze[t]='{"'+e+'":"'+i+'"}'})}),$(".button-group").on({click:function(){$.ajax({type:"POST",url:$("#submit_url").val(),data:ze,dataType:"json",success:function(t){"success"==t.msg?window.location.href=$("#next_url").val():"fail"==t.msg?$(".modal-content .err_msg").text(t.data).show().fadeOut(8e3,$("#satisfy-examen").modal("hide")):$(".modal-content .err_msg").text(t.data).show().fadeOut(3e3)}})}},".submit"))}})}}),$("#satisfy-examen").on({click:function(){window.location.href=$("#next_url").val()}},".next-time");var Ee=T("bdeditor");Ee.ready(function(){Ee.setContent('<p style="color: #c3c3c3;font-size: 14px;font-family: "Microsoft Yahei";">请输入你的问题</p>')}),Ee.addListener("focus",function(){"请输入你的问题"==Ee.getContentTxt()&&Ee.setContent('<p style="color: #333;"></p>')}),M()};!function(t){t.fly=function(e,i){var n={version:"1.0.0",autoPlay:!0,vertex_Rtop:20,speed:1.2,start:{},end:{},onEnd:t.noop},s=this,o=t(e);s.init=function(t){this.setOptions(t),!!this.settings.autoPlay&&this.play()},s.setOptions=function(e){this.settings=t.extend(!0,{},n,e);var i=this.settings,s=i.start,a=i.end;o.css({marginTop:"0px",marginLeft:"0px",position:"fixed"}).appendTo("body"),null!=a.width&&null!=a.height&&t.extend(!0,s,{width:o.width(),height:o.height()});var l=Math.min(s.top,a.top)-Math.abs(s.left-a.left)/3;i.vertex_Rtop>l&&(l=Math.min(i.vertex_Rtop,Math.min(s.top,a.top)));var r=Math.sqrt(Math.pow(s.top-a.top,2)+Math.pow(s.left-a.left,2)),c=Math.ceil(Math.min(Math.max(Math.log(r)/.05-75,30),100)/i.speed),d=s.top==l?0:-Math.sqrt((a.top-l)/(s.top-l)),u=(d*s.left-a.left)/(d-1),p=a.left==u?0:(a.top-l)/Math.pow(a.left-u,2);t.extend(!0,i,{count:-1,steps:c,vertex_left:u,vertex_top:l,curvature:p})},s.play=function(){this.move()},s.move=function(){var e=this.settings,i=e.start,n=e.count,s=e.steps,a=e.end,l=i.left+(a.left-i.left)*n/s,r=0==e.curvature?i.top+(a.top-i.top)*n/s:e.curvature*Math.pow(l-e.vertex_left,2)+e.vertex_top;if(null!=a.width&&null!=a.height){var c=s/2,d=a.width-(a.width-i.width)*Math.cos(c>n?0:(n-c)/(s-c)*Math.PI/2),u=a.height-(a.height-i.height)*Math.cos(c>n?0:(n-c)/(s-c)*Math.PI/2);o.css({width:d+"px",height:u+"px","font-size":Math.min(d,u)+"px"})}o.css({left:l+"px",top:r+"px"}),e.count++;var p=window.requestAnimationFrame(t.proxy(this.move,this));n==s&&(window.cancelAnimationFrame(p),e.onEnd.apply(this))},s.destory=function(){o.remove()},s.init(i)},t.fn.fly=function(e){return this.each(function(){void 0==t(this).data("fly")&&t(this).data("fly",new t.fly(this,e))})}}(jQuery),init();