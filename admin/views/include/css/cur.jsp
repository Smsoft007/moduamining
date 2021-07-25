
<%
      String a = "'Hello! SM-SOFT JINdddd'"; //String 형 변수를 선언하여 = 다음 구문을 저장
%>
<%@ page contentType="text/css" %> 


/* 홈 페이지 타이틀 변경하기 */
#post-2 .entry-title {
visibility: hidden;
line-height: 0;
}
#post-2 .entry-title:before {
visibility: visible;
font-size:40px;
content: <% out.println(a); %>;
line-height: 1.2em;
}

#post-2 .entry-title3 {
font-size:80px;
}