/*! LPS4.0 2016-12-19
*/
function ratyRemark(){var e=$(".star-1"),t=$(".star-2"),o=$("#score"),i=$("#remark"),n=$(".submitBtn");o.val(""),e.raty({hints:["1","2","3","4","5"],showHalf:!1,path:"http://"+window.location.host+"/images/lps4",click:function(e){o.val(e)}}),"None"!=serviceScore&&t.raty({path:"http://"+window.location.host+"/images/lps4",readOnly:!0,score:serviceScore}),n.on("click",function(){var e,t=$(".rating-box h2");""!=o.val()?($.ajax({type:"POST",url:"/lps4/student_score_meeting/",data:{score:o.val(),comment:i.val(),meeting_id:service_id},success:function(t){var n=$(".rating-box"),a='<div class="rating-info"><div class="rating-star star-2 textC"></div><div class="remark-box font14">'+i.val()+"</div></div>";t.success?($(".rating-error").remove(),n.html(a),$(".star-2").raty({path:"http://"+window.location.host+"/images/lps4",readOnly:!0,score:o.val()})):(e=$('<div class="rating-error font12 textC red" style="margin-top: 20px;">'+t.message+"</div>"),$(".rating-error").remove(),$(".rating").append(e))},error:function(e){layer.alert(e.success,{skin:"layui-layer-molv",closeBtn:0})}}),t.removeAttr("style")):t.css("color","red")})}$(function(){ratyRemark()});