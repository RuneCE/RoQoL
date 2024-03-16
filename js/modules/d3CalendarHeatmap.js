//https://raw.githubusercontent.com/g1eb/calendar-heatmap/master/dist/calendar-heatmap.min.js
"use strict";var calendarHeatmap={settings:{gutter:5,item_gutter:1,width:1e3,height:300,item_size:10,label_padding:40,max_block_height:20,transition_duration:500,tooltip_width:250,tooltip_padding:15},init:function(a,e,t,n,r){calendarHeatmap.data=a,calendarHeatmap.container=e,calendarHeatmap.color=t||"#ff4500",calendarHeatmap.overview=n||"global",calendarHeatmap.history=["global"],calendarHeatmap.selected={},calendarHeatmap.handler=r,calendarHeatmap.in_transition=!1,calendarHeatmap.createElements(),calendarHeatmap.parseData(),calendarHeatmap.drawChart()},createElements:function(){if(null!=calendarHeatmap.container){var a=document.getElementById(calendarHeatmap.container);if(!a||"DIV"!=a.tagName)throw"Element not found or not of type div";a.classList.contains("calendar-heatmap")||a.classList.add("calendar-heatmap")}else{var a=document.createElement("div");a.className="calendar-heatmap",document.body.appendChild(a)}var e=d3.select(a).append("svg").attr("class","svg");calendarHeatmap.items=e.append("g"),calendarHeatmap.labels=e.append("g"),calendarHeatmap.buttons=e.append("g"),calendarHeatmap.tooltip=d3.select(a).append("div").attr("class","heatmap-tooltip").style("opacity",0);var t=function(){var t=Math.round((moment()-moment().subtract(1,"year").startOf("week"))/864e5),n=Math.trunc(t/7),r=n+1;calendarHeatmap.settings.width=a.offsetWidth<1e3?1e3:a.offsetWidth,calendarHeatmap.settings.item_size=(calendarHeatmap.settings.width-calendarHeatmap.settings.label_padding)/r-calendarHeatmap.settings.gutter,calendarHeatmap.settings.height=calendarHeatmap.settings.label_padding+7*(calendarHeatmap.settings.item_size+calendarHeatmap.settings.gutter),e.attr("width",calendarHeatmap.settings.width).attr("height",calendarHeatmap.settings.height),calendarHeatmap.data&&calendarHeatmap.data[0].summary&&calendarHeatmap.drawChart()};t(),window.onresize=function(a){t()}},parseData:function(){calendarHeatmap.data&&(calendarHeatmap.data[0].summary||calendarHeatmap.data.map(function(a){var e=a.details.reduce(function(a,e){return a[e.name]?a[e.name].value+=e.value:a[e.name]={value:e.value},a},{}),t=Object.keys(e).map(function(a){return{name:a,value:e[a].value}});return a.summary=t.sort(function(a,e){return e.value-a.value}),a}))},drawChart:function(){"global"===calendarHeatmap.overview?calendarHeatmap.drawGlobalOverview():"year"===calendarHeatmap.overview?calendarHeatmap.drawYearOverview():"month"===calendarHeatmap.overview?calendarHeatmap.drawMonthOverview():"week"===calendarHeatmap.overview?calendarHeatmap.drawWeekOverview():"day"===calendarHeatmap.overview&&calendarHeatmap.drawDayOverview()},drawGlobalOverview:function(){calendarHeatmap.history[calendarHeatmap.history.length-1]!==calendarHeatmap.overview&&calendarHeatmap.history.push(calendarHeatmap.overview);var a=moment(calendarHeatmap.data[0].date).startOf("year"),e=moment(calendarHeatmap.data[calendarHeatmap.data.length-1].date).endOf("year"),t=d3.timeYears(a,e).map(function(a){var e=moment(a);return{date:e,total:calendarHeatmap.data.reduce(function(a,t){return moment(t.date).year()===e.year()&&(a+=t.total),a},0),summary:function(){var a=calendarHeatmap.data.reduce(function(a,t){if(moment(t.date).year()===e.year())for(var n=0;n<t.summary.length;n++)a[t.summary[n].name]?a[t.summary[n].name].value+=t.summary[n].value:a[t.summary[n].name]={value:t.summary[n].value};return a},{}),t=Object.keys(a).map(function(e){return{name:e,value:a[e].value}});return t.sort(function(a,e){return e.value-a.value})}()}}),n=d3.max(t,function(a){return a.total}),r=d3.timeYears(a,e).map(function(a){return moment(a)}),i=d3.scaleBand().rangeRound([0,calendarHeatmap.settings.width]).padding([.05]).domain(r.map(function(a){return a.year()}));calendarHeatmap.items.selectAll(".item-block-year").remove();calendarHeatmap.items.selectAll(".item-block-year").data(t).enter().append("rect").attr("class","item item-block-year").attr("width",function(){return(calendarHeatmap.settings.width-calendarHeatmap.settings.label_padding)/r.length-5*calendarHeatmap.settings.gutter}).attr("height",function(){return calendarHeatmap.settings.height-calendarHeatmap.settings.label_padding}).attr("transform",function(a){return"translate("+i(a.date.year())+","+2*calendarHeatmap.settings.tooltip_padding+")"}).attr("fill",function(a){var e=d3.scaleLinear().range(["#ffffff",calendarHeatmap.color||"#ff4500"]).domain([-.15*n,n]);return e(a.total)||"#ff4500"}).on("click",function(a){calendarHeatmap.in_transition||(calendarHeatmap.in_transition=!0,calendarHeatmap.selected=a,calendarHeatmap.hideTooltip(),calendarHeatmap.removeGlobalOverview(),calendarHeatmap.overview="year",calendarHeatmap.drawChart())}).style("opacity",0).on("mouseover",function(a){if(!calendarHeatmap.in_transition){var e="";e+="<div><span><strong>Total time tracked:</strong></span>";var t=parseInt(a.total,10),n=Math.floor(t/86400);n>0&&(e+="<span>"+(1===n?"1 day":n+" days")+"</span></div>");var r=Math.floor((t-86400*n)/3600);r>0&&(e+=n>0?"<div><span></span><span>"+(1===r?"1 hour":r+" hours")+"</span></div>":"<span>"+(1===r?"1 hour":r+" hours")+"</span></div>");var l=Math.floor((t-86400*n-3600*r)/60);if(l>0&&(e+=n>0||r>0?"<div><span></span><span>"+(1===l?"1 minute":l+" minutes")+"</span></div>":"<span>"+(1===l?"1 minute":l+" minutes")+"</span></div>"),e+="<br />",a.summary.length<=5)for(var d=0;d<a.summary.length;d++)e+="<div><span><strong>"+a.summary[d].name+"</strong></span>",e+="<span>"+calendarHeatmap.formatTime(a.summary[d].value)+"</span></div>";else{for(var d=0;d<5;d++)e+="<div><span><strong>"+a.summary[d].name+"</strong></span>",e+="<span>"+calendarHeatmap.formatTime(a.summary[d].value)+"</span></div>";e+="<br />";for(var o=0,d=5;d<a.summary.length;d++)o=+a.summary[d].value;e+="<div><span><strong>Other:</strong></span>",e+="<span>"+calendarHeatmap.formatTime(o)+"</span></div>"}for(var s=i(a.date.year())+2*calendarHeatmap.settings.tooltip_padding;calendarHeatmap.settings.width-s<calendarHeatmap.settings.tooltip_width+5*calendarHeatmap.settings.tooltip_padding;)s-=10;var c=this.getBoundingClientRect().top+calendarHeatmap.settings.tooltip_padding;calendarHeatmap.tooltip.html(e).style("left",s+"px").style("top",c+"px").transition().duration(calendarHeatmap.settings.transition_duration/2).ease(d3.easeLinear).style("opacity",1)}}).on("mouseout",function(){calendarHeatmap.in_transition||calendarHeatmap.hideTooltip()}).transition().delay(function(a,e){return calendarHeatmap.settings.transition_duration*(e+1)/10}).duration(function(){return calendarHeatmap.settings.transition_duration}).ease(d3.easeLinear).style("opacity",1).call(function(a,e){a.empty()&&e();var t=0;a.each(function(){++t}).on("end",function(){--t||e.apply(this,arguments)})},function(){calendarHeatmap.in_transition=!1});calendarHeatmap.labels.selectAll(".label-year").remove(),calendarHeatmap.labels.selectAll(".label-year").data(r).enter().append("text").attr("class","label label-year").attr("font-size",function(){return Math.floor(calendarHeatmap.settings.label_padding/3)+"px"}).text(function(a){return a.year()}).attr("x",function(a){return i(a.year())}).attr("y",calendarHeatmap.settings.label_padding/2).on("mouseenter",function(a){calendarHeatmap.in_transition||calendarHeatmap.items.selectAll(".item-block-year").transition().duration(calendarHeatmap.settings.transition_duration).ease(d3.easeLinear).style("opacity",function(e){return moment(e.date).year()===a.year()?1:.1})}).on("mouseout",function(){calendarHeatmap.in_transition||calendarHeatmap.items.selectAll(".item-block-year").transition().duration(calendarHeatmap.settings.transition_duration).ease(d3.easeLinear).style("opacity",1)}).on("click",function(a){calendarHeatmap.in_transition||(calendarHeatmap.in_transition=!0,calendarHeatmap.selected={date:a},calendarHeatmap.hideTooltip(),calendarHeatmap.removeGlobalOverview(),calendarHeatmap.overview="year",calendarHeatmap.drawChart())})},drawYearOverview:function(){calendarHeatmap.history[calendarHeatmap.history.length-1]!==calendarHeatmap.overview&&calendarHeatmap.history.push(calendarHeatmap.overview);var a=moment(calendarHeatmap.selected.date).startOf("year"),e=moment(calendarHeatmap.selected.date).endOf("year"),t=calendarHeatmap.data.filter(function(t){return a<=moment(t.date)&&moment(t.date)<e}),n=d3.max(t,function(a){return a.total}),r=d3.scaleLinear().range(["#ffffff",calendarHeatmap.color||"#ff4500"]).domain([-.15*n,n]),i=function(e){var t=moment(e.date),n=Math.round((t-moment(a).startOf("week"))/864e5),r=Math.trunc(n/7);return r*(calendarHeatmap.settings.item_size+calendarHeatmap.settings.gutter)+calendarHeatmap.settings.label_padding},l=function(a){return calendarHeatmap.settings.label_padding+moment(a.date).weekday()*(calendarHeatmap.settings.item_size+calendarHeatmap.settings.gutter)},d=function(a){return n<=0?calendarHeatmap.settings.item_size:.75*calendarHeatmap.settings.item_size+calendarHeatmap.settings.item_size*a.total/n*.25};calendarHeatmap.items.selectAll(".item-circle").remove(),calendarHeatmap.items.selectAll(".item-circle").data(t).enter().append("rect").attr("class","item item-circle").style("opacity",0).attr("x",function(a){return i(a)+(calendarHeatmap.settings.item_size-d(a))/2}).attr("y",function(a){return l(a)+(calendarHeatmap.settings.item_size-d(a))/2}).attr("rx",function(a){return d(a)}).attr("ry",function(a){return d(a)}).attr("width",function(a){return d(a)}).attr("height",function(a){return d(a)}).attr("fill",function(a){return a.total>0?r(a.total):"transparent"}).on("click",function(a){calendarHeatmap.in_transition||0!==a.total&&(calendarHeatmap.in_transition=!0,calendarHeatmap.selected=a,calendarHeatmap.hideTooltip(),calendarHeatmap.removeYearOverview(),calendarHeatmap.overview="day",calendarHeatmap.drawChart())}).on("mouseover",function(a){if(!calendarHeatmap.in_transition){var e=d3.select(this);!function s(){e=e.transition().duration(calendarHeatmap.settings.transition_duration).ease(d3.easeLinear).attr("x",function(a){return i(a)-(1.1*calendarHeatmap.settings.item_size-calendarHeatmap.settings.item_size)/2}).attr("y",function(a){return l(a)-(1.1*calendarHeatmap.settings.item_size-calendarHeatmap.settings.item_size)/2}).attr("width",1.1*calendarHeatmap.settings.item_size).attr("height",1.1*calendarHeatmap.settings.item_size).transition().duration(calendarHeatmap.settings.transition_duration).ease(d3.easeLinear).attr("x",function(a){return i(a)+(calendarHeatmap.settings.item_size-d(a))/2}).attr("y",function(a){return l(a)+(calendarHeatmap.settings.item_size-d(a))/2}).attr("width",function(a){return d(a)}).attr("height",function(a){return d(a)}).on("end",s)}();var t="";t+='<div class="header"><strong>'+(a.total?calendarHeatmap.formatTime(a.total):"No time")+" tracked</strong></div>",t+="<div>on "+moment(a.date).format("dddd, MMM Do YYYY")+"</div><br>";for(var n=0;n<a.summary.length;n++)t+="<div><span><strong>"+a.summary[n].name+"</strong></span>",t+="<span>"+calendarHeatmap.formatTime(a.summary[n].value)+"</span></div>";var r=i(a)+calendarHeatmap.settings.item_size;calendarHeatmap.settings.width-r<calendarHeatmap.settings.tooltip_width+3*calendarHeatmap.settings.tooltip_padding&&(r-=calendarHeatmap.settings.tooltip_width+2*calendarHeatmap.settings.tooltip_padding);var o=this.getBoundingClientRect().top+calendarHeatmap.settings.item_size;calendarHeatmap.tooltip.html(t).style("left",r+"px").style("top",o+"px").transition().duration(calendarHeatmap.settings.transition_duration/2).ease(d3.easeLinear).style("opacity",1)}}).on("mouseout",function(){calendarHeatmap.in_transition||(d3.select(this).transition().duration(calendarHeatmap.settings.transition_duration/2).ease(d3.easeLinear).attr("x",function(a){return i(a)+(calendarHeatmap.settings.item_size-d(a))/2}).attr("y",function(a){return l(a)+(calendarHeatmap.settings.item_size-d(a))/2}).attr("width",function(a){return d(a)}).attr("height",function(a){return d(a)}),calendarHeatmap.hideTooltip())}).transition().delay(function(){return(Math.cos(Math.PI*Math.random())+1)*calendarHeatmap.settings.transition_duration}).duration(function(){return calendarHeatmap.settings.transition_duration}).ease(d3.easeLinear).style("opacity",1).call(function(a,e){a.empty()&&e();var t=0;a.each(function(){++t}).on("end",function(){--t||e.apply(this,arguments)})},function(){calendarHeatmap.in_transition=!1});var o=d3.timeMonths(a,e),s=d3.scaleLinear().range([0,calendarHeatmap.settings.width]).domain([0,o.length]);calendarHeatmap.labels.selectAll(".label-month").remove(),calendarHeatmap.labels.selectAll(".label-month").data(o).enter().append("text").attr("class","label label-month").attr("font-size",function(){return Math.floor(calendarHeatmap.settings.label_padding/3)+"px"}).text(function(a){return a.toLocaleDateString("en-us",{month:"short"})}).attr("x",function(a,e){return s(e)+(s(e)-s(e-1))/2}).attr("y",calendarHeatmap.settings.label_padding/2).on("mouseenter",function(a){if(!calendarHeatmap.in_transition){var e=moment(a);calendarHeatmap.items.selectAll(".item-circle").transition().duration(calendarHeatmap.settings.transition_duration).ease(d3.easeLinear).style("opacity",function(a){return moment(a.date).isSame(e,"month")?1:.1})}}).on("mouseout",function(){calendarHeatmap.in_transition||calendarHeatmap.items.selectAll(".item-circle").transition().duration(calendarHeatmap.settings.transition_duration).ease(d3.easeLinear).style("opacity",1)}).on("click",function(a){if(!calendarHeatmap.in_transition){var e=calendarHeatmap.data.filter(function(e){return moment(a).startOf("month")<=moment(e.date)&&moment(e.date)<moment(a).endOf("month")});e.length&&(calendarHeatmap.selected={date:a},calendarHeatmap.in_transition=!0,calendarHeatmap.hideTooltip(),calendarHeatmap.removeYearOverview(),calendarHeatmap.overview="month",calendarHeatmap.drawChart())}});var c=d3.timeDays(moment().startOf("week"),moment().endOf("week")),m=d3.scaleBand().rangeRound([calendarHeatmap.settings.label_padding,calendarHeatmap.settings.height]).domain(c.map(function(a){return moment(a).weekday()}));calendarHeatmap.labels.selectAll(".label-day").remove(),calendarHeatmap.labels.selectAll(".label-day").data(c).enter().append("text").attr("class","label label-day").attr("x",calendarHeatmap.settings.label_padding/3).attr("y",function(a,e){return m(e)+m.bandwidth()/1.75}).style("text-anchor","left").attr("font-size",function(){return Math.floor(calendarHeatmap.settings.label_padding/3)+"px"}).text(function(a){return moment(a).format("dddd")[0]}).on("mouseenter",function(a){if(!calendarHeatmap.in_transition){var e=moment(a);calendarHeatmap.items.selectAll(".item-circle").transition().duration(calendarHeatmap.settings.transition_duration).ease(d3.easeLinear).style("opacity",function(a){return moment(a.date).day()===e.day()?1:.1})}}).on("mouseout",function(){calendarHeatmap.in_transition||calendarHeatmap.items.selectAll(".item-circle").transition().duration(calendarHeatmap.settings.transition_duration).ease(d3.easeLinear).style("opacity",1)}),calendarHeatmap.drawButton()},drawMonthOverview:function(){calendarHeatmap.history[calendarHeatmap.history.length-1]!==calendarHeatmap.overview&&calendarHeatmap.history.push(calendarHeatmap.overview);for(var a=moment(calendarHeatmap.selected.date).startOf("month"),e=moment(calendarHeatmap.selected.date).endOf("month"),t=calendarHeatmap.data.filter(function(t){return a<=moment(t.date)&&moment(t.date)<e}),n=d3.max(t,function(a){return d3.max(a.summary,function(a){return a.value})}),r=d3.timeDays(moment().startOf("week"),moment().endOf("week")),i=d3.scaleBand().rangeRound([calendarHeatmap.settings.label_padding,calendarHeatmap.settings.height]).domain(r.map(function(a){return moment(a).weekday()})),l=[a.clone()];a.week()!==e.week();)l.push(a.add(1,"week").clone());var d=d3.scaleBand().rangeRound([calendarHeatmap.settings.label_padding,calendarHeatmap.settings.width]).padding([.05]).domain(l.map(function(a){return a.week()}));calendarHeatmap.items.selectAll(".item-block-month").remove();var o=calendarHeatmap.items.selectAll(".item-block-month").data(t).enter().append("g").attr("class","item item-block-month").attr("width",function(){return(calendarHeatmap.settings.width-calendarHeatmap.settings.label_padding)/l.length-5*calendarHeatmap.settings.gutter}).attr("height",function(){return Math.min(i.bandwidth(),calendarHeatmap.settings.max_block_height)}).attr("transform",function(a){return"translate("+d(moment(a.date).week())+","+(i(moment(a.date).weekday())+i.bandwidth()/1.75-15)+")"}).attr("total",function(a){return a.total}).attr("date",function(a){return a.date}).attr("offset",0).on("click",function(a){calendarHeatmap.in_transition||0!==a.total&&(calendarHeatmap.in_transition=!0,calendarHeatmap.selected=a,calendarHeatmap.hideTooltip(),calendarHeatmap.removeMonthOverview(),calendarHeatmap.overview="day",calendarHeatmap.drawChart())}),s=(calendarHeatmap.settings.width-calendarHeatmap.settings.label_padding)/l.length-5*calendarHeatmap.settings.gutter,c=d3.scaleLinear().rangeRound([0,s]);o.selectAll(".item-block-rect").data(function(a){return a.summary}).enter().append("rect").attr("class","item item-block-rect").attr("x",function(a){var e=parseInt(d3.select(this.parentNode).attr("total")),t=parseInt(d3.select(this.parentNode).attr("offset"));return c.domain([0,e]),d3.select(this.parentNode).attr("offset",t+c(a.value)),t}).attr("width",function(a){var e=parseInt(d3.select(this.parentNode).attr("total"));return c.domain([0,e]),Math.max(c(a.value)-calendarHeatmap.settings.item_gutter,1)}).attr("height",function(){return Math.min(i.bandwidth(),calendarHeatmap.settings.max_block_height)}).attr("fill",function(a){var e=d3.scaleLinear().range(["#ffffff",calendarHeatmap.color||"#ff4500"]).domain([-.15*n,n]);return e(a.value)||"#ff4500"}).style("opacity",0).on("mouseover",function(a){if(!calendarHeatmap.in_transition){var e=new Date(d3.select(this.parentNode).attr("date")),t="";t+='<div class="header"><strong>'+a.name+"</strong></div><br>",t+="<div><strong>"+(a.value?calendarHeatmap.formatTime(a.value):"No time")+" tracked</strong></div>",t+="<div>on "+moment(e).format("dddd, MMM Do YYYY")+"</div>";for(var n=d(moment(e).week())+calendarHeatmap.settings.tooltip_padding;calendarHeatmap.settings.width-n<calendarHeatmap.settings.tooltip_width+3*calendarHeatmap.settings.tooltip_padding;)n-=10;var r=this.getBoundingClientRect().top+calendarHeatmap.settings.tooltip_padding;calendarHeatmap.tooltip.html(t).style("left",n+"px").style("top",r+"px").transition().duration(calendarHeatmap.settings.transition_duration/2).ease(d3.easeLinear).style("opacity",1)}}).on("mouseout",function(){calendarHeatmap.in_transition||calendarHeatmap.hideTooltip()}).transition().delay(function(){return(Math.cos(Math.PI*Math.random())+1)*calendarHeatmap.settings.transition_duration}).duration(function(){return calendarHeatmap.settings.transition_duration}).ease(d3.easeLinear).style("opacity",1).call(function(a,e){a.empty()&&e();var t=0;a.each(function(){++t}).on("end",function(){--t||e.apply(this,arguments)})},function(){calendarHeatmap.in_transition=!1}),calendarHeatmap.labels.selectAll(".label-week").remove(),calendarHeatmap.labels.selectAll(".label-week").data(l).enter().append("text").attr("class","label label-week").attr("font-size",function(){return Math.floor(calendarHeatmap.settings.label_padding/3)+"px"}).text(function(a){return"Week "+a.week()}).attr("x",function(a){return d(a.week())}).attr("y",calendarHeatmap.settings.label_padding/2).on("mouseenter",function(a){calendarHeatmap.in_transition||calendarHeatmap.items.selectAll(".item-block-month").transition().duration(calendarHeatmap.settings.transition_duration).ease(d3.easeLinear).style("opacity",function(e){return moment(e.date).week()===a.week()?1:.1})}).on("mouseout",function(){calendarHeatmap.in_transition||calendarHeatmap.items.selectAll(".item-block-month").transition().duration(calendarHeatmap.settings.transition_duration).ease(d3.easeLinear).style("opacity",1)}).on("click",function(a){if(!calendarHeatmap.in_transition){var e=calendarHeatmap.data.filter(function(e){return a.startOf("week")<=moment(e.date)&&moment(e.date)<a.endOf("week")});e.length&&(calendarHeatmap.in_transition=!0,calendarHeatmap.selected={date:a},calendarHeatmap.hideTooltip(),calendarHeatmap.removeMonthOverview(),calendarHeatmap.overview="week",calendarHeatmap.drawChart())}}),calendarHeatmap.labels.selectAll(".label-day").remove(),calendarHeatmap.labels.selectAll(".label-day").data(r).enter().append("text").attr("class","label label-day").attr("x",calendarHeatmap.settings.label_padding/3).attr("y",function(a,e){return i(e)+i.bandwidth()/1.75}).style("text-anchor","left").attr("font-size",function(){return Math.floor(calendarHeatmap.settings.label_padding/3)+"px"}).text(function(a){return moment(a).format("dddd")[0]}).on("mouseenter",function(a){if(!calendarHeatmap.in_transition){var e=moment(a);calendarHeatmap.items.selectAll(".item-block-month").transition().duration(calendarHeatmap.settings.transition_duration).ease(d3.easeLinear).style("opacity",function(a){return moment(a.date).day()===e.day()?1:.1})}}).on("mouseout",function(){calendarHeatmap.in_transition||calendarHeatmap.items.selectAll(".item-block-month").transition().duration(calendarHeatmap.settings.transition_duration).ease(d3.easeLinear).style("opacity",1)}),calendarHeatmap.drawButton()},drawWeekOverview:function(){calendarHeatmap.history[calendarHeatmap.history.length-1]!==calendarHeatmap.overview&&calendarHeatmap.history.push(calendarHeatmap.overview);var a=moment(calendarHeatmap.selected.date).startOf("week"),e=moment(calendarHeatmap.selected.date).endOf("week"),t=calendarHeatmap.data.filter(function(t){return a<=moment(t.date)&&moment(t.date)<e}),n=d3.max(t,function(a){return d3.max(a.summary,function(a){return a.value})}),r=d3.timeDays(moment().startOf("week"),moment().endOf("week")),i=d3.scaleBand().rangeRound([calendarHeatmap.settings.label_padding,calendarHeatmap.settings.height]).domain(r.map(function(a){return moment(a).weekday()})),l=[a],d=d3.scaleBand().rangeRound([calendarHeatmap.settings.label_padding,calendarHeatmap.settings.width]).padding([.01]).domain(l.map(function(a){return a.week()}));calendarHeatmap.items.selectAll(".item-block-week").remove();var o=calendarHeatmap.items.selectAll(".item-block-week").data(t).enter().append("g").attr("class","item item-block-week").attr("width",function(){return(calendarHeatmap.settings.width-calendarHeatmap.settings.label_padding)/l.length-5*calendarHeatmap.settings.gutter}).attr("height",function(){return Math.min(i.bandwidth(),calendarHeatmap.settings.max_block_height)}).attr("transform",function(a){return"translate("+d(moment(a.date).week())+","+(i(moment(a.date).weekday())+i.bandwidth()/1.75-15)+")"}).attr("total",function(a){return a.total}).attr("date",function(a){return a.date}).attr("offset",0).on("click",function(a){calendarHeatmap.in_transition||0!==a.total&&(calendarHeatmap.in_transition=!0,calendarHeatmap.selected=a,calendarHeatmap.hideTooltip(),calendarHeatmap.removeWeekOverview(),calendarHeatmap.overview="day",calendarHeatmap.drawChart())}),s=(calendarHeatmap.settings.width-calendarHeatmap.settings.label_padding)/l.length-5*calendarHeatmap.settings.gutter,c=d3.scaleLinear().rangeRound([0,s]);o.selectAll(".item-block-rect").data(function(a){return a.summary}).enter().append("rect").attr("class","item item-block-rect").attr("x",function(a){var e=parseInt(d3.select(this.parentNode).attr("total")),t=parseInt(d3.select(this.parentNode).attr("offset"));return c.domain([0,e]),d3.select(this.parentNode).attr("offset",t+c(a.value)),t}).attr("width",function(a){var e=parseInt(d3.select(this.parentNode).attr("total"));return c.domain([0,e]),Math.max(c(a.value)-calendarHeatmap.settings.item_gutter,1)}).attr("height",function(){return Math.min(i.bandwidth(),calendarHeatmap.settings.max_block_height)}).attr("fill",function(a){var e=d3.scaleLinear().range(["#ffffff",calendarHeatmap.color||"#ff4500"]).domain([-.15*n,n]);return e(a.value)||"#ff4500"}).style("opacity",0).on("mouseover",function(a){if(!calendarHeatmap.in_transition){var e=new Date(d3.select(this.parentNode).attr("date")),t="";t+='<div class="header"><strong>'+a.name+"</strong></div><br>",t+="<div><strong>"+(a.value?calendarHeatmap.formatTime(a.value):"No time")+" tracked</strong></div>",t+="<div>on "+moment(e).format("dddd, MMM Do YYYY")+"</div>";var n=parseInt(d3.select(this.parentNode).attr("total"));c.domain([0,n]);for(var r=parseInt(d3.select(this).attr("x"))+c(a.value)/4+calendarHeatmap.settings.tooltip_width/4;calendarHeatmap.settings.width-r<calendarHeatmap.settings.tooltip_width+3*calendarHeatmap.settings.tooltip_padding;)r-=10;var i=this.getBoundingClientRect().top+calendarHeatmap.settings.tooltip_padding;calendarHeatmap.tooltip.html(t).style("left",r+"px").style("top",i+"px").transition().duration(calendarHeatmap.settings.transition_duration/2).ease(d3.easeLinear).style("opacity",1)}}).on("mouseout",function(){calendarHeatmap.in_transition||calendarHeatmap.hideTooltip()}).transition().delay(function(){return(Math.cos(Math.PI*Math.random())+1)*calendarHeatmap.settings.transition_duration}).duration(function(){return calendarHeatmap.settings.transition_duration}).ease(d3.easeLinear).style("opacity",1).call(function(a,e){a.empty()&&e();var t=0;a.each(function(){++t}).on("end",function(){--t||e.apply(this,arguments)})},function(){calendarHeatmap.in_transition=!1}),calendarHeatmap.labels.selectAll(".label-week").remove(),calendarHeatmap.labels.selectAll(".label-week").data(l).enter().append("text").attr("class","label label-week").attr("font-size",function(){return Math.floor(calendarHeatmap.settings.label_padding/3)+"px"}).text(function(a){return"Week "+a.week()}).attr("x",function(a){return d(a.week())}).attr("y",calendarHeatmap.settings.label_padding/2).on("mouseenter",function(a){calendarHeatmap.in_transition||calendarHeatmap.items.selectAll(".item-block-week").transition().duration(calendarHeatmap.settings.transition_duration).ease(d3.easeLinear).style("opacity",function(e){return moment(e.date).week()===a.week()?1:.1})}).on("mouseout",function(){calendarHeatmap.in_transition||calendarHeatmap.items.selectAll(".item-block-week").transition().duration(calendarHeatmap.settings.transition_duration).ease(d3.easeLinear).style("opacity",1)}),calendarHeatmap.labels.selectAll(".label-day").remove(),calendarHeatmap.labels.selectAll(".label-day").data(r).enter().append("text").attr("class","label label-day").attr("x",calendarHeatmap.settings.label_padding/3).attr("y",function(a,e){return i(e)+i.bandwidth()/1.75}).style("text-anchor","left").attr("font-size",function(){return Math.floor(calendarHeatmap.settings.label_padding/3)+"px"}).text(function(a){return moment(a).format("dddd")[0]}).on("mouseenter",function(a){if(!calendarHeatmap.in_transition){var e=moment(a);calendarHeatmap.items.selectAll(".item-block-week").transition().duration(calendarHeatmap.settings.transition_duration).ease(d3.easeLinear).style("opacity",function(a){return moment(a.date).day()===e.day()?1:.1})}}).on("mouseout",function(){calendarHeatmap.in_transition||calendarHeatmap.items.selectAll(".item-block-week").transition().duration(calendarHeatmap.settings.transition_duration).ease(d3.easeLinear).style("opacity",1)}),calendarHeatmap.drawButton()},drawDayOverview:function(){calendarHeatmap.history[calendarHeatmap.history.length-1]!==calendarHeatmap.overview&&calendarHeatmap.history.push(calendarHeatmap.overview),Object.keys(calendarHeatmap.selected).length||(calendarHeatmap.selected=calendarHeatmap.data[calendarHeatmap.data.length-1]);var a=calendarHeatmap.selected.summary.map(function(a){return a.name}),e=d3.scaleBand().rangeRound([calendarHeatmap.settings.label_padding,calendarHeatmap.settings.height]).domain(a),t=d3.scaleTime().range([2*calendarHeatmap.settings.label_padding,calendarHeatmap.settings.width]).domain([moment(calendarHeatmap.selected.date).startOf("day"),moment(calendarHeatmap.selected.date).endOf("day")]);calendarHeatmap.items.selectAll(".item-block").remove(),calendarHeatmap.items.selectAll(".item-block").data(calendarHeatmap.selected.details).enter().append("rect").attr("class","item item-block").attr("x",function(a){return t(moment(a.date))}).attr("y",function(a){return e(a.name)+e.bandwidth()/2-15}).attr("width",function(a){var e=t(d3.timeSecond.offset(moment(a.date),a.value));return Math.max(e-t(moment(a.date)),1)}).attr("height",function(){return Math.min(e.bandwidth(),calendarHeatmap.settings.max_block_height)}).attr("fill",function(a){return a.color||calendarHeatmap.color||"#ff4500"}).style("opacity",0).on("mouseover",function(a){if(!calendarHeatmap.in_transition){var e="";e+='<div class="header"><strong>'+a.name+"</strong><div><br>",e+="<div><strong>"+(a.value?calendarHeatmap.formatTime(a.value):"No time")+" tracked</strong></div>",e+="<div>on "+moment(a.date).format("dddd, MMM Do YYYY HH:mm")+"</div>";for(var n=100*a.value/86400+t(moment(a.date));calendarHeatmap.settings.width-n<calendarHeatmap.settings.tooltip_width+3*calendarHeatmap.settings.tooltip_padding;)n-=10;var r=this.getBoundingClientRect().top+calendarHeatmap.settings.tooltip_padding;calendarHeatmap.tooltip.html(e).style("left",n+"px").style("top",r+"px").transition().duration(calendarHeatmap.settings.transition_duration/2).ease(d3.easeLinear).style("opacity",1)}}).on("mouseout",function(){calendarHeatmap.in_transition||calendarHeatmap.hideTooltip()}).on("click",function(a){calendarHeatmap.handler&&"function"==typeof calendarHeatmap.handler&&calendarHeatmap.handler(a)}).transition().delay(function(){return(Math.cos(Math.PI*Math.random())+1)*calendarHeatmap.settings.transition_duration}).duration(function(){return calendarHeatmap.settings.transition_duration}).ease(d3.easeLinear).style("opacity",.5).call(function(a,e){a.empty()&&e();var t=0;a.each(function(){++t}).on("end",function(){--t||e.apply(this,arguments)})},function(){calendarHeatmap.in_transition=!1});var n=d3.timeHours(moment(calendarHeatmap.selected.date).startOf("day"),moment(calendarHeatmap.selected.date).endOf("day")),r=d3.scaleTime().range([2*calendarHeatmap.settings.label_padding,calendarHeatmap.settings.width]).domain([0,n.length]);calendarHeatmap.labels.selectAll(".label-time").remove(),calendarHeatmap.labels.selectAll(".label-time").data(n).enter().append("text").attr("class","label label-time").attr("font-size",function(){return Math.floor(calendarHeatmap.settings.label_padding/3)+"px"}).text(function(a){return moment(a).format("HH:mm")}).attr("x",function(a,e){return r(e)}).attr("y",calendarHeatmap.settings.label_padding/2).on("mouseenter",function(a){if(!calendarHeatmap.in_transition){var e=t(moment(a));calendarHeatmap.items.selectAll(".item-block").transition().duration(calendarHeatmap.settings.transition_duration).ease(d3.easeLinear).style("opacity",function(a){var n=t(moment(a.date)),r=t(moment(a.date).add(a.value,"seconds"));return e>=n&&e<=r?1:.1})}}).on("mouseout",function(){calendarHeatmap.in_transition||calendarHeatmap.items.selectAll(".item-block").transition().duration(calendarHeatmap.settings.transition_duration).ease(d3.easeLinear).style("opacity",.5)}),calendarHeatmap.labels.selectAll(".label-project").remove(),calendarHeatmap.labels.selectAll(".label-project").data(a).enter().append("text").attr("class","label label-project").attr("x",calendarHeatmap.settings.gutter).attr("y",function(a){return e(a)+e.bandwidth()/2}).attr("min-height",function(){return e.bandwidth()}).style("text-anchor","left").attr("font-size",function(){return Math.floor(calendarHeatmap.settings.label_padding/3)+"px"}).text(function(a){return a}).each(function(){for(var a=d3.select(this),e=a.node().getComputedTextLength(),t=a.text();e>1.5*calendarHeatmap.settings.label_padding&&t.length>0;)t=t.slice(0,-1),a.text(t+"..."),e=a.node().getComputedTextLength()}).on("mouseenter",function(a){calendarHeatmap.in_transition||calendarHeatmap.items.selectAll(".item-block").transition().duration(calendarHeatmap.settings.transition_duration).ease(d3.easeLinear).style("opacity",function(e){
return e.name===a?1:.1})}).on("mouseout",function(){calendarHeatmap.in_transition||calendarHeatmap.items.selectAll(".item-block").transition().duration(calendarHeatmap.settings.transition_duration).ease(d3.easeLinear).style("opacity",.5)}),calendarHeatmap.drawButton()},drawButton:function(){calendarHeatmap.buttons.selectAll(".button").remove();var a=calendarHeatmap.buttons.append("g").attr("class","button button-back").style("opacity",0).on("click",function(){calendarHeatmap.in_transition||(calendarHeatmap.in_transition=!0,"year"===calendarHeatmap.overview?calendarHeatmap.removeYearOverview():"month"===calendarHeatmap.overview?calendarHeatmap.removeMonthOverview():"week"===calendarHeatmap.overview?calendarHeatmap.removeWeekOverview():"day"===calendarHeatmap.overview&&calendarHeatmap.removeDayOverview(),calendarHeatmap.history.pop(),calendarHeatmap.overview=calendarHeatmap.history.pop(),calendarHeatmap.drawChart())});a.append("circle").attr("cx",calendarHeatmap.settings.label_padding/2.25).attr("cy",calendarHeatmap.settings.label_padding/2.5).attr("r",calendarHeatmap.settings.item_size/2),a.append("text").attr("x",calendarHeatmap.settings.label_padding/2.25).attr("y",calendarHeatmap.settings.label_padding/2.5).attr("dy",function(){return Math.floor(calendarHeatmap.settings.width/100)/3}).attr("font-size",function(){return Math.floor(calendarHeatmap.settings.label_padding/3)+"px"}).html("&#x2190;"),a.transition().duration(calendarHeatmap.settings.transition_duration).ease(d3.easeLinear).style("opacity",1)},removeGlobalOverview:function(){calendarHeatmap.items.selectAll(".item-block-year").transition().duration(calendarHeatmap.settings.transition_duration).ease(d3.easeLinear).style("opacity",0).remove(),calendarHeatmap.labels.selectAll(".label-year").remove()},removeYearOverview:function(){calendarHeatmap.items.selectAll(".item-circle").transition().duration(calendarHeatmap.settings.transition_duration).ease(d3.easeLinear).style("opacity",0).remove(),calendarHeatmap.labels.selectAll(".label-day").remove(),calendarHeatmap.labels.selectAll(".label-month").remove(),calendarHeatmap.hideBackButton()},removeMonthOverview:function(){calendarHeatmap.items.selectAll(".item-block-month").selectAll(".item-block-rect").transition().duration(calendarHeatmap.settings.transition_duration).ease(d3.easeLinear).style("opacity",0).attr("x",function(a,e){return e%2===0?-calendarHeatmap.settings.width/3:calendarHeatmap.settings.width/3}).remove(),calendarHeatmap.labels.selectAll(".label-day").remove(),calendarHeatmap.labels.selectAll(".label-week").remove(),calendarHeatmap.hideBackButton()},removeWeekOverview:function(){calendarHeatmap.items.selectAll(".item-block-week").selectAll(".item-block-rect").transition().duration(calendarHeatmap.settings.transition_duration).ease(d3.easeLinear).style("opacity",0).attr("x",function(a,e){return e%2===0?-calendarHeatmap.settings.width/3:calendarHeatmap.settings.width/3}).remove(),calendarHeatmap.labels.selectAll(".label-day").remove(),calendarHeatmap.labels.selectAll(".label-week").remove(),calendarHeatmap.hideBackButton()},removeDayOverview:function(){calendarHeatmap.items.selectAll(".item-block").transition().duration(calendarHeatmap.settings.transition_duration).ease(d3.easeLinear).style("opacity",0).attr("x",function(a,e){return e%2===0?-calendarHeatmap.settings.width/3:calendarHeatmap.settings.width/3}).remove(),calendarHeatmap.labels.selectAll(".label-time").remove(),calendarHeatmap.labels.selectAll(".label-project").remove(),calendarHeatmap.hideBackButton()},hideTooltip:function(){calendarHeatmap.tooltip.transition().duration(calendarHeatmap.settings.transition_duration/2).ease(d3.easeLinear).style("opacity",0)},hideBackButton:function(){calendarHeatmap.buttons.selectAll(".button").transition().duration(calendarHeatmap.settings.transition_duration).ease(d3.easeLinear).style("opacity",0).remove()},formatTime:function(a){var e=Math.floor(a/3600),t=Math.floor((a-3600*e)/60),n="";return e>0&&(n+=1===e?"1 hour ":e+" hours "),t>0&&(n+=1===t?"1 minute":t+" minutes"),0===e&&0===t&&(n=Math.round(a)+" seconds"),n}};