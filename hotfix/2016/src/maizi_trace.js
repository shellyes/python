/*! LPS4.0 2016-10-31
*/
var trace_server_host="http://hit.maiziedu.com/action/hit",maizi_trace={_get_cookie:function(e){if(document.cookie.length>0){var t=document.cookie.indexOf(e+"=");if(-1!=t)return t=t+e.length+1,c_end=document.cookie.indexOf(";",t),-1==c_end&&(c_end=document.cookie.length),unescape(document.cookie.substring(t,c_end))}return""},del_cookie:function(e,t){var a=new Date;a.setDate(a.getDate()+t);var o=escape(value)+(null==t?"":"; expires="+a.toUTCString());document.cookie=e+"="+o+"; path=/"},trace:function(e){return $.ajax({type:"GET",url:trace_server_host+"/action/hit/",data:e,dataType:"jsonp",jsonp:"callback",success:function(){console.log("maizi trace succeed. trace_action: "+e.action_id)}}),console.log("maizi trace started. trace_action: "+e.action_id),!0},pay_type:function(){return $("#maizi_trace_common_data #trace_pay_type_common_data").attr("value")},user_type:function(){return $("#maizi_trace_common_data #trace_user_type_common_data").attr("value")},career_name:function(){return $("#maizi_trace_common_data #trace_career_name_common_data").attr("value")},taskball_name:function(){return $("#maizi_trace_common_data #trace_taskball_name_common_data").attr("value")},video_name:function(){return $("#maizi_trace_common_data #trace_video_name_common_data").attr("value")},video_name:function(){return this._get_cookie("login_source"),this.cookie},suid:function(){return this._get_cookie("maiziuid")}};