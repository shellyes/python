/*! LPS4.0 2016-12-19
*/
$(".grade_btn").off("click").on("click",function(){$(this).addClass("on"),$(".grade_float").removeClass("_hide").addClass("_show")}),$(".change_btn").off("click").on("click",function(){$(this).addClass("xg_on"),$(".grade_float").removeClass("_hide").addClass("_show")}),$(".grade_level>li").off("click").on("click",function(){$(this).hasClass("selected")?$(this).removeClass("selected"):$(this).addClass("selected").siblings().removeClass("selected")}),$("._close").off("click").on("click",function(){$(".grade_float").removeClass("_show").addClass("_hide")}),$(".sure_grade_btn").off("click").on("click",function(e){var t=$(".grade_level>.selected>img").attr("src"),t=t?t:"",o=$(".grade_level>.selected>img").attr("name");$(".grade_float").removeClass("_show").addClass("_hide"),$.ajax({url:"/lps4/grade_coach_project/",type:"POST",data:{class_id:classId,score:o,stage_task_id:stageTaskId,student_id:studentId},success:function(e){if(e.success){if(""!=t)switch($(".grade>img").attr("src",t),$(".grade>.grade_btn").hide(),$(".grade>.change_btn").hide(),$(".grade>.comment").show(),o){case"S":$(".grade>.comment").html("超出预期的完成了作业");break;case"A":$(".grade>.comment").html("出色的完成了作业");break;case"B":$(".grade>.comment").html("完成了作业主要考核点，但仍有些许瑕疵");break;case"C":$(".grade>.comment").html("完成了作业但并无出彩之处");break;case"D":$(".grade>.comment").html("学生的作业没有达到要求"),$(".grade>.change_btn").css("display","inline-block")}else $(".grade>img").attr("src","/images/lps4/project_making/waiting.png"),$(".grade>.change_btn").hide(),$(".grade>.grade_btn").show();$(".grade_btn").removeClass("on")}else layer.alert(e.message,{skin:"layui-layer-molv",closeBtn:0})}}),e.stopPropagation()});